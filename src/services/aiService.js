import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const generateFinancialInsight = async (dashboardData) => {
    try {
        const {
            monthlySpend,
            prevMonthSpend,
            categoryBreakdown,
            prevCategoryBreakdown,
            expenseTrend,
            budgetsVsActual,
            income
        } = dashboardData;

        if (!monthlySpend && (!categoryBreakdown || categoryBreakdown.length === 0)) {
            return "• Build your profile to unlock insights\n• Add 2+ months of transaction history";
        }

        const currentSpend = Number(monthlySpend || 0);
        const prevSpend = Number(prevMonthSpend || 0);
        const currentIncome = Number(income || 0);

        const fmt = (n) => n >= 1000 ? `₹${(n / 1000).toFixed(1)}K` : `₹${Number(n).toLocaleString()}`;

        // Build a lookup of prev-month spend by category name
        const prevByCategory = {};
        (prevCategoryBreakdown || []).forEach(cat => {
            prevByCategory[cat.name] = cat.amount || 0;
        });

        // Compute per-category deltas
        const categoryDeltas = (categoryBreakdown || []).map(cat => {
            const prev = prevByCategory[cat.name] || 0;
            const diff = cat.amount - prev;
            const pct = prev > 0 ? ((diff / prev) * 100).toFixed(1) : null;
            return { name: cat.name, current: cat.amount, prev, diff, pct };
        });

        // Biggest increase and decrease
        const withPrev = categoryDeltas.filter(c => c.prev > 0);
        const biggestIncrease = withPrev.length
            ? withPrev.reduce((a, b) => (b.diff > a.diff ? b : a))
            : null;
        const biggestDecrease = withPrev.length
            ? withPrev.reduce((a, b) => (b.diff < a.diff ? b : a))
            : null;

        // Overspent budget categories
        const overspent = (budgetsVsActual || []).filter(b => b.actual_spend > b.monthly_limit);

        // Build prompt sections
        const spendLine = prevSpend > 0
            ? `Total spend: ${fmt(currentSpend)} this month vs ${fmt(prevSpend)} last month (${expenseTrend?.uiLabel || ''})`
            : `Total spend: ${fmt(currentSpend)} this month (no prior month data)`;

        const incomeLine = currentIncome > 0 ? `Income this month: ${fmt(currentIncome)}` : '';

        const categoryLines = categoryDeltas.map(c => {
            if (c.prev > 0) {
                const sign = c.diff >= 0 ? '+' : '';
                return `${c.name}: ${fmt(c.current)} vs ${fmt(c.prev)} (${sign}${fmt(Math.abs(c.diff))}, ${sign}${c.pct}%)`;
            }
            return `${c.name}: ${fmt(c.current)} (no prior month data)`;
        }).join('\n');

        const biggestIncreaseLine = biggestIncrease && biggestIncrease.diff > 0
            ? `Biggest increase: ${biggestIncrease.name} (+${fmt(biggestIncrease.diff)}, +${biggestIncrease.pct}%)`
            : '';
        const biggestDecreaseLine = biggestDecrease && biggestDecrease.diff < 0
            ? `Biggest decrease: ${biggestDecrease.name} (-${fmt(Math.abs(biggestDecrease.diff))}, ${biggestDecrease.pct}%)`
            : '';

        const overspentLine = overspent.length > 0
            ? `Over-budget: ${overspent.map(b => `${b.category} (${fmt(b.actual_spend)} spent, ${fmt(b.monthly_limit)} limit)`).join(', ')}`
            : 'No categories over budget';

        // Default fallback (no Gemini key)
        const topCat = categoryBreakdown && categoryBreakdown.length > 0 ? categoryBreakdown[0].name : 'General';
        let defaultInsight = `• ${spendLine}\n• ${topCat} is your top expense category this month`;
        if (overspent.length > 0) {
            defaultInsight += `\n• Overspent in: ${overspent.map(b => b.category).join(', ')} — review your limits`;
        } else if (biggestIncrease && biggestIncrease.diff > 0) {
            defaultInsight += `\n• ${biggestIncrease.name} rose the most — consider reducing it next month`;
        }

        if (!genAI) return defaultInsight;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
You are a personal finance assistant. Analyze the following monthly spending data and give 2 specific saving suggestions.

${spendLine}
${incomeLine}

Category changes (this month vs last month):
${categoryLines || 'No category data'}

${biggestIncreaseLine}
${biggestDecreaseLine}

${overspentLine}

Rules:
- Output exactly 3 bullet points using the • symbol, each on its own line.
- First bullet: summarise the overall spending trend with exact amounts.
- Second and third bullets: give 2 specific, actionable saving suggestions referencing category names and amounts.
- No markdown, no bold, no headers, no introduction, no conclusion.
        `.trim();

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();

        if (responseText && responseText.includes('•')) {
            return responseText;
        }
        return defaultInsight;

    } catch (error) {
        console.error("AI Insight generation failed:", error);

        const safeSpend = dashboardData?.monthlySpend || 0;
        const spendFormatted = safeSpend >= 1000 ? `₹${(safeSpend / 1000).toFixed(1)}K` : `₹${safeSpend.toLocaleString()}`;
        let topCat = "General";
        if (dashboardData?.categoryBreakdown?.length > 0) {
            topCat = dashboardData.categoryBreakdown[0].name;
        }
        return `• Spending ₹${spendFormatted} this month\n• ${topCat} is highest — review next month`;
    }
};

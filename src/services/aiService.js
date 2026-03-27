import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const generateFinancialInsight = async (dashboardData) => {
    try {
        const { monthlySpend, categoryBreakdown, expenseTrend } = dashboardData;

        if (!monthlySpend && (!categoryBreakdown || categoryBreakdown.length === 0)) {
            return "• Build your profile to unlock insights\n• Add 2+ months of transaction history";
        }

        const currentSpend = Number(monthlySpend || 0);

        let topCatStr = "General";
        if (categoryBreakdown && categoryBreakdown.length > 0) {
            topCatStr = categoryBreakdown[0].name; 
        }

        const spendFormatted = currentSpend >= 1000 ? `${(currentSpend/1000).toFixed(1)}K` : currentSpend.toLocaleString();
        
        const { semantic, trend } = expenseTrend || { semantic: "tracking initiated", trend: "neutral" };
        
        let actionStr = "Monitor it next month";
        if (trend === 'up') {
            actionStr = "Reduce next month";
        } else if (trend === 'down') {
            actionStr = "Keep saving next month";
        }

        const defaultInsight = `• Spending ${semantic} (₹${spendFormatted})\n• ${topCatStr} dominates. ${actionStr}.`;

        if (!genAI) return defaultInsight;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `
You are a financial assistant.
Data:
Trend string: ${semantic} (₹${spendFormatted})
Top category: ${topCatStr}
Action context: ${actionStr}

Rules:
- Give exactly 2 bullets separated by a newline.
- Format strictly as follows:
• Spending [Trend string] ([Spend string] vs last month)
• [Top category] dominates. [Rewrite action context into 3-4 words max].

Do not use bolding or markdown. No introduction.
        `.trim();

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();
        
        if (responseText && responseText.includes('•')) {
            return responseText;
        }
        return defaultInsight;

    } catch (error) {
        console.error("AI Insight generation failed:", error);
        
        // Final fallback ensuring we NEVER show an error screen mapping
        const safeSpend = dashboardData?.monthlySpend || 0;
        const spendFormatted = safeSpend >= 1000 ? `${(safeSpend/1000).toFixed(1)}K` : safeSpend.toLocaleString();
        
        let topCat = "General";
        if (dashboardData?.categoryBreakdown?.length > 0) {
            topCat = dashboardData.categoryBreakdown[0].name;
        }
        
        return `• Spending ₹${spendFormatted}\n• ${topCat} is highest. Review next month.`;
    }
};

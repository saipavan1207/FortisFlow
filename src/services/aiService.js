// The Gemini API key is now securely stored on the backend.
// We call our Netlify serverless function instead of directly using the SDK here.
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

        // Securely call the backend Netlify function
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error(`Backend AI failed with status ${response.status}`);
        }

        const result = await response.json();
        const responseText = result.text;
        
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
        
        return `• Spending ₹${spendFormatted} this period\n• Highest spending was on ${topCat}. Consider optimizing.`;
    }
};

export const generateAnalyticsInsight = async (analyticsData) => {
    try {
        if (!analyticsData || !analyticsData.kpis) {
            return "Gathering more data to provide insights...";
        }

        const { kpis, category_breakdown } = analyticsData;
        const netSavings = kpis.net_savings;
        const topCat = kpis.top_category;
        
        let topCatAmount = 0;
        if (category_breakdown && category_breakdown.length > 0) {
            const topCatData = category_breakdown.find(c => c.category === topCat);
            if (topCatData) topCatAmount = topCatData.amount;
        }

        const defaultInsight = `Your net savings are ₹${netSavings.toLocaleString('en-IN')}. Highest spending is on ${topCat} (₹${topCatAmount.toLocaleString('en-IN')}).`;

        // Securely call the backend Netlify function
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) {
            throw new Error(`Backend AI failed with status ${response.status}`);
        }

        const result = await response.json();
        const responseText = result.text;
        
        return responseText || defaultInsight;

    } catch (error) {
        console.error("AI Analytics Insight generation failed:", error);
        return "Keep tracking your expenses to build strong financial habits.";
    }
};

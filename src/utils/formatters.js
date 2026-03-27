export const getSafePercentageChange = (current, previous) => {
    if (!previous || previous === 0) {
        return {
            value: 0,
            label: "New",
            uiLabel: "First record set",
            semantic: "tracking initiated",
            trend: "neutral"
        };
    }

    let change = ((current - previous) / previous) * 100;
    const diff = current - previous;

    // Clamp values (IMPORTANT)
    if (change > 150) change = 150;
    if (change < -100) change = -100;

    // Case 3 — No meaningful change
    if (Math.abs(change) < 5) {
        return {
            value: change,
            label: "No significant change",
            uiLabel: "No significant change",
            semantic: "stable",
            trend: "neutral"
        };
    }

    const trend = change > 0 ? "up" : change < 0 ? "down" : "neutral";

    let semanticLabel = "";
    let aiSemantic = "";
    if (change > 0 && change <= 20) { semanticLabel = "Slight increase"; aiSemantic = "increased slightly"; }
    else if (change > 20 && change <= 60) { semanticLabel = "Moderate increase"; aiSemantic = "increased"; }
    else if (change > 60) { semanticLabel = "Spending surged"; aiSemantic = "increased significantly"; }
    else if (change < 0 && change >= -20) { semanticLabel = "Slight decrease"; aiSemantic = "decreased slightly"; }
    else if (change < -20 && change >= -60) { semanticLabel = "Moderate decrease"; aiSemantic = "decreased"; }
    else if (change < -60) { semanticLabel = "Major decrease"; aiSemantic = "dropped significantly"; }

    const prefix = diff > 0 ? "+" : "";
    const diffFormatted = `₹${Math.abs(diff).toLocaleString()}`;
    const uiLabel = `${semanticLabel} (${prefix}${diffFormatted})`;

    return {
        value: change,
        label: `${Math.abs(change).toFixed(1)}%`,
        uiLabel,
        semantic: aiSemantic,
        trend
    };
};

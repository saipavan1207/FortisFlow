import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoalRecord, GoalAnalytics, GoalUIModel } from '../types/goals';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

interface GoalWithAnalytics {
  goal: GoalUIModel;
  analytics: GoalAnalytics;
}

export async function generateGoalGuidance(
  goalsWithAnalytics: GoalWithAnalytics[],
  monthlyIncome?: number
): Promise<string> {
  const active = goalsWithAnalytics.filter(g => g.goal.status === 'active');

  if (active.length === 0) {
    return "No active goals! Create one to get personalized AI financial guidance to supercharge your savings journey.";
  }

  // Build context string from live data
  const goalSummaries = active.map(({ goal, analytics }) => {
    const lines = [
      `Goal: ${goal.title}`,
      `Progress: ₹${goal.saved_amount.toLocaleString()} / ₹${goal.target_amount.toLocaleString()} (${Math.round(analytics.progress)}%)`,
      `Deadline: ${goal.deadline}`,
      `Avg daily saving: ₹${Math.round(analytics.avgDailySaving)}`,
      `Probability: ${analytics.probability}%`,
      `On track: ${analytics.isOnTrack ? 'Yes' : 'No'}`,
    ];
    if (analytics.estimatedDaysLeft > 0) {
      lines.push(`Est. completion: ${analytics.estimatedDaysLeft} days`);
    }
    return lines.join('\n');
  }).join('\n---\n');

  const defaultInsight = buildFallbackInsight(active);

  if (!genAI) return defaultInsight;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
You are a personal finance advisor inside a beautiful fin-tech app (FortisFlow).

USER'S ACTIVE GOALS:
${goalSummaries}
${monthlyIncome ? `Monthly income: ₹${monthlyIncome.toLocaleString()}` : ''}

INSTRUCTIONS:
- Give ONE actionable paragraph (max 50 words).
- Reference the weakest goal by name (the one with the lowest probability).
- Suggest a specific, realistic monthly saving adjustment.
- Be encouraging, high-energy, and completely professional.
- Try to give actionable advice (e.g. cut dining out, reduce subscriptions).
- Use ₹ symbol for currency. 
- Do NOT use markdown bold like **. Keep it plain text.
    `.trim();

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim()
      .replace(/\*\*/g, '') // Remove bold
      .replace(/[\r\n]+/g, ' ') // Make single-line
      .replace(/\s{2,}/g, ' '); // Clean multiple spaces

    return text || defaultInsight;
  } catch (err) {
    console.error("AI Guidance generation failed", err);
    return defaultInsight;
  }
}

function buildFallbackInsight(
  goals: GoalWithAnalytics[]
): string {
  // Find the goal with lowest probability
  const weakest = goals.reduce((min, g) =>
    g.analytics.probability < min.analytics.probability ? g : min
  );

  const pct = Math.round(weakest.analytics.progress);
  const monthly = Math.round(weakest.analytics.avgDailySaving * 30);

  if (pct > 90) {
    return `You are ${pct}% toward your ${weakest.goal.title} goal! Keep up the momentum to finish strong.`;
  }

  const extraMonthly = Math.max(Math.round(monthly * 0.2), 500); // at least 500
  const daysSaved = Math.max(Math.round(weakest.analytics.estimatedDaysLeft * 0.15), 5);

  return `You are ${pct}% toward your ${weakest.goal.title} goal. ` +
    `Increasing your monthly saving by just ₹${extraMonthly.toLocaleString()} ` +
    `could help you reach it ${daysSaved} days earlier.`;
}

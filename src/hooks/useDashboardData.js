import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { generateFinancialInsight } from '../services/aiService';
import { getSafePercentageChange } from '../utils/formatters';
import { useRealtimeTransactions } from './useRealtimeTransactions';

export const useDashboardData = () => {
    const [userId, setUserId] = useState(null);
    const [profile, setProfile] = useState(null);
    const [budgets, setBudgets] = useState([]);
    const [goalPredictions, setGoalPredictions] = useState([]);
    const [staticLoading, setStaticLoading] = useState(true);

    const { transactions, loading: txLoading } = useRealtimeTransactions(userId);

    const [aiInsight, setAiInsight] = useState('');

    // ── Fetch user identity + semi-static data once ──────────────────────────
    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setStaticLoading(false);
                return;
            }

            setUserId(user.id);

            const [
                { data: profileData },
                { data: budgets },
                { data: goals },
            ] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', user.id).single(),
                supabase.from('budgets').select('*').eq('user_id', user.id),
                supabase.from('goals').select('*').eq('user_id', user.id),
            ]);

            // Set fetched data
            setProfile(profileData || null);
            setBudgets(budgets || []);
            // Ensure a budget entry exists for the current month (default 50000)
            const currentMonth = new Date().toLocaleString('default', { month: 'long' });
            const hasCurrentMonthBudget = (budgets || []).some(b => b.category?.toLowerCase() === currentMonth.toLowerCase());
            if (!hasCurrentMonthBudget) {
                (async () => {
                    try {
                        await supabase.from('budgets').insert({
                          user_id: user.id,
                          category: currentMonth,
                          Budget: 50000,
                          month: new Date().getMonth() + 1,
                          year: new Date().getFullYear(),
                        });
                        // Refresh budgets after insertion
                        const { data: refreshedBudgets } = await supabase.from('budgets').select('*').eq('user_id', user.id);
                        setBudgets(refreshedBudgets || []);

                    } catch (e) {
                        console.error('Failed to create monthly budget', e);
                    }
                })();
            }
            setGoalPredictions(goals || []);
            setStaticLoading(false);
        };

        init();
    }, []);

    // ── All dynamic metrics derived ONLY from live transactions ────────────────
    const dynamicData = useMemo(() => {
        const EMPTY = {
            spendingStats: { totalSpend: 0, monthlySpend: 0, dailyAverage: 0 },
            categoryBreakdown: [],
            financialHealth: { score: null, savings_rate_score: 0, goals_progress_score: 0, budget_adherence_score: 0 },
            monthlyStatsData: [],
            expenseTrend: { value: 0, uiLabel: 'No data', trend: 'neutral' },
            budgetsVsActual: [],
        };

        // HARD RULE: if no real transactions, return all zeros / nulls
        if (!transactions || transactions.length === 0) {
            console.log('[useDashboardData] transactions empty → returning zero state');
            return EMPTY;
        }

        console.log('[useDashboardData] Processing', transactions.length, 'transactions');

        const now = transactions.length > 0
            ? new Date(transactions.reduce((max, t) => Math.max(max, new Date(t.created_at).getTime()), 0))
            : new Date();
        const last30Start = new Date(now);
        last30Start.setDate(last30Start.getDate() - 30);

        const prev30Start = new Date(now);
        prev30Start.setDate(prev30Start.getDate() - 60);


        let totalIncomeAllTime = 0;
        let totalExpenseAllTime = 0;

        const categoryTotals = {};
        const monthlyStatsMap = {};
        const monthlyExpenseMap = {}; // YYYY-MM → total expense (all time, for budget adherence)

        let currentTotalExpense = 0;  // last 30 days
        let prevTotalExpense = 0;     // prior 30 days

        transactions.forEach(txn => {
            const txnDate = new Date(txn.created_at);
            const amount = parseFloat(txn.amount) || 0;

            // All-time totals
            if (txn.type === 'income') totalIncomeAllTime += amount;
            if (txn.type === 'expense') totalExpenseAllTime += amount;

            // Monthly bar chart grouping (YYYY-MM)
            const monthKey = txnDate.toISOString().substring(0, 7);
            if (!monthlyStatsMap[monthKey]) {
                monthlyStatsMap[monthKey] = { month: monthKey, income: 0, expense: 0 };
            }
            if (txn.type === 'income') monthlyStatsMap[monthKey].income += amount;
            if (txn.type === 'expense') monthlyStatsMap[monthKey].expense += amount;

            // Per-month expense totals for budget adherence
            if (txn.type === 'expense') {
                if (!monthlyExpenseMap[monthKey]) monthlyExpenseMap[monthKey] = 0;
                monthlyExpenseMap[monthKey] += amount;
            }

            // Period-based windows
            if (txn.type === 'expense') {
                if (txnDate >= last30Start) {
                    currentTotalExpense += amount;
                    categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + amount;
                } else if (txnDate >= prev30Start) {
                    prevTotalExpense += amount;
                }
            }
        });

        // ── 3-PILLAR FINANCIAL HEALTH SCORE ───────────────────────────────────

        // PILLAR 1 — Savings Rate (30 pts max)
        // % of income saved. 30%+ savings = full 30 pts.
        let savingsRateScore = 0;
        if (totalIncomeAllTime > 0) {
            const rate = Math.max(0, (totalIncomeAllTime - totalExpenseAllTime) / totalIncomeAllTime);
            savingsRateScore = Math.min(30, Math.round(rate * 100)); // 1pt per 1% saved, cap at 30
        }

        // PILLAR 2 — Budget Adherence (40 pts max)
        // For each month where user set a budget, check if actual expense ≤ budget.
        // Score = (months within budget / total budgeted months) * 40
        let budgetAdherenceScore = 0;
        const validBudgets = budgets.filter(b => {
            const limit = parseFloat(b.Budget ?? b.amount ?? 0);
            return limit > 0 && b.month && b.year;
        });
        if (validBudgets.length > 0) {
            let monthsWithin = 0;
            validBudgets.forEach(b => {
                const limit = parseFloat(b.Budget ?? b.amount ?? 0);
                const key = `${b.year}-${String(b.month).padStart(2, '0')}`;
                const actual = monthlyExpenseMap[key] || 0;
                if (actual <= limit) monthsWithin++;
            });
            budgetAdherenceScore = Math.round((monthsWithin / validBudgets.length) * 40);
        } else {
            // No budgets set — give partial credit if saving positively
            budgetAdherenceScore = totalIncomeAllTime > totalExpenseAllTime ? 20 : 0;
        }

        // PILLAR 3 — Goals Progress (30 pts max)
        // Completed goals = full weight; active goals = proportional (saved/target).
        let goalsProgressScore = 0;
        if (goalPredictions.length > 0) {
            let totalWeight = 0, achievedWeight = 0;
            goalPredictions.forEach(g => {
                const target = parseFloat(g.target_amount) || 0;
                const saved = parseFloat(g.saved_amount) || 0;
                totalWeight += 1;
                achievedWeight += g.status === 'completed' ? 1 : (target > 0 ? Math.min(saved / target, 1) : 0);
            });
            goalsProgressScore = totalWeight > 0 ? Math.round((achievedWeight / totalWeight) * 30) : 0;
        }

        const rawScore = savingsRateScore + budgetAdherenceScore + goalsProgressScore;
        const score = (totalIncomeAllTime === 0 && totalExpenseAllTime === 0) ? null : Math.max(0, Math.min(100, rawScore));

        // Category breakdown (last 30 days expenses, sorted desc)
        const categoryBreakdown = Object.entries(categoryTotals)
            .map(([name, amount]) => ({ name, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5)
            .map(cat => ({ ...cat, color: 'bg-blue-500' }));

        const expenseTrend = getSafePercentageChange(currentTotalExpense, prevTotalExpense);

        const monthlyStatsData = Object.values(monthlyStatsMap)
            .sort((a, b) => a.month.localeCompare(b.month));

        const budgetsVsActual = budgets.map(b => {
            const actual_spend = categoryTotals[b.category] || 0;
            const usage_percentage = b.amount > 0 ? (actual_spend / b.amount) * 100 : 0;
            return {
                ...b,
                actual_spend,
                monthly_limit: b.amount,
                usage_percentage
            };
        });

        return {
            spendingStats: {
                totalSpend: totalExpenseAllTime,
                monthlySpend: currentTotalExpense,
                dailyAverage: currentTotalExpense / 30,
            },
            categoryBreakdown,
            financialHealth: { score, savings_rate_score: savingsRateScore, goals_progress_score: goalsProgressScore, budget_adherence_score: budgetAdherenceScore },
            monthlyStatsData,
            expenseTrend,
            budgetsVsActual,
        };
    }, [transactions, budgets, goalPredictions]);

    // ── AI Insight (debounced, only fires when real data exists) ─────────────
    useEffect(() => {
        if (txLoading || !transactions || transactions.length === 0) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setAiInsight('Add transactions to unlock AI-powered financial insights.');
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                const insight = await generateFinancialInsight({
                    monthlySpend: dynamicData.spendingStats.monthlySpend,
                    categoryBreakdown: dynamicData.categoryBreakdown,
                    expenseTrend: dynamicData.expenseTrend,
                });
                setAiInsight(insight);
            } catch (err) {
                console.error('Failed to generate AI insight', err);
                setAiInsight('Unable to generate insight right now.');
            }
        }, 1500);

        return () => clearTimeout(timeoutId);
    }, [dynamicData.spendingStats.monthlySpend, dynamicData.categoryBreakdown, dynamicData.expenseTrend, txLoading, transactions]);

    return {
        loading: staticLoading || txLoading,
        profile,
        goalPredictions,
        transactions,
        aiInsight,
        ...dynamicData,
    };
};

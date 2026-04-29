import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { generateFinancialInsight } from '../services/aiService';
import { getSafePercentageChange } from '../utils/formatters';
import { useRealtimeTransactions } from './useRealtimeTransactions';

export const useDashboardData = () => {
    const [userId, setUserId] = useState(null);
    const [profile, setProfile] = useState(null);
    const [budgetsVsActual, setBudgetsVsActual] = useState([]);
    const [goalPredictions, setGoalPredictions] = useState([]);
    const [staticLoading, setStaticLoading] = useState(true);

    const { transactions, loading: txLoading } = useRealtimeTransactions(userId);

    const [aiInsight, setAiInsight] = useState('');
    const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

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
                supabase.from('goals').select('*').eq('user_id', user.id).eq('status', 'active'),
            ]);

            setProfile(profileData || null);

            // Budget vs Actual — computed from live transactions, kept here for structure
            setBudgetsVsActual(budgets || []);
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
            financialHealth: { score: null },
            monthlyStatsData: [],
            expenseTrend: { value: 0, uiLabel: 'No data', trend: 'neutral' },
        };

        // HARD RULE: if no real transactions, return all zeros / nulls
        if (!transactions || transactions.length === 0) {
            console.log('[useDashboardData] transactions empty → returning zero state');
            return EMPTY;
        }

        console.log('[useDashboardData] Processing', transactions.length, 'transactions');

        const now = new Date();
        const last30Start = new Date(now);
        last30Start.setDate(last30Start.getDate() - 30);

        const prev30Start = new Date(now);
        prev30Start.setDate(prev30Start.getDate() - 60);

        let totalIncomeAllTime = 0;
        let totalExpenseAllTime = 0;

        const categoryTotals = {};
        const monthlyStatsMap = {};

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

        // Financial Health Score
        let score = null;
        if (totalIncomeAllTime === 0 && totalExpenseAllTime === 0) {
            score = null; // "No data"
        } else {
            const savings = totalIncomeAllTime - totalExpenseAllTime;
            score = totalIncomeAllTime > 0
                ? Math.max(0, Math.min(100, (savings / totalIncomeAllTime) * 100))
                : 0;
        }

        // Category breakdown (last 30 days expenses, sorted desc)
        const categoryBreakdown = Object.entries(categoryTotals)
            .map(([name, amount]) => ({ name, amount }))
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5)
            .map(cat => ({ ...cat, color: 'bg-blue-500' }));

        const expenseTrend = getSafePercentageChange(currentTotalExpense, prevTotalExpense);

        const monthlyStatsData = Object.values(monthlyStatsMap)
            .sort((a, b) => a.month.localeCompare(b.month));

        return {
            spendingStats: {
                totalSpend: totalExpenseAllTime,
                monthlySpend: currentTotalExpense,
                dailyAverage: currentTotalExpense / 30,
            },
            categoryBreakdown,
            financialHealth: { score },
            monthlyStatsData,
            expenseTrend,
        };
    }, [transactions]);

    // ── AI Insight (debounced, only fires when real data exists) ─────────────
    useEffect(() => {
        if (txLoading || !transactions || transactions.length === 0) {
            setAiInsight('Add transactions to unlock AI-powered financial insights.');
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsGeneratingInsight(true);
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
            } finally {
                setIsGeneratingInsight(false);
            }
        }, 1500);

        return () => clearTimeout(timeoutId);
    }, [dynamicData.spendingStats.monthlySpend, dynamicData.expenseTrend?.value, txLoading]);

    return {
        loading: staticLoading || txLoading,
        profile,
        budgetsVsActual,
        goalPredictions,
        transactions,
        aiInsight,
        ...dynamicData,
    };
};

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { generateFinancialInsight } from '../services/aiService';
import { fetchDashboardData } from '../services/dashboardService';
import { getSafePercentageChange } from '../utils/formatters';

export const useDashboardData = (isPreview = false) => {
    const [loading, setLoading] = useState(!isPreview);
    const [data, setData] = useState(() => {
        if (isPreview) {
            return {
                profile: null,
                transactions: [],
                budgets: [],
                spendingStats: { totalSpend: 8240, monthlySpend: 8240, dailyAverage: 265 },
                categoryBreakdown: [
                    { name: 'Housing', amount: 2400 },
                    { name: 'Food', amount: 1800 },
                    { name: 'Transport', amount: 1440 },
                    { name: 'Travel', amount: 1400 },
                    { name: 'Entertainment', amount: 1200 }
                ],
                financialHealth: { score: 78, savings_rate_score: 30, goals_progress_score: 20, budget_adherence_score: 28 },
                monthlyStatsData: [
                    { month: "Jan", income: 5000, expense: 2000 },
                    { month: "Feb", income: 5200, expense: 2500 },
                    { month: "Mar", income: 5400, expense: 3000 }
                ],
                aiInsight: "• Expenses ↑ 12.5% vs last month (Transport ↑, Food ↓)\n• Cut transport budget next month",
                expenseTrend: { value: 12.5, label: "12.5%", trend: "up" },
                budgetsVsActual: [
                    { category: 'Housing', monthly_limit: 3000, actual_spend: 2400, usage_percentage: 80 },
                    { category: 'Food', monthly_limit: 2000, actual_spend: 1800, usage_percentage: 90 },
                    { category: 'Transport', monthly_limit: 1000, actual_spend: 900, usage_percentage: 90 }
                ],
                goalPredictions: [
                    { title: "Emergency Fund", target_amount: 10000, saved_amount: 5000, avg_monthly_saving: 1000, months_left: 5 },
                    { title: "Vacation", target_amount: 5000, saved_amount: 1000, avg_monthly_saving: 500, months_left: 8 }
                ],
                categoryTrends: [
                    { category: 'Transport', current_spend: 1440, prev_spend: 960, change_pct: 50 },
                    { category: 'Food', current_spend: 1800, prev_spend: 2250, change_pct: -20 }
                ]
            };
        }
        return {
            profile: null,
            transactions: [],
            budgets: [],
            spendingStats: { totalSpend: 0, monthlySpend: 0, dailyAverage: 0 },
            categoryBreakdown: [],
            financialHealth: { score: 0, savings_rate_score: 0, goals_progress_score: 0, budget_adherence_score: 0 },
            monthlyStatsData: [],
            aiInsight: "Analyzing your data to uncover insights...",
            expenseTrend: { value: 0, label: "0%", trend: "neutral" },
            budgetsVsActual: [],
            goalPredictions: [],
            categoryTrends: []
        };
    });

    useEffect(() => {
        if (isPreview) return; // KILL api fetching on landing pages explicitly

        const fetchData = async () => {
            try {
                if (!supabase) return;

                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                // 1. Fetch Profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                // 2. Fetch all recent transactions to calibrate relative timeline regardless of import age
                const { data: transactions } = await supabase
                    .from('transactions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('date', { ascending: false })
                    .limit(200);

                // 3. Fetch Budgets
                const { data: budgets } = await supabase
                    .from('budgets')
                    .select('*')
                    .eq('user_id', user.id);

                // --- DATA PROCESSING WITH CENTRALIZED SERVICE ---
                const { 
                    monthly: monthlyStatsData, 
                    categories: topCategoriesData, 
                    health: healthScore,
                    expenseTrend,
                    budgetsVsActual,
                    goalPredictions,
                    categoryTrends 
                } = await fetchDashboardData(user.id);

                // STEP 1: Filter Transactions by Time Window bounds to latest data frame
                const now = (transactions && transactions.length > 0) ? new Date(transactions[0].date) : new Date();
                const last30DaysTransactions = [];
                const prev30DaysTransactions = [];

                (transactions || []).forEach(txn => {
                    const txnDate = new Date(txn.date);
                    const diff = (now - txnDate) / (1000 * 60 * 60 * 24);
                    if (diff <= 30) {
                        last30DaysTransactions.push(txn);
                    } else if (diff > 30 && diff <= 60) {
                        prev30DaysTransactions.push(txn);
                    }
                });

                // STEP 2 & 3: Aggregate by Category & Sort
                const categoryTotals = {};
                let currentTotal = 0;
                last30DaysTransactions.forEach(txn => {
                    if (txn.type === "expense") {
                        categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + txn.amount;
                        currentTotal += txn.amount;
                    }
                });

                let prevTotal = 0;
                prev30DaysTransactions.forEach(txn => {
                    if (txn.type === "expense") {
                        prevTotal += txn.amount;
                    }
                });

                const topSources = Object.entries(categoryTotals)
                    .map(([category, total]) => ({ category, total }))
                    .sort((a, b) => b.total - a.total);

                // STEP 5: Limit to Top 5 UI bounds
                const top5 = topSources.slice(0, 5);

                const categoryBreakdown = top5.map(cat => ({
                    name: cat.category || 'Categorized',
                    amount: cat.total || 0,
                    color: 'bg-blue-500' 
                }));

                // STEP 8: Fix "No Change" UI Label (Compare last 30 vs prev 30)
                const localExpenseTrendObj = getSafePercentageChange(currentTotal, prevTotal);

                // Legacy fallbacks for broader context
                let totalSpend = 0;
                (monthlyStatsData || []).forEach(stat => {
                    totalSpend += parseFloat(stat.expense) || 0;
                });

                setData({
                    profile,
                    transactions: transactions || [],
                    budgets: budgets || [],
                    spendingStats: {
                        totalSpend,
                        monthlySpend: currentTotal,
                        dailyAverage: currentTotal / 30 
                    },
                    categoryBreakdown,
                    financialHealth: (typeof healthScore === 'object' && healthScore !== null) ? healthScore : { score: parseFloat(healthScore) || 0, savings_rate_score: 0, goals_progress_score: 0, budget_adherence_score: 0 },
                    monthlyStatsData: monthlyStatsData || [],
                    aiInsight: "Analyzing your data to uncover insights...",
                    expenseTrend: localExpenseTrendObj,
                    budgetsVsActual: budgetsVsActual || [],
                    goalPredictions: goalPredictions || [],
                    categoryTrends: categoryTrends || []
                });

                // Trigger AI generation (non-blocking) utilizing the explicit JS array temporal bounds mapped for UI parity
                generateFinancialInsight({
                    monthlySpend: currentTotal,
                    categoryBreakdown,
                    expenseTrend: localExpenseTrendObj
                }).then(insight => {
                    setData(prev => ({ ...prev, aiInsight: insight }));
                });

            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { loading, ...data };
};

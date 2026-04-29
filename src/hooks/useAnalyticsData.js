import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { generateAnalyticsInsight } from '../services/aiService';
import { useRealtimeTransactions } from './useRealtimeTransactions';

const EMPTY_DATA = {
    kpis: { total_income: 0, total_expense: 0, net_savings: 0, top_category: 'None' },
    timeSeries: [],
    categoryBreakdown: [],
    subcategoryBreakdown: [],
};

export const useAnalyticsData = (filters) => {
    const [userId, setUserId] = useState(null);
    const { transactions, loading: txLoading, error: txError } = useRealtimeTransactions(
        userId,
        filters.startDate,
        filters.endDate
    );

    const [insight, setInsight] = useState('');
    const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserId(user.id);
        };
        fetchUser();
    }, []);

    const data = useMemo(() => {
        // STRICT: no transactions → return zeros, render nothing
        if (!transactions || transactions.length === 0) {
            console.log('[useAnalyticsData] No transactions → returning empty state');
            return EMPTY_DATA;
        }

        console.log('[useAnalyticsData] Processing', transactions.length, 'transactions');

        let filteredTransactions = transactions;
        if (filters.categoryFilter) {
            filteredTransactions = filteredTransactions.filter(
                t => t.category === filters.categoryFilter
            );
        }

        let totalIncome = 0;
        let totalExpense = 0;
        const categoryMap = {};
        const subCategoryMap = {};

        // ── Time-series grouping ──────────────────────────────────────────────
        // Key is always YYYY-MM (7 chars) so each calendar month gets exactly ONE bucket.
        // The chart XAxis uses the `period` field, formatted as "Apr 2026".
        const timeSeriesMap = {};

        filteredTransactions.forEach(t => {
            const rawAmount = parseFloat(t.amount);
            // Guard: skip NaN rows
            if (!isFinite(rawAmount) || isNaN(rawAmount)) return;

            const amount = Math.abs(rawAmount); // always positive

            // ── Income / Expense totals ──
            if (t.type === 'income') {
                totalIncome += amount;
            } else if (t.type === 'expense') {
                totalExpense += amount;

                // Category Breakdown
                categoryMap[t.category] = (categoryMap[t.category] || 0) + amount;

                // Subcategory Breakdown
                const subKey = `${t.category}|${t.subcategory || 'Other'}`;
                if (!subCategoryMap[subKey]) {
                    subCategoryMap[subKey] = {
                        category: t.category,
                        subcategory: t.subcategory || 'Other',
                        amount: 0,
                    };
                }
                subCategoryMap[subKey].amount += amount;
            }

            // ── Time-series bucketing ─────────────────────────────────────────
            // Extract YYYY-MM from created_at (ISO string)
            const createdAt = t.created_at;
            if (!createdAt) return;

            let bucketKey; // YYYY-MM
            if (filters.timeGroup === 'year') {
                bucketKey = createdAt.substring(0, 4); // YYYY
            } else {
                // Default: month grouping  →  YYYY-MM
                bucketKey = createdAt.substring(0, 7);
            }

            if (!timeSeriesMap[bucketKey]) {
                // Format a human-readable label for the X-axis
                let label;
                if (filters.timeGroup === 'year') {
                    label = bucketKey; // "2026"
                } else {
                    // "2026-04" → "Apr 2026"
                    const [year, month] = bucketKey.split('-');
                    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
                    label = date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
                }
                timeSeriesMap[bucketKey] = { bucketKey, period: label, income: 0, expense: 0 };
            }

            if (t.type === 'income') {
                timeSeriesMap[bucketKey].income += amount;
            } else if (t.type === 'expense') {
                timeSeriesMap[bucketKey].expense += amount;
            }
        });

        // Sort by YYYY-MM key (chronological order)
        const timeSeries = Object.values(timeSeriesMap)
            .sort((a, b) => a.bucketKey.localeCompare(b.bucketKey))
            .map(({ period, income, expense }) => ({
                period,
                income: Math.round(income * 100) / 100,
                expense: Math.round(expense * 100) / 100,
            }));

        const categoryBreakdown = Object.entries(categoryMap)
            .map(([category, amount]) => ({ category, amount: Math.round(amount * 100) / 100 }))
            .sort((a, b) => b.amount - a.amount);

        const subcategoryBreakdown = Object.values(subCategoryMap)
            .map(s => ({ ...s, amount: Math.round(s.amount * 100) / 100 }))
            .sort((a, b) => b.amount - a.amount);

        const topCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0].category : 'None';

        console.log('[useAnalyticsData] timeSeries:', timeSeries);

        // Safe division guard for KPIs
        const safeNetSavings = isFinite(totalIncome - totalExpense)
            ? totalIncome - totalExpense
            : 0;

        return {
            kpis: {
                total_income: totalIncome,
                total_expense: totalExpense,
                net_savings: safeNetSavings,
                top_category: topCategory,
            },
            timeSeries,
            categoryBreakdown,
            subcategoryBreakdown,
        };
    }, [transactions, filters]);

    // ── Debounced AI Insight ──────────────────────────────────────────────────
    useEffect(() => {
        if (txLoading || !transactions || transactions.length === 0) {
            setInsight('Add transactions to get AI-powered financial insights.');
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                setIsGeneratingInsight(true);
                const rawData = {
                    kpis: data.kpis,
                    time_series: data.timeSeries,
                    category_breakdown: data.categoryBreakdown,
                    subcategory_breakdown: data.subcategoryBreakdown,
                };
                const aiInsight = await generateAnalyticsInsight(rawData);
                setInsight(aiInsight);
            } catch (err) {
                console.error('AI Insight Error:', err);
                setInsight('Unable to generate insight right now.');
            } finally {
                setIsGeneratingInsight(false);
            }
        }, 1500);

        return () => clearTimeout(timeoutId);
    }, [data.kpis.total_income, data.kpis.total_expense, txLoading]);

    return {
        data,
        insight,
        loading: txLoading || isGeneratingInsight,
        error: txError,
        hasData: Boolean(transactions && transactions.length > 0),
        transactions,
    };
};

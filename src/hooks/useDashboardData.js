import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useDashboardData = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        profile: null,
        transactions: [],
        budgets: [],
        spendingStats: {
            totalSpend: 0,
            monthlySpend: 0,
            dailyAverage: 0
        },
        categoryBreakdown: []
    });

    useEffect(() => {
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

                // 2. Fetch Transactions (Last 30 days for monthly stats)
                // For simplicity, fetching all recent transactions first
                const { data: transactions } = await supabase
                    .from('transactions')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('date', { ascending: false })
                    .limit(50);

                // 3. Fetch Budgets
                const { data: budgets } = await supabase
                    .from('budgets')
                    .select('*')
                    .eq('user_id', user.id);

                // --- DATA PROCESSING ---

                // Calculate Total Spend (This Month)
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();

                let monthlySpend = 0;
                let totalSpend = 0;
                const categoryMap = {};

                transactions?.forEach(txn => {
                    const txnDate = new Date(txn.date);
                    const amount = parseFloat(txn.amount);

                    if (txn.type === 'expense') {
                        totalSpend += amount;

                        if (txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear) {
                            monthlySpend += amount;
                        }

                        // Category Breakdown
                        if (!categoryMap[txn.category]) {
                            categoryMap[txn.category] = 0;
                        }
                        categoryMap[txn.category] += amount;
                    }
                });

                // Format Category Data for Charts
                const categoryBreakdown = Object.keys(categoryMap).map(cat => ({
                    name: cat,
                    amount: categoryMap[cat],
                    // Assign random color or map specific ones if needed
                    color: 'bg-blue-500'
                })).sort((a, b) => b.amount - a.amount).slice(0, 5); // Top 5

                setData({
                    profile,
                    transactions: transactions || [],
                    budgets: budgets || [],
                    spendingStats: {
                        totalSpend,
                        monthlySpend,
                        dailyAverage: monthlySpend / now.getDate() // Avg per day this month
                    },
                    categoryBreakdown
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

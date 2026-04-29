import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useRealtimeTransactions = (userId, startDate, endDate) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTransactions = useCallback(async () => {
        if (!userId) return;
        
        try {
            // setError(null);
            
            let query = supabase
                .from('transactions')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: true });
                
            if (startDate) {
                query = query.gte('created_at', startDate);
            }
            if (endDate) {
                // endDate is a plain date string (YYYY-MM-DD); created_at is a full
                // ISO timestamp, so append end-of-day to avoid cutting off today's records.
                const endOfDay = endDate.includes('T') ? endDate : `${endDate}T23:59:59.999Z`;
                query = query.lte('created_at', endOfDay);
            }

            const { data, error: fetchError } = await query;

            if (fetchError) {
                console.error('Supabase Query Error:', fetchError);
                throw fetchError;
            }
            console.log('Fetched Transactions:', data);
            setTransactions(data || []);
        } catch (err) {
            console.error('Error fetching real-time transactions:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [userId, startDate, endDate]);

    useEffect(() => {
        if (!userId) {
            setLoading(false);
            return;
        }

        // Initial fetch
        fetchTransactions();

        // Realtime Subscription
        const channel = supabase
            .channel('transactions_channel')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${userId}` },
                (payload) => {
                    console.log('Realtime change received!', payload);
                    fetchTransactions(); // refetch on change
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [userId, fetchTransactions]);

    return { transactions, loading, error, refetch: fetchTransactions };
};

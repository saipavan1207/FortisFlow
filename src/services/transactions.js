import { supabase } from '../lib/supabase';

// Add a new transaction
export const addTransaction = async (transactionData) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { data, error } = await supabase
            .from('transactions')
            .insert([
                {
                    user_id: user.id,
                    ...transactionData,
                    source: 'manual' // Default source for manual entry
                }
            ])
            .select() // Return the inserted data
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error adding transaction:', error);
        return { data: null, error };
    }
};

// Get transactions for the current user
export const getTransactions = async (filters = {}) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        let query = supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });

        // Apply limit if provided
        if (filters.limit) {
            query = query.limit(filters.limit);
        }

        const { data, error } = await query;

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return { data: [], error };
    }
};

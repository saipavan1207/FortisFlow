import { supabase } from '../lib/supabase';

// Add a new transaction
export const addTransaction = async (transactionData) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const record = {
            user_id: user.id,
            amount: parseFloat(transactionData.amount),
            type: transactionData.type,          // 'income' | 'expense'
            category: transactionData.category,
            subcategory: transactionData.subcategory || null,
            description: transactionData.description || null,
            // created_at is set by Supabase default (now()); only override if
            // the user explicitly supplies a custom date from the modal.
            ...(transactionData.created_at && {
                created_at: new Date(transactionData.created_at).toISOString(),
            }),
        };

        console.log('[addTransaction] Inserting record:', record);

        const { data, error } = await supabase
            .from('transactions')
            .insert([record])
            .select()
            .single();

        if (error) throw error;

        console.log('[addTransaction] Inserted:', data);
        return { data, error: null };
    } catch (error) {
        console.error('Error adding transaction:', error);
        return { data: null, error };
    }
};

// Bulk add transactions (used by SMS import)
export const bulkAddTransactions = async (transactions) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const records = transactions.map(txn => ({
            user_id: user.id,
            amount: parseFloat(txn.amount),
            type: txn.type,
            category: txn.category,
            subcategory: txn.subcategory || null,
            description: txn.description || null,
            ...(txn.created_at && {
                created_at: new Date(txn.created_at).toISOString(),
            }),
        }));

        const { data, error } = await supabase
            .from('transactions')
            .insert(records)
            .select();

        if (error) throw error;

        return { data: data || [], error: null, count: data?.length || 0 };
    } catch (error) {
        console.error('Error bulk adding transactions:', error);
        return { data: null, error, count: 0 };
    }
};

// Get transactions for the current user with optional filters
export const getTransactions = async (filters = {}) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        let query = supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        // ── Type filter ──
        if (filters.type && filters.type !== 'all') {
            query = query.eq('type', filters.type);
        }

        // ── Category filter ──
        if (filters.category && filters.category !== 'all') {
            query = query.eq('category', filters.category);
        }

        // ── Date filter ──
        if (filters.date && filters.date !== 'all') {
            const now = new Date();
            let startDate;

            if (filters.date === 'today') {
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            } else if (filters.date === 'week') {
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
            } else if (filters.date === 'month') {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            }

            if (startDate) {
                query = query.gte('created_at', startDate.toISOString());
            }
        }

        // ── Search (description / category ilike) ──
        if (filters.search && filters.search.trim()) {
            query = query.or(
                `description.ilike.%${filters.search.trim()}%,category.ilike.%${filters.search.trim()}%,subcategory.ilike.%${filters.search.trim()}%`
            );
        }

        // ── Limit ──
        if (filters.limit) {
            query = query.limit(filters.limit);
        }

        const { data, error } = await query;

        if (error) throw error;

        console.log('[getTransactions] Fetched:', data?.length ?? 0, 'records');
        return { data: data || [], error: null };
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return { data: [], error };
    }
};

// Delete a single transaction by ID
export const deleteTransaction = async (transactionId) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', transactionId)
            .eq('user_id', user.id);

        if (error) throw error;
        return { error: null };
    } catch (error) {
        console.error('Error deleting transaction:', error);
        return { error };
    }
};

// Delete all transactions for the current user
export const deleteAllTransactions = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('user_id', user.id);

        if (error) throw error;
        return { error: null };
    } catch (error) {
        console.error('Error deleting all transactions:', error);
        return { error };
    }
};

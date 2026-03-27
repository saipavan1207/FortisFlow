import { supabase } from '../lib/supabase';

/**
 * Map app-level type values to DB enum values
 * App uses: 'income' / 'expense'
 * DB uses:  'credit' / 'debit'
 */
const mapTypeToDB = (type) => type;

const mapTypeFromDB = (type) => type;

const mapSourceToDB = (source) => {
    const validSources = ['upi', 'bank', 'card', 'sms', 'HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak', 'Other'];
    if (validSources.includes(source)) return source;
    // Attempt uppercase transformation matching for known values before defaulting to upi
    if (source?.toUpperCase() === 'UPI') return 'upi';
    return 'upi'; // default fallback
};

// Add a new transaction
export const addTransaction = async (transactionData) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const record = {
            user_id: user.id,
            amount: parseFloat(transactionData.amount),
            type: mapTypeToDB(transactionData.type),
            merchant: transactionData.merchant,
            category: transactionData.category,
            account_source: mapSourceToDB(transactionData.source || 'upi'),
            date: transactionData.date
                ? new Date(transactionData.date).toISOString()
                : new Date().toISOString(),
            status: transactionData.status || 'completed',
            description: transactionData.description || null,
        };

        const { data, error } = await supabase
            .from('transactions')
            .insert([record])
            .select()
            .single();

        if (error) throw error;

        // Map type back for the UI
        if (data) data.type = mapTypeFromDB(data.type);
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
            type: mapTypeToDB(txn.type),
            merchant: txn.merchant,
            category: txn.category,
            account_source: mapSourceToDB(txn.source || 'sms'),
            date: txn.date
                ? new Date(txn.date).toISOString()
                : new Date().toISOString(),
            status: 'completed',
            description: txn.description || null,
        }));

        const { data, error } = await supabase
            .from('transactions')
            .insert(records)
            .select();

        if (error) throw error;

        // Map types back for the UI
        const mapped = (data || []).map(d => ({ ...d, type: mapTypeFromDB(d.type) }));
        return { data: mapped, error: null, count: mapped.length };
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
            .order('date', { ascending: false });

        // ── Type filter ──
        if (filters.type && filters.type !== 'all') {
            query = query.eq('type', mapTypeToDB(filters.type));
        }

        // ── Account source filter ──
        if (filters.account && filters.account !== 'all') {
            query = query.eq('account_source', filters.account);
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
                const dayOfWeek = now.getDay();
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
            } else if (filters.date === 'month') {
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            }

            if (startDate) {
                query = query.gte('date', startDate.toISOString());
            }
        }

        // ── Search (merchant ilike) ──
        if (filters.search && filters.search.trim()) {
            query = query.ilike('merchant', `%${filters.search.trim()}%`);
        }

        // ── Limit ──
        if (filters.limit) {
            query = query.limit(filters.limit);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Map DB enum types to app-friendly values & normalize column names
        const mapped = (data || []).map(row => ({
            ...row,
            type: mapTypeFromDB(row.type),
            date: row.date,
            source: row.account_source,
        }));

        return { data: mapped, error: null };
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

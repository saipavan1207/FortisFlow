import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, Calendar, Tag } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const CATEGORIES = [
    'Food',
    'Shopping',
    'Transport',
    'Bills',
    'Subscriptions',
    'Entertainment',
    'Health',
    'Travel',
];

const currentYearMonth = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
};

const BudgetModal = ({ isOpen, onClose, onSave }) => {
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [limit, setLimit] = useState('');
    const [month, setMonth] = useState(() => currentYearMonth());
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const handleClose = () => {
        setCategory(CATEGORIES[0]);
        setLimit('');
        setMonth(currentYearMonth());
        setError('');
        onClose();
    };

    const handleSave = async () => {
        const parsedLimit = parseFloat(limit);
        if (!category || !limit || isNaN(parsedLimit) || parsedLimit <= 0) {
            setError('Please enter a valid category and limit.');
            return;
        }
        if (!/^\d{4}-\d{2}$/.test(month)) {
            setError('Invalid month format.');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const [year, mon] = month.split('-').map(Number);
            const monthDate = new Date(year, mon - 1, 1).toISOString().split('T')[0];

            const { error: upsertError } = await supabase
                .from('budgets')
                .upsert(
                    {
                        user_id: user.id,
                        category,
                        monthly_limit: parsedLimit,
                        month: monthDate,
                    },
                    { onConflict: 'user_id,category,month' }
                );

            if (upsertError) throw upsertError;

            onSave();
            handleClose();
        } catch (err) {
            console.error('Budget save error:', err);
            setError(err.message || 'Failed to save budget. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-[#09090b]/80 backdrop-blur-md z-[100]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 font-manrope">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md bg-zinc-950 border border-white/10 shadow-2xl rounded-3xl overflow-hidden relative"
                        >
                            {/* Decorative Top Glow */}
                            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-sm" />
                            <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-400 to-transparent" />

                            <div className="p-6 sm:p-8">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                                            <Wallet className="w-6 h-6 text-blue-400" />
                                            Adjust Budget
                                        </h2>
                                        <p className="text-zinc-400 text-sm mt-1">Set a monthly spending limit for a category.</p>
                                    </div>
                                    <button
                                        onClick={handleClose}
                                        className="p-2 text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors self-start border border-white/5"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* Category */}
                                    <div>
                                        <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">
                                            Category
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Tag className="h-4 w-4 text-zinc-500" />
                                            </div>
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium shadow-inner appearance-none [color-scheme:dark]"
                                            >
                                                {CATEGORIES.map((cat) => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Monthly Limit & Month row */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">
                                                Monthly Limit (₹)
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <span className="text-zinc-500 font-bold text-sm">₹</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    step="0.01"
                                                    value={limit}
                                                    onChange={(e) => setLimit(e.target.value)}
                                                    placeholder="5000"
                                                    className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium placeholder:text-zinc-600 shadow-inner"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 ml-1">
                                                Month
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Calendar className="h-4 w-4 text-zinc-500" />
                                                </div>
                                                <input
                                                    type="month"
                                                    value={month}
                                                    onChange={(e) => setMonth(e.target.value)}
                                                    className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-medium shadow-inner [color-scheme:dark]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <p className="text-rose-400 text-xs font-semibold px-1">{error}</p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            onClick={handleClose}
                                            className="px-4 py-2.5 text-zinc-400 hover:text-white font-bold text-sm transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving || !limit || !category}
                                            className="px-6 py-2.5 bg-white text-black hover:bg-zinc-200 font-bold text-sm rounded-xl transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {saving ? 'Saving…' : 'Save Budget'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default BudgetModal;

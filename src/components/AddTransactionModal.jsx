import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { addTransaction } from '../services/transactions';

const categories = [
    { id: 'Food', label: 'Food & Dining' },
    { id: 'Transport', label: 'Transport' },
    { id: 'Shopping', label: 'Shopping' },
    { id: 'Bills', label: 'Bills & Utilities' },
    { id: 'Housing', label: 'Housing' },
    { id: 'Health', label: 'Health' },
    { id: 'Entertainment', label: 'Entertainment' },
    { id: 'Subscriptions', label: 'Subscriptions' },
    { id: 'Travel', label: 'Travel' },
    { id: 'Income', label: 'Income' },
    { id: 'Other', label: 'Other' }
];

const AddTransactionModal = ({ isOpen, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [type, setType] = useState('expense'); // 'expense' or 'income'

    const [formData, setFormData] = useState({
        amount: '',
        category: 'Food',
        subcategory: '',
        description: '',
        created_at: new Date().toISOString().split('T')[0]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        let newFormData = { ...formData, [name]: value };

        // Auto-categorization logic — scan description and subcategory
        if (name === 'subcategory' || name === 'description') {
            const textToScan = value.toLowerCase();
            if (textToScan.includes('swiggy') || textToScan.includes('zomato') || textToScan.includes('blinkit')) {
                newFormData.category = 'Food';
                if (type === 'income') setType('expense');
            } else if (textToScan.includes('netflix') || textToScan.includes('prime') || textToScan.includes('hotstar')) {
                newFormData.category = 'Entertainment';
                if (type === 'income') setType('expense');
            } else if (textToScan.includes('uber') || textToScan.includes('ola') || textToScan.includes('rapido')) {
                newFormData.category = 'Transport';
            }
        }

        setFormData(newFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: apiError } = await addTransaction({
                ...formData,
                type,
                amount: parseFloat(formData.amount)
            });

            if (apiError) throw apiError;

            // Success — reset form
            setFormData({
                amount: '',
                category: 'Food',
                subcategory: '',
                description: '',
                created_at: new Date().toISOString().split('T')[0]
            });
            onSuccess?.();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[#09090b] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                        <h2 className="text-lg font-bold text-white">Add Transaction</h2>
                        <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Type Toggle */}
                        <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-white/5">
                            <button
                                type="button"
                                onClick={() => setType('expense')}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${type === 'expense' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Expense
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('income')}
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${type === 'income' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Income
                            </button>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Amount</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₹</span>
                                <input
                                    type="number"
                                    name="amount"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg pl-8 pr-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-600"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Subcategory + Date Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Subcategory / Merchant</label>
                                <input
                                    type="text"
                                    name="subcategory"
                                    value={formData.subcategory}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-600"
                                    placeholder="Swiggy, Amazon..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Date</label>
                                <input
                                    type="date"
                                    name="created_at"
                                    required
                                    value={formData.created_at}
                                    onChange={handleChange}
                                    className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id} className="bg-zinc-900">{cat.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Description (Optional)</label>
                            <textarea
                                name="description"
                                rows="2"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-zinc-600 resize-none"
                                placeholder="Details about this transaction..."
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <CheckCircle2 className="w-4 h-4" />
                            )}
                            {loading ? 'Adding...' : 'Add Transaction'}
                        </button>

                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default AddTransactionModal;

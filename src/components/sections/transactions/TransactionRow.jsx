import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, Trash2, Loader2 } from 'lucide-react';

const SOURCE_LABELS = {
    upi: 'UPI',
    bank: 'Bank Transfer',
    card: 'Card',
    sms: 'SMS Import',
};

const TransactionRow = ({ transaction, onDelete }) => {
    const [deleting, setDeleting] = useState(false);
    const isIncome = transaction.type === 'income';
    const accountSource = SOURCE_LABELS[transaction.account_source] || transaction.account_source || 'UPI';
    const txnDate = transaction.date || transaction.transaction_date;

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (deleting) return;
        setDeleting(true);
        await onDelete?.(transaction.id);
        setDeleting(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20, height: 0 }}
            className="grid grid-cols-7 px-6 py-4 border-b border-white/[0.02] hover:bg-blue-500/[0.015] transition-all duration-200 ease-out items-center group relative cursor-pointer"
        >
            {/* Subtle row hover glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/[0.02] to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Date */}
            <div className="col-span-1 text-sm text-zinc-400 font-medium z-10">
                {txnDate ? new Date(txnDate).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }) : '—'}
            </div>

            {/* Details / Merchant */}
            <div className="col-span-2 flex items-center gap-3 z-10">
                <div
                    className="w-10 h-10 rounded-[12px] flex items-center justify-center bg-white/[0.03] border border-white/[0.05] shadow-inner transition-transform duration-200 ease-out group-hover:scale-[1.02]"
                >
                    {isIncome ? <ArrowDownLeft className="w-4 h-4 text-emerald-400" /> : <ArrowUpRight className="w-4 h-4 text-rose-400" />}
                </div>
                <div>
                    <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{transaction.merchant || 'Unknown Merchant'}</p>
                    {transaction.description && <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-[200px]">{transaction.description}</p>}
                </div>
            </div>

            {/* Category */}
            <div className="col-span-1 z-10">
                <span className="px-2.5 py-1 rounded-[6px] bg-white/[0.02] border border-white/[0.04] text-xs text-zinc-400 font-medium">
                    {transaction.category || 'Uncategorized'}
                </span>
            </div>

            {/* Account Source */}
            <div className="col-span-1 z-10">
                <span className="text-sm text-zinc-400">
                    {accountSource}
                </span>
            </div>

            {/* Status Badge + Delete */}
            <div className="col-span-1 z-10 flex items-center gap-2">
                {isIncome ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/[0.05] border border-emerald-500/[0.1] text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                        Credited
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/[0.05] border border-rose-500/[0.1] text-rose-400 text-[10px] font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500/80" />
                        Debited
                    </span>
                )}

                {/* Delete button — visible on hover */}
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 disabled:opacity-50"
                    title="Delete transaction"
                >
                    {deleting
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />
                    }
                </button>
            </div>

            {/* Amount */}
            <div
                className={`col-span-1 text-right font-bold text-[15px] z-10 transition-colors duration-200
                ${isIncome ? 'text-emerald-400 group-hover:text-emerald-300' : 'text-rose-400 group-hover:text-rose-300'}`}
            >
                {isIncome ? '+' : '−'}₹{parseFloat(transaction.amount).toLocaleString()}
            </div>
        </motion.div>
    );
};

export default TransactionRow;

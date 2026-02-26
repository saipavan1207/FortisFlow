import React, { useMemo } from 'react';
import { ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';
import GlassCard from '../../common/GlassCard';

const SummaryCards = ({ transactions = [] }) => {
    // Calculate summaries
    const summary = useMemo(() => {
        return transactions.reduce((acc, curr) => {
            const amount = parseFloat(curr.amount) || 0;
            if (curr.type === 'income') {
                acc.income += amount;
                acc.balance += amount;
            } else {
                acc.expense += amount;
                acc.balance -= amount;
            }
            return acc;
        }, { income: 0, expense: 0, balance: 0 });
    }, [transactions]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
            {/* Total Balance */}
            <GlassCard hoverEffect delay={0} className="p-6 flex flex-col justify-between overflow-hidden group !bg-[#131114]">
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Balance</p>
                    <div className="relative">
                        {/* Ultra-smooth CSS radial glow, no filters to prevent tearing */}
                        <div className="absolute -inset-8 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none" />
                        <div className="p-2.5 rounded-xl bg-blue-500/[0.02] border border-blue-500/10 shadow-inner flex items-center justify-center relative z-10 group-hover:bg-blue-500/[0.05] transition-colors duration-300">
                            <Wallet className="w-5 h-5 text-blue-500" />
                        </div>
                    </div>
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white tracking-tight">₹{summary.balance.toLocaleString()}</h2>
                </div>
            </GlassCard>

            {/* Total Income */}
            <GlassCard hoverEffect delay={0.1} className="p-6 flex flex-col justify-between overflow-hidden group !bg-[#131114]">
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Income</p>
                    <div className="relative">
                        <div className="absolute -inset-8 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.15)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none" />
                        <div className="p-2.5 rounded-xl bg-emerald-500/[0.02] border border-emerald-500/10 shadow-inner flex items-center justify-center relative z-10 group-hover:bg-emerald-500/[0.05] transition-colors duration-300">
                            <ArrowDownLeft className="w-5 h-5 text-emerald-500" />
                        </div>
                    </div>
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white tracking-tight">₹{summary.income.toLocaleString()}</h2>
                </div>
            </GlassCard>

            {/* Total Expense */}
            <GlassCard hoverEffect delay={0.2} className="p-6 flex flex-col justify-between overflow-hidden group !bg-[#131114]">
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Expenses</p>
                    <div className="relative">
                        <div className="absolute -inset-8 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.15)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none" />
                        <div className="p-2.5 rounded-xl bg-rose-500/[0.02] border border-rose-500/10 shadow-inner flex items-center justify-center relative z-10 group-hover:bg-rose-500/[0.05] transition-colors duration-300">
                            <ArrowUpRight className="w-5 h-5 text-rose-500" />
                        </div>
                    </div>
                </div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-white tracking-tight">₹{summary.expense.toLocaleString()}</h2>
                </div>
            </GlassCard>
        </div>
    );
};

export default SummaryCards;

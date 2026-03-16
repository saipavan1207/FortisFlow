import React, { useMemo } from 'react';
import { ArrowUpRight, ArrowDownLeft, ArrowRight, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import GlassCard from '../../common/GlassCard';

const ImportSmsButton = ({ onClick }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center h-full"
        >
            <button onClick={onClick} className="group flex overflow-hidden uppercase transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(234,88,12,0.5)] focus:outline-none text-sm font-medium text-white tracking-widest rounded-full py-4 px-10 relative items-center justify-center">
                {/* Beam border keyframes */}
                <style>{`
                    @keyframes beam-spin { to { transform: rotate(360deg); } }
                    @keyframes dots-move {
                        0% { background-position: 0 0; }
                        100% { background-position: 24px 24px; }
                    }
                `}</style>

                {/* Full Border Beam */}
                <div className="absolute inset-0 -z-20 rounded-full overflow-hidden p-[1px]">
                    <div
                        className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#ea580c_360deg)]"
                        style={{ animation: 'beam-spin 3s linear infinite' }}
                    />
                    <div className="absolute inset-[1px] rounded-full bg-black" />
                </div>

                {/* Inner Background & Effects */}
                <div className="-z-10 overflow-hidden bg-zinc-950 rounded-full absolute top-[2px] right-[2px] bottom-[2px] left-[2px]">
                    <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/60 to-transparent" />
                    <div
                        className="opacity-30 mix-blend-overlay absolute inset-0"
                        style={{
                            backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
                            backgroundSize: '12px 12px',
                            animation: 'dots-move 8s linear infinite'
                        }}
                    />
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-orange-500/10 blur-2xl rounded-full pointer-events-none transition-colors duration-500 group-hover:bg-orange-500/30" />
                </div>

                {/* Content */}
                <MessageSquare className="relative z-10 w-4 h-4 mr-3 text-orange-400 transition-colors group-hover:text-orange-300" />
                <span className="relative z-10 text-white/90 transition-colors group-hover:text-white">
                    Import SMS
                </span>
                <ArrowRight className="relative z-10 w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1 text-white/70" />
            </button>
        </motion.div>
    );
};

const SummaryCards = ({ transactions = [], onImportSms }) => {
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
            {/* Import SMS Button */}
            <ImportSmsButton onClick={onImportSms} />

            {/* Total Income */}
            <GlassCard hoverEffect delay={0.1} glowColor="rgba(16, 185, 129, 0.15)" className="p-6 flex flex-col justify-between overflow-hidden group !bg-[#131114]">
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
            <GlassCard hoverEffect delay={0.2} glowColor="rgba(244, 63, 94, 0.15)" className="p-6 flex flex-col justify-between overflow-hidden group !bg-[#131114]">
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

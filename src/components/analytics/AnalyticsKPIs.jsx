import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const KPICard = ({ title, value, icon: Icon, colorClass, delay = 0 }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay }}
        className="bg-zinc-950/50 p-5 rounded-2xl border border-white/5 relative overflow-hidden"
    >
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClass} opacity-[0.03] rounded-full blur-2xl -mr-10 -mt-10`}></div>
        <div className="flex items-center gap-3 mb-2">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${colorClass} bg-opacity-10`}>
                <Icon className={`w-5 h-5 text-white`} />
            </div>
            <span className="text-sm font-medium text-zinc-400">{title}</span>
        </div>
        <h3 className="text-2xl font-bold text-white mt-4">{value}</h3>
    </motion.div>
);

const AnalyticsKPIs = ({ kpis }) => {
    const { total_income, total_expense, net_savings, top_category } = kpis;

    const formatCurrency = (amount) => {
        const n = Number(amount);
        if (!isFinite(n) || isNaN(n)) return '₹0';
        return `₹${Math.round(n).toLocaleString('en-IN')}`;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <KPICard 
                title="Total Income" 
                value={formatCurrency(total_income)} 
                icon={TrendingUp} 
                colorClass="from-green-500 to-emerald-600"
                delay={0}
            />
            <KPICard 
                title="Total Expense" 
                value={formatCurrency(total_expense)} 
                icon={TrendingDown} 
                colorClass="from-red-500 to-rose-600"
                delay={0.1}
            />
            <KPICard 
                title="Net Savings" 
                value={formatCurrency(net_savings)} 
                icon={Wallet} 
                colorClass="from-blue-500 to-indigo-600"
                delay={0.2}
            />
            <KPICard 
                title="Top Category" 
                value={top_category} 
                icon={Target} 
                colorClass="from-purple-500 to-fuchsia-600"
                delay={0.3}
            />
        </div>
    );
};

export default AnalyticsKPIs;

import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
    LayoutDashboard, ArrowRightLeft, CreditCard,
    Smartphone, Wallet, Target, BarChart3,
    PieChart, Sparkles, LogOut, Settings as SettingsIcon, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import Logo from '../common/Logo';
import UserDropdown from '../common/UserDropdown';


const SidebarItem = ({ icon: Icon, label, path, active }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => path && navigate(path)}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${active
                ? 'bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/20'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
        >
            <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
            <span className="text-sm tracking-wide">{label}</span>
        </div>
    );
};

const DashboardLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Mapping router paths to Header titles
    const routeTitles = {
        '/dashboard': 'Dashboard',
        '/transactions': 'Transactions',
        '/cards': 'Cards & UPI',
        '/categories': 'Categories',
        '/goals': 'Goals',
        '/analytics': 'Analytics',
        '/reports': 'Reports',
        '/insights': 'AI Insights',
    };

    // Determine current page title based on path, fallback to empty
    const currentPath = location.pathname;
    const pageTitle = routeTitles[currentPath] || 'Overview';

    const isActive = (path) => currentPath === path;

    return (
        <div className="flex h-screen w-full bg-[#09090b] text-white font-manrope overflow-hidden rounded-2xl border border-zinc-800/50 shadow-2xl">
            {/* --- SIDEBAR --- */}
            <aside className="w-60 h-full flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl hidden md:flex shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-white/5">
                    <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
                        <div className="flex items-center justify-center relative">
                            <Logo className="h-7 text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-wide text-white font-manrope">FortisFlow</span>
                    </div>
                </div>

                <div className="flex-1 px-4 space-y-8 overflow-y-auto custom-scrollbar pt-6">
                    {/* Platform Group */}
                    <div>
                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-3">Platform</h3>
                        <div className="space-y-1">
                            <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" active={isActive('/dashboard')} />
                            <SidebarItem icon={ArrowRightLeft} label="Transactions" path="/transactions" active={isActive('/transactions')} />
                            <SidebarItem icon={CreditCard} label="Cards & UPI" path="/cards" active={isActive('/cards')} />
                            <SidebarItem icon={Wallet} label="Categories" path="/categories" active={isActive('/categories')} />
                            <SidebarItem icon={Target} label="Goals" path="/goals" active={isActive('/goals')} />
                        </div>
                    </div>

                    {/* Insights Group */}
                    <div>
                        <h3 className="text-xs font-semibold text-zinc-600 uppercase tracking-wider mb-4 px-4">Insights</h3>
                        <div className="space-y-1">
                            <SidebarItem icon={BarChart3} label="Analytics" path="/analytics" active={isActive('/analytics')} />
                            <SidebarItem icon={PieChart} label="Reports" path="/reports" active={isActive('/reports')} />
                            <SidebarItem icon={Sparkles} label="AI Insights" path="/insights" active={isActive('/insights')} />
                        </div>
                    </div>
                </div>

                {/* User Profile Dropdown */}
                <UserDropdown />
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col min-w-0 bg-[#0c0c0e] relative overflow-hidden">
                {/* Dynamic Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 relative z-10 flex-shrink-0">
                    <div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={pageTitle}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <h1 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Overview</h1>
                                <h2 className="text-xl font-bold text-white tracking-tight">{pageTitle}</h2>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/5">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-[#0c0c0e]"></span>
                        </button>
                    </div>
                </header>

                {/* Page Content Rendered Here */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;

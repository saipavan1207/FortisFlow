import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import DatePicker from './DatePicker';

const AnalyticsFilters = ({ filters, setFilters }) => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categories = ["All Categories", "Food", "Entertainment", "Travel", "Shopping", "Utilities", "Other"];

    return (
        <div className="flex flex-col md:flex-row gap-4 items-center bg-zinc-950/50 p-4 rounded-2xl border border-white/5 mb-6">
            <div className="flex gap-2 p-1 bg-zinc-900 rounded-lg">
                {['week', 'month', 'year'].map(time => (
                    <button
                        key={time}
                        onClick={() => setFilters({ ...filters, timeGroup: time })}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-md capitalize transition-all ${
                            filters.timeGroup === time 
                                ? 'bg-blue-500 text-white shadow-md' 
                                : 'text-zinc-400 hover:text-white'
                        }`}
                    >
                        {time}
                    </button>
                ))}
            </div>

            <div className="flex flex-1 items-center gap-4 w-full flex-wrap">
                <DatePicker
                    label="Start Date"
                    value={filters.startDate}
                    onChange={(val) => setFilters({ ...filters, startDate: val })}
                    maxDate={filters.endDate}
                />

                <DatePicker
                    label="End Date"
                    value={filters.endDate}
                    onChange={(val) => setFilters({ ...filters, endDate: val })}
                    minDate={filters.startDate}
                />
                
                <div className="flex flex-col ml-auto relative">
                    <span className="text-xs text-zinc-500 mb-1 ml-1 font-semibold uppercase tracking-wider">Category Filter</span>
                    <div 
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className="bg-zinc-900/80 text-sm text-white px-4 py-2.5 rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all cursor-pointer flex items-center justify-between w-48"
                    >
                        <span>{filters.categoryFilter || "All Categories"}</span>
                        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </div>
                    <AnimatePresence>
                        {isCategoryOpen && (
                            <motion.div 
                                initial={{ opacity: 0, y: -5, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -5, scale: 0.95 }}
                                transition={{ duration: 0.15 }}
                                className="absolute top-full right-0 mt-1.5 bg-zinc-900 border border-white/10 rounded-xl shadow-xl z-50 w-full max-h-56 overflow-y-auto custom-scrollbar p-1"
                            >
                                {categories.map(cat => {
                                    const value = cat === "All Categories" ? null : cat;
                                    const isSelected = filters.categoryFilter === value || (cat === "All Categories" && !filters.categoryFilter);
                                    
                                    return (
                                        <div 
                                            key={cat} 
                                            onClick={() => { setFilters({ ...filters, categoryFilter: value }); setIsCategoryOpen(false); }}
                                            className={`px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-blue-500/20 text-blue-400' : 'text-zinc-300 hover:bg-white/5 hover:text-white'}`}
                                        >
                                            {cat}
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsFilters;

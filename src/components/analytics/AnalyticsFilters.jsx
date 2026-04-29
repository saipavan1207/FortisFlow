import React from 'react';

const AnalyticsFilters = ({ filters, setFilters }) => {
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

            <div className="flex flex-1 items-center gap-4 w-full">
                <div className="flex flex-col">
                    <span className="text-xs text-zinc-500 mb-1 ml-1">Start Date</span>
                    <input 
                        type="date" 
                        value={filters.startDate}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                        className="bg-zinc-900 text-sm text-zinc-300 px-3 py-2 rounded-xl border border-white/5 focus:outline-none focus:border-blue-500/50"
                    />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-zinc-500 mb-1 ml-1">End Date</span>
                    <input 
                        type="date" 
                        value={filters.endDate}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                        className="bg-zinc-900 text-sm text-zinc-300 px-3 py-2 rounded-xl border border-white/5 focus:outline-none focus:border-blue-500/50"
                    />
                </div>
                
                <div className="flex flex-col ml-auto">
                    <span className="text-xs text-zinc-500 mb-1 ml-1">Category Filter</span>
                    <select
                        value={filters.categoryFilter || ''}
                        onChange={(e) => setFilters({ ...filters, categoryFilter: e.target.value || null })}
                        className="bg-zinc-900 text-sm text-zinc-300 px-3 py-2 rounded-xl border border-white/5 focus:outline-none focus:border-blue-500/50 w-40"
                    >
                        <option value="">All Categories</option>
                        <option value="Food">Food</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Travel">Travel</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsFilters;

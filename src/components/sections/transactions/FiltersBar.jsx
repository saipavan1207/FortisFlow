import React, { useState } from 'react';
import { Search, ChevronDown, ListFilter, Calendar, Plus } from 'lucide-react';

const FilterSelect = ({ icon: Icon, value, options, onChange, placeholder }) => (
    <div className="relative group">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Icon className="w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
        </div>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none pl-10 pr-10 py-2.5 bg-zinc-900/50 border border-white/5 rounded-xl text-sm text-zinc-300 focus:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-zinc-900 hover:bg-zinc-800/50 transition-all cursor-pointer"
        >
            <option value="all">{placeholder}</option>
            {options.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
                    {opt.label}
                </option>
            ))}
        </select>
        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDown className="w-4 h-4 text-zinc-500" />
        </div>
    </div>
);

const FiltersBar = ({ searchTerm, setSearchTerm, filters, setFilters }) => {
    return (
        <div className="space-y-6 mb-8 relative z-20">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 focus-within:text-blue-400" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-600 hover:bg-zinc-800/50"
                    />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <FilterSelect
                        icon={ListFilter}
                        value={filters?.type || 'all'}
                        onChange={(val) => setFilters({ ...filters, type: val })}
                        placeholder="All Types"
                        options={[
                            { value: 'income', label: 'Credit (Income)' },
                            { value: 'expense', label: 'Debit (Expense)' }
                        ]}
                    />
                    <FilterSelect
                        icon={ListFilter}
                        value={filters?.account || 'all'}
                        onChange={(val) => setFilters({ ...filters, account: val })}
                        placeholder="All Accounts"
                        options={[
                            { value: 'visa', label: 'Visa •••• 8721' },
                            { value: 'upi', label: 'UPI — sai@oksbi' }
                        ]}
                    />
                    <FilterSelect
                        icon={ListFilter}
                        value={filters?.category || 'all'}
                        onChange={(val) => setFilters({ ...filters, category: val })}
                        placeholder="All Categories"
                        options={[
                            { value: 'Housing', label: 'Housing' },
                            { value: 'Food', label: 'Food & Dining' },
                            { value: 'Transport', label: 'Transport' }
                        ]}
                    />
                    <FilterSelect
                        icon={Calendar}
                        value={filters?.date || 'all'}
                        onChange={(val) => setFilters({ ...filters, date: val })}
                        placeholder="Any Time"
                        options={[
                            { value: 'today', label: 'Today' },
                            { value: 'week', label: 'This Week' },
                            { value: 'month', label: 'This Month' }
                        ]}
                    />
                </div>
            </div>
        </div>
    );
};

export default FiltersBar;

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, ListFilter, Calendar, RotateCcw, Check } from 'lucide-react';

// ── Custom Dropdown ──────────────────────────────────
const FilterDropdown = ({ icon: Icon, value, options, onChange, placeholder }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const isActive = value && value !== 'all';
    const selectedLabel = isActive
        ? options.find(o => o.value === value)?.label || value
        : placeholder;

    return (
        <div ref={ref} className="relative">
            {/* Trigger */}
            <button
                type="button"
                onClick={() => setOpen(prev => !prev)}
                className={`
                    w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium
                    border backdrop-blur-md transition-all duration-200 cursor-pointer
                    ${isActive
                        ? 'bg-orange-500/[0.08] border-orange-500/20 text-orange-300 shadow-[0_0_12px_-4px_rgba(234,88,12,0.15)]'
                        : 'bg-zinc-900/50 border-white/[0.05] text-zinc-400 hover:bg-zinc-800/60 hover:border-white/[0.08] hover:text-zinc-300'
                    }
                    ${open ? 'ring-2 ring-blue-500/30 border-blue-500/20' : ''}
                `}
            >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-orange-400' : 'text-zinc-500'}`} />
                <span className="flex-1 text-left truncate">{selectedLabel}</span>
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''} ${isActive ? 'text-orange-400/60' : 'text-zinc-600'}`} />
            </button>

            {/* Dropdown Menu */}
            {open && (
                <div className="absolute z-50 w-full mt-1.5 py-1 bg-[#111113]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                    {/* Default option */}
                    <button
                        type="button"
                        onClick={() => { onChange('all'); setOpen(false); }}
                        className={`
                            w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-all duration-150
                            ${value === 'all' || !value
                                ? 'text-white bg-white/[0.04]'
                                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
                            }
                        `}
                    >
                        <span className="flex-1 text-left">{placeholder}</span>
                        {(value === 'all' || !value) && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </button>

                    <div className="h-px bg-white/[0.04] mx-2 my-0.5" />

                    {/* Options */}
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => { onChange(opt.value); setOpen(false); }}
                            className={`
                                w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-all duration-150
                                ${value === opt.value
                                    ? 'text-white bg-white/[0.05]'
                                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                                }
                            `}
                        >
                            <span className="flex-1 text-left">{opt.label}</span>
                            {value === opt.value && <Check className="w-3.5 h-3.5 text-orange-400" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// ── Default Filters ──────────────────────────────────
const DEFAULT_FILTERS = { type: 'all', account: 'all', category: 'all', date: 'all' };

// ── Filters Bar ──────────────────────────────────────
const FiltersBar = ({ searchTerm, setSearchTerm, filters = DEFAULT_FILTERS, setFilters }) => {
    const activeCount = Object.entries(filters).filter(([, v]) => v && v !== 'all').length
        + (searchTerm ? 1 : 0);

    const handleReset = () => {
        setFilters({ ...DEFAULT_FILTERS });
        setSearchTerm('');
    };

    return (
        <div className="space-y-4 mb-8 relative z-20">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1 group">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/50 border border-white/[0.05] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/20 transition-all placeholder:text-zinc-600 hover:bg-zinc-800/50 backdrop-blur-md"
                    />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <FilterDropdown
                        icon={ListFilter}
                        value={filters.type}
                        onChange={(val) => setFilters({ ...filters, type: val })}
                        placeholder="All Types"
                        options={[
                            { value: 'income', label: 'Credit (Income)' },
                            { value: 'expense', label: 'Debit (Expense)' }
                        ]}
                    />
                    <FilterDropdown
                        icon={ListFilter}
                        value={filters.account}
                        onChange={(val) => setFilters({ ...filters, account: val })}
                        placeholder="All Accounts"
                        options={[
                            { value: 'upi', label: 'UPI' },
                            { value: 'bank', label: 'Bank Transfer' },
                            { value: 'card', label: 'Card' },
                            { value: 'sms', label: 'SMS Import' },
                        ]}
                    />
                    <FilterDropdown
                        icon={ListFilter}
                        value={filters.category}
                        onChange={(val) => setFilters({ ...filters, category: val })}
                        placeholder="All Categories"
                        options={[
                            { value: 'Food', label: 'Food & Dining' },
                            { value: 'Shopping', label: 'Shopping' },
                            { value: 'Transport', label: 'Transport' },
                            { value: 'Bills', label: 'Bills & Utilities' },
                            { value: 'Subscriptions', label: 'Subscriptions' },
                            { value: 'Entertainment', label: 'Entertainment' },
                            { value: 'Health', label: 'Health' },
                            { value: 'Travel', label: 'Travel' },
                            { value: 'Income', label: 'Income' },
                            { value: 'Freelance Income', label: 'Freelance Income' },
                            { value: 'Dining/Eating Out', label: 'Dining/Eating Out' },
                            { value: 'Groceries', label: 'Groceries' },
                            { value: 'Housing', label: 'Housing' },
                            { value: 'Other', label: 'Other' },
                        ]}
                    />
                    <FilterDropdown
                        icon={Calendar}
                        value={filters.date}
                        onChange={(val) => setFilters({ ...filters, date: val })}
                        placeholder="Any Time"
                        options={[
                            { value: 'today', label: 'Today' },
                            { value: 'week', label: 'This Week' },
                            { value: 'month', label: 'This Month' },
                        ]}
                    />
                </div>
            </div>

            {/* Active filter count + Reset */}
            {activeCount > 0 && (
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-bold text-orange-400 uppercase tracking-wider">
                        {activeCount} filter{activeCount !== 1 ? 's' : ''} active
                    </span>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-800/50 border border-white/[0.04] text-[10px] font-bold text-zinc-400 uppercase tracking-wider hover:text-white hover:bg-zinc-700/50 transition-all cursor-pointer"
                    >
                        <RotateCcw className="w-3 h-3" />
                        Reset All
                    </button>
                </div>
            )}
        </div>
    );
};

export default FiltersBar;

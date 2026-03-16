import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { getTransactions, deleteTransaction, deleteAllTransactions } from '../services/transactions';
import SummaryCards from '../components/sections/transactions/SummaryCards';
import FiltersBar from '../components/sections/transactions/FiltersBar';
import TransactionsTable from '../components/sections/transactions/TransactionsTable';
import ImportSmsModal from '../components/ImportSmsModal';
import { Trash2, AlertTriangle, X } from 'lucide-react';

const ITEMS_PER_PAGE = 10;
const DEBOUNCE_MS = 300;

const DEFAULT_FILTERS = { type: 'all', account: 'all', category: 'all', date: 'all' };

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [currentPage, setCurrentPage] = useState(1);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [clearing, setClearing] = useState(false);

    // Debounce search input
    const debounceRef = useRef(null);
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, DEBOUNCE_MS);
        return () => clearTimeout(debounceRef.current);
    }, [searchTerm]);

    // Fetch transactions whenever filters or debounced search change
    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        const queryFilters = {
            ...filters,
            search: debouncedSearch,
        };
        const { data } = await getTransactions(queryFilters);
        setTransactions(data || []);
        setLoading(false);
    }, [filters, debouncedSearch]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // Reset pagination when filters or search change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters, debouncedSearch]);

    // Delete single transaction
    const handleDeleteOne = async (id) => {
        const { error } = await deleteTransaction(id);
        if (!error) {
            setTransactions(prev => prev.filter(t => t.id !== id));
        }
    };

    // Delete all transactions
    const handleClearAll = async () => {
        setClearing(true);
        const { error } = await deleteAllTransactions();
        if (!error) {
            setTransactions([]);
            setCurrentPage(1);
        }
        setClearing(false);
        setShowClearConfirm(false);
    };

    // Pagination
    const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);

    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return transactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [transactions, currentPage]);

    return (
        <div className="p-8 h-full flex flex-col pt-6 font-manrope">
            <SummaryCards
                transactions={transactions}
                onImportSms={() => setShowImportModal(true)}
            />

            <FiltersBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filters={filters}
                setFilters={setFilters}
            />

            {/* Clear All button — only when transactions exist */}
            {transactions.length > 0 && (
                <div className="flex justify-end mb-4">
                    <button
                        type="button"
                        onClick={() => setShowClearConfirm(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/[0.06] border border-rose-500/15 text-rose-400 text-xs font-semibold hover:bg-rose-500/[0.12] hover:border-rose-500/25 transition-all duration-200"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear All Transactions
                    </button>
                </div>
            )}

            <TransactionsTable
                loading={loading}
                transactions={paginatedTransactions}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onDelete={handleDeleteOne}
            />

            <ImportSmsModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
                onSuccess={() => fetchTransactions()}
            />

            {/* ── Clear All Confirmation Modal ── */}
            {showClearConfirm && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
                    onClick={() => setShowClearConfirm(false)}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        className="bg-[#0c0c0e] border border-white/[0.06] rounded-2xl w-full max-w-[400px] shadow-[0_25px_80px_rgba(0,0,0,0.7)] overflow-hidden p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
                                <AlertTriangle className="w-5 h-5 text-rose-400" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">Delete All Transactions?</h3>
                                <p className="text-xs text-zinc-500 mt-0.5">This action cannot be undone.</p>
                            </div>
                        </div>

                        <p className="text-sm text-zinc-400 mb-6">
                            This will permanently remove <span className="text-white font-semibold">{transactions.length}</span> transaction{transactions.length !== 1 ? 's' : ''} from your account. You cannot undo this.
                        </p>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowClearConfirm(false)}
                                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleClearAll}
                                disabled={clearing}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-lg transition-all disabled:opacity-60"
                            >
                                {clearing ? (
                                    <>Deleting...</>
                                ) : (
                                    <>
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete All
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionsPage;

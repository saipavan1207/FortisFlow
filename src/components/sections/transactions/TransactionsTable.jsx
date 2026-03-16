import React from 'react';
import { Loader2 } from 'lucide-react';
import TransactionRow from './TransactionRow';
import Pagination from './Pagination';
import EmptyState from '../../common/EmptyState';
import { CreditCard } from 'lucide-react';

const TransactionsTable = ({
    loading,
    transactions,
    currentPage,
    totalPages,
    onPageChange,
    onDelete
}) => {
    return (
        <div className="flex-1 bg-[#0f0f11]/60 backdrop-blur-2xl border border-white/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.4)] rounded-[20px] overflow-hidden flex flex-col relative min-h-[400px]">
            {/* Header */}
            <div className="grid grid-cols-7 px-6 py-4 border-b border-white/[0.04] bg-white/[0.01] text-[11px] font-bold text-zinc-500 uppercase tracking-widest sticky top-0 z-10 backdrop-blur-md">
                <div className="col-span-1">Date</div>
                <div className="col-span-2">Details / Merchant</div>
                <div className="col-span-1">Category</div>
                <div className="col-span-1">Account Source</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1 text-right">Amount</div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/20 backdrop-blur-sm z-20">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <span className="text-zinc-500 mt-2 text-sm font-medium">Loading transactions...</span>
                    </div>
                ) : transactions.length > 0 ? (
                    transactions.map((t) => (
                        <TransactionRow key={t.id} transaction={t} onDelete={onDelete} />
                    ))
                ) : (
                    <EmptyState
                        icon={CreditCard}
                        title="No transactions yet"
                        description="You don't have any transactions matching the selected filters. Start by adding a new one."
                    />
                )}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default TransactionsTable;

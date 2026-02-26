import React, { useEffect, useState, useMemo } from 'react';
import { getTransactions } from '../services/transactions';
import SummaryCards from '../components/sections/transactions/SummaryCards';
import FiltersBar from '../components/sections/transactions/FiltersBar';
import TransactionsTable from '../components/sections/transactions/TransactionsTable';

const ITEMS_PER_PAGE = 10;

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        setLoading(true);
        const { data } = await getTransactions({ limit: 100 });
        setTransactions(data || []);
        setLoading(false);
    };

    // Filter logic
    const filteredTransactions = useMemo(() => {
        return transactions.filter(t =>
            t.merchant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [transactions, searchTerm]);

    // Reset pagination when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    // Pagination logic
    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTransactions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredTransactions, currentPage]);

    return (
        <div className="p-8 h-full flex flex-col pt-6 font-manrope">
            <SummaryCards
                transactions={transactions}
            />

            <FiltersBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
            />

            <TransactionsTable
                loading={loading}
                transactions={paginatedTransactions}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
    );
};

export default TransactionsPage;

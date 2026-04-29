import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Filter, FileText, Loader2, PieChart } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const CATEGORIES = [
    'Food',
    'Entertainment',
    'Travel',
    'Shopping',
    'Utilities',
    'Other'
];

const MONTHS = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
];

const DownloadReportModal = ({ isOpen, onClose, userId }) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    // Generate years from 2020 to current year
    const YEARS = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => currentYear - i);

    const [reportType, setReportType] = useState('monthly'); // 'monthly' | 'yearly'
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [reportMode, setReportMode] = useState('full'); // 'full' | 'category'
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async () => {
        if (!userId) {
            setError('User not authenticated.');
            return;
        }
        
        setError('');
        setIsGenerating(true);

        try {
            // 1. Calculate dates
            let startDate, endDate;
            if (reportType === 'monthly') {
                startDate = new Date(selectedYear, selectedMonth - 1, 1).toISOString();
                endDate = new Date(selectedYear, selectedMonth, 0, 23, 59, 59, 999).toISOString();
            } else {
                startDate = new Date(selectedYear, 0, 1).toISOString();
                endDate = new Date(selectedYear, 11, 31, 23, 59, 59, 999).toISOString();
            }

            // 2. Fetch data
            let query = supabase
                .from('transactions')
                .select('*')
                .eq('user_id', userId)
                .gte('created_at', startDate)
                .lte('created_at', endDate)
                .order('created_at', { ascending: true });

            const { data, error: fetchError } = await query;

            if (fetchError) throw fetchError;

            // 3. Filter by category
            let filteredData = data || [];
            if (reportMode === 'category') {
                filteredData = filteredData.filter(t => t.category === selectedCategory);
            }

            if (filteredData.length === 0) {
                setError('No transactions found for the selected filters.');
                setIsGenerating(false);
                return;
            }

            // 4. Calculate Totals
            let totalIncome = 0;
            let totalExpense = 0;

            filteredData.forEach(t => {
                const amount = Math.abs(parseFloat(t.amount));
                if (t.type === 'income') {
                    totalIncome += amount;
                } else {
                    totalExpense += amount;
                }
            });

            // 5. Generate PDF
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4',
            });

            const tableData = filteredData.map((txn) => {
                const dateObj = new Date(txn.created_at);
                const formattedDate = `${dateObj.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}\n${dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
                
                const typeStr = txn.type === 'income' ? 'Credit' : 'Debit';
                
                let direction = txn.type === 'income' ? 'Received from ' : 'Paid to ';
                let merchant = txn.merchant || txn.category || 'Unknown';
                let txnId = `T${dateObj.getTime()}${txn.id.substring(0, 5)}`.toUpperCase();
                let accountStr = txn.type === 'income' ? 'Credited to XX4486' : 'Debited from XX4486';

                const detailsStr = `${direction}${merchant}\nTransaction ID : ${txnId}\n${accountStr}`;
                const amountStr = `INR ${Math.abs(parseFloat(txn.amount)).toFixed(2)}`;

                return [formattedDate, detailsStr, typeStr, amountStr];
            });

            // Header Info for the PDF
            pdf.setFontSize(16);
            pdf.setTextColor(40);
            pdf.text('FortisFlow Financial Report', 40, 40);
            
            pdf.setFontSize(10);
            pdf.setTextColor(100);
            
            const periodText = reportType === 'monthly' 
                ? `${MONTHS.find(m => m.value === selectedMonth)?.label} ${selectedYear}`
                : `Year ${selectedYear}`;
            
            pdf.text(`Period: ${periodText}`, 40, 60);

            let startY = 80;
            
            if (reportMode === 'category') {
                pdf.text(`Category: ${selectedCategory}`, 40, startY);
                startY += 15;
            }

            // Totals
            pdf.setFontSize(11);
            pdf.setTextColor(40);
            pdf.text(`Total Expense: INR ${totalExpense.toFixed(2)}`, 40, startY);
            if (totalIncome > 0) {
                pdf.text(`Total Income: INR ${totalIncome.toFixed(2)}`, 200, startY);
            }
            
            startY += 20;

            autoTable(pdf, {
                startY: startY,
                head: [['Date', 'Transaction Details', 'Type', 'Amount']],
                body: tableData,
                theme: 'plain', 
                styles: {
                    fontSize: 8,
                    cellPadding: 8,
                    textColor: [40, 40, 40],
                    lineColor: [230, 230, 230],
                    lineWidth: { bottom: 0.5 },
                },
                headStyles: {
                    fillColor: [245, 245, 245],
                    textColor: [80, 80, 80],
                    fontStyle: 'bold',
                    lineWidth: 0,
                },
                columnStyles: {
                    0: { cellWidth: 80 },
                    1: { cellWidth: 'auto', fontStyle: 'bold' },
                    2: { cellWidth: 50, halign: 'left', fontStyle: 'bold' },
                    3: { cellWidth: 70, halign: 'right', fontStyle: 'bold' },
                },
                didParseCell: function (data) {
                    if (data.section === 'body') {
                        const isCredit = data.row.raw[2] === 'Credit';
                        if (isCredit) {
                            if (data.column.index === 2 || data.column.index === 3) {
                                data.cell.styles.textColor = [34, 197, 94];
                            }
                        } else {
                            if (data.column.index === 2 || data.column.index === 3) {
                                data.cell.styles.textColor = [0, 0, 0];
                            }
                        }
                    }
                },
                didDrawPage: function () {
                    const pageStr = 'Page ' + pdf.internal.getNumberOfPages();
                    pdf.setFontSize(8);
                    pdf.setTextColor(150);
                    const pageSize = pdf.internal.pageSize;
                    const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                    const footerY = pageHeight - 30;
                    const pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
                    
                    pdf.text(pageStr, pageWidth / 2, footerY, { align: 'center' });
                    pdf.text("This is a system generated statement. For any queries, contact us.", pageWidth / 2, footerY + 12, { align: 'center' });
                }
            });

            pdf.save(`FortisFlow_Report_${periodText.replace(' ', '_')}.pdf`);
            onClose(); // Close modal on success
        } catch (err) {
            console.error("PDF Generation Error:", err);
            setError('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-[#0c0c0e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <div className="flex items-center gap-3 text-white">
                                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-semibold">Download Report</h2>
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">
                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Report Type Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-zinc-400">Report Type</label>
                                <div className="flex gap-2 p-1 bg-zinc-900 rounded-lg">
                                    <button
                                        onClick={() => setReportType('monthly')}
                                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                                            reportType === 'monthly' ? 'bg-blue-500 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                                        }`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setReportType('yearly')}
                                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                                            reportType === 'yearly' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                                        }`}
                                    >
                                        Yearly
                                    </button>
                                </div>
                            </div>

                            {/* Duration Inputs */}
                            <div className="grid grid-cols-2 gap-4">
                                {reportType === 'monthly' && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-zinc-500 flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            Month
                                        </label>
                                        <select
                                            value={selectedMonth}
                                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                                            className="w-full bg-zinc-900 text-zinc-300 px-4 py-2.5 rounded-xl border border-white/5 focus:outline-none focus:border-blue-500/50 appearance-none"
                                        >
                                            {MONTHS.map(m => (
                                                <option key={m.value} value={m.value}>{m.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <div className={`space-y-2 ${reportType === 'yearly' ? 'col-span-2' : ''}`}>
                                    <label className="text-xs font-medium text-zinc-500 flex items-center gap-2">
                                        <Calendar className="w-3 h-3" />
                                        Year
                                    </label>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        className="w-full bg-zinc-900 text-zinc-300 px-4 py-2.5 rounded-xl border border-white/5 focus:outline-none focus:border-blue-500/50 appearance-none"
                                    >
                                        {YEARS.map(y => (
                                            <option key={y} value={y}>{y}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Report Mode Selection */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-zinc-400">Report Mode</label>
                                <div className="flex gap-2 p-1 bg-zinc-900 rounded-lg">
                                    <button
                                        onClick={() => setReportMode('full')}
                                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                                            reportMode === 'full' ? 'bg-blue-500 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                                        }`}
                                    >
                                        Full Report
                                    </button>
                                    <button
                                        onClick={() => setReportMode('category')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-md transition-all ${
                                            reportMode === 'category' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                                        }`}
                                    >
                                        <PieChart className="w-4 h-4" />
                                        Category-Based
                                    </button>
                                </div>
                            </div>

                            {/* Category Filter */}
                            {reportMode === 'category' && (
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-500 flex items-center gap-2">
                                        <Filter className="w-3 h-3" />
                                        Select Category
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full bg-zinc-900 text-zinc-300 px-4 py-2.5 rounded-xl border border-white/5 focus:outline-none focus:border-blue-500/50 appearance-none"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 bg-zinc-900/50 border-t border-white/5">
                            <button 
                                onClick={onClose}
                                disabled={isGenerating}
                                className="px-5 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    'Generate Report'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DownloadReportModal;

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, MessageSquare, ChevronRight, Loader2,
    CheckCircle2, ArrowUpRight, ArrowDownLeft,
    Building2, Sparkles, AlertCircle, TrendingUp,
    TrendingDown, BarChart3
} from 'lucide-react';
import { parseSmsMessages } from '../lib/smsParser';
import { bulkAddTransactions } from '../services/transactions';

const BANKS = [
    { id: 'HDFC', label: 'HDFC Bank' },
    { id: 'ICICI', label: 'ICICI Bank' },
    { id: 'SBI', label: 'SBI' },
    { id: 'Axis', label: 'Axis Bank' },
    { id: 'Kotak', label: 'Kotak Mahindra' },
    { id: 'UPI', label: 'UPI' },
    { id: 'Other', label: 'Other' },
];

const CATEGORIES = [
    'Food', 'Shopping', 'Transport', 'Bills',
    'Subscriptions', 'Entertainment', 'Health', 'Travel', 'Other'
];

const EXAMPLE_SMS = `Rs. 45,000.00 credited to A/C XXXX1234 by NEFT from SALARY on 01 Oct 23. Avl Bal Rs. 55,000.00

Rs. 1,200.00 spent on HDFC Card ending 5678 at AMAZON on 05 Oct 23.

Rs. 450.00 debited from A/C XXXX1234 via UPI to SWIGGY on 12 Oct 23. Avl Bal Rs. 53,350.00

Rs. 45,000.00 credited to A/C XXXX1234 by NEFT from SALARY on 01 Nov 23. Avl Bal Rs. 60,000.00

Rs. 2,000.00 debited from A/C XXXX1234 via UPI to ZOMATO on 08 Nov 23. Avl Bal Rs. 58,000.00

Rs. 3,500.00 spent on HDFC Card ending 5678 at FLIPKART on 18 Nov 23.

Rs. 45,000.00 credited to A/C XXXX1234 by NEFT from SALARY on 01 Dec 23. Avl Bal Rs. 62,000.00

Rs. 1,800.00 debited via UPI to OLA on 10 Dec 23. Avl Bal Rs. 60,200.00

Rs. 2,200.00 spent on HDFC Card ending 5678 at BIGBASKET on 15 Dec 23.

Rs. 45,000.00 credited to A/C XXXX1234 by NEFT from SALARY on 01 Jan 24. Avl Bal Rs. 65,000.00

Rs. 1,500.00 debited via UPI to SWIGGY on 07 Jan 24. Avl Bal Rs. 63,500.00

Rs. 4,000.00 spent on HDFC Card ending 5678 at RELIANCE DIGITAL on 20 Jan 24.

Rs. 45,000.00 credited to A/C XXXX1234 by NEFT from SALARY on 01 Feb 24. Avl Bal Rs. 68,000.00

Rs. 2,500.00 debited via UPI to ZOMATO on 09 Feb 24. Avl Bal Rs. 65,500.00

Rs. 3,000.00 spent on HDFC Card ending 5678 at MAKEMYTRIP on 18 Feb 24.

Rs. 4,500.00 spent on HDFC Card ending 5678 at APPLE STORE on 24 Feb 24.

Rs. 1,200.00 debited via UPI to UBER on 28 Feb 24.

Rs. 45,000.00 credited to A/C XXXX1234 by NEFT from SALARY on 01 Mar 24. Avl Bal Rs. 70,000.00

Rs. 1,200.00 debited via UPI to SWIGGY on 10 Mar 24. Avl Bal Rs. 68,800.00

Rs. 5,000.00 spent on HDFC Card ending 5678 at AMAZON on 15 Mar 24.

Rs. 8,000.00 spent on HDFC Card ending 5678 at INDIGO AIRLINES on 20 Mar 24.

Rs. 3,000.00 debited via UPI to ZARA on 25 Mar 24.`;

// ── Stepper ──────────────────────────────────────────
const StepIndicator = ({ currentStep }) => {
    const steps = [
        { num: 1, label: 'Paste SMS' },
        { num: 2, label: 'Preview' },
    ];

    return (
        <div className="flex items-center justify-center gap-2 mb-6">
            {steps.map((step, idx) => (
                <React.Fragment key={step.num}>
                    <div className="flex items-center gap-2">
                        <div className={`
                            w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300
                            ${currentStep > step.num
                                ? 'bg-orange-500 text-white shadow-[0_0_12px_rgba(234,88,12,0.4)]'
                                : currentStep === step.num
                                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-[0_0_12px_rgba(234,88,12,0.2)]'
                                    : 'bg-zinc-800/50 text-zinc-600 border border-zinc-700/50'
                            }
                        `}>
                            {currentStep > step.num ? (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : step.num}
                        </div>
                        <span className={`text-xs font-medium tracking-wide transition-colors duration-300 ${currentStep >= step.num ? 'text-zinc-300' : 'text-zinc-600'}`}>
                            {step.label}
                        </span>
                    </div>
                    {idx < steps.length - 1 && (
                        <div className={`w-8 h-[1px] transition-colors duration-300 ${currentStep > step.num ? 'bg-orange-500/50' : 'bg-zinc-800'}`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

// ── Summary Card ─────────────────────────────────────
const SummaryCard = ({ transactions }) => {
    const summary = useMemo(() => {
        const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
        return { income, expenses, total: transactions.length };
    }, [transactions]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-3 mb-4"
        >
            <div className="p-3 rounded-xl bg-zinc-900/40 border border-white/[0.04]">
                <div className="flex items-center gap-1.5 mb-1">
                    <BarChart3 className="w-3 h-3 text-zinc-500" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Records</span>
                </div>
                <p className="text-lg font-bold text-white">{summary.total}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/10">
                <div className="flex items-center gap-1.5 mb-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-500/70 uppercase tracking-wider">Income</span>
                </div>
                <p className="text-lg font-bold text-emerald-400">₹{summary.income.toLocaleString()}</p>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/[0.04] border border-rose-500/10">
                <div className="flex items-center gap-1.5 mb-1">
                    <TrendingDown className="w-3 h-3 text-rose-500" />
                    <span className="text-[10px] font-bold text-rose-500/70 uppercase tracking-wider">Expenses</span>
                </div>
                <p className="text-lg font-bold text-rose-400">₹{summary.expenses.toLocaleString()}</p>
            </div>
        </motion.div>
    );
};

// ── Main Modal ───────────────────────────────────────
const ImportSmsModal = ({ isOpen, onClose, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [smsText, setSmsText] = useState('');
    const [parsedTransactions, setParsedTransactions] = useState([]);
    const [parsing, setParsing] = useState(false);
    const [importing, setImporting] = useState(false);
    const [parseComplete, setParseComplete] = useState(false);
    const [error, setError] = useState(null);
    const [importSuccess, setImportSuccess] = useState(false);

    const resetModal = useCallback(() => {
        setStep(1);
        setSmsText('');
        setParsedTransactions([]);
        setParsing(false);
        setImporting(false);
        setParseComplete(false);
        setError(null);
        setImportSuccess(false);
    }, []);

    const handleClose = () => {
        resetModal();
        onClose();
    };

    const handleNextStep = () => {
        if (step === 1 && smsText.trim().length < 10) {
            setError('Please paste at least one SMS message.');
            return;
        }
        setError(null);
        setStep(prev => Math.min(prev + 1, 2));
    };

    const handlePrevStep = () => {
        setError(null);
        if (step === 2) {
            setParseComplete(false);
            setParsedTransactions([]);
        }
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleParse = async () => {
        setParsing(true);
        setError(null);
        setParseComplete(false);

        await new Promise(r => setTimeout(r, 600));

        try {
            const results = parseSmsMessages(smsText);
            if (results.length === 0) {
                setError('No transactions could be extracted. Please check the SMS format and try again.');
            } else {
                setParsedTransactions(results);
                setParseComplete(true);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to parse SMS messages. Please try a different format.');
        } finally {
            setParsing(false);
        }
    };

    const handleCategoryChange = (id, newCategory) => {
        setParsedTransactions(prev =>
            prev.map(t => t.id === id ? { ...t, category: newCategory } : t)
        );
    };

    const handleAccountChange = (id, newAccount) => {
        setParsedTransactions(prev =>
            prev.map(t => t.id === id ? { ...t, account_source: newAccount } : t)
        );
    };

    const handleRemoveTransaction = (id) => {
        setParsedTransactions(prev => prev.filter(t => t.id !== id));
    };

    const handleImport = async () => {
        if (parsedTransactions.length === 0) return;

        setImporting(true);
        setError(null);

        try {
            // Prepare transactions for bulk insert
            const txnsToInsert = parsedTransactions.map(txn => ({
                amount: txn.amount,
                type: txn.type,
                merchant: txn.merchant,
                category: txn.category,
                date: txn.date,
                description: `SMS Import: ${txn.originalSms?.substring(0, 100) || ''}`,
                source: txn.account_source || 'sms',
            }));

            const { error: apiError } = await bulkAddTransactions(txnsToInsert);

            if (apiError) throw apiError;

            setImportSuccess(true);
            setTimeout(() => {
                onSuccess?.();
                handleClose();
            }, 1800);
        } catch (err) {
            console.error(err);
            setError(`Import failed: ${err.message || 'Unable to save transactions. Please try again.'}`);
        } finally {
            setImporting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    onClick={e => e.stopPropagation()}
                    className="bg-[#0c0c0e] border border-white/[0.06] rounded-2xl w-full max-w-[660px] shadow-[0_25px_80px_rgba(0,0,0,0.7)] overflow-hidden relative"
                >
                    {/* Orange glow accent */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-orange-500/10 blur-3xl rounded-full pointer-events-none" />

                    {/* ── Header ─────────────────────────── */}
                    <div className="relative px-6 pt-6 pb-4 border-b border-white/[0.04]">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 relative">
                                <div className="absolute inset-0 rounded-xl bg-orange-500/5 blur-sm" />
                                <MessageSquare className="w-5 h-5 text-orange-400 relative z-10" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white tracking-tight">
                                    Import Transactions from SMS
                                </h2>
                                <p className="text-xs text-zinc-500 mt-0.5">
                                    Securely import your bank transaction messages to automatically track expenses and income.
                                </p>
                            </div>
                        </div>

                        <StepIndicator currentStep={step} />
                    </div>

                    {/* ── Body ────────────────────────────── */}
                    <div className="px-6 py-5 max-h-[56vh] overflow-y-auto custom-scrollbar">
                        <AnimatePresence mode="wait">
                            {/* ━━ STEP 1: Paste SMS ━━ */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                                        Paste SMS Messages
                                    </label>
                                    <p className="text-[11px] text-zinc-600 mb-3">
                                        Paste one or multiple bank SMS messages separated by blank lines.
                                    </p>
                                    <textarea
                                        value={smsText}
                                        onChange={e => { setSmsText(e.target.value); setError(null); }}
                                        rows={7}
                                        className="w-full bg-zinc-900/50 border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white font-mono leading-relaxed focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/40 outline-none transition-all placeholder:text-zinc-600 resize-none"
                                        placeholder={"Rs. 450 debited from A/C XXXX via UPI to Swiggy on 12 Mar.\n\nRs. 1200 credited to A/C XXXX by NEFT on 01 Mar."}
                                    />

                                    {/* Example format hint */}
                                    <div className="mt-3 p-3 rounded-lg bg-zinc-900/40 border border-white/[0.04]">
                                        <div className="flex items-center gap-1.5 mb-2">
                                            <Sparkles className="w-3 h-3 text-orange-400" />
                                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                                Supported Formats
                                            </span>
                                        </div>
                                        <div className="space-y-1.5">
                                            <p className="text-[11px] text-zinc-600 font-mono">
                                                • Rs. 450 debited from A/C XXXX via UPI to SWIGGY on 12 Mar 24.
                                            </p>
                                            <p className="text-[11px] text-zinc-600 font-mono">
                                                • Rs. 25,000 credited to A/C XXXX by NEFT from SALARY on 01 Mar 24.
                                            </p>
                                            <p className="text-[11px] text-zinc-600 font-mono">
                                                • Rs.150 spent on Card ending 5678 at Amazon on 10 Mar.
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setSmsText(EXAMPLE_SMS)}
                                        className="mt-2 text-[11px] text-orange-400/70 hover:text-orange-400 transition-colors cursor-pointer"
                                    >
                                        ↳ Load sample SMS for testing
                                    </button>
                                </motion.div>
                            )}

                            {/* ━━ STEP 2: Parse & Preview ━━ */}
                            {step === 2 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {/* Parse button (before extraction) */}
                                    {!parseComplete && (
                                        <div className="text-center py-6">
                                            <button
                                                type="button"
                                                onClick={handleParse}
                                                disabled={parsing}
                                                className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold text-sm rounded-xl transition-all duration-200 shadow-[0_4px_20px_rgba(234,88,12,0.3)] hover:shadow-[0_4px_28px_rgba(234,88,12,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
                                            >
                                                {parsing ? (
                                                    <>
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                        Extracting Transactions...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-4 h-4" />
                                                        Extract Transactions
                                                    </>
                                                )}
                                            </button>
                                            <p className="text-[11px] text-zinc-600 mt-3">
                                                We&apos;ll analyze your SMS messages and extract transaction data
                                            </p>
                                        </div>
                                    )}

                                    {/* Parsed Results */}
                                    {parseComplete && parsedTransactions.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            {/* Summary Card */}
                                            <SummaryCard transactions={parsedTransactions} />

                                            {/* Success badge */}
                                            <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                <span className="text-xs font-medium text-emerald-400">
                                                    {parsedTransactions.length} transaction{parsedTransactions.length !== 1 ? 's' : ''} extracted successfully
                                                </span>
                                            </div>

                                            {/* Preview Table */}
                                            <div className="rounded-xl border border-white/[0.04] overflow-hidden">
                                                <table className="w-full text-left">
                                                    <thead>
                                                        <tr className="border-b border-white/[0.04] bg-zinc-900/30">
                                                            <th className="px-3 py-2.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date</th>
                                                            <th className="px-3 py-2.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Merchant</th>
                                                            <th className="px-3 py-2.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Amount</th>
                                                            <th className="px-3 py-2.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Type</th>
                                                            <th className="px-3 py-2.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Account</th>
                                                            <th className="px-3 py-2.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Category</th>
                                                            <th className="px-2 py-2.5 w-6"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {parsedTransactions.map((txn, i) => (
                                                            <motion.tr
                                                                key={txn.id}
                                                                initial={{ opacity: 0, y: 6 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                transition={{ delay: i * 0.06 }}
                                                                className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors"
                                                            >
                                                                <td className="px-3 py-2.5 text-xs text-zinc-400 font-mono">
                                                                    {txn.date}
                                                                </td>
                                                                <td className="px-3 py-2.5 text-xs text-white font-medium max-w-[120px] truncate">
                                                                    {txn.merchant}
                                                                </td>
                                                                <td className={`px-3 py-2.5 text-xs font-bold ${txn.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                                    ₹{txn.amount.toLocaleString()}
                                                                </td>
                                                                <td className="px-3 py-2.5">
                                                                    <span className={`
                                                                        inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                                                                        ${txn.type === 'income'
                                                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                                        }
                                                                    `}>
                                                                        {txn.type === 'income'
                                                                            ? <ArrowDownLeft className="w-2.5 h-2.5" />
                                                                            : <ArrowUpRight className="w-2.5 h-2.5" />
                                                                        }
                                                                        {txn.type}
                                                                    </span>
                                                                </td>
                                                                <td className="px-3 py-2.5">
                                                                    <select
                                                                        value={txn.account_source || 'Other'}
                                                                        onChange={e => handleAccountChange(txn.id, e.target.value)}
                                                                        className="bg-zinc-800/50 border border-white/[0.06] rounded-md px-2 py-1 text-[11px] text-zinc-300 outline-none cursor-pointer appearance-none hover:border-white/[0.1] transition-colors"
                                                                    >
                                                                        {BANKS.map(b => (
                                                                            <option key={b.id} value={b.id} className="bg-zinc-900">{b.label}</option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                                <td className="px-3 py-2.5">
                                                                    <select
                                                                        value={txn.category}
                                                                        onChange={e => handleCategoryChange(txn.id, e.target.value)}
                                                                        className="bg-zinc-800/50 border border-white/[0.06] rounded-md px-2 py-1 text-[11px] text-zinc-300 outline-none cursor-pointer appearance-none hover:border-white/[0.1] transition-colors"
                                                                    >
                                                                        {CATEGORIES.map(cat => (
                                                                            <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>
                                                                        ))}
                                                                    </select>
                                                                </td>
                                                                <td className="px-2 py-2.5">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleRemoveTransaction(txn.id)}
                                                                        className="text-zinc-600 hover:text-rose-400 transition-colors"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </td>
                                                            </motion.tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error Alert */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 flex items-center gap-2 px-3 py-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg"
                            >
                                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                <span className="text-xs text-rose-400">{error}</span>
                            </motion.div>
                        )}

                        {/* Import Success Overlay */}
                        {importSuccess && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="absolute inset-0 bg-[#0c0c0e]/95 flex flex-col items-center justify-center z-20 rounded-2xl"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                >
                                    <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-4" />
                                </motion.div>
                                <h3 className="text-lg font-bold text-white mb-1">Transactions Imported!</h3>
                                <p className="text-sm text-zinc-500">
                                    {parsedTransactions.length} transaction{parsedTransactions.length !== 1 ? 's' : ''} added successfully.
                                </p>
                                <div className="mt-3 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                    <span className="text-xs font-medium text-emerald-400">
                                        ✓ Dashboard will refresh automatically
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* ── Footer ──────────────────────────── */}
                    <div className="px-6 py-4 border-t border-white/[0.04] flex items-center justify-between">
                        <button
                            type="button"
                            onClick={step === 1 ? handleClose : handlePrevStep}
                            className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200"
                        >
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>

                        <div className="flex items-center gap-2">
                            {step < 2 && (
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    className="inline-flex items-center gap-1.5 px-5 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-white text-sm font-medium rounded-lg border border-white/[0.06] hover:border-white/[0.1] transition-all duration-200"
                                >
                                    Next
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            )}

                            {step === 2 && parseComplete && parsedTransactions.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleImport}
                                    disabled={importing}
                                    className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-b from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white text-sm font-bold rounded-lg transition-all duration-200 shadow-[0_4px_16px_rgba(234,88,12,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {importing ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            Importing...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Import {parsedTransactions.length} Transaction{parsedTransactions.length !== 1 ? 's' : ''}
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ImportSmsModal;

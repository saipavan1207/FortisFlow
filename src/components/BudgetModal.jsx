import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet } from 'lucide-react';

const BudgetModal = ({ isOpen, onClose, currentBudget, onSave }) => {
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);
    const overlayRef = useRef(null);

    // Sync input value when modal opens
    useEffect(() => {
        if (isOpen) {
            setValue(currentBudget.toString());
            setError('');
            // Focus the input after mount animation
            const timer = setTimeout(() => inputRef.current?.focus(), 150);
            return () => clearTimeout(timer);
        }
    }, [isOpen, currentBudget]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // ESC key handler
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, handleKeyDown]);

    const handleSave = () => {
        const parsed = parseFloat(value);
        if (!value || isNaN(parsed) || parsed <= 0) {
            setError('Please enter a valid budget amount greater than ₹0');
            return;
        }
        onSave(parsed);
        onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target === overlayRef.current) onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={overlayRef}
                    onClick={handleOverlayClick}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 12 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="bg-[#09090b] border border-white/10 rounded-2xl w-full max-w-[400px] shadow-2xl overflow-hidden relative"
                    >
                        {/* Ambient glow */}
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-500/10 rounded-full blur-[60px] pointer-events-none" />

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <Wallet className="w-4.5 h-4.5 text-white" />
                                </div>
                                <h2 className="text-lg font-bold text-white">Set Monthly Budget</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-zinc-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-5 relative z-10">
                            <p className="text-sm text-zinc-400 leading-relaxed">
                                Define your monthly spending limit. Your dashboard will track usage in real-time against this target.
                            </p>

                            {/* Input Field */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                    Budget Amount
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-lg select-none">₹</span>
                                    <input
                                        ref={inputRef}
                                        type="number"
                                        min="1"
                                        step="100"
                                        value={value}
                                        onChange={(e) => {
                                            setValue(e.target.value);
                                            if (error) setError('');
                                        }}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
                                        className="w-full bg-zinc-900/70 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-white text-lg font-semibold focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-zinc-600"
                                        placeholder="14,500"
                                    />
                                </div>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-rose-400 text-xs font-medium mt-1"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                            </div>

                            {/* Quick Presets */}
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider shrink-0">Quick:</span>
                                {[5000, 10000, 15000, 25000, 50000].map((preset) => (
                                    <button
                                        key={preset}
                                        onClick={() => {
                                            setValue(preset.toString());
                                            if (error) setError('');
                                        }}
                                        className="px-2.5 py-1 text-[11px] font-semibold text-zinc-400 bg-zinc-800/60 border border-white/5 rounded-lg hover:bg-zinc-700/60 hover:text-white hover:border-white/10 transition-all"
                                    >
                                        ₹{preset.toLocaleString('en-IN')}
                                    </button>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3 pt-1">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 text-sm font-bold text-zinc-400 bg-zinc-900/50 border border-white/5 rounded-xl hover:bg-zinc-800/50 hover:text-zinc-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex-1 py-3 text-sm font-bold text-black bg-white rounded-xl hover:bg-zinc-200 transition-all shadow-[0_4px_14px_rgba(255,255,255,0.1)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.2)]"
                                >
                                    Save Budget
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BudgetModal;

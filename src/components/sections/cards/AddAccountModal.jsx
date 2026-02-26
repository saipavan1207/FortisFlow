import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone } from 'lucide-react';
import AccountCard from './AccountCard';

const AddAccountModal = ({ isOpen, onClose, onAdd }) => {
    const [tab, setTab] = useState('card');

    // Live Form states
    const [cardData, setCardData] = useState({
        bankName: 'Virtual Bank',
        name: 'John Doe',
        number: '**** **** **** 1234',
        expiry: '12/28',
        cardType: 'Credit',
        gradient: 'from-zinc-800 to-zinc-950'
    });

    const [upiData, setUpiData] = useState({
        provider: 'Google Pay',
        upiId: 'name@bank',
        gradient: 'from-emerald-600 to-teal-800'
    });

    // Gradients for live preview selection
    const cardGradients = [
        'from-zinc-800 to-zinc-950',
        'from-blue-600 to-indigo-800',
        'from-purple-600 to-fuchsia-800',
        'from-rose-600 to-pink-800'
    ];

    const handleAdd = () => {
        if (tab === 'card') {
            onAdd({ type: 'card', ...cardData });
        } else {
            onAdd({ type: 'upi', ...upiData });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10"
            >
                {/* Left Side - Form Area */}
                <div className="flex-1 p-8 flex flex-col h-[600px] overflow-y-auto custom-scrollbar">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight">Add Account</h2>
                            <p className="text-zinc-400 text-sm mt-1">Connect a new payment method.</p>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 transition-colors group md:hidden">
                            <X className="w-5 h-5 text-zinc-500 group-hover:text-white" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1 bg-zinc-900 rounded-xl mb-8">
                        <button
                            onClick={() => setTab('card')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === 'card' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
                        >
                            <CreditCard className="w-4 h-4" /> Card
                        </button>
                        <button
                            onClick={() => setTab('upi')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-lg transition-all ${tab === 'upi' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
                        >
                            <Smartphone className="w-4 h-4" /> UPI
                        </button>
                    </div>

                    {/* Dynamic Form Area */}
                    <div className="flex-1">
                        {tab === 'card' ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Bank Name</label>
                                    <input type="text" value={cardData.bankName} onChange={e => setCardData({ ...cardData, bankName: e.target.value })} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. HDFC Bank" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Cardholder Name</label>
                                    <input type="text" value={cardData.name} onChange={e => setCardData({ ...cardData, name: e.target.value })} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. John Doe" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Card Number</label>
                                        <input type="text" maxLength="19" value={cardData.number} onChange={e => setCardData({ ...cardData, number: e.target.value })} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0000 0000 0000 0000" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Expiry</label>
                                        <input type="text" maxLength="5" value={cardData.expiry} onChange={e => setCardData({ ...cardData, expiry: e.target.value })} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="MM/YY" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Type</label>
                                        <select value={cardData.cardType} onChange={e => setCardData({ ...cardData, cardType: e.target.value })} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                            <option value="Credit">Credit</option>
                                            <option value="Debit">Debit</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Card Style</label>
                                    <div className="flex gap-2">
                                        {cardGradients.map((grad, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setCardData({ ...cardData, gradient: grad })}
                                                className={`w-10 h-10 rounded-full bg-gradient-to-br ${grad} border-2 transition-all ${cardData.gradient === grad ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:border-white/50 hover:scale-105'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Provider</label>
                                    <select value={upiData.provider} onChange={e => setUpiData({ ...upiData, provider: e.target.value })} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                                        <option value="Google Pay">Google Pay</option>
                                        <option value="PhonePe">PhonePe</option>
                                        <option value="Paytm">Paytm</option>
                                        <option value="Amazon Pay">Amazon Pay</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1.5">UPI ID</label>
                                    <input type="text" value={upiData.upiId} onChange={e => setUpiData({ ...upiData, upiId: e.target.value })} className="w-full bg-zinc-900 border border-white/5 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 lowercase" placeholder="name@bank" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8">
                        <button
                            onClick={handleAdd}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all outline-none"
                        >
                            Connect {tab === 'card' ? 'Card' : 'UPI'}
                        </button>
                    </div>
                </div>

                {/* Right Side - Live Preview Area (Hidden on Mobile) */}
                <div className="hidden md:flex md:w-[450px] bg-[#0c0c0e] border-l border-white/5 p-8 flex-col items-center justify-center relative">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-colors group z-20">
                        <X className="w-5 h-5 text-zinc-500 group-hover:text-white" />
                    </button>

                    <div className="w-full max-w-sm relative z-10 transition-all duration-500">
                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6 text-center">Live Preview</p>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={tab}
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="w-full drop-shadow-2xl"
                            >
                                <AccountCard account={tab === 'card' ? { type: 'card', ...cardData } : { type: 'upi', ...upiData }} />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Decorative Background for Preview Area */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0)_60%)] pointer-events-none" />
                </div>
            </motion.div>
        </div>
    );
};

export default AddAccountModal;

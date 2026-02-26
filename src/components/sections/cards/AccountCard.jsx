import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone, Zap } from 'lucide-react';
import GlassCard from '../../common/GlassCard';

const AccountCard = ({ account }) => {
    const isCard = account.type === 'card';

    if (isCard) {
        return (
            <GlassCard hoverEffect className={`p-6 bg-gradient-to-br ${account.gradient} overflow-hidden h-56 flex flex-col justify-between relative`}>
                {/* Visa/Mastercard Mock Elements */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 blur-2xl rounded-full pointer-events-none" />
                <div className="absolute top-0 right-0 w-full h-full bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0)_100%)] pointer-events-none z-0" />

                {/* Card Header */}
                <div className="flex justify-between items-start relative z-10 w-full mb-4">
                    <span className="text-white font-extrabold text-lg tracking-tight drop-shadow-md">
                        {account.bankName}
                    </span>
                    <span className="text-white/80 text-xs font-bold uppercase tracking-wider drop-shadow-sm">
                        {account.cardType}
                    </span>
                </div>

                {/* Card Chip Mock */}
                <div className="relative z-10 mb-4 h-8 w-12 rounded-md bg-yellow-600/40 border border-yellow-400/50 backdrop-blur-sm shadow-inner flex items-center justify-center overflow-hidden">
                    <div className="w-full border-t border-yellow-400/30 line-clamp-1 opacity-50 absolute top-2" />
                    <div className="w-full border-t border-yellow-400/30 line-clamp-1 opacity-50 absolute bottom-2" />
                    <div className="h-full border-l border-yellow-400/30 line-clamp-1 opacity-50 absolute left-3" />
                    <div className="h-full border-l border-yellow-400/30 line-clamp-1 opacity-50 absolute right-3" />
                </div>

                {/* Card Number */}
                <div className="relative z-10 tracking-[0.2em] text-white/90 font-mono text-xl md:text-2xl drop-shadow-md mb-2">
                    {account.number}
                </div>

                {/* Footer: Name & Expiry */}
                <div className="flex justify-between items-end relative z-10 w-full mt-auto">
                    <div className="flex flex-col">
                        <span className="text-white/50 text-[10px] uppercase tracking-widest mb-1">Card Holder</span>
                        <span className="text-white font-semibold text-sm uppercase tracking-wider drop-shadow-sm">
                            {account.name}
                        </span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-white/50 text-[10px] uppercase tracking-widest mb-1">Expires</span>
                        <span className="text-white font-bold text-sm tracking-widest drop-shadow-sm">
                            {account.expiry}
                        </span>
                    </div>
                </div>
            </GlassCard>
        );
    }

    // UPI Tile
    return (
        <GlassCard hoverEffect className={`p-6 bg-gradient-to-br ${account.gradient} overflow-hidden h-56 flex flex-col justify-between relative`}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/10 blur-3xl rounded-full pointer-events-none" />

            <div className="flex justify-between items-start relative z-10 w-full">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 shadow-lg">
                    <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 backdrop-blur-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Connected
                </div>
            </div>

            <div className="relative z-10 flex flex-col">
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    {account.provider} UPI
                </span>
                <span className="text-white font-bold text-xl drop-shadow-md tracking-wide">
                    {account.upiId}
                </span>
            </div>
        </GlassCard>
    );
};

export default AccountCard;

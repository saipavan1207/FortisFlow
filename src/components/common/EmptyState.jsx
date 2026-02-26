import React from 'react';
import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';

const EmptyState = ({
    icon: Icon = SearchX,
    title = "No results found",
    description = "We couldn't find any data matching your criteria.",
    actionButton = null
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[300px]"
        >
            <div className="mb-6 relative">
                {/* Extremely Subtle Glow */}
                <div className="absolute inset-0 bg-blue-500/5 blur-2xl rounded-full" />
                <div className="relative w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.05] shadow-inner flex items-center justify-center backdrop-blur-xl">
                    <Icon className="w-6 h-6 text-zinc-500" />
                </div>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{title}</h3>
            <p className="text-zinc-500 text-sm max-w-sm mb-6 leading-relaxed">
                {description}
            </p>

            {actionButton && (
                <div className="mt-2">
                    {actionButton}
                </div>
            )}
        </motion.div>
    );
};

export default EmptyState;

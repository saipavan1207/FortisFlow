import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({
    children,
    className = '',
    onClick,
    hoverEffect = false,
    delay = 0
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            onClick={onClick}
            whileHover={hoverEffect ? { y: -2, transition: { duration: 0.2 } } : {}}
            className={`
                relative group rounded-[20px] overflow-hidden
                bg-[#0f0f11]/60 backdrop-blur-2xl
                border border-white/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.4)]
                ${hoverEffect ? 'hover:border-white/[0.08] hover:shadow-[0_12px_40px_rgb(0,0,0,0.5)] cursor-pointer' : ''}
                transition-all duration-300 ease-out
                ${className}
            `}
        >
            {/* Subtle Gradient Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none" />

            {/* Ambient Top Glow (Soft Edge Highlight) */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none" />

            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </motion.div>
    );
};

export default GlassCard;

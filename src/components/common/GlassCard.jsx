import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({
    children,
    className = '',
    onClick,
    hoverEffect = false,
    delay = 0,
    glowColor = 'rgba(59, 130, 246, 0.15)'
}) => {
    const cardRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    }, []);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            whileHover={hoverEffect ? {
                y: -6,
                scale: 1.015,
                transition: { duration: 0.25, ease: 'easeOut' }
            } : {}}
            className={`
                relative group rounded-[20px] overflow-hidden
                bg-[#0f0f11]/60 backdrop-blur-2xl
                border border-white/[0.04] shadow-[0_8px_30px_rgb(0,0,0,0.4)]
                ${hoverEffect ? 'hover:border-white/[0.1] hover:shadow-[0_20px_60px_rgb(0,0,0,0.6)] cursor-pointer' : ''}
                transition-all duration-300 ease-out
                ${className}
            `}
        >
            {/* Cursor-tracking radial glow */}
            <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-out z-0"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(
                        350px circle at ${mousePos.x}px ${mousePos.y}px,
                        ${glowColor},
                        transparent 70%
                    )`
                }}
            />

            {/* Cursor-tracking border glow */}
            <div
                className="absolute inset-0 pointer-events-none rounded-[20px] transition-opacity duration-300 ease-out z-0"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(
                        300px circle at ${mousePos.x}px ${mousePos.y}px,
                        rgba(255, 255, 255, 0.06),
                        transparent 70%
                    )`,
                    mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    maskComposite: 'exclude',
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    padding: '1px'
                }}
            />

            {/* Subtle Gradient Inner Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent pointer-events-none z-0" />

            {/* Ambient Top Glow (Soft Edge Highlight) */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent pointer-events-none z-0" />

            <div className="relative z-10 w-full h-full">
                {children}
            </div>
        </motion.div>
    );
};

export default GlassCard;

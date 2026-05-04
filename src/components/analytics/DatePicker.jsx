import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function parseDate(dateStr) {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function formatDate(date) {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function formatDisplay(dateStr) {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}-${m}-${y}`;
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    return new Date(year, month, 1).getDay();
}

export default function DatePicker({ label, value, onChange, minDate, maxDate }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const today = new Date();
    const selected = parseDate(value);
    const [viewYear, setViewYear] = useState(selected ? selected.getFullYear() : today.getFullYear());
    const [viewMonth, setViewMonth] = useState(selected ? selected.getMonth() : today.getMonth());
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
                setShowMonthPicker(false);
                setShowYearPicker(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

    const prevMonth = () => {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
    };

    const handleDayClick = (day) => {
        const date = new Date(viewYear, viewMonth, day);
        onChange(formatDate(date));
        setOpen(false);
        setShowMonthPicker(false);
        setShowYearPicker(false);
    };

    const isSelected = (day) => {
        if (!selected) return false;
        return selected.getFullYear() === viewYear &&
            selected.getMonth() === viewMonth &&
            selected.getDate() === day;
    };

    const isToday = (day) => {
        return today.getFullYear() === viewYear &&
            today.getMonth() === viewMonth &&
            today.getDate() === day;
    };

    const isDisabled = (day) => {
        const date = new Date(viewYear, viewMonth, day);
        if (minDate && date < parseDate(minDate)) return true;
        if (maxDate && date > parseDate(maxDate)) return true;
        return false;
    };

    // Year range for picker (±6 years)
    const yearRange = Array.from({ length: 13 }, (_, i) => today.getFullYear() - 6 + i);

    return (
        <div className="flex flex-col relative" ref={ref}>
            <span className="text-xs text-zinc-500 mb-1 ml-1 font-semibold uppercase tracking-wider">{label}</span>
            <button
                type="button"
                onClick={() => { setOpen(o => !o); setShowMonthPicker(false); setShowYearPicker(false); }}
                className="flex items-center gap-2 bg-zinc-900/80 text-sm text-white pl-3 pr-4 py-2.5 rounded-xl border border-white/10 hover:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all cursor-pointer w-44"
            >
                <Calendar className="w-4 h-4 text-zinc-500 shrink-0" />
                <span className={value ? 'text-white' : 'text-zinc-500'}>
                    {value ? formatDisplay(value) : 'Pick a date'}
                </span>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute top-full left-0 mt-2 z-50 w-72"
                        style={{
                            background: 'linear-gradient(145deg, #18181b, #111113)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '16px',
                            boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)',
                            overflow: 'hidden',
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.08))',
                            borderBottom: '1px solid rgba(255,255,255,0.06)',
                            padding: '14px 16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}>
                            <button
                                onClick={prevMonth}
                                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>

                            <div className="flex items-center gap-2">
                                {/* Month selector */}
                                <button
                                    onClick={() => { setShowMonthPicker(m => !m); setShowYearPicker(false); }}
                                    className="text-sm font-bold text-white hover:text-blue-400 transition-colors px-1"
                                >
                                    {MONTHS[viewMonth]}
                                </button>
                                {/* Year selector */}
                                <button
                                    onClick={() => { setShowYearPicker(y => !y); setShowMonthPicker(false); }}
                                    className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors px-1"
                                >
                                    {viewYear}
                                </button>
                            </div>

                            <button
                                onClick={nextMonth}
                                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Month or Year Picker overlay */}
                        <AnimatePresence>
                            {(showMonthPicker || showYearPicker) && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.12 }}
                                    style={{
                                        position: 'absolute',
                                        top: 53,
                                        left: 0,
                                        right: 0,
                                        bottom: 0,
                                        background: 'linear-gradient(145deg, #18181b, #111113)',
                                        zIndex: 10,
                                        padding: '12px',
                                        display: 'grid',
                                        gridTemplateColumns: showYearPicker ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)',
                                        gap: '8px',
                                        alignContent: 'start',
                                    }}
                                >
                                    {showMonthPicker && MONTHS.map((m, i) => (
                                        <button
                                            key={m}
                                            onClick={() => { setViewMonth(i); setShowMonthPicker(false); }}
                                            style={{
                                                padding: '8px 4px',
                                                borderRadius: '10px',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                transition: 'all 0.15s',
                                                background: viewMonth === i ? 'rgba(59,130,246,0.25)' : 'transparent',
                                                color: viewMonth === i ? '#60a5fa' : '#a1a1aa',
                                                border: viewMonth === i ? '1px solid rgba(59,130,246,0.4)' : '1px solid transparent',
                                                cursor: 'pointer',
                                            }}
                                            onMouseEnter={e => { if (viewMonth !== i) e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = '#fff'; }}
                                            onMouseLeave={e => { if (viewMonth !== i) e.target.style.background = 'transparent'; e.target.style.color = viewMonth === i ? '#60a5fa' : '#a1a1aa'; }}
                                        >
                                            {m.slice(0, 3)}
                                        </button>
                                    ))}
                                    {showYearPicker && yearRange.map(yr => (
                                        <button
                                            key={yr}
                                            onClick={() => { setViewYear(yr); setShowYearPicker(false); }}
                                            style={{
                                                padding: '8px 4px',
                                                borderRadius: '10px',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                transition: 'all 0.15s',
                                                background: viewYear === yr ? 'rgba(59,130,246,0.25)' : 'transparent',
                                                color: viewYear === yr ? '#60a5fa' : '#a1a1aa',
                                                border: viewYear === yr ? '1px solid rgba(59,130,246,0.4)' : '1px solid transparent',
                                                cursor: 'pointer',
                                            }}
                                            onMouseEnter={e => { if (viewYear !== yr) e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = '#fff'; }}
                                            onMouseLeave={e => { if (viewYear !== yr) e.target.style.background = 'transparent'; e.target.style.color = viewYear === yr ? '#60a5fa' : '#a1a1aa'; }}
                                        >
                                            {yr}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Day headers */}
                        <div style={{ padding: '12px 16px 4px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                            {DAYS.map(d => (
                                <div key={d} style={{ textAlign: 'center', fontSize: '10px', fontWeight: 700, color: '#52525b', padding: '4px 0', letterSpacing: '0.05em' }}>
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Days grid */}
                        <div style={{ padding: '4px 16px 16px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
                            {/* Empty cells for offset */}
                            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}

                            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                                const sel = isSelected(day);
                                const tod = isToday(day);
                                const dis = isDisabled(day);

                                return (
                                    <button
                                        key={day}
                                        onClick={() => !dis && handleDayClick(day)}
                                        disabled={dis}
                                        style={{
                                            height: '34px',
                                            width: '100%',
                                            borderRadius: '8px',
                                            fontSize: '13px',
                                            fontWeight: sel ? 700 : 500,
                                            cursor: dis ? 'not-allowed' : 'pointer',
                                            transition: 'all 0.15s',
                                            position: 'relative',
                                            border: 'none',
                                            outline: 'none',
                                            background: sel
                                                ? 'linear-gradient(135deg, #3b82f6, #6366f1)'
                                                : tod
                                                    ? 'rgba(59,130,246,0.12)'
                                                    : 'transparent',
                                            color: sel ? '#fff' : dis ? '#3f3f46' : tod ? '#60a5fa' : '#d4d4d8',
                                            boxShadow: sel ? '0 4px 12px rgba(59,130,246,0.4)' : 'none',
                                        }}
                                        onMouseEnter={e => {
                                            if (!sel && !dis) {
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                                e.currentTarget.style.color = '#fff';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (!sel && !dis) {
                                                e.currentTarget.style.background = tod ? 'rgba(59,130,246,0.12)' : 'transparent';
                                                e.currentTarget.style.color = dis ? '#3f3f46' : tod ? '#60a5fa' : '#d4d4d8';
                                            }
                                        }}
                                    >
                                        {day}
                                        {tod && !sel && (
                                            <span style={{
                                                position: 'absolute',
                                                bottom: 3,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                width: 4,
                                                height: 4,
                                                borderRadius: '50%',
                                                background: '#3b82f6',
                                                display: 'block',
                                            }} />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div style={{
                            borderTop: '1px solid rgba(255,255,255,0.06)',
                            padding: '10px 16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <button
                                onClick={() => { onChange(''); setOpen(false); }}
                                style={{ fontSize: '12px', fontWeight: 600, color: '#71717a', cursor: 'pointer', background: 'none', border: 'none', padding: '4px 8px', borderRadius: '6px', transition: 'color 0.15s' }}
                                onMouseEnter={e => e.target.style.color = '#fff'}
                                onMouseLeave={e => e.target.style.color = '#71717a'}
                            >
                                Clear
                            </button>
                            <button
                                onClick={() => { onChange(formatDate(today)); setViewYear(today.getFullYear()); setViewMonth(today.getMonth()); setOpen(false); }}
                                style={{ fontSize: '12px', fontWeight: 700, color: '#3b82f6', cursor: 'pointer', background: 'none', border: 'none', padding: '4px 8px', borderRadius: '6px', transition: 'color 0.15s' }}
                                onMouseEnter={e => e.target.style.color = '#93c5fd'}
                                onMouseLeave={e => e.target.style.color = '#3b82f6'}
                            >
                                Today
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

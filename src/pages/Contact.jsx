import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Button from '../components/common/Button'
import {
    User, Mail, ArrowRight, MessageSquare, Clock, ShieldCheck,
    ChevronDown, Send, CheckCircle2, AlertCircle, BarChart3, Lock
} from 'lucide-react'

// --- ANIMATION VARIANTS ---
const heroStagger = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0.1
        }
    }
}

const wordAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            damping: 20,
            stiffness: 100
        }
    }
}

const cardEntrance = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: "easeOut"
        }
    }
}

const itemFadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
}

// --- FAQ DATA ---
const faqs = [
    {
        question: "How does FortisFlow analyze my spending?",
        answer: "FortisFlow uses AI pattern detection to categorize transactions, track behavior trends, and identify unusual or wasteful spending automatically in real time."
    },
    {
        question: "Are the AI savings recommendations personalized?",
        answer: "Yes. Recommendations are generated from your actual spending habits, recurring expenses, and budget goals — not generic rules."
    },
    {
        question: "Is my financial data secure?",
        answer: "All data is encrypted in transit and at rest, with strict privacy controls and zero data selling. Your financial information stays protected."
    },
    {
        question: "Can I download my reports?",
        answer: "Yes. You can export monthly and yearly reports as PDF or spreadsheet with full breakdown and charts."
    }
]

// --- CONTACT PAGE COMPONENT ---
const Contact = () => {
    const [focusedField, setFocusedField] = useState(null)
    const [openFaq, setOpenFaq] = useState(null)
    const [isChecked, setIsChecked] = useState(false)
    const [subjectOpen, setSubjectOpen] = useState(false)
    const [selectedSubject, setSelectedSubject] = useState("")

    const subjects = [
        { value: "budget", label: "Budget help" },
        { value: "ai", label: "AI insights" },
        { value: "technical", label: "Technical support" },
        { value: "other", label: "Other" }
    ]

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index)
    }

    const headingText = "Get in touch with our team"
    const headingWords = headingText.split(" ")

    return (
        <div className="min-h-screen w-full bg-transparent text-white font-inter selection:bg-blue-500/30 overflow-x-hidden">
            <Navbar />

            {/* BACKGROUND EFFECTS */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Deep Blue -> Violet Gradient Glow (Right Side) - Breathing Animation */}
                <motion.div
                    animate={{
                        opacity: [0.2, 0.3, 0.2],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-gradient-to-br from-blue-900/20 via-violet-900/20 to-transparent rounded-full blur-[120px] mix-blend-screen"
                />

                {/* Soft Vertical Light Streaks - Drifting Upward */}
                <motion.div
                    animate={{ y: [-100, 1000], opacity: [0, 0.4, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] right-[20%] w-[1px] h-[600px] bg-gradient-to-b from-transparent via-blue-500/10 to-transparent blur-[1px]"
                />
                <motion.div
                    animate={{ y: [-200, 1200], opacity: [0, 0.3, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 5 }}
                    className="absolute top-[-20%] right-[35%] w-[1px] h-[800px] bg-gradient-to-b from-transparent via-violet-500/10 to-transparent blur-[1px]"
                />
            </div>

            <div className="relative z-10 pt-32 pb-20 px-6 max-w-[1100px] mx-auto">

                {/* HERO SECTION */}
                <div className="flex flex-col items-center text-center mb-12 space-y-4">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold tracking-widest uppercase text-blue-400 whitespace-nowrap"
                    >
                        <MessageSquare className="w-3 h-3" />
                        <span>Support • FortisFlow Help Center</span>
                    </motion.div>

                    {/* Staggered Heading */}
                    <motion.h1
                        variants={heroStagger}
                        initial="hidden"
                        animate="show"
                        className="text-4xl md:text-5xl font-bold tracking-tight text-white font-manrope relative inline-block"
                    >
                        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
                            {headingWords.map((word, i) => (
                                <motion.span key={i} variants={wordAnimation} className="inline-block">
                                    {word}
                                </motion.span>
                            ))}
                        </div>
                        {/* Subtle Underline Pulse */}
                        <motion.div
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: [0, 0.5, 0.2], scaleX: 1 }}
                            transition={{ duration: 1.5, delay: 0.8 }}
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
                        />
                    </motion.h1>

                    {/* Subheading */}
                    <motion.p
                        initial={{ opacity: 0, filter: "blur(4px)" }}
                        animate={{ opacity: 1, filter: "blur(0px)" }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="text-zinc-400 text-lg max-w-2xl mx-auto font-light"
                    >
                        Get help with budgeting insights, AI financial analysis, savings guidance, and platform support.
                    </motion.p>
                </div>

                {/* MAIN GRID CONTAINER */}
                <motion.div
                    variants={cardEntrance}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6 md:p-9 shadow-2xl relative overflow-hidden"
                >
                    {/* Inner Glow Stripe */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12">

                        {/* LEFT COLUMN - CONTACT FORM */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                visible: { transition: { staggerChildren: 0.08 } }
                            }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <motion.div variants={itemFadeUp} className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-400 ml-1">First Name</label>
                                    <motion.div
                                        animate={{
                                            borderColor: focusedField === 'firstName' ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)',
                                            boxShadow: focusedField === 'firstName' ? '0 0 15px rgba(59,130,246,0.15)' : 'none'
                                        }}
                                        className="relative group rounded-xl bg-zinc-950/50 border transition-all duration-300"
                                    >
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className={`w-4 h-4 transition-colors duration-300 ${focusedField === 'firstName' ? 'text-blue-400' : 'text-zinc-500'}`} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Jane"
                                            onFocus={() => setFocusedField('firstName')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full pl-11 pr-4 py-2.5 bg-transparent outline-none text-white text-sm placeholder-zinc-600/50 transition-all rounded-xl focus:placeholder-zinc-600/20"
                                        />
                                    </motion.div>
                                </motion.div>
                                <motion.div variants={itemFadeUp} className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-400 ml-1">Last Name</label>
                                    <motion.div
                                        animate={{
                                            borderColor: focusedField === 'lastName' ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)',
                                            boxShadow: focusedField === 'lastName' ? '0 0 15px rgba(59,130,246,0.15)' : 'none'
                                        }}
                                        className="relative group rounded-xl bg-zinc-950/50 border transition-all duration-300"
                                    >
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className={`w-4 h-4 transition-colors duration-300 ${focusedField === 'lastName' ? 'text-blue-400' : 'text-zinc-500'}`} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Doe"
                                            onFocus={() => setFocusedField('lastName')}
                                            onBlur={() => setFocusedField(null)}
                                            className="w-full pl-11 pr-4 py-2.5 bg-transparent outline-none text-white text-sm placeholder-zinc-600/50 transition-all rounded-xl focus:placeholder-zinc-600/20"
                                        />
                                    </motion.div>
                                </motion.div>
                            </div>

                            <motion.div variants={itemFadeUp} className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 ml-1">Email Address</label>
                                <motion.div
                                    animate={{
                                        borderColor: focusedField === 'email' ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)',
                                        boxShadow: focusedField === 'email' ? '0 0 15px rgba(59,130,246,0.15)' : 'none'
                                    }}
                                    className="relative group rounded-xl bg-zinc-950/50 border transition-all duration-300"
                                >
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className={`w-4 h-4 transition-colors duration-300 ${focusedField === 'email' ? 'text-blue-400' : 'text-zinc-500'}`} />
                                    </div>
                                    <input
                                        type="email"
                                        placeholder="jane@example.com"
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full pl-11 pr-4 py-2.5 bg-transparent outline-none text-white text-sm placeholder-zinc-600/50 transition-all rounded-xl focus:placeholder-zinc-600/20"
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div variants={itemFadeUp} className="space-y-2 relative z-20">
                                <label className="text-xs font-semibold text-zinc-400 ml-1">Subject</label>
                                <motion.div
                                    animate={{
                                        borderColor: subjectOpen || focusedField === 'subject' ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)',
                                        boxShadow: subjectOpen || focusedField === 'subject' ? '0 0 15px rgba(59,130,246,0.15)' : 'none'
                                    }}
                                    className="relative group rounded-xl bg-zinc-950/50 border transition-all duration-300 cursor-pointer"
                                    onClick={() => setSubjectOpen(!subjectOpen)}
                                >
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <AlertCircle className={`w-4 h-4 transition-colors duration-300 ${subjectOpen || selectedSubject ? 'text-blue-400' : 'text-zinc-500'}`} />
                                    </div>

                                    <div className={`w-full pl-11 pr-4 py-2.5 text-sm font-medium flex items-center ${selectedSubject ? 'text-white' : 'text-zinc-600/50'}`}>
                                        {selectedSubject ? subjects.find(s => s.value === selectedSubject)?.label : "Select a topic"}
                                    </div>

                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${subjectOpen ? 'rotate-180 text-blue-400' : ''}`} />
                                    </div>

                                    <AnimatePresence>
                                        {subjectOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                                transition={{ duration: 0.15, ease: "easeOut" }}
                                                className="absolute top-full left-0 right-0 mt-2 bg-[#0f1218]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_20px_40px_-5px_rgba(0,0,0,0.7)] z-50 overflow-hidden ring-1 ring-white/5"
                                            >
                                                <div className="relative py-1">
                                                    {subjects.map((subject) => (
                                                        <div
                                                            key={subject.value}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedSubject(subject.value);
                                                                setSubjectOpen(false);
                                                            }}
                                                            className={`px-4 py-3 text-sm transition-colors flex items-center gap-3 cursor-pointer ${selectedSubject === subject.value ? 'text-white bg-white/5' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}
                                                        >
                                                            {selectedSubject === subject.value && (
                                                                <motion.div layoutId="activeCheck" className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                                            )}
                                                            <span className={selectedSubject === subject.value ? 'ml-0 font-medium' : 'ml-4.5'}>{subject.label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                                {/* Overlay to close on outside click */}
                                {subjectOpen && (
                                    <div className="fixed inset-0 z-10" onClick={() => setSubjectOpen(false)} />
                                )}
                            </motion.div>

                            <motion.div variants={itemFadeUp} className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-400 ml-1">Message</label>
                                <motion.div
                                    animate={{
                                        borderColor: focusedField === 'message' ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.1)',
                                        boxShadow: focusedField === 'message' ? '0 0 15px rgba(59,130,246,0.15)' : 'none'
                                    }}
                                    className="relative group rounded-xl bg-zinc-950/50 border transition-all duration-300"
                                >
                                    <textarea
                                        rows="4"
                                        placeholder="How can we help you?"
                                        onFocus={() => setFocusedField('message')}
                                        onBlur={() => setFocusedField(null)}
                                        className="w-full px-4 py-3 bg-transparent outline-none text-white text-sm placeholder-zinc-600/50 transition-all rounded-xl resize-none focus:placeholder-zinc-600/20"
                                    />
                                </motion.div>
                            </motion.div>

                            {/* Animated Checkbox */}
                            <motion.div variants={itemFadeUp} className="flex items-start gap-3 pt-2">
                                <div className="relative flex items-center pt-0.5">
                                    <div
                                        className="relative h-4 w-4 rounded bg-zinc-900 border border-zinc-700 cursor-pointer overflow-hidden"
                                        onClick={() => setIsChecked(!isChecked)}
                                    >
                                        {isChecked && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute inset-0 bg-blue-600 flex items-center justify-center"
                                            >
                                                <motion.svg
                                                    viewBox="0 0 24 24"
                                                    className="w-3 h-3 text-white"
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <motion.path
                                                        d="M20 6L9 17l-5-5"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </motion.svg>
                                            </motion.div>
                                        )}
                                        {/* Glow ripple on click */}
                                        {isChecked && (
                                            <motion.div
                                                initial={{ opacity: 0.6, scale: 1 }}
                                                animate={{ opacity: 0, scale: 2 }}
                                                transition={{ duration: 0.4 }}
                                                className="absolute inset-0 bg-blue-500 rounded-full"
                                            />
                                        )}
                                    </div>
                                    <input type="checkbox" className="hidden" checked={isChecked} onChange={() => { }} />
                                </div>
                                <label onClick={() => setIsChecked(!isChecked)} className="text-xs text-zinc-400 cursor-pointer select-none">
                                    I agree to the <span className="text-zinc-200 underline decoration-zinc-700 hover:decoration-white transition-all">Terms of Service</span> and <span className="text-zinc-200 underline decoration-zinc-700 hover:decoration-white transition-all">Privacy Policy</span>.
                                </label>
                            </motion.div>

                            <motion.div variants={itemFadeUp} className="pt-4">
                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(37,99,235,0.5)" }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide bg-[#0A0A0A] text-white border border-blue-600/50 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2 relative overflow-hidden group"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Send Message
                                        <Send className="w-4 h-4 group-hover:translate-x-[3px] transition-transform duration-300" />
                                    </span>
                                    {/* Gradient Hover Swipe */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-600/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                                </motion.button>
                            </motion.div>
                        </motion.div>

                        {/* RIGHT COLUMN - INFO CARDS */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={{
                                visible: { transition: { staggerChildren: 0.15, delayChildren: 0.12 } }
                            }}
                            className="space-y-6"
                        >
                            {/* Card 1: Contact Info */}
                            <motion.div
                                variants={itemFadeUp}
                                whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)", borderColor: "rgba(255,255,255,0.15)" }}
                                className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 transition-colors group relative overflow-hidden"
                            >
                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
                                    <span className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                                        <MessageSquare className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                                    </span>
                                    Contact Information
                                </h3>
                                <div className="space-y-5 relative z-10">
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Support Email</p>
                                            <p className="text-white font-medium hover:text-blue-400 transition-colors cursor-pointer">support@fortisflow.ai</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Response Time</p>
                                            <p className="text-white font-medium">Under 24 hours</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                                            <ShieldCheck className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Platform</p>
                                            <p className="text-white font-medium">AI Financial Intelligence</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Card 2: Support Scope */}
                            <motion.div
                                variants={itemFadeUp}
                                whileHover={{ y: -6, boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)", borderColor: "rgba(255,255,255,0.15)" }}
                                className="bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-2xl p-5 transition-colors group relative overflow-hidden"
                            >
                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
                                    <span className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center border border-violet-500/20 group-hover:bg-violet-500/20 transition-colors">
                                        <ShieldCheck className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
                                    </span>
                                    Support Scope
                                </h3>
                                <div className="grid grid-cols-1 gap-3 relative z-10">
                                    {[
                                        { icon: BarChart3, text: "Budget tracking help", color: "emerald", borderColor: "hover:border-emerald-500/30", bgColor: "hover:bg-emerald-500/5" },
                                        { icon: AlertCircle, text: "Spending alerts setup", color: "amber", borderColor: "hover:border-amber-500/30", bgColor: "hover:bg-amber-500/5" },
                                        { icon: CheckCircle2, text: "AI savings recommendations", color: "blue", borderColor: "hover:border-blue-500/30", bgColor: "hover:bg-blue-500/5" },
                                        { icon: Lock, text: "Account & security help", color: "rose", borderColor: "hover:border-rose-500/30", bgColor: "hover:bg-rose-500/5" }
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className={`flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 transition-all duration-300 ${item.bgColor} ${item.borderColor}`}
                                        >
                                            <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                                            <span className="text-sm text-zinc-300">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* FAQ SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mt-20 max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl font-bold text-center text-white mb-10 font-manrope">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.4, delay: index * 0.05 }} // Faster entrance
                                whileHover={{
                                    scale: 1.015,
                                    y: -2,
                                    borderColor: "rgba(59, 130, 246, 0.4)",
                                    boxShadow: "0 10px 40px -10px rgba(59, 130, 246, 0.15)" // Soft outer glow
                                }}
                                className="group relative bg-[rgba(12,14,20,0.75)] backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden cursor-pointer"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="relative z-10 w-full flex items-center justify-between p-6 text-left"
                                >
                                    <span className="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors duration-200">
                                        {faq.question}
                                    </span>
                                    <motion.span
                                        animate={{ rotate: openFaq === index ? 180 : 0 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className={`p-2 rounded-full bg-white/5 group-hover:bg-blue-500/10 transition-colors duration-200`}
                                    >
                                        <ChevronDown className={`w-4 h-4 text-zinc-500 group-hover:text-blue-400 transition-colors duration-200`} />
                                    </motion.span>
                                </button>
                                <AnimatePresence>
                                    {openFaq === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.22, ease: "easeOut" }}
                                        >
                                            <div className="px-2 pb-2">
                                                <div className="bg-[#050507]/60 rounded-xl p-5 text-zinc-400 text-sm leading-relaxed shadow-inner">
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 6 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.25, delay: 0.05 }}
                                                    >
                                                        {faq.answer}
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* BOTTOM SPACING */}
                <div className="h-24"></div>
            </div>

            <Footer />
        </div>
    )
}

export default Contact

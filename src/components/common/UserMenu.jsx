import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { Settings, LogOut, User, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const UserMenu = ({ isPreview = false }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState(() => {
        if (isPreview) {
            return {
                email: 'demo@fortisflow.com',
                user_metadata: { full_name: 'Demo User' }
            }
        }
        return null
    })
    const [prevIsPreview, setPrevIsPreview] = useState(isPreview)
    const menuRef = useRef(null)

    if (isPreview !== prevIsPreview) {
        setPrevIsPreview(isPreview)
        if (isPreview) {
            setUser({
                email: 'demo@fortisflow.com',
                user_metadata: { full_name: 'Demo User' }
            })
        }
    }

    useEffect(() => {
        if (isPreview) return;

        const getUser = async () => {
            if (!supabase) return
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }

        getUser()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [isPreview])

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const handleLogout = async () => {
        if (isPreview) return // Don't actually logout in preview

        // Clear local storage completely on logout to prevent data leaks across sessions
        localStorage.clear()

        await supabase.auth.signOut()
        window.location.href = '/login'
    }

    // Default connection/initials if no user data yet
    // Smart Initials Logic
    const getInitials = () => {
        // 1. Try full_name (e.g. "Sai Pavan")
        // 2. Try username
        // 3. Try email prefix
        const name = user?.user_metadata?.full_name || user?.user_metadata?.username || user?.email?.split('@')[0] || 'User'

        // Clean extra spaces
        const parts = name.trim().split(/\s+/)

        // If "Sai Pavan" -> "SP"
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase()
        }

        // If "Sai" -> "SA"
        return name.slice(0, 2).toUpperCase()
    }

    const initials = getInitials()

    const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
    const displayEmail = user?.email || 'user@example.com'

    return (
        <div className="p-6 border-t border-white/5 relative" ref={menuRef}>
            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full left-6 right-6 mb-4 bg-[#12141C] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20"
                    >
                        <div className="p-1">
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                                <User className="w-4 h-4" />
                                <span>Profile</span>
                            </button>
                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors">
                                <Settings className="w-4 h-4" />
                                <span>Settings</span>
                            </button>
                            <div className="h-px bg-white/5 my-1" />
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Log out</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center gap-3 py-2 rounded-xl transition-colors text-left group ${isOpen ? 'bg-zinc-900/80' : 'hover:bg-zinc-900/50'}`}
            >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[1px] flex-shrink-0">
                    <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center text-xs font-bold text-white">
                        {initials}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{displayName}</p>
                    <p className="text-xs text-zinc-500 truncate">{displayEmail}</p>
                </div>
                <ChevronUp className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
        </div>
    )
}

export default UserMenu

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, LogOut, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const UserDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Fetch User Info
        const getUserInfo = async () => {
            if (!supabase) return;
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const email = session.user.email;
                setUserEmail(email);

                // If user metadata has a name, use it. Otherwise, default to "User".
                const name = session.user.user_metadata?.full_name || 'User';
                setUserName(name);

                const avatar = session.user.user_metadata?.avatar_url || session.user.user_metadata?.picture || null;
                setUserAvatar(avatar);
            }
        };
        getUserInfo();

        // Click outside handler
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    // Calculate Initials from Name
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length > 1) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    };

    return (
        <div className="relative mt-8 px-4 pb-4" ref={dropdownRef}>
            {/* The Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute bottom-[calc(100%+12px)] left-4 right-4 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
                    >
                        <div className="p-4 border-b border-white/5 bg-zinc-900/50">
                            <p className="text-sm font-bold text-white truncate">{userName}</p>
                            <p className="text-xs text-zinc-500 truncate">{userEmail}</p>
                        </div>
                        <div className="p-2 space-y-1">
                            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors">
                                <Settings className="w-4 h-4 text-zinc-500" />
                                Settings
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-300 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            >
                                <LogOut className="w-4 h-4 text-rose-500" />
                                Log out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* The Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 group
                    ${isOpen
                        ? 'bg-zinc-800/50 border-white/10 shadow-lg'
                        : 'bg-transparent border-transparent hover:bg-white/5'
                    }`}
            >
                <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-full bg-gradient-to-b from-zinc-900 to-[#0a1428] border border-white/5 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md overflow-hidden">
                        <div className="absolute inset-[2px] rounded-full border border-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.4)] pointer-events-none z-20" />
                        {userAvatar ? (
                            <img src={userAvatar} alt={userName} className="w-full h-full object-cover relative z-10" />
                        ) : (
                            <span className="relative z-10 drop-shadow-sm">{getInitials(userName)}</span>
                        )}
                    </div>
                    <div className="text-left min-w-0 truncate">
                        <p className="text-sm font-bold text-white truncate">{userName}</p>
                        <p className="text-xs text-zinc-500 truncate">{userEmail}</p>
                    </div>
                </div>
                <ChevronUp className={`w-4 h-4 text-zinc-500 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-white' : 'group-hover:text-zinc-300'}`} />
            </button>
        </div>
    );
};

export default UserDropdown;

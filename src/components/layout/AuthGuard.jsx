import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

const AuthGuard = ({ children }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (!supabase) {
                setLoading(false);
                return;
            }

            const { data: { session } } = await supabase.auth.getSession();

            if (!session) {
                // If no session, redirect to login
                navigate('/login');
            } else {
                setAuthenticated(true);
            }
            setLoading(false);
        };

        checkAuth();

        // Listen for auth state changes (e.g. sign out from another tab)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT' || !session) {
                setAuthenticated(false);
                navigate('/login');
            } else if (session) {
                setAuthenticated(true);
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
        );
    }

    // Only render children if authenticated
    return authenticated ? children : null;
};

export default AuthGuard;

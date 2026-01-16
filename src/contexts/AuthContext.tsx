import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    isAuthenticated: boolean;
    signIn: (email: string) => Promise<{ error: any }>;
    signUp: (email: string, pass: string, meta: any) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signIn = async (email: string) => {
        // First try to sign in with OTP (Magic Link) if password is NOT provided (just kidding, we need password flow or OTP)
        // For this app, let's assume we want Magic Link (simplest) OR Password.
        // The user asked for "Data + Email", implies passwordless or password.
        // Let's us OTP (Magic Link) which is default Safer/Easier, OR Password if they set one.
        // Wait, SetupWizard asks for Password. So we should use Password.

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: 'password-placeholder-we-need-input' // WAIT. LoginView only asks for Email in previous design?
            // Actually LoginView HAS a password field.
        });

        // We will fix LoginView to pass password.
        // For now, let's just expose the method more generically or expect the caller to do calls.

        // Actually, better to expose the raw supabase client or wrap it.
        // But for consistency let's stick to the interface.
        return { error: 'Use direct supabase client in components for flexibility' };
    };

    // Helper wrappers
    const customSignIn = async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({ email, password });
    };

    const customSignUp = async (email: string, password: string, meta: any) => {
        return await supabase.auth.signUp({
            email,
            password,
            options: {
                data: meta
            }
        });
    };

    const customSignOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{
            session,
            user,
            isAuthenticated: !!session,
            signIn: customSignIn as any,
            signUp: customSignUp as any,
            signOut: customSignOut,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

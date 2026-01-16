import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

// Types for our SaaS Structure
export interface UserProfile {
    id: string;
    clinic_id: string;
    role: 'admin' | 'dentist' | 'receptionist';
    full_name: string;
}

export interface ClinicData {
    id: string;
    name: string;
    plan: 'free' | 'pro' | 'plus';
}

interface AuthContextType {
    session: Session | null;
    user: User | null;
    profile: UserProfile | null;
    clinic: ClinicData | null;
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
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [clinic, setClinic] = useState<ClinicData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    // Fetch Profile and Clinic Data
    const fetchProfileData = async (userId: string) => {
        setAuthError(null);
        try {
            // 1. Get Profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (profileError) {
                console.warn('Profile fetch error:', profileError);
                setAuthError(`Erro no Perfil: ${profileError.message} (${profileError.code})`);

                // Auto-Heal: If profile missing (PGRST116), create one.
                if (profileError.code === 'PGRST116') {
                    console.log('Attempting to auto-heal missing profile...');
                    try {
                        // 1. Create Default Clinic
                        const { data: newClinic, error: clinicErr } = await supabase
                            .from('clinics')
                            .insert({ name: 'Meu Consultório' })
                            .select()
                            .single();

                        if (clinicErr) throw clinicErr;

                        // 2. Create Profile
                        const { data: newProfile, error: profileCreateErr } = await supabase
                            .from('profiles')
                            .insert({
                                id: userId,
                                clinic_id: newClinic.id,
                                role: 'admin',
                                full_name: 'Admin',
                                email: (await supabase.auth.getUser()).data.user?.email || 'user@email.com'
                            })
                            .select()
                            .single();

                        if (profileCreateErr) throw profileCreateErr;

                        // 3. Update State
                        setClinic(newClinic as ClinicData);
                        setProfile(newProfile as UserProfile);
                        return;

                    } catch (healingErr) {
                        console.error('Auto-healing failed:', healingErr);
                        setAuthError(`Falha na recuperação automática: ${healingErr.message || healingErr}`);
                    }
                }
                return;
            }

            setProfile(profileData as UserProfile);

            // 2. Get Clinic
            if (profileData?.clinic_id) {
                const { data: clinicData, error: clinicError } = await supabase
                    .from('clinics')
                    .select('*')
                    .eq('id', profileData.clinic_id)
                    .single();

                if (clinicError) {
                    setAuthError(`Clinic Error: ${clinicError.message}`);
                } else {
                    setClinic(clinicData as ClinicData);
                }
            } else {
                setAuthError('Profile has no Clinic ID linked.');
            }
        } catch (error: any) {
            console.error('Error fetching user data:', error);
            setAuthError(`Catch Error: ${error.message || error}`);
        }
    };

    useEffect(() => {
        let mounted = true;

        const loadSession = async () => {
            try {
                // Safety Timeout: Force stop loading after 5s
                const timeoutId = setTimeout(() => {
                    if (mounted) {
                        console.warn("Auth load timeout - Forcing app load.");
                        setIsLoading(false);
                    }
                }, 5000);

                const { data: { session } } = await supabase.auth.getSession();
                clearTimeout(timeoutId); // Clear timeout if successful

                if (mounted) {
                    setSession(session);
                    setUser(session?.user ?? null);
                    if (session?.user) {
                        await fetchProfileData(session.user.id);
                    }
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
            } finally {
                if (mounted) setIsLoading(false);
            }
        };

        loadSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (!mounted) return;

            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                // If LOGIN event, fetch data
                if (_event === 'SIGNED_IN') {
                    // Don't set loading true here if we are just recovering session, 
                    // only for explicit sign-ins if needed, but safe to keep.
                    await fetchProfileData(session.user.id);
                }
            } else {
                setProfile(null);
                setClinic(null);
                setAuthError(null); // Clear error on sign out
            }

            // Should ensure loading is false after any auth event handling
            setIsLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
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
        setAuthError(null);
        const res = await supabase.auth.signInWithPassword({ email, password });
        if (res.error) {
            setAuthError(res.error.message);
        }
        return res;
    };

    const customSignUp = async (email: string, password: string, meta: any) => {
        setAuthError(null);
        // 1. Create Auth User
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: meta
                // Note: Triggers in SQL will handle Profile/Clinic creation OR
                // we do it manually here if triggers fail/are disabled.
                // For robustness, let's rely on the Trigger creating the BASIC structure, 
                // and then we update it with 'meta' details if needed.
                // For this MVP, let's assume the Trigger 'handle_new_user' does the job.
            }
        });

        if (error) {
            setAuthError(error.message);
        }

        // If trigger is NOT enabled (user didn't run SQL), we might need manual fallbacks.
        // But the prompt asked to generate SQL for it. So we assume SQL is run.
        return { data, error };
    };

    const customSignOut = async () => {
        console.log("Signing out...");
        setAuthError(null);
        // setUserMenuOpen(false); // Helper to close menu if passed? No, this is context.

        try {
            // Race against a timeout to ensure we don't hang forever
            await Promise.race([
                supabase.auth.signOut(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('SignOut Timeout')), 2000))
            ]);
        } catch (error) {
            console.warn("Sign out forced locally due to error/timeout:", error);
        } finally {
            // Always clear local state and redirect
            setSession(null);
            setUser(null);
            setProfile(null);
            setClinic(null);
            window.localStorage.clear(); // Extra safety
            window.location.href = '/';
        }
    };

    return (
        <AuthContext.Provider value={{
            session,
            user,
            profile,
            clinic,
            isAuthenticated: !!session,
            signIn: customSignIn as any,
            signUp: customSignUp as any,
            signOut: customSignOut,
            isLoading,
            authError: authError // Exposed for debugging
        } as any}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

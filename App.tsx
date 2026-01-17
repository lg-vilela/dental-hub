import React, { useState, useEffect } from 'react';
import { TenantConfig } from './types';
import { initialTenants } from './mockData';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Components
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ScheduleView from './components/ScheduleView';
import PatientsView from './components/PatientsView';
import FinancialsView from './components/FinancialsView';
import ClinicSettingsView from './components/ClinicSettingsView';
import InventoryView from './components/InventoryView';
import PublicBookingView from './components/PublicBookingView';
import NewAppointmentModal from './components/NewAppointmentModal';
import LoginView from './components/auth/LoginView';
import SetupWizard from './components/auth/SetupWizard';
import LandingPage from './components/landing/LandingPage';

function AppContent() {
    const { isAuthenticated, isLoading, user, signOut } = useAuth();
    // Auth State handled by Context now

    const [isSetupComplete, setIsSetupComplete] = useState(true);
    const [showLanding, setShowLanding] = useState(true); // Keep Landing as first screen
    const [isSigningUp, setIsSigningUp] = useState(false); // New state to control signup flow

    const [activePage, setActivePage] = useState('dashboard');
    const [isPublicView, setIsPublicView] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState<'notifications' | 'user' | null>(null);

    // State for Tenants (now mutable)
    const [tenants, setTenants] = useState<Record<string, TenantConfig>>(initialTenants);

    // Simulation of loading a specific tenant based on URL or Login
    const [activeTenant, setActiveTenant] = useState<TenantConfig>(tenants['clinic_1']);

    // Update activeTenant when tenants state changes
    useEffect(() => {
        if (tenants[activeTenant.clinic_id]) {
            setActiveTenant(tenants[activeTenant.clinic_id]);
        }
    }, [tenants, activeTenant.clinic_id]);

    const updateTenantConfig = (newConfig: Partial<TenantConfig>) => {
        setTenants(prev => ({
            ...prev,
            [activeTenant.clinic_id]: { ...prev[activeTenant.clinic_id], ...newConfig }
        }));
    };

    // Apply Tenant Theme Variables
    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', activeTenant.branding.primaryColor);
        root.style.setProperty('--color-primary-dark', activeTenant.branding.primaryDark);
        root.style.setProperty('--color-primary-light', activeTenant.branding.primaryLight);

        // Set font class on body
        document.body.className = activeTenant.branding.font === 'manrope' ? 'font-manrope' : 'font-public';
    }, [activeTenant]);

    // Handlers
    const handleSetupComplete = (data: any) => {
        // Here we would save the new clinic data
        updateTenantConfig({ name: data.clinicName });
        // Assume context handles user creation
        setIsSetupComplete(true);
        setIsSigningUp(false);
    };

    // Render Logic
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!isAuthenticated) {
        if (showLanding) {
            return <LandingPage onStart={() => setShowLanding(false)} onLogin={() => setShowLanding(false)} />;
        }

        // Show Signup Wizard if requested
        if (isSigningUp) {
            return <SetupWizard onComplete={handleSetupComplete} />;
        }

        return <LoginView onLogin={() => { }} onSignup={() => setIsSigningUp(true)} />;
    }

    // Logic: If authenticated but no clinic setup?
    // For MVP, assume if new user (just signed up), we might need setup.
    // Let's use isSetupComplete state.
    if (!isSetupComplete) {
        return <SetupWizard onComplete={handleSetupComplete} />;
    }

    // If Public View is active, render only that
    if (isPublicView) {
        return <PublicBookingView tenant={activeTenant} onBack={() => setIsPublicView(false)} />;
    }

    return (
        <div className="flex h-screen bg-slate-50 text-slate-900">
            {/* Sidebar Navigation */}
            <div className={`fixed inset-0 z-20 bg-slate-900/50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'} print:hidden`} onClick={() => setSidebarOpen(false)}></div>
            <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} print:hidden`}>
                <Sidebar tenant={activeTenant} activePage={activePage} setPage={(p) => { setActivePage(p); setSidebarOpen(false); }} openPublic={() => setIsPublicView(true)} />
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50 print:h-auto print:overflow-visible">

                {/* Top Header */}
                <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 h-16 flex items-center justify-between px-4 lg:px-8 z-10 print:hidden">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div>
                            <h2 className="text-slate-900 text-lg font-bold leading-tight">Bom Dia, {user?.user_metadata?.name || 'Doutor'}</h2>
                            <p className="text-slate-500 text-xs hidden sm:block">Aqui está o resumo de hoje.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Simple Search */}
                        <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 w-64 focus-within:ring-2 ring-primary/20 transition-all">
                            <span className="material-symbols-outlined text-slate-400 text-[20px]">search</span>
                            <input type="text" className="bg-transparent border-none text-sm w-full focus:outline-none text-slate-700 pl-2" placeholder="Buscar..." />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 relative">
                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(prev => prev === 'notifications' ? null : 'notifications')}
                                    className={`relative size-10 flex items-center justify-center rounded-full transition-colors ${userMenuOpen === 'notifications' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-600'}`}
                                >
                                    <span className="material-symbols-outlined">notifications</span>
                                    <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                                </button>

                                {userMenuOpen === 'notifications' && (
                                    <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="px-4 py-2 border-b border-slate-100 flex justify-between items-center">
                                            <h3 className="font-bold text-slate-900">Notificações</h3>
                                            <button className="text-[10px] font-bold text-primary uppercase hover:underline">Mark all read</button>
                                        </div>
                                        <div className="max-h-[300px] overflow-y-auto">
                                            <div className="px-4 py-8 text-center text-slate-400 text-sm">Nenhuma notificação nova.</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                        {/* Profile */}
                        <div className="relative">
                            <div
                                className="flex items-center gap-3 cursor-pointer group p-1 rounded-full hover:bg-slate-50 pr-4 transition-colors"
                                onClick={() => setUserMenuOpen(prev => prev === 'user' ? null : 'user')}
                            >
                                <div className="size-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm">
                                    {user?.email?.[0].toUpperCase() || 'D'}
                                </div>
                                <div className="hidden sm:flex flex-col">
                                    <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{user?.user_metadata?.name || 'Usuario'}</span>
                                    <span className="text-xs text-slate-500">Admin</span>
                                </div>
                                <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${userMenuOpen === 'user' ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                            </div>

                            {userMenuOpen === 'user' && (
                                <div className="absolute right-0 top-14 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-slate-50 mb-2">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Logado como</p>
                                        <p className="font-bold text-slate-900 truncate">{user?.email}</p>
                                    </div>

                                    <button onClick={() => { setActivePage('settings'); setUserMenuOpen(null); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary font-medium flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[20px]">settings</span> Configurações
                                    </button>

                                    <div className="my-2 border-t border-slate-100"></div>

                                    <button onClick={() => { setUserMenuOpen(null); signOut(); }} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 font-bold flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[20px]">logout</span> Sair do Sistema
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Dynamic Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    <div className="max-w-[1400px] mx-auto">
                        {activePage === 'dashboard' && <Dashboard openModal={() => setIsModalOpen(true)} setPage={setActivePage} />}
                        {activePage === 'schedule' && <ScheduleView openModal={() => setIsModalOpen(true)} tenant={activeTenant} />}
                        {activePage === 'patients' && <PatientsView />}
                        {activePage === 'financials' && <FinancialsView />}
                        {activePage === 'settings' && <ClinicSettingsView tenant={activeTenant} updateConfig={updateTenantConfig} />}
                        {activePage === 'inventory' && <InventoryView />}
                    </div>
                </main>
            </div>

            {/* Modals */}
            <NewAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

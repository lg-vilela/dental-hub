import React, { useState, useEffect } from 'react';
import { TenantConfig } from './types';
import { initialTenants } from './mockData';

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

export default function App() {
    // Auth State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSetupComplete, setIsSetupComplete] = useState(true);
    const [showLanding, setShowLanding] = useState(true);

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

    // Handlers for Auth
    const handleLogin = (email: string) => {
        setIsAuthenticated(true);
        setIsSetupComplete(true); // Assume existing user is setup
    };

    const handleSignup = () => {
        setIsAuthenticated(true);
        setIsSetupComplete(false); // New user needs setup
    };

    const handleSetupComplete = (data: any) => {
        // Here we would save the new clinic data
        updateTenantConfig({ name: data.clinicName });
        setIsSetupComplete(true);
    };

    // Render Logic
    if (!isAuthenticated) {
        if (showLanding) {
            return <LandingPage onStart={() => setShowLanding(false)} onLogin={() => setShowLanding(false)} />;
        }
        return <LoginView onLogin={handleLogin} onSignup={handleSignup} />;
    }

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
            <div className={`fixed inset-0 z-20 bg-slate-900/50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
            <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar tenant={activeTenant} activePage={activePage} setPage={(p) => { setActivePage(p); setSidebarOpen(false); }} openPublic={() => setIsPublicView(true)} />
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">

                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div>
                            <h2 className="text-slate-900 text-lg font-bold leading-tight">Bom Dia, Dr. Smith</h2>
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
                                            {[
                                                { title: 'Novo Agendamento WEB', time: 'Há 5 min', type: 'agendamento' },
                                                { title: 'Estoque de Luvas Baixo', time: 'Há 2 horas', type: 'estoque' },
                                                { title: 'Lembrete: Reunião Clínica', time: 'Há 4 horas', type: 'lembrete' }
                                            ].map((n, i) => (
                                                <div key={i} className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex gap-3">
                                                    <div className={`size-8 rounded-full flex items-center justify-center shrink-0 ${n.type === 'agendamento' ? 'bg-blue-100 text-blue-600' : n.type === 'estoque' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                        <span className="material-symbols-outlined text-sm">
                                                            {n.type === 'agendamento' ? 'calendar_today' : n.type === 'estoque' ? 'inventory_2' : 'event'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{n.title}</p>
                                                        <p className="text-xs text-slate-400">{n.time}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="px-2 pt-2 pb-1 text-center border-t border-slate-100">
                                            <button className="text-xs font-bold text-slate-500 hover:text-slate-900 py-1">Ver todas</button>
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
                                <img src="https://picsum.photos/100/100?random=50" className="size-10 rounded-full border-2 border-white shadow-sm object-cover" alt="Profile" />
                                <div className="hidden sm:flex flex-col">
                                    <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Dr. Smith</span>
                                    <span className="text-xs text-slate-500">Admin</span>
                                </div>
                                <span className={`material-symbols-outlined text-slate-400 transition-transform duration-300 ${userMenuOpen === 'user' ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                            </div>

                            {userMenuOpen === 'user' && (
                                <div className="absolute right-0 top-14 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-3 border-b border-slate-50 mb-2">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Logado como</p>
                                        <p className="font-bold text-slate-900 truncate">dr.smith@dentalhub.com</p>
                                    </div>

                                    <button onClick={() => { setActivePage('settings'); setUserMenuOpen(null); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary font-medium flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[20px]">person</span> Meu Perfil
                                    </button>
                                    <button onClick={() => { setActivePage('settings'); setUserMenuOpen(null); }} className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary font-medium flex items-center gap-3">
                                        <span className="material-symbols-outlined text-[20px]">settings</span> Configurações
                                    </button>

                                    <div className="my-2 border-t border-slate-100"></div>

                                    <button
                                        onClick={() => {
                                            const next = activeTenant.clinic_id === 'clinic_1' ? 'clinic_2' : 'clinic_1';
                                            setActiveTenant(tenants[next]);
                                            setUserMenuOpen(null);
                                        }}
                                        className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-primary font-medium flex items-center gap-3"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">swap_horiz</span> Trocar Conta
                                    </button>

                                    <div className="my-2 border-t border-slate-100"></div>

                                    <button onClick={() => setIsAuthenticated(false)} className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 font-bold flex items-center gap-3">
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

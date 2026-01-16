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
                        <div className="flex items-center gap-2">
                            <button onClick={() => alert('Sem novas notificações')} className="relative size-10 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-600 transition-colors">
                                <span className="material-symbols-outlined">notifications</span>
                                <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </button>
                        </div>

                        <div className="h-8 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                        {/* Profile */}
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => {
                            // Easter egg to switch tenant simulation
                            const next = activeTenant.clinic_id === 'clinic_1' ? 'clinic_2' : 'clinic_1';
                            setActiveTenant(tenants[next]);
                        }}>
                            <img src="https://picsum.photos/100/100?random=50" className="size-10 rounded-full border-2 border-white shadow-sm object-cover" alt="Profile" />
                            <div className="hidden sm:flex flex-col">
                                <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">Dr. Smith</span>
                                <span className="text-xs text-slate-500">Admin</span>
                            </div>
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

import React, { useState, useEffect } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

/**
 * ARCHITECTURE NOTE:
 * Following the "Multi-tenant per clinic" concept from the PDF.
 * 
 * 1. Single Codebase: This App component serves all clinics.
 * 2. Tenant Context: `activeTenant` simulates the loaded configuration based on `clinic_id`.
 * 3. Data Isolation: In a real backend, every API call would include `clinic_id`. 
 *    Here, we mock data structured by clinic.
 */

// --- Types & Interfaces ---

interface TenantConfig {
    clinic_id: string;
    name: string;
    subdomain: string;
    status: 'active' | 'suspended';
    plan: 'starter' | 'pro' | 'enterprise';
    branding: {
        primaryColor: string; // Hex for primary
        primaryDark: string;
        primaryLight: string;
        logoIcon: string;
        font: 'manrope' | 'public';
    };
    settings: {
        openingHours: string; // Display text (deprecated or kept for summary)
        openingTime: string; // "08:00"
        closingTime: string; // "19:00"
        slotDuration: number; // minutes
        workingDays: number[]; // 0=Sun, 1=Mon
        maxDoctors: number;
        appointmentsPerMonth: number;
    };
}


type UserRole = 'admin' | 'dentist' | 'receptionist';

interface User {
    id: string;
    name: string;
    role: UserRole;
    email: string;
    avatar?: string;
}

interface NavItem {
    id: string;
    label: string;
    icon: string;
}

// --- Mock Data ---

const initialTenants: Record<string, TenantConfig> = {
    'clinic_1': {
        clinic_id: 'clinic_1',
        name: 'Dental Care',
        subdomain: 'dental-care',
        status: 'active',
        plan: 'pro',
        branding: {
            primaryColor: '#0b8593', // Teal
            primaryDark: '#086f7b',
            primaryLight: '#e0f2f1',
            logoIcon: 'dentistry',
            font: 'manrope'
        },
        settings: {
            openingHours: '08:00 - 18:00',
            openingTime: '08:00',
            closingTime: '18:00',
            slotDuration: 30, // 30 min slots
            workingDays: [1, 2, 3, 4, 5], // Mon-Fri
            maxDoctors: 5,
            appointmentsPerMonth: 200
        }
    },
    'clinic_2': {
        clinic_id: 'clinic_2',
        name: 'DentalCloud',
        subdomain: 'dental-cloud',
        status: 'active',
        plan: 'enterprise',
        branding: {
            primaryColor: '#2997db', // Blue
            primaryDark: '#1e70a3',
            primaryLight: '#e1f5fe',
            logoIcon: 'medical_services',
            font: 'public'
        },
        settings: {
            openingHours: '07:00 - 20:00',
            openingTime: '07:00',
            closingTime: '20:00',
            slotDuration: 15, // High volume
            workingDays: [1, 2, 3, 4, 5, 6], // Mon-Sat
            maxDoctors: 15,
            appointmentsPerMonth: 1000
        }
    }
};

const financialData = [
    { name: 'Mai', income: 20000, expenses: 15000 },
    { name: 'Jun', income: 35000, expenses: 18000 },
    { name: 'Jul', income: 28000, expenses: 16000 },
    { name: 'Ago', income: 48200, expenses: 22000 },
    { name: 'Set', income: 32000, expenses: 19000 },
    { name: 'Out', income: 42500, expenses: 12450 },
];

// --- Components ---

// 6. Public Booking Wizard
const PublicBookingView = ({ tenant, onBack }: { tenant: TenantConfig; onBack: () => void }) => {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');

    // Generate slots based on settings
    const generatePublicSlots = () => {
        const slots = [];
        const [startHour, startMin] = tenant.settings.openingTime.split(':').map(Number);
        const [endHour, endMin] = tenant.settings.closingTime.split(':').map(Number);
        const duration = tenant.settings.slotDuration;

        let current = new Date();
        current.setHours(startHour, startMin, 0, 0);
        const end = new Date();
        end.setHours(endHour, endMin, 0, 0);

        while (current < end) {
            slots.push(current.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
            current.setMinutes(current.getMinutes() + duration);
        }
        return slots;
    };

    const slots = generatePublicSlots();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-['Manrope'] z-50 fixed inset-0 overflow-y-auto">
            {/* Public Header */}
            <header className="bg-white border-b border-slate-200 py-4 px-6 fixed w-full top-0 z-50">
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: tenant.branding.primaryColor }}>
                            {tenant.branding.logoIcon}
                        </div>
                        <h1 className="font-bold text-slate-900 text-lg">{tenant.name}</h1>
                    </div>
                    <button onClick={onBack} className="text-sm text-slate-400 hover:text-slate-600 underline">
                        Voltar para Admin
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 pt-24 pb-12 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Progress Bar */}
                    <div className="flex justify-between mb-8 relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
                        <div className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className={`size-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors bg-white border-2 ${step >= s ? 'border-green-500 text-green-700 bg-green-50' : 'border-slate-200 text-slate-400'}`}>
                                {step > s ? '✓' : s}
                            </div>
                        ))}
                    </div>

                    {/* Step 1: Services */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-900">Qual serviço você precisa?</h2>
                                <p className="text-slate-500">Selecione o tipo de atendimento.</p>
                            </div>
                            <div className="grid gap-4">
                                {[
                                    { name: 'Avaliação Geral', icon: 'dentistry', price: 'Grátis' },
                                    { name: 'Limpeza e Profilaxia', icon: 'clean_hands', price: 'R$ 150' },
                                    { name: 'Clareamento', icon: 'brightness_7', price: 'R$ 800' },
                                    { name: 'Emergência', icon: 'medical_services', price: 'A combinar' }
                                ].map((service) => (
                                    <button
                                        key={service.name}
                                        onClick={() => { setSelectedService(service.name); setStep(2); }}
                                        className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all text-left group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="size-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                <span className="material-symbols-outlined">{service.icon}</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-lg">{service.name}</h3>
                                                <p className="text-slate-500 text-sm">{tenant.settings.slotDuration} min</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-slate-900">{service.price}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Professional (Skipped for now, auto-advance) */}
                    {step === 2 && (
                        <div className="text-center animate-in fade-in zoom-in duration-300 py-20">
                            <div className="spinner mb-4 mx-auto size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500">Buscando menor tempo de espera...</p>
                            {/* Auto advance simulation */}
                            {setTimeout(() => setStep(3), 1500) && null}
                        </div>
                    )}


                    {/* Step 3: Schedule */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-900">Escolha o horário</h2>
                                <p className="text-slate-500">Horários disponíveis para <strong>{selectedService}</strong>.</p>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {slots.map((slot) => (
                                    <button
                                        key={slot}
                                        onClick={() => { setSelectedSlot(slot); setStep(4); }}
                                        className="py-3 px-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-primary hover:text-white hover:border-primary transition-all text-sm"
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 4: Confirmation */}
                    {step === 4 && (
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6 animate-in zoom-in duration-300">
                            <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-5xl">check</span>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900">Agendado!</h2>
                                <p className="text-slate-500 mt-2">Sua consulta para <strong>{selectedService}</strong> às <strong>{selectedSlot}</strong> foi confirmada.</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl text-left space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Clínica</span>
                                    <span className="font-bold text-slate-900">{tenant.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Endereço</span>
                                    <span className="font-bold text-slate-900">Av. Paulista, 1000</span>
                                </div>
                            </div>
                            <button onClick={() => window.location.reload()} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                                Voltar ao Início
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

// 7. Sidebar
const Sidebar = ({ tenant, activePage, setPage, openPublic }: { tenant: TenantConfig; activePage: string; setPage: (p: string) => void; openPublic: () => void }) => {
    const navItems: NavItem[] = [
        { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
        { id: 'schedule', label: 'Agenda', icon: 'calendar_month' },
        { id: 'patients', label: 'Pacientes', icon: 'group' },
        { id: 'financials', label: 'Financeiro', icon: 'payments' },
        { id: 'inventory', label: 'Laboratório', icon: 'science' },
        { id: 'settings', label: 'Configurações', icon: 'settings' },
    ];

    const handleRenew = () => {
        alert(`Licença renovada com sucesso para ${tenant.name}!`);
    };

    return (
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-20 hidden lg:flex">
            {/* Clinic Identity (Tenant Specific) */}
            <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-100">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined icon-fill">{tenant.branding.logoIcon}</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-slate-900 text-lg font-bold leading-none">{tenant.name}</h1>
                    <p className="text-slate-500 text-xs font-medium mt-1">Sistema de Gestão</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
                {navItems.map((item) => {
                    const isActive = activePage === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setPage(item.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group w-full text-left
                ${isActive
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <span className={`material-symbols-outlined ${isActive ? 'icon-fill' : 'group-hover:text-primary transition-colors'}`}>
                                {item.icon}
                            </span>
                            <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer / Branding */}
            <div className="p-6 border-t border-slate-100 flex flex-col gap-4">

                <button onClick={openPublic} className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all group">
                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">public</span>
                    <span className="font-bold text-sm">Ver Página Pública</span>
                </button>
                <div className="pt-4 mt-2 border-t border-slate-800"></div>

                {/* License Info */}
                <div>
                    <p className="text-xs text-slate-500 font-medium">Sua licença expira em <span className="text-slate-900 font-bold">12 dias</span>.</p>
                    <button onClick={handleRenew} className="text-xs font-bold text-primary hover:text-primary-dark transition-colors mt-1 flex items-center gap-1">
                        Renovar Agora <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                </div>

                {/* Developer Seal */}
                <div className="flex flex-col gap-2 opacity-80 hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Developed By</span>
                    <img src="https://i.postimg.cc/JhBKhfRB/selo-vilelacodelab.png" alt="Vilela CodeLab" className="w-32 h-auto object-contain" />
                </div>

            </div>
        </aside>
    );
};

// 2. New Appointment Modal
const NewAppointmentModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const [formData, setFormData] = useState({
        patient: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:30 AM',
        procedure: 'Limpeza Regular',
        doctor: 'Dr. Sarah Smith'
    });

    if (!isOpen) return null;

    const handleSave = () => {
        if (!formData.patient) {
            alert('Por favor, informe o nome do paciente.');
            return;
        }
        alert(`Agendamento confirmado para ${formData.patient} com ${formData.doctor} em ${formData.date} às ${formData.time}.`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="w-full h-full p-8"><button onClick={onClose}>Close</button></div>
            </div>
        </div>
    );
};

// 3. Sub-pages

// Dashboard Page
const Dashboard = ({ openModal, setPage }: { openModal: () => void; setPage: (p: string) => void }) => {
    const [scheduleTime, setScheduleTime] = useState<'all' | 'morning' | 'afternoon'>('all');
    const [reminders, setReminders] = useState([
        { id: 1, text: 'Resultados de laboratório prontos', sub: 'Para o Paciente Sarah Conner', icon: 'biotech', color: 'indigo' },
        { id: 2, text: 'Estoque Baixo', sub: 'Luvas cirúrgicas (P)', icon: 'inventory_2', color: 'amber' },
    ]);

    const allAppointments = [
        { time: '09:00 AM', name: 'Sarah Conner', proc: 'Canal', doc: 'Dr. Smith', status: 'Confirmado', statusColor: 'emerald', period: 'morning' },
        { time: '10:30 AM', name: 'John Doe', proc: 'Limpeza', doc: 'Higienista Ray', status: 'Pendente', statusColor: 'orange', period: 'morning' },
        { time: '11:15 AM', name: 'Emily Blunt', proc: 'Clareamento', doc: 'Dr. Smith', status: 'Confirmado', statusColor: 'emerald', period: 'morning' },
        { time: '01:00 PM', name: 'Michael Scott', proc: 'Check-up', doc: 'Dr. Smith', status: 'Cancelado', statusColor: 'red', period: 'afternoon' },
    ];

    const filteredAppointments = allAppointments.filter(app => {
        if (scheduleTime === 'all') return true;
        return app.period === scheduleTime;
    });

    const removeReminder = (id: number) => {
        setReminders(prev => prev.filter(r => r.id !== id));
    };

    return (
        <div className="space-y-6">
            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Agendamentos do Dia', val: '12', trend: '+2', color: 'blue', icon: 'calendar_today' },
                    { label: 'Receita Est.', val: 'R$ 2.450', trend: '15%', color: 'emerald', icon: 'payments' },
                    { label: 'Novos Pacientes', val: '3', trend: '+1', color: 'purple', icon: 'person_add' },
                    { label: 'Aguardando Confirmação', val: '2', trend: '-1', color: 'orange', icon: 'pending_actions' },
                ].map((m, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="flex justify-between items-start z-10 relative">
                            <div className={`p-2 rounded-lg bg-${m.color}-50 text-${m.color}-600`}>
                                <span className="material-symbols-outlined">{m.icon}</span>
                            </div>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-${m.color}-50 text-${m.color}-700`}>{m.trend}</span>
                        </div>
                        <div className="mt-4 z-10 relative">
                            <p className="text-slate-500 text-sm font-medium">{m.label}</p>
                            <h3 className="text-3xl font-bold text-slate-900">{m.val}</h3>
                        </div>
                        <div className={`absolute -right-6 -bottom-6 size-24 bg-${m.color}-50 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Schedule List */}
                <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900">Agenda de Hoje</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setScheduleTime(scheduleTime === 'morning' ? 'all' : 'morning')}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${scheduleTime === 'morning' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
                                Manhã
                            </button>
                            <button onClick={() => setScheduleTime(scheduleTime === 'afternoon' ? 'all' : 'afternoon')}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${scheduleTime === 'afternoon' ? 'bg-primary text-white' : 'text-slate-400 hover:text-slate-600'}`}>
                                Tarde
                            </button>
                        </div>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Hora</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Paciente</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Procedimento</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Doutor</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredAppointments.length > 0 ? filteredAppointments.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{row.time}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={`https://picsum.photos/32/32?random=${i}`} className="size-8 rounded-full" alt="" />
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{row.name}</p>
                                                <p className="text-xs text-slate-400">#P-102{i}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                                            <span className="size-1.5 rounded-full bg-blue-500"></span>{row.proc}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{row.doc}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-${row.statusColor}-50 text-${row.statusColor}-700`}>{row.status}</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm">Nenhum agendamento para este período.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Quick Actions & Calendar */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                        <h3 className="text-base font-bold text-slate-900 mb-4">Ações Rápidas</h3>
                        <div className="flex flex-col gap-3">
                            <button onClick={openModal} className="w-full flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-white rounded-lg py-3 px-4 font-bold text-sm shadow-md shadow-primary/20 transition-all">
                                <span className="material-symbols-outlined text-[20px]">add_circle</span> Novo Agendamento
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => setPage('patients')} className="flex flex-col items-center justify-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg py-3 px-2 transition-colors">
                                    <span className="material-symbols-outlined text-primary text-[24px]">person_add</span>
                                    <span className="text-xs font-semibold">Novo Paciente</span>
                                </button>
                                <button onClick={() => setPage('financials')} className="flex flex-col items-center justify-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg py-3 px-2 transition-colors">
                                    <span className="material-symbols-outlined text-primary text-[24px]">receipt_long</span>
                                    <span className="text-xs font-semibold">Fatura</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex-1">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-bold text-slate-900">Lembretes</h3>
                        </div>
                        <div className="space-y-3">
                            {reminders.map(rem => (
                                <div key={rem.id} onClick={() => removeReminder(rem.id)} title="Clique para concluir" className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer group">
                                    <div className="size-8 rounded-full flex items-center justify-center shrink-0 transition-colors bg-indigo-100 text-indigo-600 group-hover:bg-green-100 group-hover:text-green-600">
                                        <span className="material-symbols-outlined text-[16px] group-hover:hidden">{rem.icon}</span>
                                        <span className="material-symbols-outlined text-[16px] hidden group-hover:block">check</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 group-hover:text-slate-500 group-hover:line-through transition-all">{rem.text}</p>
                                        <p className="text-xs text-slate-500">{rem.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Schedule View
const ScheduleView = ({ openModal, tenant }: { openModal: () => void; tenant: TenantConfig }) => {
    const [date, setDate] = useState(new Date(2023, 9, 23)); // Oct 23, 2023
    const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

    const handlePrev = () => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() - 1);
        setDate(newDate);
    };

    const handleNext = () => {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + 1);
        setDate(newDate);
    };

    const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

    // Helper: Generate Time Slots
    const generateSlots = () => {
        const slots = [];
        const [startHour, startMin] = tenant.settings.openingTime.split(':').map(Number);
        const [endHour, endMin] = tenant.settings.closingTime.split(':').map(Number);
        const duration = tenant.settings.slotDuration;

        let current = new Date();
        current.setHours(startHour, startMin, 0, 0);

        const end = new Date();
        end.setHours(endHour, endMin, 0, 0);

        while (current < end) {
            slots.push(current.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
            current.setMinutes(current.getMinutes() + duration);
        }
        return slots;
    };

    const timeSlots = generateSlots();

    return (
        <div className="h-full flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <button onClick={() => setViewMode('day')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'day' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Dia</button>
                        <button onClick={() => setViewMode('week')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Semana</button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrev} className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <h2 className="text-lg font-bold text-slate-900 capitalize min-w-[120px] text-center">{formattedDate}</h2>
                        <button onClick={handleNext} className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
                <button onClick={openModal} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-md shadow-primary/20">
                    <span className="material-symbols-outlined text-[18px]">add</span> Novo Agendamento
                </button>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] border-b border-slate-200 bg-slate-50">
                <div className="p-3 border-r border-slate-200 text-center">
                    <span className="material-symbols-outlined text-slate-400">schedule</span>
                </div>
                {[
                    { name: 'Cadeira 1', doc: 'Dr. Smith' },
                    { name: 'Cadeira 2', doc: 'Dr. Ray' },
                    { name: 'Cadeira 3 (Cirurgia)', doc: 'Dra. Lee' },
                    { name: 'Higienização', doc: 'Sarah J.' }
                ].map((col, i) => (
                    <div key={i} className="p-3 border-r border-slate-200 text-center last:border-r-0">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <div className={`size-2 rounded-full ${i === 0 || i === 2 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{col.doc}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900">{col.name}</p>
                    </div>
                ))}
            </div>

            {/* Grid Body */}
            <div className="flex-1 overflow-y-auto relative">
                {viewMode === 'week' ? (
                    <div className="flex items-center justify-center h-full text-slate-400 flex-col">
                        <span className="material-symbols-outlined text-4xl mb-2">calendar_view_week</span>
                        <p>Visualização semanal em desenvolvimento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] min-h-full">
                        {/* Times */}
                        <div className="border-r border-slate-200 bg-slate-50/50 flex flex-col text-right pr-2 pt-2 text-xs font-medium text-slate-400" >
                            {timeSlots.map((t, i) => (
                                <div key={i} className="h-24 border-b border-transparent relative group">
                                    <span className="-mt-3 block text-[10px]">{t}</span>
                                </div>
                            ))}
                        </div>

                        {/* Columns */}
                        {[0, 1, 2, 3].map((colIdx) => (
                            <div key={colIdx} className="border-r border-slate-200 relative" onClick={() => {
                                // Easter egg interaction
                                if (colIdx === 3) alert('Cadeira não atribuída. Clique em Novo Agendamento para adicionar.');
                            }}>
                                {/* Horizontal guides (dynamic) */}
                                {timeSlots.map((_, i) => (
                                    <div key={i} className="absolute w-full h-px bg-slate-100" style={{ top: `${i * 96}px` }}></div>
                                ))}

                                {/* Mock Appointments (Fixed positions for demo, would be dynamic in real app) */}
                                {colIdx === 0 && (
                                    <>
                                        <div onClick={(e) => { e.stopPropagation(); alert('Consulta: Sarah Conner - Canal'); }} className="absolute top-[110px] left-1 right-1 h-[90px] bg-blue-50 border-l-4 border-blue-500 rounded p-2 cursor-pointer hover:brightness-95 transition-all z-10">
                                            <p className="text-xs font-bold text-blue-700">Sarah Conner</p>
                                            <p className="text-[10px] text-blue-600">Canal (Endo)</p>
                                            <div className="mt-1 flex gap-1">
                                                <span className="px-1 py-0.5 bg-white/50 rounded text-[9px] text-blue-700 font-bold">Confirmado</span>
                                            </div>
                                        </div>
                                        <div className="absolute top-[320px] left-1 right-1 h-[60px] bg-amber-50 border-l-4 border-amber-500 rounded p-2 cursor-pointer hover:brightness-95 transition-all z-10">
                                            <p className="text-xs font-bold text-amber-700">John Wick</p>
                                            <p className="text-[10px] text-amber-600">Emergência</p>
                                        </div>
                                    </>
                                )}

                                {colIdx === 2 && (
                                    <div className="absolute top-[220px] left-1 right-1 h-[140px] bg-purple-50 border-l-4 border-purple-500 rounded p-2 cursor-pointer hover:brightness-95 transition-all z-10">
                                        <p className="text-xs font-bold text-purple-700">Cirurgia Complexa</p>
                                        <p className="text-[10px] text-purple-600">Extração Sisos (4x)</p>
                                        <div className="mt-2 flex items-center gap-1 text-purple-700">
                                            <span className="material-symbols-outlined text-[14px]">anesthesia</span>
                                            <span className="text-[10px]">Anestesia Geral</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {/* Current Time Line */}
                {viewMode === 'day' && (
                    <div className="absolute top-[320px] left-0 w-full flex items-center z-10 pointer-events-none">
                        <div className="w-[60px] text-right pr-2 text-[10px] font-bold text-red-500">11:15</div>
                        <div className="flex-1 h-px bg-red-500 relative">
                            <div className="absolute -top-1 -left-1 size-2 bg-red-500 rounded-full"></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Types for the Odontogram
type ToothCondition = 'healthy' | 'caries' | 'restoration' | 'crown' | 'missing' | 'implant';

interface ToothState {
    id: number;
    condition: ToothCondition;
    notes?: string;
}

// SVG Paths for a generic Molar (simplified for MVP)
const ToothSVG: React.FC<{ num: number; condition?: ToothCondition; onClick: () => void }> = ({ num, condition, onClick }) => {
    // Determine color based on condition
    let fillColor = 'fill-white';
    let strokeColor = 'stroke-slate-300';

    switch (condition) {
        case 'caries': fillColor = 'fill-red-400'; break;
        case 'restoration': fillColor = 'fill-blue-400'; break;
        case 'crown': fillColor = 'fill-amber-300'; break;
        case 'missing': fillColor = 'fill-slate-100 opacity-20'; break;
        case 'implant': fillColor = 'fill-purple-300'; break;
    }

    return (
        <div onClick={onClick} className="flex flex-col items-center gap-1 cursor-pointer group transition-transform hover:scale-110">
            <span className="text-xs font-bold text-slate-400 select-none">{num}</span>
            <svg width="40" height="60" viewBox="0 0 40 60" className={`drop-shadow-sm transition-all ${fillColor} ${strokeColor} stroke-2`}>
                {/* Crown */}
                <path d="M5 15 Q 10 5, 20 5 Q 30 5, 35 15 L 35 35 Q 30 45, 20 45 Q 10 45, 5 35 Z" />
                {/* Root (Visual only) */}
                <path d="M10 45 L 15 55 L 20 45 L 25 55 L 30 45" fill="none" className="stroke-slate-300 opacity-50" />
            </svg>
            {condition && condition !== 'healthy' && (
                <div className={`size-2 rounded-full mt-1 ${fillColor.replace('fill-', 'bg-')}`}></div>
            )}
        </div>
    );
};

// 5. Clinical View Components

// 5a. Odontogram View
const OdontogramView = () => {
    const [selectedTool, setSelectedTool] = useState<ToothCondition | 'clear'>('healthy');
    const [teeth, setTeeth] = useState<Record<number, ToothState>>({});

    // Adult dentition (11-18, 21-28, 31-38, 41-48)
    const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
    const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
    const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38].reverse();
    const lowerRight = [41, 42, 43, 44, 45, 46, 47, 48].reverse();

    const handleToothClick = (id: number) => {
        if (selectedTool === 'clear') {
            const newTeeth = { ...teeth };
            delete newTeeth[id];
            setTeeth(newTeeth);
            return;
        }

        if (selectedTool === 'healthy') {
            // Just unmark for now
            const newTeeth = { ...teeth };
            delete newTeeth[id];
            setTeeth(newTeeth);
            return;
        }

        setTeeth(prev => ({
            ...prev,
            [id]: { id, condition: selectedTool }
        }));
    };

    const tools: { id: ToothCondition | 'clear', label: string, color: string, icon: string }[] = [
        { id: 'caries', label: 'Cárie', color: 'bg-red-500', icon: 'coronavirus' },
        { id: 'restoration', label: 'Restauração', color: 'bg-blue-500', icon: 'build_circle' },
        { id: 'crown', label: 'Coroa', color: 'bg-amber-400', icon: 'diamond' },
        { id: 'implant', label: 'Implante', color: 'bg-purple-500', icon: 'hardware' },
        { id: 'missing', label: 'Ausente', color: 'bg-slate-300', icon: 'cancel' },
        { id: 'clear', label: 'Limpar', color: 'bg-white border text-slate-500', icon: 'backspace' },
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-140px)]">
            {/* Header (Removed in favor of Tab Container) */}

            {/* Odontogram Toolbar */}
            <div className="bg-white p-4 border border-slate-200 rounded-2xl flex justify-center gap-4 shadow-sm z-10 mb-6">
                {tools.map(tool => (
                    <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all w-24 gap-2 ${selectedTool === tool.id ? 'bg-slate-900 text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                        <div className={`size-8 rounded-full flex items-center justify-center ${tool.id === 'clear' ? '' : tool.color} ${tool.id === 'clear' || selectedTool === tool.id ? '' : 'bg-opacity-20 text-' + tool.color.split('-')[1] + '-600'}`}>
                            {tool.id === 'clear' && <span className="material-symbols-outlined">backspace</span>}
                            {tool.id !== 'clear' && <div className={`size-3 rounded-full bg-white`}></div>}
                        </div>
                        <span className="text-xs font-bold">{tool.label}</span>
                    </button>
                ))}
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-slate-100/50 p-10 overflow-auto flex items-center justify-center relative rounded-3xl border border-slate-200">
                <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-200/60 relative scale-90 sm:scale-100">
                    {/* Crosshair / Midline */}
                    <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100"></div>
                    <div className="absolute top-0 left-1/2 h-full w-px bg-slate-100"></div>

                    {/* Upper Arch */}
                    <div className="flex gap-12 mb-12 relative z-10">
                        <div className="flex gap-2">
                            {upperRight.map(id => <ToothSVG key={id} num={id} condition={teeth[id]?.condition} onClick={() => handleToothClick(id)} />)}
                        </div>
                        <div className="flex gap-2">
                            {upperLeft.map(id => <ToothSVG key={id} num={id} condition={teeth[id]?.condition} onClick={() => handleToothClick(id)} />)}
                        </div>
                    </div>

                    {/* Lower Arch */}
                    <div className="flex gap-12 relative z-10">
                        <div className="flex gap-2">
                            {lowerRight.map(id => <ToothSVG key={id} num={id} condition={teeth[id]?.condition} onClick={() => handleToothClick(id)} />)}
                        </div>
                        <div className="flex gap-2">
                            {lowerLeft.map(id => <ToothSVG key={id} num={id} condition={teeth[id]?.condition} onClick={() => handleToothClick(id)} />)}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl border border-slate-200 shadow-lg max-w-xs animate-in slide-in-from-left-4">
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">info</span>
                        Resumo
                    </h4>
                    <p className="text-sm text-slate-500">
                        {Object.keys(teeth).length === 0
                            ? "Nenhum procedimento marcado."
                            : `${Object.keys(teeth).length} dente(s) com alterações registradas.`
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

// 5b. Digital Anamnesis
const AnamnesisTab = () => {
    const [answers, setAnswers] = useState<Record<string, boolean>>({
        'hipertensao': false,
        'diabetes': false,
        'alergia_medicamento': true,
        'fumante': false,
        'cardiaco': false
    });

    const toggle = (key: string) => setAnswers(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 items-start">
                <span className="material-symbols-outlined text-red-500">warning</span>
                <div>
                    <h4 className="font-bold text-red-900">Alertas Médicos</h4>
                    <p className="text-sm text-red-700">Paciente alérgico a <span className="font-bold">Penicilina</span> e <span className="font-bold">Dipirona</span>.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { id: 'hipertensao', label: 'Hipertensão / Pressão Alta' },
                    { id: 'diabetes', label: 'Diabetes' },
                    { id: 'alergia_medicamento', label: 'Alergia a Medicamentos' },
                    { id: 'fumante', label: 'Fumante / Tabagista' },
                    { id: 'cardiaco', label: 'Problemas Cardíacos' },
                    { id: 'gestante', label: 'Gestante / Lactante' }
                ].map(q => (
                    <div key={q.id} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                        <span className="font-medium text-slate-700">{q.label}</span>
                        <button
                            onClick={() => toggle(q.id)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${answers[q.id] ? 'bg-primary' : 'bg-slate-200'}`}
                        >
                            <div className={`size-4 bg-white rounded-full absolute top-1 transition-transform ${answers[q.id] ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <label className="font-bold text-slate-700">Observações Adicionais</label>
                <textarea className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 h-32 resize-none" placeholder="Digite detalhes sobre as condições de saúde..."></textarea>
            </div>

            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined">save</span> Salvar Anamnese
            </button>
        </div>
    );
};

// 5c. Evolution Timeline
const EvolutionTab = () => {
    const events = [
        { date: 'Hoje, 14:30', type: 'proc', title: 'Restauração Dente 14', desc: 'Resina composta A2, 2 faces.', author: 'Dr. Lucas' },
        { date: '15 Jan, 2026', type: 'note', title: 'Paciente se queixou de dor', desc: 'Sensibilidade térmica no quadrante inferior esquerdo.', author: 'Dra. Ana' },
        { date: '10 Dez, 2025', type: 'pay', title: 'Pagamento Realizado', desc: 'R$ 450,00 referente à Limpeza.', author: 'Recepção' },
    ];

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex gap-4 mb-8">
                <input type="text" placeholder="Adicionar anotação de evolução..." className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary" />
                <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold">Adicionar</button>
            </div>

            <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
                {events.map((e, i) => (
                    <div key={i} className="pl-8 relative group">
                        <div className={`absolute -left-[9px] top-0 size-4 rounded-full border-2 border-white shadow-sm ${e.type === 'proc' ? 'bg-blue-500' : e.type === 'pay' ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-slate-900">{e.title}</h4>
                                <span className="text-xs font-bold text-slate-400">{e.date}</span>
                            </div>
                            <p className="text-slate-600 mb-2">{e.desc}</p>
                            <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">person</span> {e.author}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 5d. Files / Media
const FilesTab = () => {
    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Upload Placeholder */}
                <div className="aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 hover:border-slate-400 cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-4xl mb-2">cloud_upload</span>
                    <span className="font-bold text-sm">Adicionar Arquivo</span>
                </div>

                {/* Mock Images */}
                {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-square bg-slate-200 rounded-xl relative overflow-hidden group cursor-pointer">
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-xs font-bold">Raio-X Panorâmico</p>
                            <p className="text-[10px] opacity-80">12/01/2024</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 5. Patient Record Container (Tabs)
const PatientRecord = () => {
    const [activeTab, setActiveTab] = useState<'odontogram' | 'anamnesis' | 'evolution' | 'files'>('odontogram');

    return (
        <div className="flex flex-col h-[calc(100vh-140px)]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Prontuário: <span className="text-slate-500">João Silva</span></h2>
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 gap-1">
                    {[
                        { id: 'odontogram', label: 'Odontograma', icon: 'dentistry' },
                        { id: 'anamnesis', label: 'Anamnese', icon: 'assignment_ind' },
                        { id: 'evolution', label: 'Evolução', icon: 'history' },
                        { id: 'files', label: 'Arquivos', icon: 'folder_open' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                {activeTab === 'odontogram' && <OdontogramView />}
                {activeTab === 'anamnesis' && <AnamnesisTab />}
                {activeTab === 'evolution' && <EvolutionTab />}
                {activeTab === 'files' && <FilesTab />}
            </div>
        </div>
    );
};

// Financials View
const FinancialsView = () => {
    const [range, setRange] = useState<'6M' | '1A'>('6M');

    // Mock data switching
    const currentData = range === '6M' ? financialData : [
        { name: 'Jan', income: 18000, expenses: 14000 },
        { name: 'Fev', income: 22000, expenses: 16000 },
        { name: 'Mar', income: 25000, expenses: 15500 },
        { name: 'Abr', income: 21000, expenses: 13000 },
        ...financialData
    ];

    const generateReport = () => {
        alert('Gerando relatório financeiro em PDF... O download iniciará em breve.');
    };

    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    { label: 'Receita Total', val: 'R$ 42.500', sub: '+12.5%', icon: 'payments', color: 'slate' },
                    { label: 'Pendente', val: 'R$ 3.200', sub: '+2.1%', icon: 'pending', color: 'slate' },
                    { label: 'Despesas', val: 'R$ 12.450', sub: '-5.3%', icon: 'account_balance_wallet', color: 'slate' },
                    { label: 'Lucro Líquido', val: 'R$ 30.050', sub: '+18.2%', icon: 'savings', color: 'primary', hl: true },
                ].map((k, i) => (
                    <div key={i} className={`p-6 rounded-lg border shadow-sm relative overflow-hidden ${k.hl ? 'bg-primary/5 border-primary/20' : 'bg-white border-slate-200'}`}>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <p className={`${k.hl ? 'text-primary' : 'text-slate-500'} text-xs font-bold uppercase tracking-wide`}>{k.label}</p>
                            <span className={`material-symbols-outlined ${k.hl ? 'text-primary' : 'text-slate-400'}`}>{k.icon}</span>
                        </div>
                        <div className="flex items-end justify-between relative z-10">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{k.val}</h3>
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${k.sub.includes('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{k.sub}</span>
                        </div>
                        {k.hl && <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-10 -mt-10 blur-xl"></div>}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="font-bold text-lg text-slate-900">Fluxo de Caixa</h3>
                            <p className="text-slate-500 text-sm">Receitas vs Despesas</p>
                        </div>
                        <div className="flex bg-slate-100 rounded-lg p-1">
                            <button onClick={() => setRange('6M')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${range === '6M' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>6 Meses</button>
                            <button onClick={() => setRange('1A')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${range === '1A' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>1 Ano</button>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={currentData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0b8593" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0b8593" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(value) => `R$${value / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="income" stroke="#0b8593" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={3} fillOpacity={0} fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Transactions */}
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-slate-900">Transações Recentes</h3>
                        <button className="text-primary text-sm font-bold hover:underline" onClick={generateReport}>Ver Tudo</button>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="py-3">
                                        <div className="size-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs font-bold">SC</div>
                                        <span className="text-sm font-medium">Sarah Conner</span>
                                    </td>
                                    <td className="px-6 py-4"><span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-bold rounded">Pagamento</span></td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900">+R$ 1.250,00</td>
                                </tr>
                                <tr>
                                    <td className="py-3">
                                        <div className="size-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold">DD</div>
                                        <span className="text-sm font-medium">Dental Depot</span>
                                    </td>
                                    <td className="px-6 py-4"><span className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs font-bold rounded">Suprimentos</span></td>
                                    <td className="px-6 py-4 text-right font-bold text-red-600">-R$ 450,00</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 5. Clinic Settings View
const ClinicSettingsView = ({ tenant, updateConfig }: { tenant: TenantConfig; updateConfig: (c: Partial<TenantConfig>) => void }) => {
    const [activeTab, setActiveTab] = useState<'identity' | 'branding' | 'plan' | 'schedule'>('identity');
    const [tempName, setTempName] = useState(tenant.name);
    const [tempColor, setTempColor] = useState(tenant.branding.primaryColor);

    // Schedule Settings State
    const [openingTime, setOpeningTime] = useState(tenant.settings.openingTime);
    const [closingTime, setClosingTime] = useState(tenant.settings.closingTime);
    const [slotDuration, setSlotDuration] = useState(tenant.settings.slotDuration);
    const [workingDays, setWorkingDays] = useState(tenant.settings.workingDays);

    useEffect(() => {
        setTempName(tenant.name);
        setTempColor(tenant.branding.primaryColor);
        setOpeningTime(tenant.settings.openingTime);
        setClosingTime(tenant.settings.closingTime);
        setSlotDuration(tenant.settings.slotDuration);
        setWorkingDays(tenant.settings.workingDays);
    }, [tenant]);

    const handleSave = () => {
        updateConfig({
            name: tempName,
            branding: {
                ...tenant.branding,
                primaryColor: tempColor
            },
            settings: {
                ...tenant.settings,
                openingTime,
                closingTime,
                slotDuration,
                workingDays
            }
        });
        alert('Configurações salvas com sucesso!');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Configurações da Clínica</h2>
                    <p className="text-slate-500 text-sm">Gerencie a identidade e planos da sua conta.</p>
                </div>
                <button onClick={handleSave} className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                    <span className="material-symbols-outlined">save</span> Salvar Alterações
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-slate-100 bg-slate-50">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Menu</h3>
                        </div>
                        <nav className="flex flex-col p-2">
                            {[
                                { id: 'identity', label: 'Identidade Visual', icon: 'palette' },
                                { id: 'branding', label: 'Marca & Logo', icon: 'verified' },
                                { id: 'schedule', label: 'Agenda & Horários', icon: 'calendar_clock' },
                                { id: 'plan', label: 'Plano & Limites', icon: 'workspace_premium' },
                            ].map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as any)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
                                >
                                    <span className="material-symbols-outlined">{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Identity Tab */}
                    {activeTab === 'identity' && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="p-6 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-slate-900">Identidade da Clínica</h3>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Nome da Clínica</label>
                                    <input
                                        type="text"
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    />
                                    <p className="text-xs text-slate-400">Este nome aparecerá em relatórios e no topo do menu.</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Cor Primária (Hex)</label>
                                    <div className="flex gap-4 items-center">
                                        <div className="size-12 rounded-xl border border-slate-200 shadow-sm" style={{ backgroundColor: tempColor }}></div>
                                        <input
                                            type="text"
                                            value={tempColor}
                                            onChange={(e) => setTempColor(e.target.value)}
                                            className="w-40 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-mono uppercase"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Schedule Settings Tab */}
                    {activeTab === 'schedule' && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="p-6 border-b border-slate-100">
                                <h3 className="text-lg font-bold text-slate-900">Configuração da Agenda</h3>
                            </div>
                            <div className="p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Horário de Abertura</label>
                                        <input
                                            type="time"
                                            value={openingTime}
                                            onChange={(e) => setOpeningTime(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-lg"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Horário de Fechamento</label>
                                        <input
                                            type="time"
                                            value={closingTime}
                                            onChange={(e) => setClosingTime(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-lg"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Duração do Slot (Agendamento Padrão)</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[15, 30, 45, 60].map(dur => (
                                            <button
                                                key={dur}
                                                onClick={() => setSlotDuration(dur)}
                                                className={`px-4 py-3 rounded-xl border font-bold transition-all ${slotDuration === dur ? 'bg-primary/10 border-primary text-primary' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                            >
                                                {dur} min
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Dias de Funcionamento</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, i) => {
                                            const isActive = workingDays.includes(i);
                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => setWorkingDays(prev => isActive ? prev.filter(d => d !== i) : [...prev, i])}
                                                    className={`size-10 rounded-lg font-bold text-sm transition-all border ${isActive ? 'bg-primary text-white border-primary' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'}`}
                                                >
                                                    {day[0]}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Plan Tab */}
                    {activeTab === 'plan' && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900">Seu Plano</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${tenant.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {tenant.status === 'active' ? 'Ativo' : 'Suspenso'}
                                </span>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="size-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <span className="material-symbols-outlined text-4xl">workspace_premium</span>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-900 capitalize">Plano {tenant.plan}</h2>
                                        <p className="text-slate-500">Próxima renovação em 12 dias.</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                                        <p className="text-xs font-bold text-slate-400 uppercase">Profissionais</p>
                                        <p className="text-xl font-bold text-slate-900 mt-1">3 <span className="text-slate-400 text-sm font-normal">/ {tenant.settings.maxDoctors}</span></p>
                                        <div className="w-full h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${(3 / tenant.settings.maxDoctors) * 100}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                                        <p className="text-xs font-bold text-slate-400 uppercase">Consultas/Mês</p>
                                        <p className="text-xl font-bold text-slate-900 mt-1">142 <span className="text-slate-400 text-sm font-normal">/ {tenant.settings.appointmentsPerMonth}</span></p>
                                        <div className="w-full h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                            <div className="h-full bg-green-500" style={{ width: `${(142 / tenant.settings.appointmentsPerMonth) * 100}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Branding Tab Placeholder */}
                    {activeTab === 'branding' && (
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-8 flex flex-col items-center justify-center text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <span className="material-symbols-outlined text-6xl text-slate-200 mb-4">architecture</span>
                            <h3 className="text-slate-900 font-bold text-lg">Configurações Avançadas de Marca</h3>
                            <p className="text-slate-500 max-w-md mt-2">Upload de logo personalizado e fontes estarão disponíveis na próxima atualização.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// 4. Main App Container
export default function App() {
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
                        {activePage === 'patients' && <PatientRecord />}
                        {activePage === 'financials' && <FinancialsView />}
                        {activePage === 'settings' && <ClinicSettingsView tenant={activeTenant} updateConfig={updateTenantConfig} />}
                        {activePage === 'inventory' && (
                            <div className="flex items-center justify-center h-[500px] bg-white rounded-xl border border-slate-200 border-dashed">
                                <div className="text-center text-slate-400">
                                    <span className="material-symbols-outlined text-6xl mb-4">construction</span>
                                    <p>Este módulo está em desenvolvimento.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Modals */}
            <NewAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}

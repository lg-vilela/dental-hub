import React from 'react';
import { TenantConfig, NavItem } from '../types';

interface SidebarProps {
    tenant: TenantConfig;
    activePage: string;
    setPage: (p: string) => void;
    openPublic: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ tenant, activePage, setPage, openPublic }) => {
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
        <aside className="w-64 bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex flex-col h-full font-['Manrope'] shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]">
            {/* Clinic Identity */}
            <div className="h-24 flex items-center px-6 gap-3 border-b border-slate-100/50">
                <div className="relative group">
                    <div className="absolute -inset-2 bg-[#617FA3]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <img src="https://i.postimg.cc/ydfbFRrP/logo-vilelacodelab-removebg-preview.png" alt="Dental Hub" className="h-9 w-auto object-contain relative z-10" />
                </div>
                <div className="flex flex-col justify-center">
                    <h1 className="text-slate-900 text-lg font-extrabold leading-none tracking-tight">Dental Hub</h1>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">Consultório</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
                <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 opacity-60">Menu Principal</p>
                {navItems.map((item) => {
                    const isActive = activePage === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setPage(item.id)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group w-full text-left relative overflow-hidden
                                ${isActive
                                    ? 'bg-gradient-to-r from-[#617FA3] to-[#4A6280] text-white shadow-lg shadow-[#617FA3]/25 translate-x-1'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-[#617FA3] hover:translate-x-1'
                                }`}
                        >
                            {/* Tech-glow effect for active items */}
                            {isActive && <div className="absolute inset-0 bg-white/10 opacity-50"></div>}

                            <span className={`material-symbols-outlined ${isActive ? 'text-white' : 'group-hover:text-[#617FA3] transition-colors scale-90'}`}>
                                {item.icon}
                            </span>
                            <span className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>

                            {isActive && <div className="absolute right-3 size-1.5 rounded-full bg-white shadow-sm animate-pulse"></div>}
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 m-4 bg-slate-50/50 rounded-2xl border border-slate-100/80">
                {/* Public Page Link */}
                <button onClick={openPublic} className="w-full mb-4 flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100 shadow-sm text-slate-500 hover:border-[#617FA3] hover:text-[#617FA3] transition-all group group cursor-pointer">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg px-1 text-slate-400 group-hover:text-[#617FA3] transition-colors">public</span>
                        <span className="font-bold text-xs">Página Pública</span>
                    </div>
                    <span className="material-symbols-outlined text-xs bg-slate-50 rounded p-1 group-hover:bg-[#617FA3]/10">open_in_new</span>
                </button>

                <div className="border-t border-slate-200/50 pt-4">
                    {/* License */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] uppercase font-bold text-slate-400">Status</span>
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">Plano <span className="text-slate-900 font-bold">Pro</span> ativo.</p>
                        <button onClick={handleRenew} className="text-[10px] mt-2 font-bold text-[#617FA3] hover:underline">
                            Gerenciar Assinatura
                        </button>
                    </div>

                    {/* Developer Seal */}
                    <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
                        <img src="https://i.postimg.cc/02HZYY53/selo-de-desenvolvimento.png" alt="Vilela CodeLab" className="h-4 w-auto grayscale" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Vilela CodeLab</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

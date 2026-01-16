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
        <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen fixed left-0 top-0 z-20 hidden lg:flex font-['Manrope']">
            {/* Clinic Identity */}
            <div className="h-24 flex items-center px-6 gap-3">
                <img src="https://i.postimg.cc/7PCPGZjd/logoblack-vilelacodelab.png" alt="Dental Hub" className="h-10 w-auto object-contain" />
                <div className="flex flex-col justify-center">
                    <h1 className="text-slate-900 text-lg font-extrabold leading-none tracking-tight">Dental Hub</h1>
                    <p className="text-slate-400 text-xs font-semibold mt-1 tracking-wide">Consultório Inteligente</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-2">
                <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 mt-2">Menu Principal</p>
                {navItems.map((item) => {
                    const isActive = activePage === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setPage(item.id)}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group w-full text-left relative overflow-hidden
                                ${isActive
                                    ? 'bg-[#617FA3] text-white shadow-md shadow-[#617FA3]/25 translate-x-1'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-[#617FA3] hover:translate-x-1'
                                }`}
                        >
                            <span className={`material-symbols-outlined ${isActive ? 'text-white' : 'group-hover:text-[#617FA3] transition-colors'}`}>
                                {item.icon}
                            </span>
                            <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                        </button>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-6">
                {/* Public Page Link */}
                <button onClick={openPublic} className="w-full mb-6 flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-500 hover:border-[#617FA3] hover:text-[#617FA3] hover:shadow-lg hover:shadow-[#617FA3]/10 transition-all group group cursor-pointer">
                    <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-400 group-hover:text-[#617FA3] transition-colors">
                            <span className="material-symbols-outlined text-lg">public</span>
                        </div>
                        <span className="font-bold text-sm">Página Pública</span>
                    </div>
                    <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">arrow_forward</span>
                </button>

                <div className="border-t border-slate-100 pt-6">
                    {/* License */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-slate-400">Sua Licença</span>
                            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Ativa</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mb-2">Expira em <span className="text-slate-900 font-bold">12 dias</span>.</p>
                        <button onClick={handleRenew} className="text-xs font-bold text-[#617FA3] hover:underline flex items-center gap-1">
                            Renovar Plano <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                        </button>
                    </div>

                    {/* Developer Seal */}
                    <div className="flex flex-col gap-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Developed By</p>
                        <img src="https://i.postimg.cc/02HZYY53/selo-de-desenvolvimento.png" alt="Vilela CodeLab" className="h-6 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity self-start" />
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

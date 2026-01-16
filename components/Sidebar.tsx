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

export default Sidebar;

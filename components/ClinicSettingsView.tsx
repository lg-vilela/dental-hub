import React, { useState, useEffect } from 'react';
import { TenantConfig } from '../types';

// 6c. Audit Logs Tab (Phase 6)
const AuditLogsTab = () => {
    const logs = [
        { user: 'Dr. Smith', action: 'Acessou Prontuário (João Silva)', time: 'Hoje, 14:32', ip: '192.168.1.1' },
        { user: 'Recepção', action: 'Agendou Consulta (Maria Souza)', time: 'Hoje, 10:15', ip: '192.168.1.5' },
        { user: 'Dr. Smith', action: 'Alterou Configurações da Clínica', time: 'Ontem, 18:40', ip: '192.168.1.1' },
        { user: 'Sistema', action: 'Backup Automático', time: 'Ontem, 02:00', ip: 'Localhost' },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Segurança e Auditoria</h3>
                <button className="text-sm font-bold text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">download</span> Exportar Logs
                </button>
            </div>
            <div className="p-0">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-bold">Usuário</th>
                            <th className="px-6 py-3 font-bold">Ação</th>
                            <th className="px-6 py-3 font-bold">Data/Hora</th>
                            <th className="px-6 py-3 font-bold">IP</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {logs.map((log, i) => (
                            <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-3 font-medium text-slate-900">{log.user}</td>
                                <td className="px-6 py-3 text-slate-600">{log.action}</td>
                                <td className="px-6 py-3 text-slate-500">{log.time}</td>
                                <td className="px-6 py-3 text-slate-400 font-mono text-xs">{log.ip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50">
                <div className="flex items-start gap-3">
                    <input type="checkbox" id="lgpd" className="mt-1" />
                    <div>
                        <label htmlFor="lgpd" className="font-bold text-slate-900 block">Ativar Consultoria LGPD</label>
                        <p className="text-xs text-slate-500">Ao ativar, o sistema solicitará consentimento dos pacientes para armazenamento de dados sensíveis na ficha de cadastro.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 6d. Team Tab
import { profileService } from '../src/services/profileService';
import { UserProfile } from '../src/contexts/AuthContext';
import { useAuth } from '../src/contexts/AuthContext';

const TeamTab = () => {
    const { clinic } = useAuth();
    const [members, setMembers] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [inviteRole, setInviteRole] = useState('dentist');
    const [inviteLink, setInviteLink] = useState('');
    const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

    useEffect(() => {
        loadTeam();
    }, []);

    const loadTeam = async () => {
        try {
            const data = await profileService.getTeamMembers();
            setMembers(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateInvite = () => {
        if (!clinic) return;
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/signup?invite_clinic_id=${clinic.id}&invite_role=${inviteRole}`;
        setInviteLink(link);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        alert('Link copiado!');
    };

    const roles = [
        { id: 'dentist', label: 'Dentista' },
        { id: 'receptionist', label: 'Recepcionista' },
        { id: 'admin', label: 'Administrador' }
    ];

    const currentRoleLabel = roles.find(r => r.id === inviteRole)?.label;

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Gerenciar Equipe</h3>
                    <p className="text-sm text-slate-500">Convide novos membros para sua clínica.</p>
                </div>

                <div className="flex gap-2 items-center bg-slate-50 p-2 rounded-xl border border-slate-200">
                    {/* Custom Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                            className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-lg text-sm font-bold text-slate-700 hover:border-slate-300 transition-all min-w-[140px] justify-between"
                        >
                            {currentRoleLabel}
                            <span className="material-symbols-outlined text-slate-400 text-[18px]">expand_more</span>
                        </button>

                        {isRoleDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsRoleDropdownOpen(false)}></div>
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-20 py-1 animate-in fade-in zoom-in-95 duration-200">
                                    {roles.map(r => (
                                        <button
                                            key={r.id}
                                            onClick={() => { setInviteRole(r.id); setInviteLink(''); setIsRoleDropdownOpen(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center justify-between ${inviteRole === r.id ? 'text-primary bg-primary/5' : 'text-slate-600'}`}
                                        >
                                            {r.label}
                                            {inviteRole === r.id && <span className="material-symbols-outlined text-[16px]">check</span>}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <button onClick={generateInvite} className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">link</span>
                        Gerar Convite
                    </button>
                </div>
            </div>

            {/* Invite Link Area */}
            {inviteLink && (
                <div className="p-6 bg-primary/5 border-b border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-2">
                    <div className="flex-1">
                        <p className="text-xs font-bold text-primary uppercase mb-2 flex items-center gap-2">
                            <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                            Link Ativo para {currentRoleLabel}
                        </p>
                        <div className="flex items-center gap-3 bg-white border border-primary/20 rounded-lg p-3">
                            <span className="material-symbols-outlined text-primary">link</span>
                            <p className="text-sm text-slate-600 font-mono truncate select-all">{inviteLink}</p>
                        </div>
                    </div>
                    <button onClick={copyLink} className="bg-white text-primary border border-primary/20 hover:bg-primary hover:text-white px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm">
                        <span className="material-symbols-outlined">content_copy</span>
                        Copiar Link
                    </button>
                </div>
            )}

            <div className="p-0">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Membro</th>
                            <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Email</th>
                            <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Cargo</th>
                            <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            [1, 2, 3].map(i => (
                                <tr key={i}>
                                    <td className="px-6 py-4"><div className="h-4 w-32 bg-slate-100 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-48 bg-slate-100 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-20 bg-slate-100 rounded animate-pulse"></div></td>
                                    <td className="px-6 py-4"><div className="h-4 w-16 bg-slate-100 rounded animate-pulse"></div></td>
                                </tr>
                            ))
                        ) : members.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">group_off</span>
                                        <p className="font-medium">Nenhum membro encontrado.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : members.map((m) => (
                            <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 text-slate-500 flex items-center justify-center text-sm shadow-inner">
                                        {m.full_name[0]}
                                    </div>
                                    {m.full_name}
                                </td>
                                <td className="px-6 py-4 text-slate-600 font-medium">{m.email || 'Email oculto'}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${m.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                            m.role === 'dentist' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                'bg-orange-50 text-orange-700 border-orange-100'
                                        }`}>
                                        {m.role === 'admin' && <span className="material-symbols-outlined text-[14px]">shield_person</span>}
                                        {m.role === 'dentist' && <span className="material-symbols-outlined text-[14px]">dentistry</span>}
                                        {m.role === 'receptionist' && <span className="material-symbols-outlined text-[14px]">support_agent</span>}
                                        {m.role === 'dentist' ? 'Dentista' : m.role === 'receptionist' ? 'Recepção' : 'Admin'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400 text-xs font-bold flex items-center gap-2">
                                    <span className="size-2 rounded-full bg-green-500"></span>
                                    Ativo
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                <p className="text-xs text-slate-500 font-medium bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                    <span className="material-symbols-outlined text-[14px] align-middle mr-1">inventory_2</span>
                    Limite do Plano: <span className="font-bold text-slate-900">{members.length} / {clinic?.plan === 'pro' ? '10' : clinic?.plan === 'plus' ? '∞' : '1'}</span> usuários.
                </p>
            </div>
        </div>
    );
};

// 5. Clinic Settings View
const ClinicSettingsView = ({ tenant, updateConfig }: { tenant: TenantConfig; updateConfig: (c: Partial<TenantConfig>) => void }) => {
    const [activeTab, setActiveTab] = useState<'schedule' | 'plan' | 'security' | 'team'>('schedule');

    // Schedule Settings State
    const [openingTime, setOpeningTime] = useState(tenant.settings.openingTime);
    const [closingTime, setClosingTime] = useState(tenant.settings.closingTime);
    const [slotDuration, setSlotDuration] = useState(tenant.settings.slotDuration);
    const [workingDays, setWorkingDays] = useState(tenant.settings.workingDays);

    useEffect(() => {
        setOpeningTime(tenant.settings.openingTime);
        setClosingTime(tenant.settings.closingTime);
        setSlotDuration(tenant.settings.slotDuration);
        setWorkingDays(tenant.settings.workingDays);
    }, [tenant]);

    const handleSave = () => {
        updateConfig({
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
                    <p className="text-slate-500 text-sm">Gerencie horários e planos da sua conta.</p>
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
                                { id: 'schedule', label: 'Agenda & Horários', icon: 'calendar_clock' },
                                { id: 'team', label: 'Membros da Equipe', icon: 'group' },
                                { id: 'plan', label: 'Plano & Limites', icon: 'workspace_premium' },
                                { id: 'security', label: 'Segurança & LGPD', icon: 'shield_lock' },
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

                    {/* Team Tab */}
                    {activeTab === 'team' && <TeamTab />}

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

                    {/* Audit Logs Tab */}
                    {activeTab === 'security' && <AuditLogsTab />}
                </div>
            </div>
        </div>
    );
};

export default ClinicSettingsView;

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
        // Generate a link that passes metadata to the signup page
        // Format: /signup?invite_clinic_id=UUID&invite_role=ROLE
        const baseUrl = window.location.origin; // e.g. http://localhost:5173
        const link = `${baseUrl}/signup?invite_clinic_id=${clinic.id}&invite_role=${inviteRole}`;
        setInviteLink(link);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        alert('Link copiado! Envie para o membro da equipe.');
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Gerenciar Equipe</h3>
                <div className="flex gap-2">
                    <select
                        value={inviteRole}
                        onChange={(e) => { setInviteRole(e.target.value); setInviteLink(''); }}
                        className="text-sm border border-slate-200 rounded-lg px-2 py-1 outline-none"
                    >
                        <option value="dentist">Dentista</option>
                        <option value="receptionist">Recepcionista</option>
                        <option value="admin">Administrador</option>
                    </select>
                    <button onClick={generateInvite} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors">
                        Gerar Convite
                    </button>
                </div>
            </div>

            {/* Invite Link Area */}
            {inviteLink && (
                <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold text-blue-800 uppercase mb-1">Link de Convite ({inviteRole === 'dentist' ? 'Dentista' : inviteRole === 'receptionist' ? 'Recepcionista' : 'Admin'})</p>
                        <p className="text-sm text-blue-600 font-mono break-all">{inviteLink}</p>
                    </div>
                    <button onClick={copyLink} className="text-blue-700 font-bold text-sm hover:underline">Copiar</button>
                </div>
            )}

            <div className="p-0">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-bold">Nome</th>
                            <th className="px-6 py-3 font-bold">Email</th>
                            <th className="px-6 py-3 font-bold">Cargo</th>
                            <th className="px-6 py-3 font-bold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-6 text-center text-slate-400">Carregando equipe...</td></tr>
                        ) : members.map((m) => (
                            <tr key={m.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-3 font-bold text-slate-900 flex items-center gap-2">
                                    <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">
                                        {m.full_name[0]}
                                    </div>
                                    {m.full_name}
                                </td>
                                <td className="px-6 py-3 text-slate-600">{m.email || 'Email oculto'}</td>
                                <td className="px-6 py-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${m.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                            m.role === 'dentist' ? 'bg-blue-100 text-blue-700' :
                                                'bg-orange-100 text-orange-700'
                                        }`}>
                                        {m.role === 'dentist' ? 'Dentista' : m.role === 'receptionist' ? 'Recepção' : 'Admin'}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-slate-400 text-xs">Ativo</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100">
                <p className="text-xs text-slate-500 text-center">
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

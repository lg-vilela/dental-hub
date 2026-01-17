import React, { useState, useEffect } from 'react';
import { TenantConfig } from '../types';

// 6c. Audit Logs Tab (Phase 6)
// 6c. Audit Logs Tab (Phase 6)
import { auditService, AuditLog } from '../src/services/auditService';

const AuditLogsTab = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        try {
            const data = await auditService.getLogs();
            setLogs(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

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
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-8 text-center bg-slate-50 animate-pulse">Carregando logs...</td></tr>
                        ) : logs.length === 0 ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-400">Nenhum registro encontrado.</td></tr>
                        ) : logs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-3 font-medium text-slate-900">
                                    {log.profiles?.full_name || 'Usuário Desconhecido'}
                                    <span className="block text-xs text-slate-400 font-normal">{log.profiles?.email}</span>
                                </td>
                                <td className="px-6 py-3 text-slate-600">{log.action}</td>
                                <td className="px-6 py-3 text-slate-500">{new Date(log.created_at).toLocaleString('pt-BR')}</td>
                                <td className="px-6 py-3 text-slate-400 font-mono text-xs">{log.ip_address || '-'}</td>
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
import { useToast } from '../src/contexts/ToastContext';

const TeamTab = () => {
    const { clinic } = useAuth();
    const { showToast } = useToast();
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

    const limit = clinic?.plan === 'plus' ? 999 : clinic?.plan === 'pro' ? 10 : 2; // Free = 2 (Owner + 1)
    const canAdd = members.length < limit;

    const generateInvite = () => {
        if (!clinic) {
            console.error("Clinic (AuthContext) is missing");
            showToast("Erro: Dados da clínica não carregados. Recarregue a página.", 'error');
            return;
        }

        if (!canAdd) {
            showToast(`Você atingiu o limite do plano ${clinic.plan || 'Grátis'}. Faça upgrade!`, 'error');
            return;
        }

        console.log("Generating invite for clinic:", clinic.id, "Role:", inviteRole);
        const baseUrl = window.location.origin;
        // Correct Invite Link Format
        const link = `${baseUrl}/signup?invite_clinic_id=${clinic.id}&invite_role=${inviteRole}`;
        setInviteLink(link);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(inviteLink);
        showToast('Link copiado para a área de transferência!', 'success');
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

                    <button
                        onClick={generateInvite}
                        className={`bg-slate-900 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2 ${!canAdd ? 'opacity-75' : ''}`}
                    >
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
                    Limite do Plano <span className="uppercase font-bold">{clinic?.plan}</span>: <span className={`font-bold ${!canAdd ? 'text-red-500' : 'text-slate-900'}`}>{members.length} / {limit === 999 ? '∞' : limit}</span> usuários.
                </p>
            </div>
        </div>
    );
};

// 6f. Services Tab (New)
import { servicesService, Service } from '../src/services/servicesService';

const ServicesTab = () => {
    const { clinic } = useAuth();
    const { showToast } = useToast();
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState<Partial<Service>>({ title: '', price: 0, duration_minutes: 30, icon: 'dentistry' });

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            const data = await servicesService.getServices();
            setServices(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!currentService.title) return showToast('Nome é obrigatório', 'warning');
        if (!clinic?.id) return showToast('Erro: Clínica não identificada.', 'error');

        try {
            const serviceData = { ...currentService, clinic_id: clinic.id };

            if (currentService.id) {
                await servicesService.updateService(currentService.id, serviceData);
                showToast('Serviço atualizado com sucesso!', 'success');
            } else {
                await servicesService.createService(serviceData as any);
                showToast('Serviço criado com sucesso!', 'success');
            }
            setIsEditing(false);
            setCurrentService({ title: '', price: 0, duration_minutes: 30, icon: 'dentistry' });
            loadServices();
        } catch (error: any) {
            console.error(error);
            showToast('Erro ao salvar: ' + (error.message || 'Erro desconhecido'), 'error');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Excluir este serviço?')) return;
        try {
            await servicesService.deleteService(id);
            showToast('Serviço excluído.', 'success');
            loadServices();
        } catch (error: any) {
            showToast('Erro ao excluir: ' + error.message, 'error');
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Serviços e Preços</h3>
                    <p className="text-sm text-slate-500">Defina os procedimentos disponíveis para agendamento.</p>
                </div>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary-dark transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined">add</span> Novo Serviço
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="p-6 bg-slate-50 border-b border-slate-100 animate-in slide-in-from-top-2">
                    <h4 className="font-bold text-slate-900 mb-4">{currentService.id ? 'Editar Serviço' : 'Novo Serviço'}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Nome do Procedimento</label>
                            <input
                                value={currentService.title}
                                onChange={e => setCurrentService({ ...currentService, title: e.target.value })}
                                className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-700"
                                placeholder="Ex: Limpeza Dental"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Preço (R$)</label>
                            <input
                                type="number"
                                value={currentService.price}
                                onChange={e => setCurrentService({ ...currentService, price: Number(e.target.value) })}
                                className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-700"
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Duração (min)</label>
                            <select
                                value={currentService.duration_minutes}
                                onChange={e => setCurrentService({ ...currentService, duration_minutes: Number(e.target.value) })}
                                className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-700 bg-white"
                            >
                                {[15, 30, 45, 60, 90, 120].map(m => <option key={m} value={m}>{m} min</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Ícone</label>
                            <div className="flex gap-2">
                                {['dentistry', 'clean_hands', 'medical_services', 'brightness_7', 'emergency'].map(icon => (
                                    <button
                                        key={icon}
                                        onClick={() => setCurrentService({ ...currentService, icon })}
                                        className={`size-10 rounded-lg flex items-center justify-center border transition-all ${currentService.icon === icon ? 'bg-primary text-white border-primary' : 'bg-white text-slate-400 border-slate-200'}`}
                                    >
                                        <span className="material-symbols-outlined">{icon}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button onClick={() => { setIsEditing(false); setCurrentService({ title: '', price: 0, duration_minutes: 30, icon: 'dentistry' }); }} className="px-4 py-2 font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors">Cancelar</button>
                        <button onClick={handleSave} className="px-6 py-2 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">Salvar</button>
                    </div>
                </div>
            ) : null}

            <div className="p-0">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                        <tr>
                            <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Serviço</th>
                            <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Duração</th>
                            <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider">Preço</th>
                            <th className="px-6 py-4 font-bold uppercase text-xs tracking-wider text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {isLoading ? (
                            <tr><td colSpan={4} className="p-8 text-center text-slate-400">Carregando...</td></tr>
                        ) : services.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-12 text-center text-slate-400">
                                    <div className="flex flex-col items-center">
                                        <span className="material-symbols-outlined text-4xl opacity-30 mb-2">playlist_add</span>
                                        <p>Nenhum serviço cadastrado.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : services.map(s => (
                            <tr key={s.id} className="hover:bg-slate-50 group">
                                <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[18px]">{s.icon}</span>
                                    </div>
                                    {s.title}
                                </td>
                                <td className="px-6 py-4 text-slate-600 font-medium">{s.duration_minutes} min</td>
                                <td className="px-6 py-4 font-bold text-emerald-600">
                                    {s.price === 0 ? 'Grátis' : `R$ ${s.price.toFixed(2)}`}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setCurrentService(s); setIsEditing(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                        <button onClick={() => handleDelete(s.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// 5. Clinic Settings View
const ClinicSettingsView = () => {
    const { clinic, updateClinicSettings } = useAuth();
    const { showToast } = useToast();
    const [activeTab, setActiveTab] = useState<'schedule' | 'services' | 'plan' | 'security' | 'team'>('schedule');

    // Schedule Settings State
    const [openingTime, setOpeningTime] = useState('08:00');
    const [closingTime, setClosingTime] = useState('18:00');
    const [slotDuration, setSlotDuration] = useState(30);
    const [workingDays, setWorkingDays] = useState<number[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (clinic) {
            setOpeningTime(clinic.opening_time || '08:00');
            setClosingTime(clinic.closing_time || '18:00');
            setSlotDuration(clinic.slot_duration || 30);
            setWorkingDays(clinic.working_days || [1, 2, 3, 4, 5]);
        }
    }, [clinic]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateClinicSettings({
                opening_time: openingTime,
                closing_time: closingTime,
                slot_duration: slotDuration,
                working_days: workingDays
            });
            await auditService.logAction('Alterou Configurações da Clínica');
            showToast('Configurações salvas com sucesso!', 'success');
        } catch (err) {
            showToast('Erro ao salvar configurações.', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Configurações da Clínica</h2>
                    <p className="text-slate-500 text-sm">Gerencie horários e planos da sua conta.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-70"
                >
                    {isSaving ? (
                        <>
                            <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> Salvando...
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined">save</span> Salvar Alterações
                        </>
                    )}
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
                                { id: 'services', label: 'Serviços & Preços', icon: 'payments' },
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
                                            const isActive = workingDays?.includes(i);
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

                    {/* Services Tab */}
                    {activeTab === 'services' && <ServicesTab />}

                    {/* Team Tab */}
                    {activeTab === 'team' && <TeamTab />}

                    {/* Plan Tab */}
                    {activeTab === 'plan' && <PlanTab />}

                    {/* Audit Logs Tab */}
                    {activeTab === 'security' && <AuditLogsTab />}
                </div>
            </div>
        </div>
    );
};

// 6e. Plan Tab (Refactored to use Real Data)
const PlanTab = () => {
    const { clinic } = useAuth();

    // Limits based on Plan
    const limits = {
        free: { users: 1, appts: 50, name: 'Grátis' },
        pro: { users: 10, appts: 500, name: 'Profissional' },
        plus: { users: 999, appts: 9999, name: 'Enterprise' }
    };

    const currentPlan = limits[clinic?.plan || 'free'];

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-900">Seu Plano</h3>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-green-100 text-green-700">
                    Ativo
                </span>
            </div>
            <div className="p-8">
                <div className="flex items-center gap-6 mb-8">
                    <div className="size-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-4xl">workspace_premium</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 capitalize">Plano {currentPlan.name}</h2>
                        <p className="text-slate-500">Próxima renovação em 12 dias.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                        <p className="text-xs font-bold text-slate-400 uppercase">Profissionais</p>
                        <p className="text-xl font-bold text-slate-900 mt-1">
                            <span className="text-sm font-normal">Limite: </span>
                            {currentPlan.users > 100 ? 'Ilimitado' : currentPlan.users}
                        </p>
                        <div className="w-full h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '30%' }}></div>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                        <p className="text-xs font-bold text-slate-400 uppercase">Consultas/Mês</p>
                        <p className="text-xl font-bold text-slate-900 mt-1">
                            <span className="text-sm font-normal">Limite: </span>
                            {currentPlan.appts > 1000 ? 'Ilimitado' : currentPlan.appts}
                        </p>
                        <div className="w-full h-1 bg-slate-200 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: '10%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClinicSettingsView;

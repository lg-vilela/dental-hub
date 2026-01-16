
import React, { useState, useEffect } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import { appointmentsService } from '../src/services/appointmentsService';
import { remindersService, Reminder } from '../src/services/remindersService';

const Dashboard = () => {
    const { clinic, user, logout } = useAuth(); // Get clinic & user from context
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Reminders State
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [colleagues, setColleagues] = useState<any[]>([]);
    const [isCreatingReminder, setIsCreatingReminder] = useState(false);
    const [newReminder, setNewReminder] = useState({ title: '', assigned_to: '', priority: 'medium' });

    useEffect(() => {
        loadAppointments();
        loadRemindersData();
    }, [clinic, user]);

    const loadRemindersData = async () => {
        if (!clinic?.id) return;
        try {
            const [rems, cols] = await Promise.all([
                remindersService.getReminders(),
                remindersService.getColleagues(clinic.id)
            ]);
            setReminders(rems);
            setColleagues(cols);
        } catch (error) {
            console.error('Error loading reminders data:', error);
        }
    };

    const handleCreateReminder = async () => {
        if (!newReminder.title || !newReminder.assigned_to || !clinic?.id || !user?.id) return;
        try {
            const created = await remindersService.createReminder(
                newReminder as any,
                clinic.id,
                user.id
            );
            setReminders([created, ...reminders]);
            setNewReminder({ title: '', assigned_to: '', priority: 'medium' });
            setIsCreatingReminder(false);
        } catch (error) {
            console.error('Error creating reminder:', error);
            alert('Erro ao criar lembrete.');
        }
    };

    const updateReminderStatus = async (id: string, status: 'pending' | 'in_progress' | 'done') => {
        try {
            await remindersService.updateStatus(id, status);
            setReminders(reminders.map(r => r.id === id ? { ...r, status } : r));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const loadAppointments = async () => {
        try {
            const data = await appointmentsService.getTodayAppointments();
            setAppointments(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const metrics = [
        { label: 'Pacientes Hoje', val: appointments.length.toString(), trend: '+12%', icon: 'group', color: 'blue' },
        { label: 'Faturamento', val: 'R$ 4.2k', trend: '+8%', icon: 'payments', color: 'emerald' },
        { label: 'Pending', val: '3', trend: '-2%', icon: 'pending_actions', color: 'orange' },
        { label: 'NPS', val: '92', trend: '+5%', icon: 'thumb_up', color: 'purple' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            {/* Header with Greeting */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                        Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 capitalize">{user?.name || 'Doutor'}</span> 👋
                    </h2>
                    <p className="text-slate-500 font-medium mt-1">Aqui está o resumo da sua clínica hoje.</p>
                </div>
                <div className="flex gap-3">
                    <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm hover:shadow-md">
                        <span className="material-symbols-outlined">notifications</span>
                    </button>
                    <button className="px-5 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg hover:shadow-slate-900/20 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">add</span> Novo Agendamento
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, i) => (
                    <div key={i} className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-sm relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start z-10 relative">
                            <div className={`p-3 rounded-xl bg-${m.color}-50 text-${m.color}-600 border border-${m.color}-100/50 group-hover:scale-110 transition-transform`}>
                                <span className="material-symbols-outlined">{m.icon}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-${m.color}-50 text-${m.color}-700 border border-${m.color}-100`}>{m.trend}</span>
                        </div>
                        <div className="mt-4 z-10 relative">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{m.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{m.val}</h3>
                        </div>
                        {/* Tech-ish background decoration */}
                        <div className={`absolute -right-6 -bottom-6 size-32 bg-${m.color}-50/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
                    </div>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Schedule Feed */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Agenda em Tempo Real</h3>
                                <p className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full w-fit mt-1 flex items-center gap-1">
                                    <span className="size-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    Atualizado agora
                                </p>
                            </div>
                            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                                Ver Todos
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hora</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paciente</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Procedimento</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Doutor</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {isLoading ? (
                                        <tr><td colSpan={5} className="p-12 text-center text-slate-400">Carregando agendamentos...</td></tr>
                                    ) : appointments.length > 0 ? appointments.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50/80 transition-all cursor-pointer group">
                                            <td className="px-6 py-4 text-xs font-bold text-slate-500 font-mono">{row.time}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {/* Foto removida conforme solicitado */}
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-800">{row.patientName}</p>
                                                        <p className="text-[10px] font-mono text-slate-400">ID: #P-{row.id.substring(0, 4)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-bold bg-white border border-slate-100 text-slate-600 shadow-sm">
                                                    <span className="size-1.5 rounded-full bg-blue-500"></span>{row.proc}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium text-slate-600">{row.doc}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide 
                                                    ${row.status === 'confirmed' ? 'bg-green-50 text-green-600 border border-green-100' :
                                                        row.status === 'scheduled' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-50 text-slate-500'}`}>
                                                    {row.status === 'scheduled' ? 'Agendado' : row.status === 'confirmed' ? 'Confirmado' : row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                                                    <span className="material-symbols-outlined text-4xl opacity-20">event_busy</span>
                                                    <p className="text-sm font-medium">Nenhum agendamento para hoje.</p>
                                                    <p className="text-xs">Os agendamentos da página pública aparecerão aqui.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Quick Action */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                            <span className="material-symbols-outlined text-9xl">bolt</span>
                        </div>
                        <h3 className="text-lg font-bold mb-1 relative z-10">Acesso Rápido</h3>
                        <p className="text-slate-300 text-sm mb-6 relative z-10">Ações frequentes para agilizar seu dia.</p>

                        <div className="grid grid-cols-2 gap-3 relative z-10">
                            {[
                                { icon: 'person_add', label: 'Novo Paciente' },
                                { icon: 'add_card', label: 'Nova Cobrança' },
                                { icon: 'description', label: 'Prontuário' },
                                { icon: 'send', label: 'Lembrete' }
                            ].map((action, i) => (
                                <button key={i} className="bg-white/10 hover:bg-white/20 border border-white/5 hover:border-white/20 p-3 rounded-xl flex flex-col items-center gap-2 transition-all group/btn">
                                    <span className="material-symbols-outlined text-2xl group-hover/btn:scale-110 transition-transform">{action.icon}</span>
                                    <span className="text-[10px] font-bold uppercase tracking-wider">{action.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Auto Reminders (Static for now) */}
                    {/* Auto Reminders (Dynamic) */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">task_alt</span>
                                Tarefas & Lembretes
                            </h3>
                            <button
                                onClick={() => setIsCreatingReminder(!isCreatingReminder)}
                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-600 transition-all"
                            >
                                <span className="material-symbols-outlined">{isCreatingReminder ? 'close' : 'add'}</span>
                            </button>
                        </div>

                        {/* Create Form */}
                        {isCreatingReminder && (
                            <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
                                <input
                                    type="text"
                                    placeholder="Título da tarefa..."
                                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 mb-2"
                                    value={newReminder.title}
                                    onChange={e => setNewReminder({ ...newReminder, title: e.target.value })}
                                />
                                <div className="flex gap-2">
                                    <select
                                        className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                                        value={newReminder.assigned_to}
                                        onChange={e => setNewReminder({ ...newReminder, assigned_to: e.target.value })}
                                    >
                                        <option value="">Atribuir a...</option>
                                        {colleagues.map((c: any) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                                    </select>
                                    <select
                                        className="w-24 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                                        value={newReminder.priority}
                                        onChange={e => setNewReminder({ ...newReminder, priority: e.target.value as any })}
                                    >
                                        <option value="low">Baixa</option>
                                        <option value="medium">Média</option>
                                        <option value="high">Alta</option>
                                    </select>
                                    <button
                                        onClick={handleCreateReminder}
                                        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-all"
                                    >
                                        Salvar
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                            {reminders.length > 0 ? reminders.map((r, i) => (
                                <div key={i} className="group p-3 rounded-xl bg-white border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className={`text-sm font-semibold ${r.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                            {r.title}
                                        </p>
                                        <div className="flex items-center gap-1">
                                            <span className={`size-2 rounded-full ${r.priority === 'high' ? 'bg-red-500' : r.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-2">
                                        <div className="flex items-center gap-2">
                                            <div className="size-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500" title={r.assignee?.full_name}>
                                                {r.assignee?.full_name?.substring(0, 2).toUpperCase() || 'UN'}
                                            </div>
                                            <span className="text-[10px] text-slate-400">
                                                {new Date(r.created_at).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <select
                                            value={r.status}
                                            onChange={(e) => updateReminderStatus(r.id, e.target.value as any)}
                                            className={`text-[10px] font-bold px-2 py-1 rounded-md border appearance-none cursor-pointer text-center min-w-[80px]
                                                ${r.status === 'done' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    r.status === 'in_progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        'bg-slate-50 text-slate-500 border-slate-100'}`}
                                        >
                                            <option value="pending">Pendente</option>
                                            <option value="in_progress">Em Andamento</option>
                                            <option value="done">Concluído</option>
                                        </select>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-8 text-slate-400">
                                    <p className="text-xs">Nenhuma tarefa pendente.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

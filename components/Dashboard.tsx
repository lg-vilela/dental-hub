import React, { useState } from 'react';

interface DashboardProps {
    openModal: () => void;
    setPage: (p: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ openModal, setPage }) => {
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

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Schedule List */}
                <div className="xl:col-span-2 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100/50 flex items-center justify-between bg-white/50">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-slate-900 animate-pulse"></div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Agenda em Tempo Real</h3>
                        </div>
                        <div className="flex bg-slate-100/50 p-1 rounded-lg">
                            <button onClick={() => setScheduleTime(scheduleTime === 'morning' ? 'all' : 'morning')}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${scheduleTime === 'morning' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                                Manhã
                            </button>
                            <button onClick={() => setScheduleTime(scheduleTime === 'afternoon' ? 'all' : 'afternoon')}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${scheduleTime === 'afternoon' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                                Tarde
                            </button>
                        </div>
                    </div>
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
                            {filteredAppointments.length > 0 ? filteredAppointments.map((row, i) => (
                                <tr key={i} className="hover:bg-slate-50/80 transition-all cursor-pointer group">
                                    <td className="px-6 py-4 text-xs font-bold text-slate-500 font-mono">{row.time}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                                                <img src={`https://picsum.photos/32/32?random=${i}`} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{row.name}</p>
                                                <p className="text-[10px] font-mono text-slate-400">ID: #P-102{i}</p>
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
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wide bg-${row.statusColor}-50 text-${row.statusColor}-600 border border-${row.statusColor}-100`}>{row.status}</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                                            <span className="material-symbols-outlined text-4xl opacity-20">event_busy</span>
                                            <p className="text-sm font-medium">Nenhum agendamento neste período.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Quick Actions & Calendar */}
                <div className="flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-white to-slate-50 border border-white/20 rounded-2xl shadow-sm p-5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <span className="material-symbols-outlined text-6xl">bolt</span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 relative z-10">Ações Rápidas</h3>
                        <div className="flex flex-col gap-3 relative z-10">
                            <button onClick={openModal} className="w-full flex items-center justify-center gap-2 bg-[#617FA3] hover:bg-[#4A6280] text-white rounded-xl py-3 px-4 font-bold text-sm shadow-lg shadow-[#617FA3]/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                <span className="material-symbols-outlined text-[20px]">add</span> Novo Agendamento
                            </button>
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={() => setPage('patients')} className="flex flex-col items-center justify-center gap-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 hover:border-[#617FA3]/50 rounded-xl py-4 px-2 transition-all hover:shadow-md">
                                    <span className="material-symbols-outlined text-[#617FA3] text-[24px]">person_add</span>
                                    <span className="text-xs font-bold">Paciente</span>
                                </button>
                                <button onClick={() => setPage('financials')} className="flex flex-col items-center justify-center gap-1 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 hover:border-[#617FA3]/50 rounded-xl py-4 px-2 transition-all hover:shadow-md">
                                    <span className="material-symbols-outlined text-[#617FA3] text-[24px]">receipt_long</span>
                                    <span className="text-xs font-bold">Fatura</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm p-0 flex-1 flex flex-col">
                        <div className="flex items-center justify-between p-5 border-b border-slate-100/50">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Lembretes Inteligentes</h3>
                            <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">{reminders.length}</span>
                        </div>
                        <div className="p-3 space-y-2">
                            {reminders.map(rem => (
                                <div key={rem.id} onClick={() => removeReminder(rem.id)} title="Clique para concluir" className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-[#617FA3] hover:shadow-md transition-all cursor-pointer group">
                                    <div className="size-10 rounded-xl flex items-center justify-center shrink-0 transition-colors bg-slate-50 text-slate-400 group-hover:bg-[#617FA3] group-hover:text-white">
                                        <span className="material-symbols-outlined text-[20px] group-hover:hidden">{rem.icon}</span>
                                        <span className="material-symbols-outlined text-[20px] hidden group-hover:block">check</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800 group-hover:text-slate-500 group-hover:line-through transition-all">{rem.text}</p>
                                        <p className="text-[11px] text-slate-400 font-medium">{rem.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {reminders.length === 0 && (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-6 opacity-50">
                                <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
                                <p className="text-xs font-medium">Tudo limpo por aqui!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

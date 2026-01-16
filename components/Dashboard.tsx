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

export default Dashboard;

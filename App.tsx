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
  branding: {
    primaryColor: string; // Hex for primary
    primaryDark: string;
    primaryLight: string;
    logoIcon: string;
    font: 'manrope' | 'public';
  };
}

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

// --- Mock Data ---

const tenants: Record<string, TenantConfig> = {
  'clinic_1': {
    clinic_id: 'clinic_1',
    name: 'Dental Care',
    subdomain: 'dental-care',
    branding: {
      primaryColor: '#0b8593', // Teal
      primaryDark: '#086f7b',
      primaryLight: '#e0f2f1',
      logoIcon: 'dentistry',
      font: 'manrope'
    }
  },
  'clinic_2': {
    clinic_id: 'clinic_2',
    name: 'DentalCloud',
    subdomain: 'dental-cloud',
    branding: {
      primaryColor: '#2997db', // Blue
      primaryDark: '#1e70a3',
      primaryLight: '#e1f5fe',
      logoIcon: 'medical_services',
      font: 'public'
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

// 1. Sidebar Component
const Sidebar = ({
  tenant,
  activePage,
  setPage
}: {
  tenant: TenantConfig;
  activePage: string;
  setPage: (p: string) => void
}) => {
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

      {/* Pro Plan Widget */}
      {/* Pro Plan Widget */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-900 rounded-xl p-4 flex flex-col gap-4 relative overflow-hidden group">

          <div className="flex flex-col gap-1 z-10">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-[2px] bg-primary"></div>
              <span className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Developed By</span>
            </div>
            <div className="flex items-center gap-2">
              <img src="/logo-vilela.png" alt="Vilela CodeLab" className="h-8 w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <p className="text-[10px] text-slate-500">Sua licença expira em <span className="text-white font-bold">12 dias</span>.</p>
            <button onClick={handleRenew} className="text-[10px] font-bold text-primary hover:text-white transition-colors text-left mt-1 flex items-center gap-1">
              Renovar Agora <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
            </button>
          </div>

          {/* Abstract BG Shape */}
          <div className="absolute -right-6 -bottom-6 size-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
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

        {/* Left: Form */}
        <div className="flex-1 flex flex-col p-8 overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Novo Agendamento</h2>
              <p className="text-slate-500 text-sm">Preencha os detalhes para agendar uma visita.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Paciente</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                <input
                  type="text"
                  placeholder="Buscar por nome, ID ou telefone..."
                  value={formData.patient}
                  onChange={e => setFormData({ ...formData, patient: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Selecionar Dentista</label>
                <select
                  value={formData.doctor}
                  onChange={e => setFormData({ ...formData, doctor: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option>Dr. Sarah Smith</option>
                  <option>Dr. Ray</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Tipo de Procedimento</label>
                <select
                  value={formData.procedure}
                  onChange={e => setFormData({ ...formData, procedure: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option>Limpeza Regular</option>
                  <option>Canal</option>
                  <option>Clareamento</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Data</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-600"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Horário</label>
                <select
                  value={formData.time}
                  onChange={e => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                >
                  <option>10:30 AM</option>
                  <option>11:00 AM</option>
                  <option>11:30 AM</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Notas do Agendamento</label>
              <textarea className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none h-24 resize-none" placeholder="Adicione requisitos específicos..."></textarea>
            </div>
          </div>

          <div className="mt-auto pt-6 flex justify-end gap-3">
            <button onClick={onClose} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
            <button onClick={handleSave} className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">Confirmar Agendamento</button>
          </div>
        </div>

        {/* Right: Availability Preview */}
        <div className="w-full md:w-[350px] bg-slate-50 border-l border-slate-200 p-6 flex flex-col">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Prévia de Disponibilidade</h3>

          <div className="flex items-center gap-4 mb-6">
            <img src="https://picsum.photos/100/100?random=1" alt="Dr" className="size-14 rounded-full object-cover border-2 border-white shadow-sm" />
            <div>
              <h4 className="font-bold text-slate-900">{formData.doctor}</h4>
              <p className="text-primary text-sm font-medium">Ortodontista</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto pr-2">
            <div className="flex gap-3 opacity-50">
              <span className="text-xs font-bold text-slate-400 pt-3 w-14">09:00 AM</span>
              <div className="flex-1 bg-slate-200 rounded-lg p-3">
                <span className="text-xs font-bold text-slate-500 uppercase">Ocupado</span>
                <p className="text-xs text-slate-400">Check-up Regular</p>
              </div>
            </div>

            <div className="flex gap-3 relative">
              <div className="absolute left-[-10px] top-6 w-1 h-1 bg-primary rounded-full"></div>
              <span className="text-xs font-bold text-primary pt-3 w-14">10:30 AM</span>
              <div className="flex-1 bg-white border-2 border-primary rounded-lg p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-xs font-bold text-primary uppercase">Selecionado</span>
                </div>
                <p className="text-xs text-slate-700">Reserva de Horário (30m)</p>
              </div>
            </div>

            <div className="flex gap-3 cursor-pointer group">
              <span className="text-xs font-bold text-slate-400 pt-3 w-14 group-hover:text-primary">11:00 AM</span>
              <div className="flex-1 bg-white border border-dashed border-slate-300 rounded-lg p-3 hover:border-primary hover:bg-primary/5 transition-colors">
                <span className="text-xs font-bold text-emerald-600 uppercase">Disponível</span>
              </div>
            </div>
          </div>
        </div>
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
              {reminders.length > 0 ? reminders.map((rem) => (
                <div key={rem.id} onClick={() => removeReminder(rem.id)} title="Clique para concluir" className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer group">
                  <div className={`size-8 rounded-full bg-${rem.color}-100 text-${rem.color}-600 flex items-center justify-center shrink-0 group-hover:bg-green-100 group-hover:text-green-600 transition-colors`}>
                    <span className="material-symbols-outlined text-[16px] group-hover:hidden">{rem.icon}</span>
                    <span className="material-symbols-outlined text-[16px] hidden group-hover:block">check</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 group-hover:text-slate-500 group-hover:line-through transition-all">{rem.text}</p>
                    <p className="text-xs text-slate-500}>{rem.sub}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center text-slate-400 text-xs py-4">
                    <span className="material-symbols-outlined text-3xl mb-1 block">thumb_up</span>
                    Tudo limpo por aqui!
                  </div>
              )}
                </div>
          </div>
          </div>
        </div>
      </div>
      );
};

      // Schedule View
      const ScheduleView = ({openModal}: {openModal: () => void }) => {
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

      const formattedDate = date.toLocaleDateString('pt-BR', {day: '2-digit', month: 'short', year: 'numeric' });

      return (
      <div className="h-full flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 rounded-lg p-1">
              <button onClick={handlePrev} className="p-1 hover:bg-white rounded shadow-sm"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
              <span className="px-3 text-sm font-bold flex items-center capitalize">{formattedDate}</span>
              <button onClick={handleNext} className="p-1 hover:bg-white rounded shadow-sm"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
            </div>
            <div className="flex gap-1">
              <button onClick={() => setViewMode('day')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${viewMode === 'day' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-600'}`}>Dia</button>
              <button onClick={() => setViewMode('week')} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${viewMode === 'week' ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-600'}`}>Semana</button>
            </div>
          </div>
          <button onClick={openModal} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
            <span className="material-symbols-outlined text-[18px]">add</span> Novo Agendamento
          </button>
        </div>

        {/* Grid Header */}
        <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] border-b border-slate-200 bg-slate-50">
          <div className="p-3 border-r border-slate-200 text-[10px] font-bold text-slate-400 flex items-end justify-center">HORA</div>
          {[
            { name: 'Dr. Ray', chair: 'Cadeira 1', color: 'blue' },
            { name: 'Dr. Lee', chair: 'Cadeira 2', color: 'purple' },
            { name: 'Higienista', chair: 'Cadeira 3', color: 'orange' },
            { name: 'Não atribuído', chair: 'Cadeira 4', color: 'gray' },
          ].map((col, i) => (
            <div key={i} className="p-3 border-r border-slate-200 last:border-r-0">
              <div className="flex items-center gap-2 mb-1">
                <div className={`size-2 rounded-full bg-${col.color}-500`}></div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{col.chair}</span>
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
            <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] h-[1000px]">
              {/* Times */}
              <div className="border-r border-slate-200 bg-slate-50/50 flex flex-col text-right pr-2 pt-2 gap-[85px] text-xs font-medium text-slate-400">
                {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'].map(t => (
                  <div key={t} className="h-6">{t}</div>
                ))}
              </div>

              {/* Columns */}
              {[0, 1, 2, 3].map((colIdx) => (
                <div key={colIdx} className="border-r border-slate-200 relative" onClick={() => {
                  // Easter egg interaction
                  if (colIdx === 3) alert('Cadeira não atribuída. Clique em Novo Agendamento para adicionar.');
                }}>
                  {/* Horizontal Lines */}
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="h-[100px] border-b border-slate-100 w-full"></div>
                  ))}

                  {/* Appointments (Mocked absolutely) */}
                  {colIdx === 0 && (
                    <>
                      <div onClick={(e) => { e.stopPropagation(); alert('Detalhes de Martha Stuart'); }} className="absolute top-[100px] left-1 right-2 h-[100px] bg-red-50 border-l-4 border-red-500 rounded p-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow hover:brightness-95">
                        <p className="text-xs font-bold text-slate-900">Martha Stuart</p>
                        <p className="text-[10px] text-red-600">Canal</p>
                        <span className="text-[10px] text-slate-400 mt-2 block">09:00 - 10:00</span>
                      </div>
                      <div onClick={(e) => { e.stopPropagation(); alert('Detalhes de John Doe'); }} className="absolute top-[350px] left-1 right-2 h-[50px] bg-teal-50 border-l-4 border-teal-500 rounded p-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow hover:brightness-95">
                        <p className="text-xs font-bold text-slate-900">John Doe</p>
                        <p className="text-[10px] text-teal-600">Consulta</p>
                      </div>
                    </>
                  )}
                  {colIdx === 1 && (
                    <div className="absolute top-0 w-full h-[100px] bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAD9JREFUKFNjZGBg0GZAABYgFgViCJ+BAU4C4u+A+D82MVA+I5I4I5I4TA5YjQO6QmR1eD2CVY0DNEJkdXg9AgC8AAwLG+u5EAAAAABJRU5ErkJggg==')] opacity-20 flex items-center justify-center">
                      <span className="bg-white px-2 py-1 text-[10px] font-bold border border-slate-200 rounded">BLOQUEADO</span>
                    </div>
                  )}
                  {colIdx === 2 && (
                    <div onClick={(e) => { e.stopPropagation(); alert('Detalhes de Esther Howard'); }} className="absolute top-[50px] left-1 right-2 h-[75px] bg-emerald-50 border-l-4 border-emerald-500 rounded p-2 shadow-sm cursor-pointer hover:shadow-md transition-shadow hover:brightness-95">
                      <p className="text-xs font-bold text-slate-900">Esther Howard</p>
                      <p className="text-[10px] text-emerald-600">Limpeza</p>
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
      )
}

      // Patient Record (Odontogram)

      // A simplified Tooth component using SVG
      const Tooth: React.FC<{ num: number; top?: boolean; condition?: string; onClick?: () => void }> = ({num, top, condition, onClick}) => (
      <div onClick={onClick} className={`flex flex-col items-center gap-1 cursor-pointer group w-8`}>
        {!top && <span className="text-[10px] font-bold text-slate-400 group-hover:text-primary">{num}</span>}
        <div className={`relative w-full h-10 bg-white border ${condition ? 'border-2 border-' + (condition === 'Cárie' ? 'red-500' : condition === 'Coroa' ? 'yellow-400' : 'blue-500') : 'border-slate-300'} ${top ? 'rounded-b-lg' : 'rounded-t-lg'} hover:border-primary transition-colors overflow-hidden`}>
          {/* Simulate conditions */}
          {condition === 'Cárie' && <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center"><div className="size-2 bg-red-500 rounded-full"></div></div>}
          {condition === 'Coroa' && <div className="absolute inset-0 border-2 border-yellow-400 bg-yellow-100/50"></div>}
          {condition === 'Restauração' && <div className="absolute inset-0 bg-blue-500/10"><div className="w-full h-1/2 bg-blue-500/30"></div></div>}
          {condition === 'Ausente' && <div className="absolute inset-0 flex items-center justify-center"><span className="material-symbols-outlined text-slate-300 text-lg">close</span></div>}

          {/* Default seeds for demo if no interaction yet */}
          {!condition && num === 3 && <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center"><div className="size-2 bg-red-500 rounded-full"></div></div>}
          {!condition && num === 30 && <div className="absolute inset-0 border-2 border-yellow-400 bg-yellow-100/50"></div>}
          {!condition && num === 18 && <div className="absolute inset-0 flex items-center justify-center"><span className="material-symbols-outlined text-slate-300 text-lg">close</span></div>}
        </div>
        {top && <span className="text-[10px] font-bold text-slate-400 group-hover:text-primary">{num}</span>}
      </div>
      );

const PatientRecord = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
      const [toothConditions, setToothConditions] = useState<Record<number, string>>({ });
        const [zoom, setZoom] = useState(1);
        const [history, setHistory] = useState([
        {date: '01 Nov, 2023', tooth: 30, proc: 'Coroa - Porcelana sobre Metal', status: 'Em Andamento', color: 'yellow' },
        {date: '12 Out, 2023', tooth: 14, proc: 'Resina Composta', status: 'Concluído', color: 'teal' },
        ]);

  const handleToothClick = (num: number) => {
    if (selectedTool) {
          setToothConditions(prev => ({
            ...prev,
            [num]: selectedTool
          }));
    } else {
          alert(`Dente ${num} selecionado. Selecione uma condição à direita para aplicar.`);
    }
  };

  const addHistory = () => {
    const newRecord = {
          date: new Date().toLocaleDateString('pt-BR', {day: '2-digit', month: 'short', year: 'numeric' }),
        tooth: Math.floor(Math.random() * 32) + 1,
        proc: 'Consulta de Rotina',
        status: 'Pendente',
        color: 'blue'
    };
        setHistory([newRecord, ...history]);
  };

        return (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-teal-400 to-primary"></div>
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <img src="https://picsum.photos/100/100?random=20" className="size-20 rounded-full border-4 border-slate-50" alt="Patient" />
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-slate-900">Sarah Jenkins</h1>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded">#99281</span>
                  </div>
                  <div className="flex gap-4 text-sm text-slate-500 mt-1">
                    <span>34 Anos</span>
                    <span>(555) 123-4567</span>
                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">event</span> Último: 12 Out</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-100">
                  <span className="material-symbols-outlined text-sm">warning</span> Alergia a Penicilina
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Odontogram */}
            <div className="lg:col-span-9 bg-white p-6 rounded-xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 z-10 relative">
                <h3 className="font-bold text-slate-900">Odontograma {selectedTool && <span className="text-primary text-sm font-normal">- Ferramenta: {selectedTool}</span>}</h3>
                <div className="flex gap-2">
                  <button onClick={() => setZoom(z => z === 1 ? 1.2 : 1)} className={`p-1.5 hover:bg-slate-50 rounded border transition-all ${zoom > 1 ? 'border-primary text-primary bg-primary/5' : 'border-slate-200'}`}><span className="material-symbols-outlined text-sm">zoom_in</span></button>
                  <button onClick={() => window.print()} className="p-1.5 hover:bg-slate-50 rounded border border-slate-200"><span className="material-symbols-outlined text-sm">print</span></button>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center gap-12 px-8 transition-transform duration-300 origin-center" style={{ transform: `scale(${zoom})` }}>
                {/* Maxilla */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-2 sm:gap-4">
                    {/* 1-16 */}
                    {Array.from({ length: 16 }, (_, i) => i + 1).map(n => (
                      <Tooth key={n} num={n} top condition={toothConditions[n]} onClick={() => handleToothClick(n)} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Maxilar</span>
                </div>

                {/* Mandible */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Mandíbula</span>
                  <div className="flex gap-2 sm:gap-4">
                    {/* 32-17 */}
                    {Array.from({ length: 16 }, (_, i) => 32 - i).map(n => (
                      <Tooth key={n} num={n} condition={toothConditions[n]} onClick={() => handleToothClick(n)} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Palette */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase">Condições</h4>
                  <button onClick={() => setSelectedTool(null)} className="text-xs text-slate-400 hover:text-red-500 font-bold">Limpar</button>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Cárie', color: 'red-500' },
                    { name: 'Restauração', color: 'blue-500' },
                    { name: 'Coroa', color: 'yellow-400' },
                    { name: 'Ausente', color: 'slate-300' }
                  ].map((c, i) => (
                    <button key={i} onClick={() => setSelectedTool(c.name)} className={`w-full flex items-center gap-3 p-2 rounded transition-colors text-left ${selectedTool === c.name ? 'bg-primary/10 ring-2 ring-primary/20' : 'hover:bg-slate-50'}`}>
                      <div className={`size-4 rounded bg-${c.color}`}></div>
                      <span className={`text-sm font-medium ${selectedTool === c.name ? 'text-primary font-bold' : 'text-slate-700'}`}>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Treatment History Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between">
              <h3 className="font-bold text-slate-800">Histórico de Tratamento</h3>
              <button onClick={addHistory} className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"><span className="material-symbols-outlined text-sm">add</span> Adicionar Registro</button>
            </div>
            <table className="w-full text-left">
              <thead className="border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase">Data</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase">Dente</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase">Procedimento</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((row, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 text-sm">{row.date}</td>
                    <td className="px-6 py-4 font-bold">{row.tooth}</td>
                    <td className="px-6 py-4 text-sm">{row.proc}</td>
                    <td className="px-6 py-4"><span className={`bg-${row.color}-100 text-${row.color}-800 text-xs font-bold px-2 py-0.5 rounded`}>{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        );
};

// Financials View
const FinancialsView = () => {
  const [range, setRange] = useState<'6M' | '1A'>('6M');

        // Mock data switching
        const currentData = range === '6M' ? financialData : [
        {name: 'Jan', income: 18000, expenses: 14000 },
        {name: 'Fev', income: 22000, expenses: 16000 },
        {name: 'Mar', income: 25000, expenses: 15500 },
        {name: 'Abr', income: 21000, expenses: 13000 },
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
                <div className="bg-slate-100 p-1 rounded-lg flex text-xs font-bold">
                  <button onClick={() => setRange('6M')} className={`px-3 py-1 rounded shadow-sm ${range === '6M' ? 'bg-white text-slate-900' : 'text-slate-500'}`}>6M</button>
                  <button onClick={() => setRange('1A')} className={`px-3 py-1 rounded shadow-sm ${range === '1A' ? 'bg-white text-slate-900' : 'text-slate-500'}`}>1A</button>
                </div>
              </div>
              <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={currentData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0b8593" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#0b8593" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Area type="monotone" dataKey="income" stroke="#0b8593" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pending Bills */}
            <div className="flex flex-col gap-4">
              <button onClick={generateReport} className="w-full bg-primary hover:opacity-90 text-white h-14 rounded-lg font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">description</span> Gerar Relatório
              </button>

              <div className="flex-1 bg-white border border-slate-200 rounded-lg shadow-sm p-5 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">Contas Pendentes</h3>
                  <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-1 rounded-full">3 ATRASADAS</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-red-100 bg-red-50/50">
                    <div className="bg-white size-10 rounded flex items-center justify-center text-red-500 shrink-0 border border-red-100"><span className="material-symbols-outlined">warning</span></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">Taxa Laboratorial - Biotech</p>
                      <p className="text-red-600 text-xs font-semibold">Atraso de 2 dias</p>
                    </div>
                    <p className="font-bold text-sm">R$ 350,00</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                    <div className="bg-white size-10 rounded flex items-center justify-center text-slate-400 shrink-0 border border-slate-100"><span className="material-symbols-outlined">real_estate_agent</span></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">Aluguel Consultório</p>
                      <p className="text-slate-500 text-xs">Vence 30 Out</p>
                    </div>
                    <p className="font-bold text-sm">R$ 2.000,00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-lg">Transações Recentes</h3>
              <div className="relative">
                <span className="absolute left-2 top-1.5 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                <input type="text" placeholder="Buscar..." className="pl-9 pr-4 py-1.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-48" />
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Data</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Entidade</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Categoria</th>
                  <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium">24 Out</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">JD</div>
                    <span className="text-sm font-medium">John Doe</span>
                  </td>
                  <td className="px-6 py-4"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded">Consulta</span></td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">+R$ 150,00</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium">23 Out</td>
                  <td className="px-6 py-4 flex items-center gap-3">
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
        );
};


        // 4. Main App Container
        export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
        const [isModalOpen, setIsModalOpen] = useState(false);
        const [sidebarOpen, setSidebarOpen] = useState(false);

        // Simulation of loading a specific tenant based on URL or Login
        // Try changing this to 'clinic_2' to see blue theme and 'DentalCloud' name
        const [activeTenant, setActiveTenant] = useState<TenantConfig>(tenants['clinic_1']);

  // Apply Tenant Theme Variables
  useEffect(() => {
    const root = document.documentElement;
          root.style.setProperty('--color-primary', activeTenant.branding.primaryColor);
          root.style.setProperty('--color-primary-dark', activeTenant.branding.primaryDark);
          root.style.setProperty('--color-primary-light', activeTenant.branding.primaryLight);

          // Set font class on body
          document.body.className = activeTenant.branding.font === 'manrope' ? 'font-manrope' : 'font-public';
  }, [activeTenant]);

          return (
          <div className="flex h-screen bg-slate-50 text-slate-900">
            {/* Sidebar Navigation */}
            <div className={`fixed inset-0 z-20 bg-slate-900/50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
            <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              <Sidebar tenant={activeTenant} activePage={activePage} setPage={(p) => { setActivePage(p); setSidebarOpen(false); }} />
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
                  {activePage === 'schedule' && <ScheduleView openModal={() => setIsModalOpen(true)} />}
                  {activePage === 'patients' && <PatientRecord />}
                  {activePage === 'financials' && <FinancialsView />}
                  {/* Other pages placeholders */}
                  {(activePage === 'inventory' || activePage === 'settings') && (
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
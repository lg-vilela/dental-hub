import React, { useState, useEffect } from 'react';
import { TenantConfig } from '../types';
import { appointmentService, Appointment } from '../src/services/appointmentService';
import { supabase } from '../src/lib/supabase';
import NewAppointmentModal from './NewAppointmentModal';
import EditAppointmentModal from './EditAppointmentModal';

interface ScheduleViewProps {
    tenant: TenantConfig;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ tenant }) => {
    const [date, setDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [dentists, setDentists] = useState<any[]>([]); // Profiles
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const fetchData = async () => {
        setLoading(true);
        // 1. Fetch Dentists (Profiles)
        // Ideally filter by role='dentist' but checking clinic_id is good enough for now
        const { data: profs } = await supabase.from('profiles').select('*').eq('clinic_id', tenant.id); // Assuming tenant.id matches clinic from context, actually we should use AuthContext logic but tenant here might be just config.
        // Wait, 'tenant' prop is TenantConfig (mock data maybe?).
        // Use useAuth logic? user.clinic_id?
        // Let's rely on tenant prop being correct OR better, update to useAuth inside component if tenant prop is legacy.
        // Looking at App.tsx, tenant depends on tenant selection. But we are in "Single Tenant" mode effectively with Supabase.
        // Let's fetch based on the 'profiles' using RLS.

        // Actually simplest: just fetch profiles. RLS filters by my clinic.
        const { data: myProfs } = await supabase.from('profiles').select('*');
        if (myProfs) setDentists(myProfs);

        // 2. Fetch Appointments
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        try {
            const data = await appointmentService.getAppointments(start, end);
            setAppointments(data);
        } catch (e) {
            console.error("Error fetching appointments:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [date]);

    // ... Date Nav Handlers ...
    const handlePrev = () => { const d = new Date(date); d.setDate(date.getDate() - 1); setDate(d); };
    const handleNext = () => { const d = new Date(date); d.setDate(date.getDate() + 1); setDate(d); };

    const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

    // Generate Time Slots
    const generateSlots = () => {
        const slots = [];
        const [startHour, startMin] = tenant.settings.openingTime.split(':').map(Number);
        const [endHour, endMin] = tenant.settings.closingTime.split(':').map(Number);
        const duration = tenant.settings.slotDuration;
        let current = new Date(); current.setHours(startHour, startMin, 0, 0);
        const end = new Date(); end.setHours(endHour, endMin, 0, 0);
        while (current < end) {
            slots.push(current.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
            current.setMinutes(current.getMinutes() + duration);
        }
        return slots;
    };
    const timeSlots = generateSlots();
    const slotHeight = 96; // px

    const getPosition = (timeStr: string) => {
        const [h, m] = timeStr.split(':').map(Number);
        const [startH, startM] = tenant.settings.openingTime.split(':').map(Number);
        const minutesFromStart = (h * 60 + m) - (startH * 60 + startM);
        return minutesFromStart * (slotHeight / tenant.settings.slotDuration);
    };

    return (
        <div className="h-full flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrev} className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
                        <h2 className="text-lg font-bold text-slate-900 capitalize min-w-[120px] text-center">{formattedDate}</h2>
                        <button onClick={handleNext} className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
                    </div>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-md shadow-primary/20">
                    <span className="material-symbols-outlined text-[18px]">add</span> Novo Agendamento
                </button>
            </div>

            {/* Grid Header */}
            <div className="grid border-b border-slate-200 bg-slate-50" style={{ gridTemplateColumns: `60px repeat(${dentists.length || 1}, 1fr)` }}>
                <div className="p-3 border-r border-slate-200 text-center"><span className="material-symbols-outlined text-slate-400">schedule</span></div>
                {dentists.length > 0 ? dentists.map(d => (
                    <div key={d.id} className="p-3 border-r border-slate-200 text-center text-sm font-bold text-slate-900 truncate">
                        {d.full_name || d.email}
                    </div>
                )) : (
                    <div className="p-3 text-center text-slate-400 italic">Nenhum profissional cadastrado</div>
                )}
            </div>

            {/* Grid Body */}
            <div className="flex-1 overflow-y-auto relative">
                <div className="grid min-h-full" style={{ gridTemplateColumns: `60px repeat(${dentists.length || 1}, 1fr)` }}>
                    {/* Time Column */}
                    <div className="border-r border-slate-200 bg-slate-50/50 flex flex-col text-right pr-2 pt-2 text-xs font-medium text-slate-400">
                        {timeSlots.map((t, i) => (
                            <div key={i} className="h-24 border-b border-transparent relative"><span className="-mt-3 block text-[10px]">{t}</span></div>
                        ))}
                    </div>

                    {/* Dentist Columns */}
                    {dentists.map((dentist, colIdx) => (
                        <div key={dentist.id} className="border-r border-slate-200 relative">
                            {/* Grid Lines */}
                            {timeSlots.map((_, i) => (
                                <div key={i} className="absolute w-full h-px bg-slate-100" style={{ top: `${i * slotHeight}px` }}></div>
                            ))}

                            {/* Appointments */}
                            {appointments
                                .filter(apt => apt.dentist_id === dentist.id)
                                .map(apt => {
                                    const top = getPosition(new Date(apt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
                                    const durationMins = (new Date(apt.end_time).getTime() - new Date(apt.start_time).getTime()) / 60000;
                                    const height = durationMins * (slotHeight / tenant.settings.slotDuration);

                                    // Status Colors
                                    const colors = {
                                        'scheduled': 'bg-blue-50 border-blue-500 text-blue-700',
                                        'confirmed': 'bg-green-50 border-green-500 text-green-700',
                                        'completed': 'bg-slate-100 border-slate-500 text-slate-700',
                                        'canceled': 'bg-red-50 border-red-500 text-red-700 opacity-60',
                                        'no-show': 'bg-amber-50 border-amber-500 text-amber-700'
                                    };

                                    return (
                                        <div
                                            key={apt.id}
                                            style={{ top: `${top}px`, height: `${height}px` }}
                                            className={`absolute left-1 right-1 border-l-4 rounded p-2 text-xs cursor-pointer hover:brightness-95 z-10 overflow-hidden shadow-sm transition-all ${colors[apt.status] || colors['scheduled']}`}
                                            title={apt.notes}
                                            onClick={() => setSelectedAppointment(apt)}
                                        >
                                            <div className="font-bold truncate">{apt.patients?.full_name}</div>
                                            <div className="text-[10px] opacity-80 truncate">{new Date(apt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - {apt.status}</div>
                                        </div>
                                    );
                                })}
                        </div>
                    ))}

                    {dentists.length === 0 && <div className="bg-slate-50/20"></div>}
                </div>
            </div>

            <NewAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
            />

            <EditAppointmentModal
                appointment={selectedAppointment}
                onClose={() => setSelectedAppointment(null)}
                onSuccess={fetchData}
            />
        </div>
    );
};

export default ScheduleView;

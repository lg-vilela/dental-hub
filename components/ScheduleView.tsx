import React, { useState, useEffect } from 'react';
import { TenantConfig } from '../types';
// Actually types is likely in src/types based on usage. The file was in components/ScheduleView.tsx so `../src/types` or `../types` depending on structure.
// Let's assume `../src/types` is safer if components is in root.
// Wait, `list_dir` of root showed `components` and `src`. So `../src/types` is correct.

import { appointmentService, Appointment } from '../src/services/appointmentService';
import NewAppointmentModal from './NewAppointmentModal'; // Ensure generic import

interface ScheduleViewProps {
    openModal?: () => void; // Deprecated, we manage modal internally or passed
    tenant: TenantConfig;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ tenant }) => {
    const [date, setDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchAppointments = async () => {
        // Fetch for the whole day
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);

        try {
            const data = await appointmentService.getAppointments(start, end);
            setAppointments(data);
        } catch (e) {
            console.error("Error fetching appointments:", e);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [date]);

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

    const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

    // Helper: Generate Time Slots
    const generateSlots = () => {
        const slots = [];
        const [startHour, startMin] = tenant.settings.openingTime.split(':').map(Number);
        const [endHour, endMin] = tenant.settings.closingTime.split(':').map(Number);
        const duration = tenant.settings.slotDuration;

        let current = new Date();
        current.setHours(startHour, startMin, 0, 0);

        const end = new Date();
        end.setHours(endHour, endMin, 0, 0);

        while (current < end) {
            slots.push(current.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
            current.setMinutes(current.getMinutes() + duration);
        }
        return slots;
    };

    const timeSlots = generateSlots();

    // Helper: Render Appointment on Grid
    // For MVP, we will render ALL in column 0 or try to map 'chairs' if we had them.
    // Let's map by Dentist for columns? 
    // The previous code had "Cadeira 1 (Dr. Smith)", "Cadeira 2 (Dr. Ray)".
    // We can try to map dentist_id to a column index if we fetch dentists.
    // For now, let's put everyone in Column 0 or verify dentist.

    // Simpler: Just render list in col 0 for demo if we don't have explicit dentist mapping yet.
    // Or simpler: Use columns as "Resources" (Chairs).
    // Let's stick to the visual provided: 4 columns.
    // We can hash the `dentist_id` to pick a column 0-3 for visual variety.

    const getColIndex = (id: string) => {
        return id.charCodeAt(0) % 4;
    };

    // Calculate position
    const getPosition = (timeStr: string) => {
        // "10:00" -> logic relative to opening time
        // 96px per slot?
        // Let's assume simple linear mapping for MVP or direct match
        const [h, m] = timeStr.split(':').map(Number);
        const [startH, startM] = tenant.settings.openingTime.split(':').map(Number);

        const minutesFromStart = (h * 60 + m) - (startH * 60 + startM);
        const slotDuration = tenant.settings.slotDuration; // e.g. 30
        const slotHeight = 96; // px height of one "slot" div (h-24 = 6rem = 96px)

        // This is tricky if slots are just text.
        // We rendered slots as h-24.
        // So 30 mins = 96px. 1 min = 3.2px.
        return minutesFromStart * 3.2;
    };

    return (
        <div className="h-full flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <button onClick={() => setViewMode('day')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'day' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Dia</button>
                        <button onClick={() => setViewMode('week')} className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${viewMode === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}>Semana</button>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrev} className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <h2 className="text-lg font-bold text-slate-900 capitalize min-w-[120px] text-center">{formattedDate}</h2>
                        <button onClick={handleNext} className="p-1 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-md shadow-primary/20">
                    <span className="material-symbols-outlined text-[18px]">add</span> Novo Agendamento
                </button>
            </div>

            {/* Grid Header & Body */}
            <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] border-b border-slate-200 bg-slate-50">
                <div className="p-3 border-r border-slate-200 text-center"><span className="material-symbols-outlined text-slate-400">schedule</span></div>
                {['Cadeira 1', 'Cadeira 2', 'Cadeira 3', 'Cadeira 4'].map((name, i) => (
                    <div key={i} className="p-3 border-r border-slate-200 text-center text-sm font-bold text-slate-900">{name}</div>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto relative">
                <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] min-h-full">
                    {/* Time Column */}
                    <div className="border-r border-slate-200 bg-slate-50/50 flex flex-col text-right pr-2 pt-2 text-xs font-medium text-slate-400">
                        {timeSlots.map((t, i) => (
                            <div key={i} className="h-24 border-b border-transparent relative"><span className="-mt-3 block text-[10px]">{t}</span></div>
                        ))}
                    </div>

                    {/* Appointment Columns */}
                    {[0, 1, 2, 3].map(colIdx => (
                        <div key={colIdx} className="border-r border-slate-200 relative">
                            {/* Guides */}
                            {timeSlots.map((_, i) => (
                                <div key={i} className="absolute w-full h-px bg-slate-100" style={{ top: `${i * 96}px` }}></div>
                            ))}

                            {/* Events */}
                            {appointments
                                .filter(apt => (apt.dentist_id ? getColIndex(apt.dentist_id) : 0) === colIdx)
                                .map(apt => {
                                    // Calculate Top based on time
                                    const time = new Date(apt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                                    const top = getPosition(time);
                                    const startTime = new Date(apt.start_time);
                                    const endTime = new Date(apt.end_time);
                                    const durationMins = (endTime.getTime() - startTime.getTime()) / 60000;
                                    const height = durationMins * 3.2;

                                    return (
                                        <div
                                            key={apt.id}
                                            style={{ top: `${top}px`, height: `${height}px` }}
                                            className="absolute left-1 right-1 bg-blue-50 border-l-4 border-blue-500 rounded p-2 text-xs cursor-pointer hover:brightness-95 z-10 overflow-hidden"
                                            title={apt.notes}
                                        >
                                            <p className="font-bold text-blue-700 truncate">{apt.patients?.full_name}</p>
                                            <p className="text-[10px] text-blue-600 truncate">{apt.status}</p>
                                        </div>
                                    );
                                })}
                        </div>
                    ))}
                </div>
            </div>

            <NewAppointmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchAppointments}
            />
        </div>
    );
};

export default ScheduleView;

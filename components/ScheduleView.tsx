import React, { useState } from 'react';
import { TenantConfig } from '../types';

interface ScheduleViewProps {
    openModal: () => void;
    tenant: TenantConfig;
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ openModal, tenant }) => {
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
                <button onClick={openModal} className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-md shadow-primary/20">
                    <span className="material-symbols-outlined text-[18px]">add</span> Novo Agendamento
                </button>
            </div>

            {/* Grid Header */}
            <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] border-b border-slate-200 bg-slate-50">
                <div className="p-3 border-r border-slate-200 text-center">
                    <span className="material-symbols-outlined text-slate-400">schedule</span>
                </div>
                {[
                    { name: 'Cadeira 1', doc: 'Dr. Smith' },
                    { name: 'Cadeira 2', doc: 'Dr. Ray' },
                    { name: 'Cadeira 3 (Cirurgia)', doc: 'Dra. Lee' },
                    { name: 'Higienização', doc: 'Sarah J.' }
                ].map((col, i) => (
                    <div key={i} className="p-3 border-r border-slate-200 text-center last:border-r-0">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <div className={`size-2 rounded-full ${i === 0 || i === 2 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{col.doc}</span>
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
                    <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr] min-h-full">
                        {/* Times */}
                        <div className="border-r border-slate-200 bg-slate-50/50 flex flex-col text-right pr-2 pt-2 text-xs font-medium text-slate-400" >
                            {timeSlots.map((t, i) => (
                                <div key={i} className="h-24 border-b border-transparent relative group">
                                    <span className="-mt-3 block text-[10px]">{t}</span>
                                </div>
                            ))}
                        </div>

                        {/* Columns */}
                        {[0, 1, 2, 3].map((colIdx) => (
                            <div key={colIdx} className="border-r border-slate-200 relative" onClick={() => {
                                // Easter egg interaction
                                if (colIdx === 3) alert('Cadeira não atribuída. Clique em Novo Agendamento para adicionar.');
                            }}>
                                {/* Horizontal guides (dynamic) */}
                                {timeSlots.map((_, i) => (
                                    <div key={i} className="absolute w-full h-px bg-slate-100" style={{ top: `${i * 96}px` }}></div>
                                ))}

                                {/* Mock Appointments (Fixed positions for demo, would be dynamic in real app) */}
                                {colIdx === 0 && (
                                    <>
                                        <div onClick={(e) => { e.stopPropagation(); alert('Consulta: Sarah Conner - Canal'); }} className="absolute top-[110px] left-1 right-1 h-[90px] bg-blue-50 border-l-4 border-blue-500 rounded p-2 cursor-pointer hover:brightness-95 transition-all z-10 group">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-xs font-bold text-blue-700">Sarah Conner</p>
                                                    <p className="text-[10px] text-blue-600">Canal (Endo)</p>
                                                </div>
                                                <button onClick={(e) => { e.stopPropagation(); alert('Enviando lembrete para (11) 99999-9999 via WhatsApp...'); }} className="p-1 hover:bg-blue-100 rounded-full text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" title="Enviar Lembrete WhatsApp">
                                                    <span className="material-symbols-outlined text-[16px]">chat</span>
                                                </button>
                                            </div>
                                            <div className="mt-1 flex gap-1">
                                                <span className="px-1 py-0.5 bg-blue-100/50 rounded text-[9px] text-blue-700 font-bold">Confirmado</span>
                                            </div>
                                        </div>
                                        <div className="absolute top-[320px] left-1 right-1 h-[60px] bg-amber-50 border-l-4 border-amber-500 rounded p-2 cursor-pointer hover:brightness-95 transition-all z-10 group">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-xs font-bold text-amber-700">John Wick</p>
                                                    <p className="text-[10px] text-amber-600">Emergência</p>
                                                </div>
                                                <button onClick={(e) => { e.stopPropagation(); alert('Enviando lembrete para John Wick via WhatsApp...'); }} className="p-1 hover:bg-amber-100 rounded-full text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" title="Enviar Lembrete WhatsApp">
                                                    <span className="material-symbols-outlined text-[16px]">chat</span>
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {colIdx === 2 && (
                                    <div className="absolute top-[220px] left-1 right-1 h-[140px] bg-purple-50 border-l-4 border-purple-500 rounded p-2 cursor-pointer hover:brightness-95 transition-all z-10">
                                        <p className="text-xs font-bold text-purple-700">Cirurgia Complexa</p>
                                        <p className="text-[10px] text-purple-600">Extração Sisos (4x)</p>
                                        <div className="mt-2 flex items-center gap-1 text-purple-700">
                                            <span className="material-symbols-outlined text-[14px]">anesthesia</span>
                                            <span className="text-[10px]">Anestesia Geral</span>
                                        </div>
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
    );
};

export default ScheduleView;

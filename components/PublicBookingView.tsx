import React, { useState, useEffect } from 'react';
import { TenantConfig } from '../types';
import { supabase } from '../src/lib/supabase';
import { Service } from '../src/services/servicesService';
import { useAuth } from '../src/contexts/AuthContext';

// 6. Public Booking Wizard
const PublicBookingView = ({ tenant, onBack }: { tenant: TenantConfig; onBack: () => void }) => {
    const { clinic } = useAuth(); // Use real clinic context if available (Preview Mode)
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [services, setServices] = useState<Service[]>([]);
    const [isLoadingServices, setIsLoadingServices] = useState(true);

    // Booking Form State
    const [patientName, setPatientName] = useState('');
    const [patientPhone, setPatientPhone] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [dayAppointments, setDayAppointments] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadServices();
    }, []);

    useEffect(() => {
        loadDayAvailability();
    }, [selectedDate, clinic, tenant, selectedService]);

    const loadDayAvailability = async () => {
        const targetId = clinic?.id || tenant.clinic_id;
        if (!targetId) return;

        const startOfDay = new Date(selectedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(selectedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const { data } = await supabase
            .from('appointments')
            .select('start_time, end_time')
            .eq('clinic_id', targetId)
            .neq('status', 'canceled')
            .gte('start_time', startOfDay.toISOString())
            .lte('start_time', endOfDay.toISOString());

        if (data) setDayAppointments(data);
    };

    const loadServices = async () => {
        try {
            // Use real ID if available (Preview), otherwise fallback to tenant prop (Public URL)
            const targetId = clinic?.id || tenant.clinic_id;

            const { data } = await supabase
                .from('services')
                .select('*')
                .eq('clinic_id', targetId)
                .eq('active', true)
                .order('title');

            if (data) setServices(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingServices(false);
        }
    };

    // Generate slots based on settings
    const generatePublicSlots = () => {
        const slots = [];
        const [startHour, startMin] = tenant.settings.openingTime.split(':').map(Number);
        const [endHour, endMin] = tenant.settings.closingTime.split(':').map(Number);
        const duration = tenant.settings.slotDuration;

        let current = new Date(selectedDate + 'T00:00:00');
        current.setHours(startHour, startMin, 0, 0);

        const end = new Date(selectedDate + 'T00:00:00');
        end.setHours(endHour, endMin, 0, 0);

        const now = new Date();

        while (current < end) {
            const timeString = current.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            // Check if slot is in the past (only if selectedDate is today)
            const isPast = new Date(selectedDate).toDateString() === now.toDateString() && current < now;

            if (!isPast) {
                slots.push(timeString);
            }

            current.setMinutes(current.getMinutes() + duration);
        }
        return slots;
    };

    const isSlotAvailable = (slotTime: string) => {
        if (!selectedService) return true;

        const [hours, minutes] = slotTime.split(':').map(Number);
        const slotStart = new Date(selectedDate);
        slotStart.setHours(hours, minutes, 0, 0);

        // Calculate expected end time based on service duration
        const slotEnd = new Date(slotStart.getTime() + selectedService.duration_minutes * 60000);

        // Check for overlap with any existing appointment
        return !dayAppointments.some(appt => {
            const apptStart = new Date(appt.start_time);
            const apptEnd = new Date(appt.end_time);

            // Overlap condition: (StartA < EndB) and (EndA > StartB)
            return slotStart < apptEnd && slotEnd > apptStart;
        });
    };

    const slots = generatePublicSlots();

    const handleBooking = async () => {
        if (!patientName || !patientPhone) return alert('Por favor, preencha seus dados.');
        if (!selectedService) return;

        setIsSubmitting(true);
        try {
            const today = new Date(selectedDate);
            const [hours, minutes] = selectedSlot.split(':').map(Number);
            today.setHours(hours, minutes, 0, 0);

            // Use real ID if available
            const targetId = clinic?.id || tenant.clinic_id;

            // Direct Insert: Find/Create Patient
            let patientId = null;
            const { data: existingPatient } = await supabase.from('patients').select('id').eq('clinic_id', targetId).eq('phone', patientPhone).single();

            if (existingPatient) {
                patientId = existingPatient.id;
            } else {
                const { data: newPatient, error: patError } = await supabase.from('patients').insert({
                    clinic_id: targetId,
                    full_name: patientName,
                    phone: patientPhone
                }).select().single();

                if (patError) throw patError;
                patientId = newPatient.id;
            }

            // Create Appointment
            const endTime = new Date(today.getTime() + selectedService.duration_minutes * 60000);

            const { error: apptError } = await supabase.from('appointments').insert({
                clinic_id: targetId,
                patient_id: patientId,
                start_time: today.toISOString(),
                end_time: endTime.toISOString(),
                status: 'scheduled',
                notes: 'Agendamento Agendamento Online via Página Pública'
            });

            if (apptError) throw apptError;

            setStep(5); // Success step
        } catch (error) {
            console.error(error);
            alert(`Erro ao realizar agendamento: ${(error as any).message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-['Manrope'] z-50 fixed inset-0 overflow-y-auto">
            {/* Public Header */}
            <header className="bg-white border-b border-slate-200 py-4 px-6 fixed w-full top-0 z-50">
                <div className="max-w-3xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className="absolute -inset-2 bg-[#617FA3]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <img src="https://i.postimg.cc/ydfbFRrP/logo-vilelacodelab-removebg-preview.png" alt="Dental Hub" className="h-9 w-auto object-contain relative z-10" />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h1 className="font-bold text-slate-900 text-lg leading-none">Dental Hub</h1>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">{tenant.name}</p>
                        </div>
                    </div>
                    <button onClick={onBack} className="text-sm text-slate-400 hover:text-slate-600 underline">
                        Voltar para Admin
                    </button>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 pt-24 pb-12 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Progress Bar */}
                    <div className="flex justify-between mb-8 relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded-full"></div>
                        <div className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className={`size-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors bg-white border-2 ${step >= s ? 'border-green-500 text-green-700 bg-green-50' : 'border-slate-200 text-slate-400'}`}>
                                {step > s ? '✓' : s}
                            </div>
                        ))}
                    </div>

                    {/* Step 1: Services */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-slate-900">Qual serviço você precisa?</h2>
                                <p className="text-slate-500">Selecione o tipo de atendimento.</p>
                            </div>
                            <div className="grid gap-4">
                                {isLoadingServices ? (
                                    <div className="text-center text-slate-400 py-10">Carregando serviços...</div>
                                ) : services.length === 0 ? (
                                    <div className="text-center text-slate-400 py-10">Nenhum serviço disponível no momento.</div>
                                ) : (
                                    services.map((service) => (
                                        <button
                                            key={service.id}
                                            onClick={() => { setSelectedService(service); setStep(2); }}
                                            className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-2xl hover:border-primary hover:shadow-lg hover:shadow-primary/5 transition-all text-left group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <span className="material-symbols-outlined">{service.icon}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900 text-lg">{service.title}</h3>
                                                    <p className="text-slate-500 text-sm">{service.duration_minutes} min</p>
                                                </div>
                                            </div>
                                            <span className="font-bold text-slate-900">
                                                {service.price === 0 ? 'Grátis' : `R$ ${service.price}`}
                                            </span>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Professional (Skipped Logic - Auto Advance) */}
                    {step === 2 && (
                        <div className="text-center animate-in fade-in zoom-in duration-300 py-20">
                            <div className="spinner mb-4 mx-auto size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-slate-500">Buscando disponibilidade...</p>
                            {setTimeout(() => setStep(3), 1000) && null}
                        </div>
                    )}

                    {/* Step 3: Schedule */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-center mb-4">
                                <h2 className="text-2xl font-bold text-slate-900">Escolha o horário</h2>
                                <p className="text-slate-500">Disponibilidade para <strong>{selectedService?.title}</strong>.</p>
                            </div>

                            {/* Date Picker */}
                            <div className="flex justify-center mb-6">
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="px-4 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 focus:border-primary outline-none shadow-sm"
                                />
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {slots.map((slot) => {
                                    const available = isSlotAvailable(slot);
                                    return (
                                        <button
                                            key={slot}
                                            disabled={!available}
                                            onClick={() => { setSelectedSlot(slot); setStep(4); }}
                                            className={`py-3 px-2 border rounded-xl font-bold text-sm transition-all
                                                ${available
                                                    ? 'bg-white border-slate-200 text-slate-600 hover:bg-primary hover:text-white hover:border-primary'
                                                    : 'bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed decoration-slice'
                                                }
                                            `}
                                        >
                                            {slot}
                                        </button>
                                    );
                                })}
                            </div>
                            {slots.length === 0 && <p className="text-center text-slate-400">Nenhum horário disponível para este dia.</p>}
                        </div>
                    )}

                    {/* Step 4: Patient Info */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-md mx-auto">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-slate-900">Seus Dados</h2>
                                <p className="text-slate-500">Para confirmar o agendamento.</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        value={patientName}
                                        onChange={e => setPatientName(e.target.value)}
                                        className="w-full p-4 border border-slate-200 rounded-xl font-medium focus:border-primary outline-none"
                                        placeholder="Seu nome"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Whatsapp</label>
                                    <input
                                        type="tel"
                                        value={patientPhone}
                                        onChange={e => setPatientPhone(e.target.value)}
                                        className="w-full p-4 border border-slate-200 rounded-xl font-medium focus:border-primary outline-none"
                                        placeholder="(00) 00000-0000"
                                    />
                                </div>
                                <button
                                    onClick={handleBooking}
                                    disabled={isSubmitting}
                                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Confirmando...' : 'Confirmar Agendamento'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 5: Success */}
                    {step === 5 && (
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-6 animate-in zoom-in duration-300">
                            <div className="size-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <span className="material-symbols-outlined text-5xl">check</span>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900">Agendado!</h2>
                                <p className="text-slate-500 mt-2">Sua consulta para <strong>{selectedService?.title}</strong> às <strong>{selectedSlot}</strong> foi confirmada.</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-2xl text-left space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Paciente</span>
                                    <span className="font-bold text-slate-900">{patientName}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Clínica</span>
                                    <span className="font-bold text-slate-900">{tenant.name}</span>
                                </div>
                            </div>
                            <button onClick={() => window.location.reload()} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors">
                                Novo Agendamento
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default PublicBookingView;

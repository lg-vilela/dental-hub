import React, { useState, useEffect } from 'react';
import { patientService, Patient } from '../src/services/patientService';
import { appointmentService } from '../src/services/appointmentService';
import { useAuth } from '../src/contexts/AuthContext';
import { supabase } from '../src/lib/supabase';

interface NewAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { clinic, user } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [dentists, setDentists] = useState<any[]>([]); // Profiles
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        patient_id: '',
        dentist_id: user?.id || '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: 30, // minutes
        notes: ''
    });

    useEffect(() => {
        if (isOpen) {
            loadData();
        }
    }, [isOpen]);

    const loadData = async () => {
        try {
            const pts = await patientService.getPatients();
            setPatients(pts);

            // Load Dentists (Profiles in this clinic)
            const { data: profs } = await supabase
                .from('profiles')
                .select('*')
                .eq('clinic_id', clinic?.id);

            if (profs) setDentists(profs);

        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clinic) return;
        setIsLoading(true);

        try {
            const start = new Date(`${formData.date}T${formData.time}`);
            const end = new Date(start.getTime() + formData.duration * 60000);

            await appointmentService.createAppointment({
                clinic_id: clinic.id,
                patient_id: formData.patient_id,
                dentist_id: formData.dentist_id || null, // Fix: Send null if empty string to avoid UUID error
                start_time: start.toISOString(),
                end_time: end.toISOString(),
                status: 'scheduled',
                notes: formData.notes
            });

            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert(`Erro ao agendar: ${(error as any).message || error}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Novo Agendamento</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Paciente</label>
                        <select
                            required
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                            value={formData.patient_id}
                            onChange={e => setFormData({ ...formData, patient_id: e.target.value })}
                        >
                            <option value="">Selecione um paciente...</option>
                            {patients.map(p => (
                                <option key={p.id} value={p.id}>{p.full_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Data</label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                value={formData.date}
                                onChange={e => setFormData({ ...formData, date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Hora</label>
                            <input
                                type="time"
                                required
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Dentista</label>
                        <select
                            required
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                            value={formData.dentist_id}
                            onChange={e => setFormData({ ...formData, dentist_id: e.target.value })}
                        >
                            <option value="">Selecione um dentista...</option>
                            {dentists.map(d => (
                                <option key={d.id} value={d.id}>{d.full_name || d.email}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Observações</label>
                        <textarea
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl h-20 resize-none"
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-lg">Cancelar</button>
                        <button type="submit" disabled={isLoading} className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-primary-dark shadow-lg shadow-primary/20">
                            {isLoading ? 'Salvando...' : 'Confirmar Agendamento'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewAppointmentModal;

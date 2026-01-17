import React, { useState } from 'react';
import { Appointment, appointmentService } from '../src/services/appointmentService';

interface EditAppointmentModalProps {
    appointment: Appointment | null;
    onClose: () => void;
    onSuccess: () => void;
}

const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({ appointment, onClose, onSuccess }) => {
    const [isLoading, setIsLoading] = useState(false);

    if (!appointment) return null;

    const handleStatusChange = async (status: Appointment['status']) => {
        setIsLoading(true);
        try {
            await appointmentService.updateStatus(appointment.id, status);
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar status");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Tem certeza que deseja cancelar e remover este agendamento?")) return;
        setIsLoading(true);
        try {
            await appointmentService.deleteAppointment(appointment.id);
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <span className="material-symbols-outlined">close</span>
                </button>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{appointment.patients?.full_name}</h3>
                <p className="text-slate-500 text-sm mb-6">
                    {new Date(appointment.start_time).toLocaleDateString()} às {new Date(appointment.start_time).toLocaleTimeString().slice(0, 5)}
                </p>

                <div className="space-y-3">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alterar Status</p>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleStatusChange('confirmed')} className="bg-green-50 text-green-700 hover:bg-green-100 p-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">check_circle</span> Confirmar
                        </button>
                        <button onClick={() => handleStatusChange('completed')} className="bg-blue-50 text-blue-700 hover:bg-blue-100 p-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">done_all</span> Concluir
                        </button>
                        <button onClick={() => handleStatusChange('no-show')} className="bg-amber-50 text-amber-700 hover:bg-amber-100 p-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">person_off</span> Faltou
                        </button>
                        <button onClick={() => handleStatusChange('canceled')} className="bg-red-50 text-red-700 hover:bg-red-100 p-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">cancel</span> Cancelar
                        </button>
                    </div>

                    <div className="pt-4 border-t border-slate-100 mt-4">
                        <button onClick={handleDelete} className="w-full text-red-600 hover:bg-red-50 p-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors">
                            <span className="material-symbols-outlined text-[18px]">delete</span> Excluir Agendamento
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditAppointmentModal;

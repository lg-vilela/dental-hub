import React, { useState } from 'react';
import { patientService } from '../../src/services/patientService';
import { useAuth } from '../../src/contexts/AuthContext';

interface AddPatientModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const AddPatientModal: React.FC<AddPatientModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { clinic } = useAuth(); // We need clinic_id, assuming it's available in context
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        cpf: '',
        email: '',
        birth_date: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // In a real scenario, we might want to pass clinic_id to the service 
            // OR the service infers it.
            // My service signature for 'createPatientWithClinicId' expects { clinic_id, ... }
            // So we must provide it.

            if (!clinic?.id) throw new Error("ID da Clínica não encontrado. Por favor, faça login novamente.");

            await patientService.createPatientWithClinicId({
                clinic_id: clinic.id,
                full_name: formData.full_name,
                phone: formData.phone,
                cpf: formData.cpf,
                email: formData.email,
                birth_date: formData.birth_date || undefined
            });

            onSuccess();
            onClose();
            // Reset form
            setFormData({ full_name: '', phone: '', cpf: '', email: '', birth_date: '' });
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Erro ao adicionar paciente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">Novo Paciente</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-100 font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Nome Completo *</label>
                        <input
                            type="text"
                            required
                            placeholder="Ex: Maria Silva"
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            value={formData.full_name}
                            onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Telefone</label>
                            <input
                                type="text"
                                placeholder="(11) 99999-9999"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Data Nasc.</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.birth_date}
                                onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">CPF</label>
                            <input
                                type="text"
                                placeholder="000.000.000-00"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.cpf}
                                onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">E-mail</label>
                            <input
                                type="email"
                                placeholder="email@exemplo.com"
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 disabled:opacity-70 flex items-center gap-2"
                        >
                            {isLoading ? (
                                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : 'Salvar Paciente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

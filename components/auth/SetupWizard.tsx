import React, { useState } from 'react';

interface SetupWizardProps {
    onComplete: (data: any) => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        clinicName: '',
        type: '',
        goal: ''
    });

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            onComplete(formData);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500">
                {/* Progress Header */}
                <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 size-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-4">
                            <div className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold backdrop-blur-sm">Passo {step} de 3</div>
                            <span className="material-symbols-outlined text-white/50">rocket_launch</span>
                        </div>
                        <h1 className="text-3xl font-bold">Vamos configurar sua clínica</h1>
                        <p className="text-slate-400 mt-2">Levará menos de 1 minuto.</p>
                    </div>
                </div>

                <div className="p-8 sm:p-12">
                    {/* Step 1: Name */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-4">
                                <label className="text-lg font-bold text-slate-900 block">Qual o nome da sua clínica ou consultório?</label>
                                <input
                                    type="text"
                                    autoFocus
                                    className="w-full text-2xl font-bold placeholder:text-slate-300 border-b-2 border-slate-200 py-2 focus:border-slate-900 focus:outline-none transition-colors"
                                    placeholder="Ex: Sorriso Radiante"
                                    value={formData.clinicName}
                                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Type */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <label className="text-lg font-bold text-slate-900 block">Como você se identifica?</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['Consultório Individual', 'Clínica Multidisciplinar', 'Franquia', 'Estudante'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setFormData({ ...formData, type: t })}
                                        className={`p-6 rounded-xl border-2 text-left transition-all hover:scale-105 ${formData.type === t ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 hover:border-slate-300'}`}
                                    >
                                        <span className="font-bold text-lg">{t}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Goal */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <label className="text-lg font-bold text-slate-900 block">Qual seu principal objetivo?</label>
                            <div className="space-y-3">
                                {[
                                    { id: 'organize', label: 'Organizar a agenda e pacientes' },
                                    { id: 'finance', label: 'Controlar o financeiro' },
                                    { id: 'grow', label: 'Atrair mais pacientes' },
                                    { id: 'all', label: 'Tudo isso e mais um pouco' }
                                ].map((g) => (
                                    <button
                                        key={g.id}
                                        onClick={() => setFormData({ ...formData, goal: g.id })}
                                        className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition-colors ${formData.goal === g.id ? 'bg-slate-900 text-white border-slate-900' : 'border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        <div className={`size-6 rounded-full border-2 flex items-center justify-center ${formData.goal === g.id ? 'border-white' : 'border-slate-300'}`}>
                                            {formData.goal === g.id && <div className="size-3 bg-white rounded-full"></div>}
                                        </div>
                                        <span className="font-bold">{g.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="mt-10 flex justify-end">
                        <button
                            onClick={handleNext}
                            disabled={step === 1 && !formData.clinicName}
                            className="bg-primary text-white text-lg font-bold py-4 px-10 rounded-2xl hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-xl shadow-primary/20"
                        >
                            {step === 3 ? 'Finalizar Setup' : 'Continuar'} <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetupWizard;

import React, { useState, useEffect } from 'react';

interface SetupWizardProps {
    onComplete: (data: any) => void;
}

import { useAuth } from '../../src/contexts/AuthContext';

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
    const { signUp } = useAuth();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        clinicName: '',
        type: '',
        goal: '',
        plan: 'free', // Default
        inviteClinicId: '',
        inviteRole: ''
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const clinicId = params.get('invite_clinic_id');
        const role = params.get('invite_role');

        if (clinicId && role) {
            setFormData(prev => ({
                ...prev,
                inviteClinicId: clinicId,
                inviteRole: role,
                clinicName: 'Clínica Existente' // Placeholder to bypass step 2 validation if needed
            }));
            // Skip to Step 1 immediately
        }
    }, []);

    const handleNext = async () => {
        if (formData.inviteClinicId) {
            // If invited, skip steps 2-5
            setIsLoading(true);
            setError('');
            try {
                const { error } = await signUp(formData.email, formData.password, {
                    name: formData.name,
                    inviteClinicId: formData.inviteClinicId,
                    inviteRole: formData.inviteRole
                });
                if (error) throw error;
                onComplete(formData);
            } catch (err: any) {
                setError(err.message || 'Erro ao criar conta.');
                setIsLoading(false);
            }
            return;
        }

        if (step < 5) {
            setStep(step + 1);
        } else {
            // Finalize - Create Account
            setIsLoading(true);
            setError('');
            try {
                const { error } = await signUp(formData.email, formData.password, {
                    name: formData.name,
                    clinicName: formData.inviteClinicId ? '' : formData.clinicName, // Don't create clinic if invited
                    type: formData.type,
                    goal: formData.goal,
                    plan: formData.plan,
                    inviteClinicId: formData.inviteClinicId,
                    inviteRole: formData.inviteRole
                });

                if (error) throw error;
                // Success
                onComplete(formData);
            } catch (err: any) {
                // Robust Error Extraction
                let msg = '';
                if (typeof err === 'string') {
                    msg = err;
                } else if (err?.message) {
                    msg = err.message;
                } else {
                    msg = 'Erro desconhecido ao processar cadastro.';
                }

                console.log('Signup Raw Error:', err); // Debug
                console.log('Signup Extracted Msg:', msg); // Debug

                // Translate specific Supabase errors (Case Insensitive & Trimmed)
                const lowerMsg = msg.toLowerCase().trim();

                if (
                    lowerMsg.includes('user already registered') ||
                    lowerMsg.includes('email already registered') ||
                    lowerMsg === 'user already registered'
                ) {
                    msg = 'Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.';
                } else if (lowerMsg.includes('password should be at least')) {
                    msg = 'A senha deve ter no mínimo 6 caracteres.';
                }

                setError(msg);
                setIsLoading(false);
            }
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
            setError('');
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
                            <div className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold backdrop-blur-sm">Passo {step} de 5</div>
                            <span className="material-symbols-outlined text-white/50">rocket_launch</span>
                        </div>
                        <h1 className="text-3xl font-bold">
                            {step === 1 ? 'Crie sua conta' : 'Vamos configurar seu negócio'}
                        </h1>
                        <p className="text-slate-400 mt-2">
                            {formData.inviteClinicId ? 'Você foi convidado para participar de uma equipe.' : step === 1 ? 'Dados para acesso administrativo.' : 'Levará menos de 1 minuto.'}
                        </p>
                    </div>
                </div>

                <div className="p-8 sm:p-12">
                    {/* Step 1: User Data (Always show) */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            {formData.inviteClinicId && (
                                <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-800 text-sm font-bold flex items-center gap-2 mb-4">
                                    <span className="material-symbols-outlined">mail</span>
                                    <span>Aceitando convite para entrar na equipe ({formData.inviteRole === 'dentist' ? 'Profissional' : formData.inviteRole}).</span>
                                </div>
                            )}
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-bold text-slate-700 block mb-1">Nome Completo</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="Dr. João Silva"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-slate-700 block mb-1">E-mail Corporativo</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="contato@suaclinica.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-slate-700 block mb-1">Senha de Acesso</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                        placeholder="Mínimo 8 caracteres"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Name */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <div className="space-y-4">
                                <label className="text-lg font-bold text-slate-900 block">Qual o nome da sua empresa ou negócio?</label>
                                <input
                                    type="text"
                                    autoFocus
                                    className="w-full text-2xl font-bold placeholder:text-slate-300 border-b-2 border-slate-200 py-2 focus:border-slate-900 focus:outline-none transition-colors"
                                    placeholder="Ex: Minha Empresa Inc."
                                    value={formData.clinicName}
                                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                                    onKeyDown={(e) => e.key === 'Enter' && formData.clinicName && handleNext()}
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Type */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <label className="text-lg font-bold text-slate-900 block">Como você se identifica?</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {['Profissional Autônomo', 'Pequena Empresa', 'Franquia/Rede', 'Estudante'].map((t) => (
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

                    {/* Step 4: Plan Selection */}
                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <label className="text-lg font-bold text-slate-900 block">Escolha o plano ideal</label>
                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { id: 'free', name: 'Grátis', price: 'R$ 0', features: ['5 Clientes', '1 Usuário'] },
                                    { id: 'pro', name: 'Pro', price: 'R$ 97', features: ['Ilimitado', 'Financeiro', 'WhatsApp'] },
                                    { id: 'plus', name: 'Plus', price: 'R$ 197', features: ['Tudo do Pro', 'Estoque', 'Franquias'] }
                                ].map((p) => (
                                    <button
                                        key={p.id}
                                        onClick={() => setFormData({ ...formData, plan: p.id })}
                                        className={`p-4 rounded-xl border-2 text-left transition-all flex justify-between items-center ${formData.plan === p.id ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-300'}`}
                                    >
                                        <div>
                                            <span className={`font-bold text-lg block ${formData.plan === p.id ? 'text-primary' : 'text-slate-900'}`}>{p.name}</span>
                                            <span className="text-sm text-slate-500">{p.features.join(' • ')}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-black text-xl text-slate-900">{p.price}</span>
                                            <div className={`size-5 rounded-full border-2 ml-auto mt-1 flex items-center justify-center ${formData.plan === p.id ? 'border-primary bg-primary' : 'border-slate-300'}`}>
                                                {formData.plan === p.id && <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 5: Goal */}
                    {step === 5 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                            <label className="text-lg font-bold text-slate-900 block">Qual seu principal objetivo?</label>
                            <div className="space-y-3">
                                {[
                                    { id: 'organize', label: 'Organizar a agenda e clientes' },
                                    { id: 'finance', label: 'Controlar o financeiro' },
                                    { id: 'grow', label: 'Vender mais' },
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

                    {/* Footer Actions */}
                    <div className="mt-10 flex flex-col gap-4">
                        {error && (
                            <div className="text-red-600 text-sm font-bold bg-red-50 px-4 py-2 rounded-lg border border-red-100 animate-in fade-in slide-in-from-bottom-2">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center gap-3 justify-end">
                            {step > 1 && (
                                <button
                                    onClick={handleBack}
                                    disabled={isLoading}
                                    className="text-slate-500 font-bold px-6 py-4 hover:text-slate-800 transition-colors disabled:opacity-50"
                                >
                                    Voltar
                                </button>
                            )}

                            <button
                                onClick={handleNext}
                                disabled={
                                    (step === 1 && (!formData.name || !formData.email || !formData.password)) ||
                                    (step === 2 && !formData.clinicName) ||
                                    isLoading
                                }
                                className="bg-primary text-white text-lg font-bold py-4 px-10 rounded-2xl hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-xl shadow-primary/20 flex-1 justify-center sm:flex-none"
                            >
                                {isLoading ? (
                                    <div className="size-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        {formData.inviteClinicId ? 'Entrar na Equipe' : step === 5 ? 'Finalizar Setup' : 'Continuar'} <span className="material-symbols-outlined">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetupWizard;

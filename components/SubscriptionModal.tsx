import React from 'react';

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Gerenciar Assinatura</h2>
                        <p className="text-xs text-slate-500 font-medium">Detalhes e preferências do seu plano</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Active Plan Card */}
                    <div className="bg-gradient-to-br from-[#617FA3] to-[#4A6280] rounded-xl p-5 text-white shadow-lg shadow-[#617FA3]/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <span className="material-symbols-outlined text-8xl">verified</span>
                        </div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Plano Atual</p>
                                    <h3 className="text-2xl font-black">Dental Hub Pro</h3>
                                </div>
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">Ativo</span>
                            </div>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-3xl font-bold">R$ 149,90</span>
                                <span className="text-sm text-blue-100">/mês</span>
                            </div>
                            <p className="text-xs text-blue-100">Próxima renovação em 25/02/2026</p>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wide">Benefícios Inclusos</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                'Agendamentos Ilimitados',
                                'Gestão Financeira Completa',
                                'Suporte Prioritário 24/7',
                                'Armazenamento em Nuvem',
                                'Lembretes via WhatsApp',
                                'Dashboard Avançado'
                            ].map((feature, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                    <span className="material-symbols-outlined text-emerald-500 text-lg">check_circle</span>
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                        <button className="w-full py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-slate-300 transition-all text-sm flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined">upgrade</span>
                            Alterar Plano
                        </button>
                        <button className="w-full py-3 px-4 rounded-xl text-red-500 font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-sm flex items-center justify-center gap-2">
                            Cancelar Assinatura
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionModal;

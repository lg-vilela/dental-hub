import React, { useState } from 'react';

interface LandingPageProps {
    onStart: () => void;
    onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-white font-['Manrope'] selection:bg-[#617FA3] selection:text-white">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                        <div className="size-9 bg-[#617FA3] rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#617FA3]/20">
                            <span className="material-symbols-outlined text-[22px]">dentistry</span>
                        </div>
                        <span className="font-extrabold text-xl text-slate-900 tracking-tight">Dental Hub</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={onLogin} className="text-sm font-bold text-slate-600 hover:text-[#617FA3] transition-colors">
                            Entrar
                        </button>
                        <button onClick={onStart} className="bg-[#617FA3] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#4A6280] transition-all shadow-lg shadow-[#617FA3]/25 hover:shadow-[#617FA3]/40 hover:-translate-y-0.5">
                            Começar Grátis
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F0F4F8] text-[#4A6280] text-xs font-bold uppercase tracking-wider">
                            <span className="flex size-2 bg-[#617FA3] rounded-full animate-pulse"></span>
                            Novo: Gestão Financeira 2.0
                        </div>
                        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                            A plataforma que <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#617FA3] to-[#829AB5]">sua clínica merece</span>.
                        </h1>
                        <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-medium">
                            Centralize agenda, prontuários e financeiro em um único lugar. Simples, moderno e feito para ver sua clínica crescer.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <button onClick={onStart} className="px-8 py-4 bg-[#617FA3] text-white rounded-full font-bold text-lg hover:bg-[#4A6280] transition-all shadow-xl shadow-[#617FA3]/30 flex items-center justify-center gap-2 group hover:-translate-y-1">
                                Criar Conta Gratuita
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                    </div>

                    <div className="relative animate-in fade-in zoom-in duration-1000 delay-200 hidden lg:block">
                        <div className="absolute -top-20 -right-20 size-96 bg-[#617FA3]/10 rounded-full blur-3xl"></div>
                        <div className="relative z-10 bg-white p-2 rounded-2xl shadow-2xl border border-slate-100 rotate-1 hover:rotate-0 transition-transform duration-700">
                            <img
                                src="https://raw.githubusercontent.com/lg-vilela/dental-saas-assets/main/dashboard-preview_mockup.png"
                                onError={(e) => e.currentTarget.src = 'https://placehold.co/800x600/f1f5f9/617FA3?text=Dental+Hub+Dashboard'}
                                alt="Dashboard Preview"
                                className="rounded-xl border border-slate-100"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Section: Is it for me? (Metric Cards) */}
            <section className="py-20 bg-white border-t border-slate-50">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-block p-3 rounded-full bg-[#EBF1F5] mb-6">
                        <span className="material-symbols-outlined text-[#617FA3]">bolt</span>
                    </div>
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Será que faz sentido pra mim?</h2>
                    <p className="text-slate-500 mb-16">Se você tem essas características, o Dental Hub foi feito pensando em você.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="p-6">
                            <h3 className="text-5xl font-extrabold text-[#009B82] mb-4">40+</h3>
                            <p className="font-bold text-slate-800">Quero aumentar minha taxa de aceitação</p>
                        </div>
                        <div className="p-6 border-x border-slate-100">
                            <h3 className="text-5xl font-extrabold text-[#009B82] mb-4">600%</h3>
                            <p className="font-bold text-slate-800">Perco muito tempo explicando orçamentos</p>
                        </div>
                        <div className="p-6">
                            <h3 className="text-5xl font-extrabold text-[#009B82] mb-4">4k+</h3>
                            <p className="font-bold text-slate-800">Quero me diferenciar da concorrência</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section: How it works (Steps) */}
            <section className="py-24 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="px-4 py-1.5 rounded-full bg-[#EBF1F5] text-[#617FA3] font-bold text-sm uppercase">Como Funciona</span>
                        <h2 className="text-3xl font-bold text-slate-900 mt-6">Do orçamento ao tratamento aceito <span className="text-[#009B82]">em minutos</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-0.5 bg-[#009B82]/30 -z-0"></div>

                        {[
                            { step: 1, icon: 'person_add', title: 'Cadastre o Tratamento', desc: 'Preencha etapas, procedimentos e valores' },
                            { step: 2, icon: 'visibility', title: 'Apresente Visualmente', desc: 'Mostre timeline interativa ao paciente na consulta' },
                            { step: 3, icon: 'ios_share', title: 'Compartilhe o link', desc: 'Compartilhe o link do tratamento com o paciente' },
                            { step: 4, icon: 'send', title: 'Paciente Acessa o link', desc: 'O paciente pode acessar o link 24/7 no celular' }
                        ].map((s) => (
                            <div key={s.step} className="text-center relative bg-[#F8FAFC] z-10">
                                <div className="size-8 rounded-full bg-[#009B82] text-white flex items-center justify-center font-bold mx-auto mb-6">
                                    {s.step}
                                </div>
                                <div className="size-20 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-[#617FA3] mx-auto mb-6">
                                    <span className="material-symbols-outlined text-3xl">{s.icon}</span>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-2">{s.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed max-w-[200px] mx-auto">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section: Comparison Table */}
            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="px-4 py-1.5 rounded-full bg-[#EBF1F5] text-[#617FA3] font-bold text-sm uppercase">Comparativo</span>
                        <h2 className="text-3xl font-bold text-slate-900 mt-6">Dental Hub vs Métodos Tradicionais</h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr>
                                    <th className="p-4 border-b border-transparent"></th>
                                    <th className="p-4 text-center font-bold text-slate-500 text-sm">Manual<br /><span className="text-xs font-normal">(PDF/PowerPoint)</span></th>
                                    <th className="p-4 text-center font-bold text-slate-500 text-sm">Software Gestão<br /><span className="text-xs font-normal">(Tradicional)</span></th>
                                    <th className="p-4 text-center bg-[#E6F5F3] rounded-t-2xl border-b-2 border-[#009B82] font-bold text-[#009B82]">Dental Hub<br /><span className="text-xs bg-[#009B82] text-white px-2 py-0.5 rounded-full">Recomendado</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr>
                                    <td className="p-6 font-bold text-slate-900">Tempo de criação</td>
                                    <td className="p-6 text-center text-slate-500">30-60 min</td>
                                    <td className="p-6 text-center text-slate-500">15-20 min</td>
                                    <td className="p-6 text-center font-bold text-[#009B82] bg-[#Fafffd] border-x border-[#E6F5F3]">5 min</td>
                                </tr>
                                <tr>
                                    <td className="p-6 font-bold text-slate-900">Portal do paciente</td>
                                    <td className="p-6 text-center text-slate-300"><span className="material-symbols-outlined">close</span></td>
                                    <td className="p-6 text-center text-slate-300"><span className="material-symbols-outlined">close</span></td>
                                    <td className="p-6 text-center text-[#009B82] bg-[#Fafffd] border-x border-[#E6F5F3]"><span className="material-symbols-outlined">check</span></td>
                                </tr>
                                <tr>
                                    <td className="p-6 font-bold text-slate-900">Taxa de aceitação média</td>
                                    <td className="p-6 text-center text-slate-500">40%</td>
                                    <td className="p-6 text-center text-slate-500">50%</td>
                                    <td className="p-6 text-center font-bold text-[#009B82] bg-[#Fafffd] border-x border-[#E6F5F3]">75%</td>
                                </tr>
                                <tr>
                                    <td className="p-6 font-bold text-slate-900">Notificações automáticas</td>
                                    <td className="p-6 text-center text-slate-300"><span className="material-symbols-outlined">close</span></td>
                                    <td className="p-6 text-center text-slate-300"><span className="material-symbols-outlined">close</span></td>
                                    <td className="p-6 text-center text-[#009B82] bg-[#Fafffd] border-x border-[#E6F5F3] rounded-b-2xl"><span className="material-symbols-outlined">check</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Section: Pricing */}
            <section className="py-24 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="px-4 py-1.5 rounded-full bg-[#EBF1F5] text-[#617FA3] font-bold text-sm uppercase">Preços</span>
                        <h2 className="text-4xl font-bold text-slate-900 mt-6 mb-4">Planos Transparentes. <span className="text-[#009B82]">Sem Pegadinhas.</span></h2>
                        <p className="text-slate-500">Cancele quando quiser.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                        {/* Free - Grátis */}
                        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                            <div className="size-10 bg-[#E6F5F3] rounded-full flex items-center justify-center text-[#009B82] mb-4">
                                <span className="material-symbols-outlined">bolt</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#009B82] mb-1">Plano Free</h3>
                            <p className="text-sm text-slate-500 mb-6">Para testar a plataforma</p>
                            <div className="mb-8">
                                <span className="text-4xl font-extrabold text-slate-900">Grátis</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="text-sm text-slate-600 flex items-center gap-2"><span className="material-symbols-outlined text-[#009B82] text-sm">check_circle</span> 5 pacientes ativos</li>
                                <li className="text-sm text-slate-600 flex items-center gap-2"><span className="material-symbols-outlined text-[#009B82] text-sm">check_circle</span> Suporte por email</li>
                                <li className="text-sm text-slate-600 flex items-center gap-2"><span className="material-symbols-outlined text-[#009B82] text-sm">check_circle</span> 1 usuário</li>
                            </ul>
                            <button onClick={onStart} className="w-full py-3 rounded-full bg-[#009B82] text-white font-bold hover:bg-[#007A65] transition-all">
                                Começar Grátis
                            </button>
                        </div>

                        {/* Pro - R$ 97 */}
                        <div className="p-8 rounded-3xl bg-[#009B82] text-white shadow-2xl relative transform md:-translate-y-4">
                            <div className="absolute top-0 right-0 left-0 -mt-4 flex justify-center">
                                <span className="bg-white text-[#009B82] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide border border-[#009B82]">Mais Popular</span>
                            </div>
                            <div className="size-10 bg-white/20 rounded-full flex items-center justify-center text-white mb-4">
                                <span className="material-symbols-outlined">layers</span>
                            </div>
                            <h3 className="text-lg font-bold mb-1">Plano Pro</h3>
                            <p className="text-sm text-white/80 mb-6">Para consultório com 1 dentista</p>
                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-5xl font-extrabold">R$ 97</span>
                                <span className="text-white/70">/mês</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="text-sm text-white flex items-center gap-2"><span className="material-symbols-outlined text-white text-sm">check_circle</span> Pacientes Ilimitados</li>
                                <li className="text-sm text-white flex items-center gap-2"><span className="material-symbols-outlined text-white text-sm">check_circle</span> Portal do Paciente</li>
                                <li className="text-sm text-white flex items-center gap-2"><span className="material-symbols-outlined text-white text-sm">check_circle</span> Templates Padrão</li>
                                <li className="text-sm text-white flex items-center gap-2"><span className="material-symbols-outlined text-white text-sm">check_circle</span> Dashboard Análise</li>
                                <li className="text-sm text-white flex items-center gap-2"><span className="material-symbols-outlined text-white text-sm">check_circle</span> 2 usuários</li>
                            </ul>
                            <button onClick={onStart} className="w-full py-3 rounded-full bg-white text-[#009B82] font-bold hover:bg-slate-50 transition-all">
                                Iniciar Teste
                            </button>
                        </div>

                        {/* Max - R$ 197 */}
                        <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all">
                            <div className="size-10 bg-[#E6F5F3] rounded-full flex items-center justify-center text-[#009B82] mb-4">
                                <span className="material-symbols-outlined">stars</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#009B82] mb-1">Plano Max</h3>
                            <p className="text-sm text-slate-500 mb-6">Para clínicas</p>
                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-5xl font-extrabold text-slate-900">R$ 197</span>
                                <span className="text-slate-500">/mês</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="text-sm text-slate-600 flex items-center gap-2"><span className="material-symbols-outlined text-[#009B82] text-sm">check_circle</span> Tudo do Pro</li>
                                <li className="text-sm text-slate-600 flex items-center gap-2"><span className="material-symbols-outlined text-[#009B82] text-sm">check_circle</span> Templates Personalizados</li>
                                <li className="text-sm text-slate-600 flex items-center gap-2"><span className="material-symbols-outlined text-[#009B82] text-sm">check_circle</span> Suporte via WhatsApp</li>
                                <li className="text-sm text-slate-600 flex items-center gap-2"><span className="material-symbols-outlined text-[#009B82] text-sm">check_circle</span> Usuários Ilimitados</li>
                            </ul>
                            <button onClick={onStart} className="w-full py-3 rounded-full bg-[#009B82] text-white font-bold hover:bg-[#007A65] transition-all">
                                Iniciar Teste
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section: FAQ */}
            <section className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Dúvidas Frequentes</h2>
                    <div className="space-y-4">
                        {[
                            { q: 'O que é o Dental Hub?', a: 'É uma plataforma completa para gestão, vendas e relacionamento com pacientes.' },
                            { q: 'Como o Dental Hub aumenta minha taxa de aceitação?', a: 'Através de apresentações visuais e interativas dos tratamentos que encantam o paciente.' },
                            { q: 'Preciso de conhecimento técnico para usar?', a: 'Não! O sistema foi desenhado para ser intuitivo e fácil de usar, como um app de celular.' },
                            { q: 'O paciente tem acesso ao plano de tratamento?', a: 'Sim, você pode compartilhar um link exclusivo onde ele visualiza o orçamento e a timeline.' },
                            { q: 'Posso personalizar os templates?', a: 'Sim, no plano Max você tem total liberdade para criar seus próprios templates.' }
                        ].map((faq, i) => (
                            <div key={i} className="border border-slate-200 rounded-2xl overflow-hidden hover:border-[#617FA3] transition-colors">
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full p-6 text-left flex justify-between items-center font-bold text-slate-800 bg-white hover:bg-slate-50"
                                >
                                    {faq.q}
                                    <span className={`material-symbols-outlined transition-transform text-[#617FA3] ${openFaq === i ? 'rotate-180' : ''}`}>expand_more</span>
                                </button>
                                {openFaq === i && (
                                    <div className="p-6 pt-0 text-slate-600 leading-relaxed bg-slate-50 border-t border-slate-100">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="size-8 bg-[#617FA3] rounded-lg flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-lg">dentistry</span>
                            </div>
                            <span className="font-extrabold text-xl text-slate-900">Dental Hub</span>
                        </div>
                        <p className="text-slate-500 max-w-xs leading-relaxed">
                            Simplificando a gestão odontológica para que você possa focar no que importa: o sorriso do seu paciente.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Plataforma</h4>
                        <ul className="space-y-3 text-sm text-slate-500">
                            <li className="hover:text-[#617FA3] cursor-pointer">Agenda Inteligente</li>
                            <li className="hover:text-[#617FA3] cursor-pointer">Prontuário Eletrônico</li>
                            <li className="hover:text-[#617FA3] cursor-pointer">Financeiro</li>
                            <li className="hover:text-[#617FA3] cursor-pointer">Estoque</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
                    <p>&copy; 2026 Dental Hub. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

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
        <div className="min-h-screen bg-slate-50 font-['Manrope'] selection:bg-[#617FA3] selection:text-white">
            {/* Navbar - Glassmorphism */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm transition-all duration-300">
                <div className="w-full max-w-[1400px] mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-2.5 group cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="size-10 bg-gradient-to-br from-[#617FA3] to-[#4A6280] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#617FA3]/20 group-hover:scale-110 transition-transform duration-300">
                            <span className="material-symbols-outlined text-[24px]">dentistry</span>
                        </div>
                        <span className="font-extrabold text-2xl text-slate-800 tracking-tight">Dental Hub</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={onLogin} className="text-sm font-bold text-slate-600 hover:text-[#617FA3] px-4 py-2 rounded-full hover:bg-slate-50 transition-all">
                            Entrar
                        </button>
                        <button onClick={onStart} className="bg-[#617FA3] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#4A6280] hover:shadow-xl hover:shadow-[#617FA3]/30 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                            Começar Grátis
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section - Full Width & Modern Gradients */}
            <section className="pt-32 pb-32 px-6 relative overflow-hidden bg-gradient-to-b from-white to-slate-50">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#617FA3]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-200/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>

                <div className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
                    <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-100 shadow-sm text-[#4A6280] text-sm font-bold tracking-wide hover:shadow-md transition-shadow cursor-default">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#617FA3] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#617FA3]"></span>
                            </span>
                            Novo: Módulo Financeiro 2.0
                        </div>
                        <h1 className="text-6xl sm:text-7xl font-extrabold text-slate-900 leading-[1.05] tracking-tight">
                            A plataforma que <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#617FA3] via-[#829AB5] to-[#4A6280]">sua clínica merece</span>.
                        </h1>
                        <p className="text-xl text-slate-500 max-w-xl leading-relaxed font-medium">
                            Gestão completa, sem complicações. Centralize agenda, prontuários e financeiro em um único lugar bonito e intuitivo.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button onClick={onStart} className="px-10 py-5 bg-[#617FA3] text-white rounded-full font-bold text-lg hover:bg-[#4A6280] transition-all shadow-xl shadow-[#617FA3]/30 flex items-center justify-center gap-2 group hover:-translate-y-1 hover:scale-105 active:scale-95 duration-300">
                                Criar Conta Gratuita
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                        <div className="pt-4 flex items-center gap-6">
                            <div className="flex -space-x-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="size-12 rounded-full border-4 border-white overflow-hidden shadow-sm hover:-translate-y-2 transition-transform duration-300 z-0 hover:z-10">
                                        <img src={`https://picsum.photos/50/50?random=${i + 20}`} className="w-full h-full object-cover" alt="" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col">
                                <div className="flex text-yellow-400 text-lg">
                                    {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
                                </div>
                                <p className="text-slate-600 font-bold text-sm">+500 dentistas confiam</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative animate-in fade-in zoom-in duration-1000 delay-200 hidden lg:block perspective-1000">
                        <div className="relative z-10 bg-white p-3 rounded-3xl shadow-2xl border border-slate-100 transform rotate-y-6 hover:rotate-y-0 hover:scale-[1.02] transition-all duration-700 ease-out">
                            <img
                                src="https://raw.githubusercontent.com/lg-vilela/dental-saas-assets/main/dashboard-preview_mockup.png"
                                onError={(e) => e.currentTarget.src = 'https://placehold.co/1200x800/f8fafc/617FA3?text=Dental+Hub+Dashboard+HD'}
                                alt="Dashboard Preview"
                                className="rounded-2xl border border-slate-100 shadow-inner w-full"
                            />
                            {/* Floating Card Animation */}
                            <div className="absolute -left-12 top-24 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-white/50 animate-bounce-slow flex items-center gap-4">
                                <div className="size-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                                    <span className="material-symbols-outlined text-2xl">check</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Produtividade</p>
                                    <p className="font-bold text-slate-900 text-lg">+ 140%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Is it for me? - Dynamic Cards */}
            <section className="py-32 bg-white">
                <div className="w-full max-w-[1400px] mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="px-5 py-2 rounded-full bg-[#EBF1F5] text-[#617FA3] font-bold text-sm uppercase tracking-wider">Público Alvo</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-6 mb-4">Será que faz sentido pra mim?</h2>
                        <p className="text-xl text-slate-500 max-w-2xl mx-auto">Desenvolvemos o Dental Hub para profissionais que buscam excelência.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { val: '40+', label: 'Aumento na Aceitação', sub: 'Transforme avaliações em tratamentos fechados com orçamentos visuais.', icon: 'trending_up' },
                            { val: '600%', label: 'Mais Produtividade', sub: ' Automatize confirmações e lembretes para focar no atendimento.', icon: 'rocket_launch' },
                            { val: '4k+', label: 'Economia Mensal', sub: 'Reduza faltas e otimize o uso dos seus materiais e horários.', icon: 'savings' }
                        ].map((item, i) => (
                            <div key={i} className="group p-10 rounded-[32px] bg-slate-50 border border-slate-100 hover:bg-white hover:border-[#617FA3]/30 hover:shadow-2xl hover:shadow-[#617FA3]/10 transition-all duration-500 cursor-default">
                                <div className="size-16 rounded-2xl bg-white flex items-center justify-center text-[#617FA3] shadow-md mb-8 group-hover:scale-110 group-hover:bg-[#617FA3] group-hover:text-white transition-all duration-300">
                                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                                </div>
                                <h3 className="text-6xl font-extrabold text-[#617FA3] mb-4 tracking-tighter">{item.val}</h3>
                                <h4 className="text-xl font-bold text-slate-900 mb-3">{item.label}</h4>
                                <p className="text-slate-500 leading-relaxed group-hover:text-slate-600">{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Steps - How it Works */}
            <section className="py-32 bg-[#0F172A] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute -top-[300px] -right-[300px] w-[800px] h-[800px] bg-[#617FA3]/20 rounded-full blur-[120px]"></div>

                <div className="w-full max-w-[1400px] mx-auto px-6 relative z-10">
                    <div className="text-center mb-24">
                        <span className="px-5 py-2 rounded-full bg-white/10 text-white font-bold text-sm uppercase backdrop-blur-md border border-white/20">Simplicidade</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold mt-6">Do orçamento ao aceite <span className="text-[#617FA3]">em minutos</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
                        {/* Line */}
                        <div className="hidden md:block absolute top-[40px] left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#617FA3]/50 to-transparent"></div>

                        {[
                            { step: 1, title: 'Cadastro Rápido', desc: 'Lance o tratamento em segundos.' },
                            { step: 2, title: 'Apresentação Visual', desc: 'Mostre o "Antes e Depois" estimado.' },
                            { step: 3, title: 'Link Inteligente', desc: 'Envie o orçamento via WhatsApp.' },
                            { step: 4, title: 'Aprovação Digital', desc: 'Paciente aprova no próprio celular.' }
                        ].map((s) => (
                            <div key={s.step} className="relative text-center group">
                                <div className="size-20 mx-auto bg-[#1E293B] rounded-2xl border border-[#617FA3]/30 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-[#617FA3]/10 mb-8 z-10 relative group-hover:scale-110 group-hover:border-[#617FA3] transition-all duration-300">
                                    {s.step}
                                </div>
                                <h3 className="text-xl font-bold mb-3 group-hover:text-[#617FA3] transition-colors">{s.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-32 bg-white">
                <div className="w-full max-w-[1200px] mx-auto px-6">
                    <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <span className="px-5 py-2 rounded-full bg-[#EBF1F5] text-[#617FA3] font-bold text-sm uppercase tracking-wider">Comparativo</span>
                        <h2 className="text-4xl font-extrabold text-slate-900 mt-6">Dental Hub vs O resto</h2>
                    </div>

                    <div className="overflow-hidden rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-200/50">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="p-8 border-b border-slate-200"></th>
                                    <th className="p-8 text-center border-b border-slate-200 opacity-50 grayscale">Métodos Antigos</th>
                                    <th className="p-8 text-center bg-[#617FA3] text-white font-bold text-lg border-b border-[#4A6280] relative">
                                        Dental Hub
                                        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-bl-xl uppercase tracking-wider">Líder</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {[
                                    { label: 'Tempo de Criação', old: '45 min', new: '3 min' },
                                    { label: 'Experiência Visual', old: 'Nenhuma', new: 'Imersiva 3D' },
                                    { label: 'Taxa de Aceitação', old: 'Baixa (~30%)', new: 'Alta (~85%)' },
                                    { label: 'Custo-benefício', old: 'Caro/Complexo', new: 'Simples' },
                                    { label: 'Suporte', old: 'Email (48h)', new: 'WhatsApp (Agora)' }
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-8 font-bold text-slate-700">{row.label}</td>
                                        <td className="p-8 text-center text-slate-400 font-medium">{row.old}</td>
                                        <td className="p-8 text-center font-extrabold text-[#617FA3] bg-[#617FA3]/5">{row.new}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Pricing Cards - Highlighted & Modern */}
            <section className="py-32 bg-[#F8FAFC]">
                <div className="w-full max-w-[1400px] mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="px-5 py-2 rounded-full bg-[#EBF1F5] text-[#617FA3] font-bold text-sm uppercase tracking-wider">Planos Flexíveis</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-6 mb-6">Investimento que se paga <br />na <span className="text-[#617FA3]">primeira semana</span>.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        {/* Free */}
                        <div className="p-10 rounded-[40px] bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Plano Free</h3>
                            <p className="text-slate-500 mb-8">Para quem está começando agora.</p>
                            <div className="text-5xl font-black text-slate-900 mb-8">R$ 0<span className="text-lg font-medium text-slate-400 ml-1">/mês</span></div>
                            <button onClick={onStart} className="w-full py-4 rounded-2xl border-2 border-slate-100 font-bold text-slate-600 hover:border-[#617FA3] hover:text-[#617FA3] hover:bg-[#617FA3]/5 transition-all mb-8">
                                Começar Grátis
                            </button>
                            <ul className="space-y-4">
                                {['1 Dentista', '5 Pacientes/mês', 'Agenda Básica'].map(f => (
                                    <li key={f} className="flex items-center gap-3 text-sm text-slate-600"><span className="material-symbols-outlined text-[#617FA3]">check</span> {f}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Pro - Highlight */}
                        <div className="p-10 rounded-[40px] bg-[#617FA3] text-white shadow-2xl shadow-[#617FA3]/40 relative transform md:scale-110 z-10">
                            <div className="absolute top-0 right-10 bg-white text-[#617FA3] text-xs font-bold px-4 py-2 rounded-b-xl shadow-lg uppercase tracking-wide">Mais Escolhido</div>
                            <h3 className="text-2xl font-bold mb-2">Plano Pro</h3>
                            <p className="text-white/80 mb-8">Tudo para seu consultório voar.</p>
                            <div className="text-6xl font-black mb-8">R$ 97<span className="text-lg font-medium text-white/60 ml-1">/mês</span></div>
                            <button onClick={onStart} className="w-full py-5 rounded-2xl bg-white text-[#617FA3] font-bold hover:shadow-lg hover:scale-105 transition-all mb-8">
                                Testar por 14 dias
                            </button>
                            <ul className="space-y-4">
                                {['Pacientes Ilimitados', 'Confirmação WhatsApp', 'Financeiro Completo', 'Portal do Paciente', 'Suporte Prioritário'].map(f => (
                                    <li key={f} className="flex items-center gap-3 text-sm font-medium"><span className="material-symbols-outlined shrink-0 text-white">check_circle</span> {f}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Max */}
                        <div className="p-10 rounded-[40px] bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Plano Plus</h3>
                            <p className="text-slate-500 mb-8">Para redes e franquias.</p>
                            <div className="text-5xl font-black text-slate-900 mb-8">R$ 197<span className="text-lg font-medium text-slate-400 ml-1">/mês</span></div>
                            <button onClick={onStart} className="w-full py-4 rounded-2xl border-2 border-slate-100 font-bold text-slate-600 hover:border-slate-900 hover:text-slate-900 hover:bg-slate-50 transition-all mb-8">
                                Falar com Consultor
                            </button>
                            <ul className="space-y-4">
                                {['Múltiplas Unidades', 'Gestão de Estoque', 'API e Integrações', 'Gerente de Conta'].map(f => (
                                    <li key={f} className="flex items-center gap-3 text-sm text-slate-600"><span className="material-symbols-outlined text-[#617FA3]">check</span> {f}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Accordion */}
            <section className="py-24 bg-white">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-extrabold text-center text-slate-900 mb-12">Perguntas Frequentes</h2>
                    <div className="space-y-4">
                        {[
                            { q: 'O que é o Dental Hub?', a: 'É uma plataforma completa para gestão, vendas e relacionamento com pacientes.' },
                            { q: 'Como o Dental Hub aumenta minha taxa de aceitação?', a: 'Através de apresentações visuais e interativas dos tratamentos que encantam o paciente.' },
                            { q: 'Posso cancelar a qualquer momento?', a: 'Sim! Não temos fidelidade. Você pode cancelar sua assinatura quando quiser direto no painel.' },
                            { q: 'Preciso instalar algo?', a: 'Não. O Dental Hub é 100% online e funciona em qualquer navegador, computador ou celular.' }
                        ].map((faq, i) => (
                            <div key={i} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === i ? 'border-[#617FA3] shadow-lg shadow-[#617FA3]/10' : 'border-slate-200 hover:border-slate-300'}`}>
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full p-6 text-left flex justify-between items-center font-bold text-slate-800 bg-white"
                                >
                                    {faq.q}
                                    <span className={`material-symbols-outlined transition-transform duration-300 text-[#617FA3] ${openFaq === i ? 'rotate-180' : ''}`}>keyboard_arrow_down</span>
                                </button>
                                <div className={`grid transition-[grid-template-rows] duration-300 ease-out ${openFaq === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                    <div className="overflow-hidden">
                                        <div className="p-6 pt-0 text-slate-500 leading-relaxed bg-white">
                                            {faq.a}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 pt-24 pb-12 border-t border-slate-800 text-slate-400">
                <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-[#617FA3] rounded-xl flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-2xl">dentistry</span>
                            </div>
                            <span className="font-extrabold text-2xl text-white">Dental Hub</span>
                        </div>
                        <p className="text-slate-400 max-w-sm leading-relaxed text-lg">
                            Tecnologia de ponta para dentistas que não aceitam o "mais do mesmo".
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-8 text-lg">Solução</h4>
                        <ul className="space-y-4 text-base">
                            <li className="hover:text-[#617FA3] cursor-pointer transition-colors">Para Consultórios</li>
                            <li className="hover:text-[#617FA3] cursor-pointer transition-colors">Para Redes</li>
                            <li className="hover:text-[#617FA3] cursor-pointer transition-colors">Funcionalidades</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-8 text-lg">Empresa</h4>
                        <ul className="space-y-4 text-base">
                            <li className="hover:text-[#617FA3] cursor-pointer transition-colors">Sobre Nós</li>
                            <li className="hover:text-[#617FA3] cursor-pointer transition-colors">Blog</li>
                            <li className="hover:text-[#617FA3] cursor-pointer transition-colors">Contato</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-[1400px] mx-auto px-6 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
                    <p>&copy; 2026 Dental Hub. Feito com 💙 para dentistas.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white transition-colors">Termos</a>
                        <a href="#" className="hover:text-white transition-colors">Privacidade</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

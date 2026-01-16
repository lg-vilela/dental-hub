import React from 'react';

interface LandingPageProps {
    onStart: () => void;
    onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
    return (
        <div className="min-h-screen bg-white font-['Manrope'] selection:bg-[#009B82] selection:text-white">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                        <div className="size-9 bg-[#009B82] rounded-lg flex items-center justify-center text-white shadow-lg shadow-[#009B82]/20">
                            <span className="material-symbols-outlined text-[22px]">dentistry</span>
                        </div>
                        <span className="font-extrabold text-xl text-slate-900 tracking-tight">Dental Hub</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button onClick={onLogin} className="text-sm font-bold text-slate-600 hover:text-[#009B82] transition-colors">
                            Entrar
                        </button>
                        <button onClick={onStart} className="bg-[#009B82] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#007A65] transition-all shadow-lg shadow-[#009B82]/25 hover:shadow-[#009B82]/40 hover:-translate-y-0.5">
                            Começar Grátis
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-24 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6F5F3] text-[#007A65] text-xs font-bold uppercase tracking-wider">
                            <span className="flex size-2 bg-[#009B82] rounded-full animate-pulse"></span>
                            Novo: Gestão Financeira 2.0
                        </div>
                        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
                            A plataforma que <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009B82] to-[#00C4A7]">sua clínica merece</span>.
                        </h1>
                        <p className="text-lg text-slate-500 max-w-lg leading-relaxed font-medium">
                            Centralize agenda, prontuários e financeiro em um único lugar. Simples, moderno e feito para ver sua clínica crescer.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <button onClick={onStart} className="px-8 py-4 bg-[#009B82] text-white rounded-full font-bold text-lg hover:bg-[#007A65] transition-all shadow-xl shadow-[#009B82]/30 flex items-center justify-center gap-2 group hover:-translate-y-1">
                                Criar Conta Gratuita
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                            <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm">
                                <span className="material-symbols-outlined text-[#009B82]">play_circle</span> Ver Demonstração
                            </button>
                        </div>
                        <div className="pt-4 flex items-center gap-4 text-sm font-bold text-slate-600">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <img key={i} src={`https://picsum.photos/40/40?random=${i + 10}`} className="size-10 rounded-full border-[3px] border-white shadow-sm" alt="" />
                                ))}
                            </div>
                            <p>Junte-se a <span className="text-[#009B82]">+500 dentistas</span> satisfeitos.</p>
                        </div>
                    </div>

                    <div className="relative animate-in fade-in zoom-in duration-1000 delay-200 hidden lg:block">
                        {/* Decorative Blobs */}
                        <div className="absolute -top-20 -right-20 size-96 bg-[#009B82]/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 size-72 bg-blue-500/10 rounded-full blur-3xl"></div>

                        {/* Main Image Mockup */}
                        <div className="relative z-10 bg-white p-2 rounded-2xl shadow-2xl border border-slate-100 rotate-1 hover:rotate-0 transition-transform duration-700">
                            <img
                                src="https://raw.githubusercontent.com/lg-vilela/dental-saas-assets/main/dashboard-preview_mockup.png"
                                onError={(e) => e.currentTarget.src = 'https://placehold.co/800x600/f1f5f9/009B82?text=Dashboard+Preview'}
                                alt="Dashboard Preview"
                                className="rounded-xl border border-slate-100"
                            />

                            {/* Floating Widget 1 */}
                            <div className="absolute -left-8 top-12 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce delay-1000 flex items-center gap-3">
                                <div className="size-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                    <span className="material-symbols-outlined">check_circle</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status</p>
                                    <p className="font-bold text-slate-900">Agenda Otimizada</p>
                                </div>
                            </div>

                            {/* Floating Widget 2 */}
                            <div className="absolute -right-6 bottom-20 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 animate-bounce delay-700 max-w-[200px]">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="size-8 rounded-full bg-[#009B82] flex items-center justify-center text-white text-xs font-bold">L</div>
                                    <p className="text-sm font-bold text-slate-900">Dra. Luiza</p>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-[#009B82] w-[85%] rounded-full"></div>
                                </div>
                                <p className="text-xs text-slate-400 mt-1 text-right">Meta Mensal: 85%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section (Z-Pattern) */}
            <section className="py-24 bg-[#F8FAFC]">
                <div className="max-w-7xl mx-auto px-6 space-y-32">
                    {/* Feature 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1 relative group">
                            <div className="absolute inset-0 bg-[#009B82] rounded-3xl rotate-3 group-hover:rotate-1 transition-all opacity-20 blur-xl"></div>
                            <div className="relative bg-white rounded-3xl p-2 shadow-xl border border-slate-100 transform hover:-translate-y-2 transition-transform duration-500">
                                <img src="https://placehold.co/600x400/e2e8f0/009B82?text=Agenda+Inteligente" className="rounded-2xl" alt="Agenda" />
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 space-y-6">
                            <div className="size-14 rounded-2xl bg-[#E6F5F3] flex items-center justify-center text-[#009B82]">
                                <span className="material-symbols-outlined text-3xl">calendar_month</span>
                            </div>
                            <h2 className="text-4xl font-bold text-slate-900">Agenda que trabalha por você.</h2>
                            <p className="text-lg text-slate-500 leading-relaxed">
                                Esqueça as faltas e os buracos na agenda. Com confirmações automáticas via WhatsApp e lista de espera inteligente, você maximiza a ocupação da sua cadeira.
                            </p>
                            <ul className="space-y-4 pt-2">
                                {['Lembretes Automáticos', 'Encaixe Inteligente', 'Histórico de Comparecimento'].map(item => (
                                    <li key={item} className="flex items-center gap-3 text-slate-700 font-bold">
                                        <span className="material-symbols-outlined text-[#009B82]">check_circle</span> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Feature 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-6">
                            <div className="size-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <span className="material-symbols-outlined text-3xl">monitoring</span>
                            </div>
                            <h2 className="text-4xl font-bold text-slate-900">Financeiro sob controle total.</h2>
                            <p className="text-lg text-slate-500 leading-relaxed">
                                Saiba exatamente quanto entra e sai. Gerencie orçamentos, contas a pagar, comissões de dentistas e emita notas fiscais com poucos cliques.
                            </p>
                            <button className="text-[#009B82] font-bold text-lg flex items-center gap-2 hover:gap-3 transition-all">
                                Conhecer o Financeiro <span className="material-symbols-outlined">arrow_forward</span>
                            </button>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-500 rounded-3xl -rotate-3 group-hover:-rotate-1 transition-all opacity-10 blur-xl"></div>
                            <div className="relative bg-white rounded-3xl p-2 shadow-xl border border-slate-100 transform hover:-translate-y-2 transition-transform duration-500">
                                <img src="https://placehold.co/600x400/e2e8f0/009B82?text=Financeiro+Pr%C3%B3" className="rounded-2xl" alt="Financeiro" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-20 bg-[#002B24] text-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
                    {[
                        { label: 'Clínicas Ativas', val: '+500' },
                        { label: 'Agendamentos/Mês', val: '120k' },
                        { label: 'Faturamento Gerido', val: 'R$ 45M+' },
                        { label: 'Tempo Poupado', val: '20h/mês' },
                    ].map((stat, i) => (
                        <div key={i} className="pt-8 md:pt-0 px-4">
                            <h3 className="text-4xl font-bold mb-2 text-[#00E5C0]">{stat.val}</h3>
                            <p className="text-slate-400 font-medium uppercase tracking-wider text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold text-slate-900 mb-4">Planos que cabem no bolso</h2>
                        <p className="text-slate-500 text-lg">Comece grátis e evolua conforme sua clínica cresce. Sem contratos de fidelidade.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                        {/* Basic */}
                        <div className="p-8 rounded-3xl border border-slate-200 hover:border-slate-300 transition-all text-center group bg-white">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Individual</h3>
                            <p className="text-slate-500 text-sm mb-6">Para quem está começando.</p>
                            <div className="flex justify-center items-baseline gap-1 mb-8">
                                <span className="text-4xl font-extrabold text-slate-900">R$ 0</span>
                                <span className="text-slate-400">/mês</span>
                            </div>
                            <button className="w-full py-3 rounded-xl border-2 border-slate-100 font-bold text-slate-600 hover:border-[#009B82] hover:text-[#009B82] transition-all mb-8">
                                Começar Agora
                            </button>
                            <ul className="space-y-3 text-left pl-4">
                                <li className="text-sm text-slate-600 flex items-center gap-2"><span className="material-symbols-outlined text-green-500 text-base">check</span> 1 Dentista</li>
                                <li className="text-sm text-slate-600 flex items-center gap-2"><span className="material-symbols-outlined text-green-500 text-base">check</span> 100 Agendamentos/mês</li>
                                <li className="text-sm text-slate-600 flex items-center gap-2"><span className="material-symbols-outlined text-green-500 text-base">check</span> Prontuário Básico</li>
                            </ul>
                        </div>

                        {/* Pro (Highlighted) */}
                        <div className="p-8 rounded-3xl bg-[#002B24] text-white shadow-2xl relative transform md:-translate-y-4">
                            <div className="absolute top-0 right-0 left-0 -mt-4 flex justify-center">
                                <span className="bg-[#00E5C0] text-[#002B24] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">Mais Popular</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Clínica Pro</h3>
                            <p className="text-slate-400 text-sm mb-6">Para clínicas em crescimento.</p>
                            <div className="flex justify-center items-baseline gap-1 mb-8">
                                <span className="text-4xl font-extrabold text-white">R$ 149</span>
                                <span className="text-slate-400">/mês</span>
                            </div>
                            <button onClick={onStart} className="w-full py-4 rounded-xl bg-[#009B82] font-bold text-white hover:bg-[#007A65] transition-all mb-8 shadow-lg shadow-[#009B82]/25">
                                Testar Grátis (14 dias)
                            </button>
                            <ul className="space-y-3 text-left pl-4">
                                <li className="text-sm text-slate-200 flex items-center gap-2"><span className="material-symbols-outlined text-[#00E5C0] text-base">check</span> Até 5 Dentistas</li>
                                <li className="text-sm text-slate-200 flex items-center gap-2"><span className="material-symbols-outlined text-[#00E5C0] text-base">check</span> Agendamentos Ilimitados</li>
                                <li className="text-sm text-slate-200 flex items-center gap-2"><span className="material-symbols-outlined text-[#00E5C0] text-base">check</span> Confirmação via WhatsApp</li>
                                <li className="text-sm text-slate-200 flex items-center gap-2"><span className="material-symbols-outlined text-[#00E5C0] text-base">check</span> Financeiro Completo</li>
                            </ul>
                        </div>

                        {/* Enterprise */}
                        <div className="p-8 rounded-3xl border border-slate-200 hover:border-slate-300 transition-all text-center group bg-white">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Rede / Franquia</h3>
                            <p className="text-slate-500 text-sm mb-6">Múltiplas unidades.</p>
                            <div className="flex justify-center items-baseline gap-1 mb-8">
                                <span className="text-4xl font-extrabold text-slate-900">Sob Consulta</span>
                            </div>
                            <button className="w-full py-3 rounded-xl border-2 border-slate-100 font-bold text-slate-600 hover:border-slate-900 hover:text-slate-900 transition-all mb-8">
                                Falar com Consultor
                            </button>
                            <ul className="space-y-3 text-left pl-4">
                                <li className="text-sm text-slate-600 flex items-center gap-2"><span className="material-symbols-outlined text-green-500 text-base">check</span> Dentistas Ilimitados</li>
                                <li className="text-sm text-slate-600 flex items-center gap-2"><span className="material-symbols-outlined text-green-500 text-base">check</span> Múltiplas Unidades</li>
                                <li className="text-sm text-slate-600 flex items-center gap-2"><span className="material-symbols-outlined text-green-500 text-base">check</span> API e Relatórios BI</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 pt-20 pb-10 border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="size-8 bg-[#009B82] rounded-lg flex items-center justify-center text-white">
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
                            <li className="hover:text-[#009B82] cursor-pointer">Agenda Inteligente</li>
                            <li className="hover:text-[#009B82] cursor-pointer">Prontuário Eletrônico</li>
                            <li className="hover:text-[#009B82] cursor-pointer">Financeiro</li>
                            <li className="hover:text-[#009B82] cursor-pointer">Estoque</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 mb-6">Suporte</h4>
                        <ul className="space-y-3 text-sm text-slate-500">
                            <li className="hover:text-[#009B82] cursor-pointer">Central de Ajuda</li>
                            <li className="hover:text-[#009B82] cursor-pointer">Falar com Suporte</li>
                            <li className="hover:text-[#009B82] cursor-pointer">Status do Sistema</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
                    <p>&copy; 2026 Dental SaaS (Dental Hub). Todos os direitos reservados.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-slate-600">Termos de Uso</a>
                        <a href="#" className="hover:text-slate-600">Privacidade</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

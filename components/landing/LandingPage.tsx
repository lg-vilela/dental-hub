import React from 'react';

interface LandingPageProps {
    onStart: () => void;
    onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
    return (
        <div className="min-h-screen bg-slate-50 font-['Manrope']">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">dentistry</span>
                        </div>
                        <span className="font-bold text-xl text-slate-900">Dental SaaS</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={onLogin} className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2">
                            Entrar
                        </button>
                        <button onClick={onStart} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                            Começar Grátis
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                            <span className="flex size-2 bg-blue-500 rounded-full animate-pulse"></span>
                            Novo: Gestão de Estoque Inteligente
                        </div>
                        <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
                            O sistema que sua clínica <span className="text-primary">realmente precisa</span>.
                        </h1>
                        <p className="text-lg text-slate-500 max-w-lg leading-relaxed">
                            Organize pacientes, financeiro e estoque em um só lugar. Simples, bonito e feito para dentistas modernos.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button onClick={onStart} className="px-8 py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl shadow-primary/30 flex items-center justify-center gap-2 group">
                                Criar Conta Gratuita
                                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                            <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">play_circle</span> Ver Demo
                            </button>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map(i => (
                                    <img key={i} src={`https://picsum.photos/32/32?random=${i}`} className="size-8 rounded-full border-2 border-white" alt="" />
                                ))}
                            </div>
                            <p>Usado por <strong>+500 dentistas</strong> no Brasil.</p>
                        </div>
                    </div>
                    <div className="relative animate-in fade-in zoom-in duration-1000 delay-200 hidden lg:block">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full transform rotate-12 scale-75"></div>
                        <img
                            src="https://raw.githubusercontent.com/lg-vilela/dental-saas-assets/main/dashboard-preview_mockup.png" // Mock generic URL functionality or assume placeholder
                            onError={(e) => e.currentTarget.src = 'https://placehold.co/800x600/e2e8f0/475569?text=Dashboard+Preview'}
                            alt="Dashboard Preview"
                            className="relative z-10 rounded-2xl shadow-2xl border-4 border-white/50 backdrop-blur-sm"
                        />
                        {/* Floating Cards */}
                        <div className="absolute -bottom-10 -left-10 bg-white p-4 rounded-xl shadow-xl border border-slate-100 animate-bounce delay-700">
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                    <span className="material-symbols-outlined">attach_money</span>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Entrada Confirmada</p>
                                    <p className="font-bold text-slate-900">+ R$ 450,00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Tudo o que você precisa para crescer</h2>
                        <p className="text-slate-500">Substitua planilhas e agendas de papel por uma plataforma completa que trabalha por você.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Agenda Inteligente', desc: 'Confirmações automáticas e gestão visual de horários.', icon: 'calendar_month', color: 'blue' },
                            { title: 'Prontuário Digital', desc: 'Odontograma visual, anamnese e evolução clínica.', icon: 'description', color: 'purple' },
                            { title: 'Controle Financeiro', desc: 'Fluxo de caixa, orçamentos e contas a pagar/receber.', icon: 'payments', color: 'green' },
                            { title: 'Estoque Automático', desc: 'Controle de entrada/saída e alertas de validade.', icon: 'inventory_2', color: 'orange' },
                            { title: 'Telemedicina', desc: 'Integração para consultas online (Em breve).', icon: 'video_call', color: 'pink' },
                            { title: 'Segurança Total', desc: 'Backups diários e conformidade com LGPD.', icon: 'lock', color: 'slate' },
                        ].map((f, i) => (
                            <div key={i} className="p-8 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all bg-slate-50/50 group">
                                <div className={`size-12 rounded-xl bg-${f.color}-100 flex items-center justify-center text-${f.color}-600 mb-6 group-hover:scale-110 transition-transform`}>
                                    <span className="material-symbols-outlined text-2xl">{f.icon}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                                <p className="text-slate-500 leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4 text-white">
                            <span className="material-symbols-outlined">dentistry</span>
                            <span className="font-bold text-xl">Dental SaaS</span>
                        </div>
                        <p className="mb-6 max-w-xs">Software de gestão odontológica feito com paixão e tecnologia de ponta.</p>
                        <div className="flex gap-4">
                            <span className="size-8 bg-slate-800 rounded flex items-center justify-center hover:bg-white hover:text-slate-900 transition-colors cursor-pointer">IG</span>
                            <span className="size-8 bg-slate-800 rounded flex items-center justify-center hover:bg-white hover:text-slate-900 transition-colors cursor-pointer">LI</span>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Produto</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-white cursor-pointer">Recursos</li>
                            <li className="hover:text-white cursor-pointer">Preços</li>
                            <li className="hover:text-white cursor-pointer">Depoimentos</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="hover:text-white cursor-pointer">Termos de Uso</li>
                            <li className="hover:text-white cursor-pointer">Privacidade</li>
                            <li className="hover:text-white cursor-pointer">Contato</li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-xs">
                    <p>&copy; 2026 Dental SaaS. Todos os direitos reservados. Made by Vilela CodeLab.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

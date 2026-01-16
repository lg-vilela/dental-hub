import React, { useState } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';

interface LoginViewProps {
    onLogin: (email: string) => void;
    onSignup: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onSignup }) => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { error } = await signIn(email, password);
            if (error) throw error;
            // onLogin callback might be redundant if App listens to useAuth, 
            // but we keep it for now if it triggered some transition (though App handles it).
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-500">
                <div className="p-8 sm:p-12">
                    <div className="text-center mb-10">
                        <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
                            <span className="material-symbols-outlined text-4xl">dentistry</span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Bem-vindo de volta!</h1>
                        <p className="text-slate-500 mt-2">Acesse sua clínica para gerenciar.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700">E-mail</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="doutor@clinica.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-bold text-slate-700">Senha</label>
                                <a href="#" className="text-xs font-bold text-primary hover:underline">Esqueceu?</a>
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Entrar na Plataforma <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-sm">
                            Ainda não tem conta?{' '}
                            <button onClick={() => {
                                // If using SetupWizard as Signup, we need to switch view in parent.
                                onSignup();
                            }} className="font-bold text-primary hover:underline">
                                Criar Clínica Grátis
                            </button>
                        </p>
                    </div>
                </div>
            </div>

            <p className="mt-8 text-xs text-slate-400 font-medium text-center">
                &copy; 2026 Dental Hub. Developed & Maintained by <a href="#" className="font-bold text-slate-500 hover:text-slate-700">Vilela CodeLab</a>.
            </p>
        </div>
    );
};

export default LoginView;

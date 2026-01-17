import React, { useState } from 'react';
import { useAuth } from '../../src/contexts/AuthContext';

interface LoginViewProps {
    onLogin: (email: string) => void;
    onSignup: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onSignup }) => {
    const { signIn, signInWithGoogle } = useAuth();
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
                        <img src="https://i.postimg.cc/ydfbFRrP/logo-vilelacodelab-removebg-preview.png" alt="Dental Hub" className="h-20 w-auto mx-auto mb-6 object-contain" />
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

                    <div className="mt-8 space-y-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-500 font-bold">Ou continue com</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => signInWithGoogle()}
                            className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                            Continuar com Google
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                        <p className="text-slate-500 text-sm mb-4">Ainda não tem conta?</p>
                        <button
                            onClick={() => onSignup()}
                            className="w-full bg-white border-2 border-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2"
                        >
                            Criar Clínica Grátis <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                        </button>
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

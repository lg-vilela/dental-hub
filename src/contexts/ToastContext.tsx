import React, { createContext, useContext, useState, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({} as ToastContextType);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substring(7);
        setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className="animate-in slide-in-from-right-full fade-in duration-300 pointer-events-auto"
                    >
                        <ToastItem toast={toast} onClose={() => removeToast(toast.id)} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ toast, onClose }: { toast: Toast, onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, toast.duration);
        return () => clearTimeout(timer);
    }, [toast, onClose]);

    const bgColors = {
        success: 'bg-slate-900 border-l-4 border-green-500 text-white',
        error: 'bg-slate-900 border-l-4 border-red-500 text-white',
        info: 'bg-slate-900 border-l-4 border-blue-500 text-white',
        warning: 'bg-slate-900 border-l-4 border-yellow-500 text-white',
    };

    const icons = {
        success: 'check_circle',
        error: 'error',
        info: 'info',
        warning: 'warning'
    };

    return (
        <div className={`${bgColors[toast.type]} shadow-2xl rounded-lg p-4 flex items-center gap-3 min-w-[300px] max-w-md`}>
            <span className="material-symbols-outlined text-xl">{icons[toast.type]}</span>
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-lg">close</span>
            </button>
        </div>
    );
};

export const useToast = () => useContext(ToastContext);

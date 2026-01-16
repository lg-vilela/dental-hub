import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface PremiumFeatureProps {
    children: React.ReactNode;
    access?: boolean; // Direct boolean override
    featureName?: string;
    fallback?: React.ReactNode;
}

const PremiumFeature: React.FC<PremiumFeatureProps> = ({ children, access = true, featureName = 'Recurso Premium', fallback }) => {

    if (access) {
        return <>{children}</>;
    }

    if (fallback) {
        return <>{fallback}</>;
    }

    return (
        <div className="relative group overflow-hidden rounded-xl border border-slate-200">
            {/* Blurred Content */}
            <div className="blur-sm opacity-50 pointer-events-none select-none grayscale" aria-hidden="true">
                {children}
            </div>

            {/* Lock Overlay */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px] p-6 text-center">
                <div className="size-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg mb-4 text-white">
                    <span className="material-symbols-outlined text-3xl">lock</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{featureName}</h3>
                <p className="text-slate-600 mb-6 max-w-xs mx-auto">
                    Faça upgrade para o plano <strong className="text-primary">PRO</strong> para desbloquear este recurso e muito mais.
                </p>
                <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-transform hover:scale-105 shadow-xl flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-400">workspace_premium</span>
                    Fazer Upgrade Agora
                </button>
            </div>
        </div>
    );
};

export default PremiumFeature;

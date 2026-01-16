import { useAuth } from '../contexts/AuthContext';

export const usePermissions = () => {
    const { clinic, isAuthenticated } = useAuth();

    // Default to 'free' if no clinic loaded yet
    const plan = clinic?.plan || 'free';

    const canAddPatient = (currentCount: number) => {
        if (plan === 'free' && currentCount >= 10) return false;
        return true;
    };

    const canAccessFinancials = () => {
        if (plan === 'free') return false;
        return true;
    };

    const canCustomizeBranding = () => {
        if (plan === 'free' || plan === 'pro') return false; // Only Plus
        return true;
    };

    const getPlanLabel = () => {
        switch (plan) {
            case 'free': return 'Plano Grátis';
            case 'pro': return 'Pro';
            case 'plus': return 'Plus';
            default: return 'Grátis';
        }
    };

    return {
        plan,
        canAddPatient,
        canAccessFinancials,
        canCustomizeBranding,
        getPlanLabel,
        isFree: plan === 'free',
        isPro: plan === 'pro',
        isPlus: plan === 'plus'
    };
};

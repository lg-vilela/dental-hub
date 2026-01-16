import { useAuth } from '../contexts/AuthContext';

export const usePermissions = () => {
    const { clinic } = useAuth();

    // Default to 'free' if no clinic loaded yet
    const plan = (clinic?.plan || 'free') as 'free' | 'pro' | 'plus';

    // Definition of Limits based on the Plan Image
    const limits = {
        free: {
            maxPatients: 5,
            maxDentists: 1,
            hasWhatsApp: false,
            hasFinancials: false,
            hasInventory: false,
            hasBranding: false,
            hasMultiUnit: false
        },
        pro: {
            maxPatients: 999999, // Ilimitado
            maxDentists: 10,     // Assumed generous limit for Pro, since it's "Per Clinic" price
            hasWhatsApp: true,
            hasFinancials: true,
            hasInventory: false,
            hasBranding: false,
            hasMultiUnit: false
        },
        plus: {
            maxPatients: 999999, // Ilimitado
            maxDentists: 999999, // Ilimitado
            hasWhatsApp: true,
            hasFinancials: true,
            hasInventory: true,
            hasBranding: true,
            hasMultiUnit: true
        }
    };

    const currentLimits = limits[plan] || limits.free;

    /* Helper Functions for Logic Checks */

    const canAddPatient = (currentCount: number) => {
        return currentCount < currentLimits.maxPatients;
    };

    const canAddDentist = (currentCount: number) => {
        return currentCount < currentLimits.maxDentists;
    };

    /* Feature Flags */
    const canAccessFinancials = currentLimits.hasFinancials;
    const canUseWhatsApp = currentLimits.hasWhatsApp;
    const canManageInventory = currentLimits.hasInventory;
    const canCustomizeBranding = currentLimits.hasBranding;

    const getPlanLabel = () => {
        switch (plan) {
            case 'free': return 'Plano Grátis';
            case 'pro': return 'Plano Pro';
            case 'plus': return 'Plano Plus';
            default: return 'Plano Grátis';
        }
    };

    return {
        plan,
        // Methods
        canAddPatient,
        canAddDentist,
        // Flags
        canAccessFinancials,
        canUseWhatsApp,
        canManageInventory,
        canCustomizeBranding,
        // Metadata
        getPlanLabel,
        isFree: plan === 'free',
        isPro: plan === 'pro',
        isPlus: plan === 'plus',
        // Raw Limits (for UI usage)
        limits: currentLimits
    };
};

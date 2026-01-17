import { useAuth } from '../contexts/AuthContext';

export const usePermissions = () => {
    const { clinic } = useAuth();

    // Default to 'free' if no clinic loaded yet
    const plan = (clinic?.plan || 'free') as 'free' | 'pro' | 'plus';

    // Definition of Limits based on the Plan Image
    const limits = {
        free: {
            maxClients: 5,
            maxUsers: 1,
            hasWhatsApp: false,
            hasFinancials: true,
            hasInventory: false,
            hasBranding: false,
            hasMultiUnit: false
        },
        pro: {
            maxClients: 999999, // Ilimitado
            maxUsers: 10,     // Assumed generous limit for Pro, since it's "Per Clinic" price
            hasWhatsApp: true,
            hasFinancials: true,
            hasInventory: false,
            hasBranding: false,
            hasMultiUnit: false
        },
        plus: {
            maxClients: 999999, // Ilimitado
            maxUsers: 999999, // Ilimitado
            hasWhatsApp: true,
            hasFinancials: true,
            hasInventory: true,
            hasBranding: true,
            hasMultiUnit: true
        }
    };

    const currentLimits = limits[plan] || limits.free;

    /* Helper Functions for Logic Checks */

    const canAddClient = (currentCount: number) => {
        return currentCount < currentLimits.maxClients;
    };

    const canAddUser = (currentCount: number) => {
        return currentCount < currentLimits.maxUsers;
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
        canAddClient,
        canAddUser,
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

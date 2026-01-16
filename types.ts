export interface TenantConfig {
    clinic_id: string;
    name: string;
    subdomain: string;
    status: 'active' | 'suspended';
    plan: 'starter' | 'pro' | 'enterprise';
    branding: {
        primaryColor: string; // Hex for primary
        primaryDark: string;
        primaryLight: string;
        logoIcon: string;
        font: 'manrope' | 'public';
    };
    settings: {
        openingHours: string; // Display text (deprecated or kept for summary)
        openingTime: string; // "08:00"
        closingTime: string; // "19:00"
        slotDuration: number; // minutes
        workingDays: number[]; // 0=Sun, 1=Mon
        maxDoctors: number;
        appointmentsPerMonth: number;
    };
}


export type UserRole = 'admin' | 'dentist' | 'receptionist';

export interface User {
    id: string;
    name: string;
    role: UserRole;
    email: string;
    avatar?: string;
}

export interface NavItem {
    id: string;
    label: string;
    icon: string;
}

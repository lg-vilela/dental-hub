import { TenantConfig } from './types';

export const initialTenants: Record<string, TenantConfig> = {
    'clinic_1': {
        clinic_id: 'clinic_1',
        name: 'Dental Hub',
        subdomain: 'dental-care',
        status: 'active',
        plan: 'pro',
        branding: {
            primaryColor: '#617FA3', // Dental Hub Blue
            primaryDark: '#4A6280',
            primaryLight: '#F0F4F8',
            logoIcon: 'dentistry',
            font: 'manrope'
        },
        settings: {
            openingHours: '08:00 - 18:00',
            openingTime: '08:00',
            closingTime: '18:00',
            slotDuration: 30, // 30 min slots
            workingDays: [1, 2, 3, 4, 5], // Mon-Fri
            maxDoctors: 5,
            appointmentsPerMonth: 200
        }
    },
    'clinic_2': {
        clinic_id: 'clinic_2',
        name: 'DentalCloud',
        subdomain: 'dental-cloud',
        status: 'active',
        plan: 'enterprise',
        branding: {
            primaryColor: '#2997db', // Blue
            primaryDark: '#1e70a3',
            primaryLight: '#e1f5fe',
            logoIcon: 'medical_services',
            font: 'public'
        },
        settings: {
            openingHours: '07:00 - 20:00',
            openingTime: '07:00',
            closingTime: '20:00',
            slotDuration: 15, // High volume
            workingDays: [1, 2, 3, 4, 5, 6], // Mon-Sat
            maxDoctors: 15,
            appointmentsPerMonth: 1000
        }
    }
};

export const financialData = [
    { name: 'Mai', income: 20000, expenses: 15000 },
    { name: 'Jun', income: 35000, expenses: 18000 },
    { name: 'Jul', income: 28000, expenses: 16000 },
    { name: 'Ago', income: 48200, expenses: 22000 },
    { name: 'Set', income: 32000, expenses: 19000 },
    { name: 'Out', income: 42500, expenses: 12450 },
];

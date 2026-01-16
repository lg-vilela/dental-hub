import { supabase } from '../lib/supabase';

export interface Service {
    id: string;
    title: string;
    price: number;
    duration_minutes: number;
    icon: string;
    active: boolean;
}

export const servicesService = {
    async getServices() {
        const { data, error } = await supabase
            .from('services')
            .select('*')
            .order('title');

        if (error) throw error;
        return data as Service[];
    },

    async createService(service: Omit<Service, 'id' | 'active'>) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('Not authenticated');

        // We need the clinic_id.
        // Assuming RLS handles clinic_id insertion automatically based on user context?
        // Actually, usually we need to pass it explicitly unless there's a trigger.
        // Let's get the clinic_id first.
        const { data: clinicData } = await supabase.from('profiles').select('clinic_id').eq('id', userData.user.id).single();

        if (!clinicData?.clinic_id) throw new Error('No clinic found');

        const { data, error } = await supabase
            .from('services')
            .insert([{ ...service, clinic_id: clinicData.clinic_id }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateService(id: string, updates: Partial<Service>) {
        const { data, error } = await supabase
            .from('services')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteService(id: string) {
        const { error } = await supabase
            .from('services')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

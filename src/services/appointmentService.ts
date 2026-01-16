import { supabase } from '../lib/supabase';

export interface Appointment {
    id: string;
    clinic_id: string;
    patient_id: string;
    dentist_id?: string;
    start_time: string;
    end_time: string;
    status: 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no-show';
    notes?: string;
    created_at: string;

    // Joined fields (optional)
    patients?: { full_name: string };
    profiles?: { full_name: string };
}

export const appointmentService = {
    async getAppointments(start: Date, end: Date) {
        const { data, error } = await supabase
            .from('appointments')
            .select(`
                *,
                patients (full_name),
                profiles (full_name)
            `)
            .gte('start_time', start.toISOString())
            .lte('start_time', end.toISOString());

        if (error) throw error;
        return data as Appointment[];
    },

    async createAppointment(appt: Omit<Appointment, 'id' | 'created_at' | 'patients' | 'profiles'>) {
        const { data, error } = await supabase
            .from('appointments')
            .insert(appt)
            .select()
            .single();

        if (error) throw error;
        return data as Appointment;
    },

    async updateStatus(id: string, status: Appointment['status']) {
        const { data, error } = await supabase
            .from('appointments')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Appointment;
    }
};

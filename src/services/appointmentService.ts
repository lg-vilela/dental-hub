import { supabase } from '../lib/supabase';

export interface Appointment {
    id: string;
    clinic_id: string;
    patient_id: string;
    dentist_id?: string;
    service_id?: string; // Added generic service link
    start_time: string;
    end_time: string;
    status: 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no-show';
    notes?: string;
    created_at: string;

    // Joined fields (optional)
    patients?: { full_name: string };
    profiles?: { full_name: string };
    services?: { title: string, duration_minutes: number, price: number };
}

export const appointmentService = {
    async getTodayAppointments() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
            .from('appointments')
            .select(`
                id,
                start_time,
                end_time,
                status,
                patient:patients(full_name),
                profile:profiles(full_name)
            `)
            .gte('start_time', today.toISOString())
            .order('start_time');

        if (error) throw error;

        return data.map((appt: any) => ({
            id: appt.id,
            start_time: appt.start_time,
            end_time: appt.end_time,
            status: appt.status,
            time: new Date(appt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            patientName: appt.patient?.full_name || 'Desconhecido',
            proc: 'Serviço', // Generic placeholder until linked
            doc: appt.profile?.full_name || 'Profissional'
        }));
    }, // Add comma if inserted before other methods or at end of list

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
    },

    async updateAppointment(id: string, updates: Partial<Appointment>) {
        const { data, error } = await supabase
            .from('appointments')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Appointment;
    },

    async deleteAppointment(id: string) {
        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};


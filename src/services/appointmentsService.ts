import { supabase } from '../lib/supabase';

export interface Appointment {
    id: string;
    start_time: string;
    end_time: string;
    status: 'scheduled' | 'confirmed' | 'completed' | 'canceled' | 'no-show';
    patient: {
        full_name: string;
    };
    // We can add service relation later if needed
}

export const appointmentsService = {
    async getTodayAppointments() {
        // Get start and end of today in UTC or local? 
        // Supabase stores UTC.
        // For simplicity in this demo, let's just fetch ALL recent appointments
        // or filter by >= today.

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
            .from('appointments')
            .select(`
                id,
                start_time,
                end_time,
                status,
                patient:patients(full_name)
            `)
            .gte('start_time', today.toISOString())
            .order('start_time');

        if (error) throw error;
        return data.map(appt => ({
            ...appt,
            time: new Date(appt.start_time).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            patientName: (appt.patient as any)?.full_name || 'Desconhecido',
            // Defaulting others for UI compatibility
            proc: 'Consulta',
            doc: 'Dr. Lucas'
        }));
    }
};

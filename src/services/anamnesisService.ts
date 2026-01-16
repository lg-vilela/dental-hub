import { supabase } from '../lib/supabase';

export interface AnamnesisData {
    id?: string;
    patient_id: string;
    answers: {
        hipertensao: boolean;
        diabetes: boolean;
        alergia_medicamento: boolean;
        fumante: boolean;
        cardiaco: boolean;
        gestante: boolean;
        notes?: string;
        [key: string]: any;
    };
    created_at?: string;
}

export const anamnesisService = {
    async getByPatientId(patientId: string) {
        const { data, error } = await supabase
            .from('anamnesis')
            .select('*')
            .eq('patient_id', patientId)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = No Rows Found (Acceptable)
            throw error;
        }
        return data as AnamnesisData | null;
    },

    async save(patientId: string, answers: any) {
        // Check if exists
        const existing = await this.getByPatientId(patientId);

        if (existing) {
            // Update
            const { data, error } = await supabase
                .from('anamnesis')
                .update({ answers })
                .eq('id', existing.id)
                .select()
                .single();
            if (error) throw error;
            return data;
        } else {
            // Create
            // We need clinic_id implicitly via RLS? No, we normally must provide it or have a trigger.
            // Our standard pattern: We must fetch my clinic_id or let the API handle it.
            // But from Client, we must provide it if the table has NOT NULL constraint.
            // Actually, we can fetch it from user session.

            // BETTER: Use a stored procedure OR fetch clinic_id from session in the component and pass it.
            // For now, let's assume we pass it or get it from AuthContext.
            // To keep service clean, we get the session here.

            const { data: { session } } = await supabase.auth.getSession();
            // We need to get the clinic_id from the profile or metadata.
            // Let's assume the component will handle the logic? No, service should do it.
            // We can resolve my_clinic_id via a DB function transparently if we set a default?
            // "default public.get_my_clinic_id()" in schema? No, I defined it as "users can select...".

            // Standard way: Fetch Profile first.
            const { data: profile } = await supabase.from('profiles').select('clinic_id').eq('id', session?.user.id).single();

            if (!profile?.clinic_id) throw new Error("No clinic found");

            const { data, error } = await supabase
                .from('anamnesis')
                .insert({
                    clinic_id: profile.clinic_id,
                    patient_id: patientId,
                    answers
                })
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    }
};

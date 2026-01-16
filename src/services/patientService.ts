import { supabase } from '../lib/supabase';

export interface Patient {
    id: string;
    clinic_id: string;
    full_name: string;
    cpf?: string;
    phone?: string;
    email?: string;
    birth_date?: string;
    created_at: string;
}

export const patientService = {
    async getPatients() {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .order('full_name', { ascending: true });

        if (error) throw error;
        return data as Patient[];
    },

    async getPatient(id: string) {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Patient;
    },

    async createPatient(patient: Omit<Patient, 'id' | 'created_at' | 'clinic_id'>) {
        // Clinic ID is handled by RLS on Insert (via default? No, usually trigger or explicitly passed)
        // Wait, my RLS policy "with check (clinic_id = get_my_clinic_id())" enforces it MATCHES, 
        // but it doesn't auto-fill it unless there's a default.
        // I need to fetch the clinic_id first or trust a trigger.
        // Actually, for simplicity/safety, let's fetch the current user's clinic_id in the component 
        // OR better: let's get it right now from the session.

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // We could fetch the profile/clinic_id here, but that's an extra query.
        // Ideally the caller passes the clinic_id from AuthContext.
        // BUT, RLS `with check` requires the value to be present in the query.

        // Let's assume we pass it or fetch it.
        // Actually, let's get it from the profile table if specific ID is needed.
        // Optimally, AuthContext already has `clinic`.
        // I will update the signature to accept clinic_id or I fetch it.
        // Let's fetch it via a helper or query since services should be standalone.
        // Or simpler: The query MUST include clinic_id.

        // For now, I will modify the standard signature to accept the full object (minus system fields)
        // AND assumption: the Caller (UI) provides the clinic_id from AuthContext.

        // However, typescript shows I typed it as Omit clinic_id.
        // Let's change that to Require clinic_id.
        throw new Error("Use createPatientWithClinicId instead");
    },

    async createPatientWithClinicId(patient: Omit<Patient, 'id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('patients')
            .insert(patient)
            .select()
            .single();

        if (error) throw error;
        return data as Patient;
    },

    async updatePatient(id: string, updates: Partial<Patient>) {
        const { data, error } = await supabase
            .from('patients')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Patient;
    },

    async deletePatient(id: string) {
        const { error } = await supabase
            .from('patients')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

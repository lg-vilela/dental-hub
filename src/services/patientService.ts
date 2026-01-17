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
    },

    // Evolutions
    async getEvolutions(patientId: string) {
        const { data, error } = await supabase
            .from('patient_evolutions')
            .select('*')
            .eq('patient_id', patientId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Evolution[];
    },

    async createEvolution(evolution: Omit<Evolution, 'id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('patient_evolutions')
            .insert(evolution)
            .select()
            .single();

        if (error) throw error;
        return data as Evolution;
    },

    // Files
    async getFiles(patientId: string) {
        const { data, error } = await supabase
            .from('patient_files')
            .select('*')
            .eq('patient_id', patientId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as PatientFile[];
    },

    async createFileRecord(file: Omit<PatientFile, 'id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('patient_files')
            .insert(file)
            .select()
            .single();

        if (error) throw error;
        return data as PatientFile;
    },

    // Odontogram
    async getOdontogram(patientId: string) {
        const { data, error } = await supabase
            .from('patient_odontograms')
            .select('*')
            .eq('patient_id', patientId)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // Ignore Not Found
        return data as OdontogramData | null;
    },

    async saveOdontogram(data: { patient_id: string; clinic_id: string; teeth_data: any }) {
        // Upsert based on patient_id (unique constraint)
        const { data: result, error } = await supabase
            .from('patient_odontograms')
            .upsert(data, { onConflict: 'patient_id' })
            .select()
            .single();

        if (error) throw error;
        return result as OdontogramData;
    }
};

export interface OdontogramData {
    id: string;
    patient_id: string;
    clinic_id: string;
    teeth_data: Record<string, any>;
    updated_at: string;
}

export interface Evolution {
    id: string;
    patient_id: string;
    clinic_id: string;
    title: string;
    description: string;
    type: 'note' | 'proc' | 'pay';
    date: string;
    created_at: string;
}

export interface PatientFile {
    id: string;
    patient_id: string;
    clinic_id: string;
    name: string;
    url: string;
    type: string;
    size?: number;
    created_at: string;
}

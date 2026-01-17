import { supabase } from '../lib/supabase';
import { Client } from '../../types';

// Re-export type for compatibility
export type { Client };

export interface ClientFile {
    id: string;
    client_id: string;
    clinic_id: string;
    name: string;
    url: string;
    type: string;
    size?: number;
    created_at: string;
}

export const clientService = {
    async getClients() {
        const { data, error } = await supabase
            .from('patients') // Keeping table name for now
            .select('*')
            .order('full_name', { ascending: true });

        if (error) throw error;

        // Map DB fields to Client interface if needed
        return (data || []).map(p => ({
            id: p.id,
            name: p.full_name,
            email: p.email,
            phone: p.phone,
            cpf: p.cpf,
            address: p.address || '',
            birthDate: p.birth_date,
            notes: p.notes,
            created_at: p.created_at
        })) as unknown as Client[];
    },

    async getClient(id: string) {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        const p = data;
        return {
            id: p.id,
            name: p.full_name,
            email: p.email,
            phone: p.phone,
            cpf: p.cpf,
            address: p.address || '',
            birthDate: p.birth_date,
            notes: p.notes,
            created_at: p.created_at
        } as unknown as Client;
    },

    async createClientWithClinicId(client: any) {
        // client data comes from UI like { full_name, phone... } matching DB columns usually
        const { data, error } = await supabase
            .from('patients')
            .insert(client)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updateClient(id: string, updates: Partial<Client>) {
        // Simple mapping, assume updates keys match DB or are mapped by caller?
        // Let's safe-map:
        const dbUpdates: any = { ...updates };
        // If UI sends 'name', DB needs 'full_name'
        if (updates.name) { dbUpdates.full_name = updates.name; delete dbUpdates.name; }
        if (updates.birthDate) { dbUpdates.birth_date = updates.birthDate; delete dbUpdates.birthDate; }

        const { data, error } = await supabase
            .from('patients')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async deleteClient(id: string) {
        const { error } = await supabase
            .from('patients')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // Files
    async getFiles(clientId: string) {
        const { data, error } = await supabase
            .from('patient_files')
            .select('*')
            .eq('patient_id', clientId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as ClientFile[];
    },

    async createFileRecord(file: Omit<ClientFile, 'id' | 'created_at'>) {
        const dbFile = {
            ...file,
            patient_id: file.client_id
        };
        // @ts-ignore
        delete dbFile.client_id;

        const { data, error } = await supabase
            .from('patient_files')
            .insert(dbFile)
            .select()
            .single();

        if (error) throw error;
        return data as ClientFile;
    }
};

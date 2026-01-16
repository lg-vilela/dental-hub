import { supabase } from '../lib/supabase';

export interface Reminder {
    id: string;
    clinic_id: string;
    title: string;
    created_by: string;
    assigned_to: string; // profile_id
    status: 'pending' | 'in_progress' | 'done';
    priority: 'low' | 'medium' | 'high';
    due_date?: string;
    created_at: string;
    assignee?: {
        full_name: string;
    };
}

export interface CreateReminderDTO {
    title: string;
    assigned_to: string;
    priority?: 'low' | 'medium' | 'high';
    due_date?: string;
}

export const remindersService = {
    async getReminders() {
        // Fetch reminders and join with profiles to get assignee name
        const { data, error } = await supabase
            .from('reminders')
            .select(`
                *,
                assignee:assigned_to (
                    full_name
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Reminder[];
    },

    async createReminder(reminder: CreateReminderDTO, clinicId: string, userId: string) {
        const { data, error } = await supabase
            .from('reminders')
            .insert({
                clinic_id: clinicId,
                created_by: userId,
                ...reminder
            })
            .select()
            .single();

        if (error) throw error;
        return data as Reminder;
    },

    async updateStatus(id: string, status: 'pending' | 'in_progress' | 'done') {
        const { error } = await supabase
            .from('reminders')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    },

    async deleteReminder(id: string) {
        const { error } = await supabase
            .from('reminders')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async getColleagues(clinicId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, role')
            .eq('clinic_id', clinicId);

        if (error) throw error;
        return data;
    }
};

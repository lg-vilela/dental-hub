import { supabase } from '../lib/supabase';
import { UserProfile } from '../contexts/AuthContext';

export const profileService = {
    async getTeamMembers() {
        // Fetch profiles belonging to the same clinic as the current user
        // This relies on RLS: "Users can view profiles from their clinic"
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('role', { ascending: true }); // Admin first usually (a-z)

        if (error) throw error;
        return data as UserProfile[];
    }
};

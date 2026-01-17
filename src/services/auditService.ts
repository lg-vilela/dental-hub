import { supabase } from '../lib/supabase';

export interface AuditLog {
    id: string;
    clinic_id: string;
    user_id: string;
    action: string;
    details: any;
    ip_address: string;
    created_at: string;
    profiles?: {
        full_name: string;
        email: string;
    };
}

export const auditService = {
    async logAction(action: string, details?: any) {
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) return;

            // Get clinic_id from profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('clinic_id')
                .eq('id', userData.user.id)
                .single();

            if (!profile?.clinic_id) return;

            // Ip address is hard to get reliably client-side without a service, 
            // but we can leave it null or mock it for now, or use a fetch to an ip API.
            // For now, let's leave it null to avoid external dependency block.

            await supabase.from('audit_logs').insert([{
                clinic_id: profile.clinic_id,
                user_id: userData.user.id,
                action,
                details
            }]);
        } catch (error) {
            console.error('Failed to log action:', error);
            // Don't throw, logging shouldn't break the app
        }
    },

    async getLogs(limit = 50) {
        const { data, error } = await supabase
            .from('audit_logs')
            .select(`
                *,
                profiles (
                    full_name,
                    email
                )
            `)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data as AuditLog[];
    }
};

import { supabase } from '../lib/supabase';

export interface BudgetItem {
    id?: string; // Optional for new items before save
    service_id?: string;
    title: string;
    quantity: number;
    unit_price: number;
    subtotal?: number;
}

export interface Budget {
    id: string;
    clinic_id: string;
    patient_id: string;
    status: 'draft' | 'sent' | 'approved' | 'rejected' | 'paid';
    total_value: number;
    notes?: string;
    created_at: string;
    patient?: {
        full_name: string;
    };
    items?: BudgetItem[];
}

export const budgetsService = {
    async getBudgets() {
        // Fetch budgets with patient name
        const { data, error } = await supabase
            .from('budgets')
            .select(`
                *,
                patient:patient_id ( full_name )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Budget[];
    },

    async getBudgetDetails(id: string) {
        const { data, error } = await supabase
            .from('budgets')
            .select(`
                *,
                patient:patient_id ( full_name ),
                items:budget_items ( * )
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as Budget;
    },

    async saveBudget(budget: {
        clinic_id: string,
        patient_id: string,
        total_value: number,
        items: any[],
        notes?: string
    }) {
        const { data, error } = await supabase.rpc('save_budget', {
            p_clinic_id: budget.clinic_id,
            p_patient_id: budget.patient_id,
            p_total_value: budget.total_value,
            p_items: budget.items,
            p_notes: budget.notes
        });

        if (error) throw error;
        return data;
    },

    async updateMultiStatus(id: string, status: string) {
        const { error } = await supabase
            .from('budgets')
            .update({ status })
            .eq('id', id);
        if (error) throw error;
    }
};

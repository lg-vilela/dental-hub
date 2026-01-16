import { supabase } from '../lib/supabase';

export interface Transaction {
    id: string;
    clinic_id: string;
    description: string;
    amount: number;
    type: 'income' | 'expense';
    category: string;
    date: string;
    patient_id?: string;
    created_at: string;
}

export const financialService = {
    async getTransactions() {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        return data as Transaction[];
    },

    async createTransaction(trx: Omit<Transaction, 'id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('transactions')
            .insert(trx)
            .select()
            .single();

        if (error) throw error;
        return data as Transaction;
    },

    async getDashboardStats() {
        // Simple client-side aggregation for MVP
        // Ideally use Supabase RPC for heavy stats
        const trxs = await this.getTransactions();

        const income = trxs.filter(t => t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
        const expense = trxs.filter(t => t.type === 'expense').reduce((acc, t) => acc + Number(t.amount), 0);

        return {
            income,
            expense,
            balance: income - expense,
            recentTransactions: trxs.slice(0, 5)
        };
    }
};

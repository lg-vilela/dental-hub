import { supabase } from '../lib/supabase';

export interface InventoryItem {
    id: string;
    clinic_id: string;
    name: string;
    category: string;
    quantity: number;
    min_quantity: number;
    unit: string;
    cost: number;
    created_at?: string;
}

export const inventoryService = {
    async getItems() {
        const { data, error } = await supabase
            .from('inventory_items')
            .select('*')
            .order('name');

        if (error) throw error;
        return data as InventoryItem[];
    },

    async createItem(item: Omit<InventoryItem, 'id' | 'created_at'>) {
        const { data, error } = await supabase
            .from('inventory_items')
            .insert(item)
            .select()
            .single();

        if (error) throw error;
        return data as InventoryItem;
    },

    async updateItem(id: string, updates: Partial<InventoryItem>) {
        const { data, error } = await supabase
            .from('inventory_items')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as InventoryItem;
    },

    async deleteItem(id: string) {
        const { error } = await supabase
            .from('inventory_items')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

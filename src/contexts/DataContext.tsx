import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { clientService, Client } from '../services/clientService'; // Updated import
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface DataContextType {
    clients: Client[]; // Renamed from patients
    appointments: any[];
    isLoadingClients: boolean; // Renamed
    isLoadingAppointments: boolean;
    refreshClients: () => Promise<void>; // Renamed
    refreshAppointments: () => Promise<void>;
    stats: {
        clientsCount: number; // Renamed
        todayAppointments: number;
    };
}

const DataContext = createContext<DataContextType>({} as DataContextType);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const { clinic, isAuthenticated } = useAuth();
    const [clients, setClients] = useState<Client[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoadingClients, setIsLoadingClients] = useState(false);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

    useEffect(() => {
        if (isAuthenticated && clinic?.id) {
            refreshClients();
            refreshAppointments();
        }
    }, [isAuthenticated, clinic?.id]);

    const refreshClients = useCallback(async () => {
        if (!clinic?.id) return;

        // Initial load show spinner
        if (clients.length === 0) setIsLoadingClients(true);

        try {
            const data = await clientService.getClients();
            // console.log(`[DataContext] Fetched ${data?.length} clients`);
            if (data) {
                setClients(data);
            }
        } catch (error) {
            console.error('[DataContext] Error fetching clients:', error);
        } finally {
            setIsLoadingClients(false);
        }
    }, [clinic?.id, clients.length]);

    const refreshAppointments = useCallback(async () => {
        if (!clinic?.id) return;

        if (appointments.length === 0) setIsLoadingAppointments(true);

        try {
            const { data, error } = await supabase
                .from('appointments')
                .select('*, client:patients(full_name)') // Rename relation alias if possible, or mapping
                // Note: DB relation name is likely 'patient' or based on FK.
                // If table is 'patients', Supabase usually uses 'patients' unless aliased.
                // Let's use 'patients' for now but map it if needed.
                // Actually, let's keep it 'patient:patients(full_name)' to avoid breaking DB query if 'client' alias not defined.
                // But wait, the consuming code might expect 'client'.
                // Ideally, we select '*, patient:patients(full_name)' and then map it?
                // Or just alias in query: 'client:patients(full_name)' works if Supabase supports it.
                // Yes, Supabase/PostgREST supports resource embedding with alias: `patients(full_name)` -> `patient` props.
                // To rename prop to `client`, use `client:patients(full_name)`.
                .eq('clinic_id', clinic.id)
                .order('start_time', { ascending: true });

            if (error) throw error;
            if (data) setAppointments(data);
        } catch (error) {
            console.error('[DataContext] Error fetching appointments:', error);
        } finally {
            setIsLoadingAppointments(false);
        }
    }, [clinic?.id, appointments.length]);

    const stats = {
        clientsCount: clients.length,
        todayAppointments: appointments.filter(a => {
            const date = new Date(a.start_time);
            const today = new Date();
            return date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear();
        }).length
    };

    return (
        <DataContext.Provider value={{
            clients,
            appointments,
            isLoadingClients,
            isLoadingAppointments,
            refreshClients,
            refreshAppointments,
            stats
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { patientService, Patient } from '../services/patientService';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface DataContextType {
    patients: Patient[];
    appointments: any[];
    isLoadingPatients: boolean;
    isLoadingAppointments: boolean;
    refreshPatients: () => Promise<void>;
    refreshAppointments: () => Promise<void>;
    stats: {
        patientsCount: number;
        todayAppointments: number;
    };
}

const DataContext = createContext<DataContextType>({} as DataContextType);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const { clinic, isAuthenticated } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoadingPatients, setIsLoadingPatients] = useState(false);
    const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);

    useEffect(() => {
        if (isAuthenticated && clinic?.id) {
            refreshPatients();
            refreshAppointments();
        }
    }, [isAuthenticated, clinic?.id]);

    const refreshPatients = useCallback(async () => {
        if (!clinic?.id) return;

        // Initial load show spinner, background refresh does not
        if (patients.length === 0) setIsLoadingPatients(true);

        try {
            const data = await patientService.getPatients();
            console.log(`[DataContext] Fetched ${data?.length} patients for clinic ${clinic.id}`);

            // Safety check: specific case where RLS might return [] but no error
            // If we have patients effectively in memory, and suddenly we get 0, could be a glitch?
            // Unless user deleted them all. But for now let's trust the DB but log it.
            if (data) {
                setPatients(data);
            }
        } catch (error) {
            console.error('[DataContext] Error fetching patients:', error);
        } finally {
            setIsLoadingPatients(false);
        }
    }, [clinic?.id, patients.length]);

    const refreshAppointments = useCallback(async () => {
        if (!clinic?.id) return;

        if (appointments.length === 0) setIsLoadingAppointments(true);

        try {
            const { data, error } = await supabase
                .from('appointments')
                .select('*, patient:patients(full_name)')
                .eq('clinic_id', clinic.id)
                .order('start_time', { ascending: true }); // optimize limit later

            if (error) throw error;
            console.log(`[DataContext] Fetched ${data?.length} appointments`);
            if (data) setAppointments(data);
        } catch (error) {
            console.error('[DataContext] Error fetching appointments:', error);
        } finally {
            setIsLoadingAppointments(false);
        }
    }, [clinic?.id, appointments.length]);

    const stats = {
        patientsCount: patients.length,
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
            patients,
            appointments,
            isLoadingPatients,
            isLoadingAppointments,
            refreshPatients,
            refreshAppointments,
            stats
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => useContext(DataContext);

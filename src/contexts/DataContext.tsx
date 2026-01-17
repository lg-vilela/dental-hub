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
        setIsLoadingPatients(true);
        try {
            const data = await patientService.getPatients();
            setPatients(data || []);
        } catch (error) {
            console.error('Error fetching patients:', error);
        } finally {
            setIsLoadingPatients(false);
        }
    }, [clinic?.id]);

    const refreshAppointments = useCallback(async () => {
        if (!clinic?.id) return;
        setIsLoadingAppointments(true);
        try {
            const { data, error } = await supabase
                .from('appointments')
                .select('*, patient:patients(full_name)')
                .eq('clinic_id', clinic.id)
                .order('start_time', { ascending: true });

            if (error) throw error;
            setAppointments(data || []);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        } finally {
            setIsLoadingAppointments(false);
        }
    }, [clinic?.id]);

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

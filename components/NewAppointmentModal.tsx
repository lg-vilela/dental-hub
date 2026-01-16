import React, { useState } from 'react';

interface NewAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        patient: '',
        date: new Date().toISOString().split('T')[0],
        time: '10:30 AM',
        procedure: 'Limpeza Regular',
        doctor: 'Dr. Sarah Smith'
    });

    if (!isOpen) return null;

    const handleSave = () => {
        if (!formData.patient) {
            alert('Por favor, informe o nome do paciente.');
            return;
        }
        alert(`Agendamento confirmado para ${formData.patient} com ${formData.doctor} em ${formData.date} às ${formData.time}.`);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="w-full h-full p-8"><button onClick={onClose}>Close</button></div>
            </div>
        </div>
    );
};

export default NewAppointmentModal;

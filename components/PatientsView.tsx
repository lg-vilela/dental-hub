import React, { useState } from 'react';
import OdontogramView from './OdontogramView';

// 5b. Digital Anamnesis
const AnamnesisTab = () => {
    const [answers, setAnswers] = useState<Record<string, boolean>>({
        'hipertensao': false,
        'diabetes': false,
        'alergia_medicamento': true,
        'fumante': false,
        'cardiaco': false
    });

    const toggle = (key: string) => setAnswers(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 items-start">
                <span className="material-symbols-outlined text-red-500">warning</span>
                <div>
                    <h4 className="font-bold text-red-900">Alertas Médicos</h4>
                    <p className="text-sm text-red-700">Paciente alérgico a <span className="font-bold">Penicilina</span> e <span className="font-bold">Dipirona</span>.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { id: 'hipertensao', label: 'Hipertensão / Pressão Alta' },
                    { id: 'diabetes', label: 'Diabetes' },
                    { id: 'alergia_medicamento', label: 'Alergia a Medicamentos' },
                    { id: 'fumante', label: 'Fumante / Tabagista' },
                    { id: 'cardiaco', label: 'Problemas Cardíacos' },
                    { id: 'gestante', label: 'Gestante / Lactante' }
                ].map(q => (
                    <div key={q.id} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                        <span className="font-medium text-slate-700">{q.label}</span>
                        <button
                            onClick={() => toggle(q.id)}
                            className={`w-12 h-6 rounded-full transition-colors relative ${answers[q.id] ? 'bg-primary' : 'bg-slate-200'}`}
                        >
                            <div className={`size-4 bg-white rounded-full absolute top-1 transition-transform ${answers[q.id] ? 'left-7' : 'left-1'}`}></div>
                        </button>
                    </div>
                ))}
            </div>

            <div className="space-y-2">
                <label className="font-bold text-slate-700">Observações Adicionais</label>
                <textarea className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 h-32 resize-none" placeholder="Digite detalhes sobre as condições de saúde..."></textarea>
            </div>

            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
                <span className="material-symbols-outlined">save</span> Salvar Anamnese
            </button>
        </div>
    );
};

// 5c. Evolution Timeline
const EvolutionTab = () => {
    const events = [
        { date: 'Hoje, 14:30', type: 'proc', title: 'Restauração Dente 14', desc: 'Resina composta A2, 2 faces.', author: 'Dr. Lucas' },
        { date: '15 Jan, 2026', type: 'note', title: 'Paciente se queixou de dor', desc: 'Sensibilidade térmica no quadrante inferior esquerdo.', author: 'Dra. Ana' },
        { date: '10 Dez, 2025', type: 'pay', title: 'Pagamento Realizado', desc: 'R$ 450,00 referente à Limpeza.', author: 'Recepção' },
    ];

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex gap-4 mb-8">
                <input type="text" placeholder="Adicionar anotação de evolução..." className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary" />
                <button className="bg-primary text-white px-6 py-3 rounded-xl font-bold">Adicionar</button>
            </div>

            <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
                {events.map((e, i) => (
                    <div key={i} className="pl-8 relative group">
                        <div className={`absolute -left-[9px] top-0 size-4 rounded-full border-2 border-white shadow-sm ${e.type === 'proc' ? 'bg-blue-500' : e.type === 'pay' ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-slate-900">{e.title}</h4>
                                <span className="text-xs font-bold text-slate-400">{e.date}</span>
                            </div>
                            <p className="text-slate-600 mb-2">{e.desc}</p>
                            <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">person</span> {e.author}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 5d. Files / Media
const FilesTab = () => {
    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Upload Placeholder */}
                <div className="aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 hover:border-slate-400 cursor-pointer transition-colors">
                    <span className="material-symbols-outlined text-4xl mb-2">cloud_upload</span>
                    <span className="font-bold text-sm">Adicionar Arquivo</span>
                </div>

                {/* Mock Images */}
                {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-square bg-slate-200 rounded-xl relative overflow-hidden group cursor-pointer">
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-xs font-bold">Raio-X Panorâmico</p>
                            <p className="text-[10px] opacity-80">12/01/2024</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 5a. Patient List
const PatientList = ({ onSelect }: { onSelect: (p: any) => void }) => {
    const patients = [
        { id: 1, name: 'João Silva', age: 34, phone: '(11) 99999-1234', lastVisit: '12 Jan, 2026', status: 'Em Tratamento' },
        { id: 2, name: 'Maria Souza', age: 28, phone: '(11) 98888-5678', lastVisit: '10 Jan, 2026', status: 'Manutenção' },
        { id: 3, name: 'Pedro Alves', age: 45, phone: '(11) 97777-4321', lastVisit: '05 Dez, 2025', status: 'Avaliação' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">search</span>
                    <input type="text" placeholder="Buscar pacientes..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>
                <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-[20px]">person_add</span> Novo Paciente
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-slate-500">Paciente</th>
                            <th className="px-6 py-4 font-bold text-slate-500">Contato</th>
                            <th className="px-6 py-4 font-bold text-slate-500">Última Visita</th>
                            <th className="px-6 py-4 font-bold text-slate-500">Status</th>
                            <th className="px-6 py-4 font-bold text-slate-500">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {patients.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">{p.name.charAt(0)}</div>
                                        <div>
                                            <p className="font-bold text-slate-900">{p.name}</p>
                                            <p className="text-xs text-slate-400">{p.age} anos</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{p.phone}</td>
                                <td className="px-6 py-4 text-sm text-slate-600">{p.lastVisit}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${p.status === 'Em Tratamento' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                                        {p.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => onSelect(p)} className="text-primary font-bold text-sm hover:underline">Abrir Prontuário</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// 5b. Patient Detail (Formerly PatientRecord)
const PatientDetail = ({ patient, onBack }: { patient: any, onBack: () => void }) => {
    const [activeTab, setActiveTab] = useState<'odontogram' | 'anamnesis' | 'evolution' | 'files'>('odontogram');

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in slide-in-from-right-4">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="size-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 className="text-2xl font-bold text-slate-900">Prontuário: <span className="text-slate-500">{patient.name}</span></h2>
                </div>
                <div className="flex bg-white p-1 rounded-xl border border-slate-200 gap-1">
                    {[
                        { id: 'odontogram', label: 'Odontograma', icon: 'dentistry' },
                        { id: 'anamnesis', label: 'Anamnese', icon: 'assignment_ind' },
                        { id: 'evolution', label: 'Evolução', icon: 'history' },
                        { id: 'files', label: 'Arquivos', icon: 'folder_open' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                        >
                            <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                {activeTab === 'odontogram' && <OdontogramView />}
                {activeTab === 'anamnesis' && <AnamnesisTab />}
                {activeTab === 'evolution' && <EvolutionTab />}
                {activeTab === 'files' && <FilesTab />}
            </div>
        </div>
    );
};

// 5c. Patients View Container
const PatientsView = () => {
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedPatient, setSelectedPatient] = useState<any>(null);

    const handleSelect = (p: any) => {
        setSelectedPatient(p);
        setView('detail');
    };

    const handleBack = () => {
        setSelectedPatient(null);
        setView('list');
    };

    if (view === 'detail' && selectedPatient) {
        return <PatientDetail patient={selectedPatient} onBack={handleBack} />;
    }

    return <PatientList onSelect={handleSelect} />;
};

export default PatientsView;

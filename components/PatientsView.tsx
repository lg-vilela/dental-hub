import React, { useState, useEffect } from 'react';
import OdontogramView from './OdontogramView';

// 5b. Digital Anamnesis
// 5b. Digital Anamnesis
import { anamnesisService } from '../src/services/anamnesisService';
import { useToast } from '../src/contexts/ToastContext';
import { usePermissions } from '../src/hooks/usePermissions';
import { patientService, Patient } from '../src/services/patientService';
import { AddPatientModal } from './patients/AddPatientModal';
import { useAuth } from '../src/contexts/AuthContext';



const AnamnesisTab = ({ patientId }: { patientId: string }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [answers, setAnswers] = useState<Record<string, any>>({
        'hipertensao': false,
        'diabetes': false,
        'alergia_medicamento': false,
        'fumante': false,
        'cardiaco': false,
        'gestante': false,
        'notes': ''
    });

    useEffect(() => {
        loadAnamnesis();
    }, [patientId]);

    const loadAnamnesis = async () => {
        setIsLoading(true);
        try {
            const data = await anamnesisService.getByPatientId(patientId);
            if (data?.answers) {
                setAnswers(data.answers);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const { showToast } = useToast();

    // ... useEffect ...

    // ... loadAnamnesis ...

    const handleSave = async () => {
        try {
            await anamnesisService.save(patientId, answers);
            showToast('Anamnese salva com sucesso!', 'success');
        } catch (error) {
            console.error(error);
            showToast('Erro ao salvar anamnese.', 'error');
        }
    };

    const toggle = (key: string) => setAnswers(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
            {/* Alerts Section (Dynamic) */}
            {(answers.alergia_medicamento || answers.hipertensao || answers.diabetes || answers.cardiaco) && (
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex gap-3 items-start">
                    <span className="material-symbols-outlined text-red-500">warning</span>
                    <div>
                        <h4 className="font-bold text-red-900">Alertas Médicos</h4>
                        <ul className="text-sm text-red-700 list-disc list-inside">
                            {answers.alergia_medicamento && <li>Paciente possui alergia a medicamentos.</li>}
                            {answers.hipertensao && <li>Histórico de Hipertensão.</li>}
                            {answers.diabetes && <li>Histórico de Diabetes.</li>}
                            {answers.cardiaco && <li>Condição Cardíaca.</li>}
                        </ul>
                    </div>
                </div>
            )}

            {isLoading ? <p>Carregando anamnese...</p> : (
                <>
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
                        <textarea
                            value={answers.notes || ''}
                            onChange={(e) => setAnswers(prev => ({ ...prev, notes: e.target.value }))}
                            className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 h-32 resize-none"
                            placeholder="Digite detalhes sobre as condições de saúde..."
                        ></textarea>
                    </div>

                    <button onClick={handleSave} className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
                        <span className="material-symbols-outlined">save</span> Salvar Anamnese
                    </button>
                </>
            )}
        </div>
    );
};


// 5c. Evolution Timeline
const EvolutionTab = () => {

    const { showToast } = useToast();
    const [note, setNote] = useState('');
    const [events, setEvents] = useState([
        { date: 'Hoje, 14:30', type: 'proc', title: 'Restauração Dente 14', desc: 'Resina composta A2, 2 faces.', author: 'Dr. Lucas' },
        { date: '15 Jan, 2026', type: 'note', title: 'Paciente se queixou de dor', desc: 'Sensibilidade térmica no quadrante inferior esquerdo.', author: 'Dra. Ana' },
        { date: '10 Dez, 2025', type: 'pay', title: 'Pagamento Realizado', desc: 'R$ 450,00 referente à Limpeza.', author: 'Recepção' },
    ]);

    const handleAddNote = () => {
        if (!note.trim()) return;

        const newEvent = {
            date: 'Agora',
            type: 'note',
            title: 'Nova Anotação',
            desc: note,
            author: 'Você'
        };

        setEvents([newEvent, ...events]);
        setNote('');
        showToast('Evolução registrada com sucesso!', 'success');
    };

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex gap-4 mb-8">
                <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Adicionar anotação de evolução..."
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-primary"
                />
                <button onClick={handleAddNote} className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-all">Adicionar</button>
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
    const { canAddPatient, isFree } = usePermissions();
    const { clinic } = useAuth(); // Just to track updates if needed, RLS handles security
    const [patients, setPatients] = useState<Patient[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchPatients = async () => {
        console.log("PatientsView: Starting fetch...");
        setIsLoading(true);
        try {
            const data = await patientService.getPatients();
            console.log("PatientsView: Success, count=", data.length);
            setPatients(data);
        } catch (error) {
            console.error("PatientsView: Error fetching patients:", error);
        } finally {
            console.log("PatientsView: Finally block reached. Loading=false");
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p =>
        p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone?.includes(searchTerm) ||
        p.cpf?.includes(searchTerm)
    );

    const canAdd = canAddPatient(patients.length);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">search</span>
                    <input
                        type="text"
                        placeholder="Buscar pacientes..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 items-center">
                    {isFree && (
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                            {patients.length} / 5 Pacientes (Grátis)
                        </span>
                    )}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={!canAdd}
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group relative"
                    >
                        <span className="material-symbols-outlined text-[20px]">person_add</span> Novo Paciente

                        {!canAdd && (
                            <div className="absolute bottom-full mb-2 right-0 w-48 bg-slate-900 text-white text-xs p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                Limite do plano Grátis atingido. Faça upgrade para adicionar mais.
                            </div>
                        )}
                    </button>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-500">Paciente</th>
                                <th className="px-6 py-4 font-bold text-slate-500">Contato</th>
                                <th className="px-6 py-4 font-bold text-slate-500">Cadastro</th>
                                <th className="px-6 py-4 font-bold text-slate-500">Status</th>
                                <th className="px-6 py-4 font-bold text-slate-500">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">Carregando pacientes...</td>
                                </tr>
                            ) : filteredPatients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">
                                        {searchTerm ? 'Nenhum paciente encontrado para a busca.' : 'Nenhum paciente cadastrado.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredPatients.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">{p.full_name.charAt(0)}</div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{p.full_name}</p>
                                                    <p className="text-xs text-slate-400">{p.birth_date ? 'Nasc: ' + new Date(p.birth_date).toLocaleDateString() : 'Idade n/a'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">
                                            <div>{p.phone || '-'}</div>
                                            <div className="text-xs text-slate-400">{p.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600">{new Date(p.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-bold bg-green-50 text-green-700`}>
                                                Ativo
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => onSelect(p)} className="text-primary font-bold text-sm hover:underline">Abrir Prontuário</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddPatientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchPatients}
            />
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
                    <h2 className="text-2xl font-bold text-slate-900">Prontuário: <span className="text-slate-500">{patient.full_name || patient.name}</span></h2>
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
                {activeTab === 'anamnesis' && <AnamnesisTab patientId={patient.id} />}
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

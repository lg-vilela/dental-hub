import React, { useState, useEffect } from 'react';
import { useToast } from '../src/contexts/ToastContext';
import { usePermissions } from '../src/hooks/usePermissions';
import { clientService } from '../src/services/clientService';
import { AddClientModal } from './clients/AddClientModal';
import { useAuth } from '../src/contexts/AuthContext';
import { useData } from '../src/contexts/DataContext';

// 5d. Files / Media
const FilesTab = ({ clientId }: { clientId: string }) => {
    const { clinic } = useAuth();
    const { showToast } = useToast();
    const [files, setFiles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadFiles();
    }, [clientId]);

    const loadFiles = async () => {
        setIsLoading(true);
        try {
            const data = await clientService.getFiles(clientId);
            setFiles(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !clinic?.id) return;

        try {
            showToast('Fazendo upload...', 'info');
            await new Promise(resolve => setTimeout(resolve, 1000));

            const newFile = await clientService.createFileRecord({
                client_id: clientId,
                clinic_id: clinic.id,
                name: file.name,
                url: '#',
                type: file.type,
                size: file.size
            });

            setFiles([newFile, ...files]);
            showToast('Arquivo adicionado com sucesso!', 'success');
        } catch (error) {
            console.error(error);
            showToast('Erro ao salvar arquivo.', 'error');
        }
    };

    return (
        <div className="p-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <label className="aspect-square bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 hover:border-slate-400 cursor-pointer transition-colors relative">
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                    <span className="material-symbols-outlined text-4xl mb-2">cloud_upload</span>
                    <span className="font-bold text-sm text-center px-2">Adicionar Arquivo</span>
                </label>

                {isLoading ? (
                    <div className="col-span-3 flex items-center text-slate-400">Carregando arquivos...</div>
                ) : files.length === 0 ? (
                    <div className="col-span-3 flex items-center text-slate-400">Nenhum arquivo anexado.</div>
                ) : (
                    files.map((file, i) => (
                        <div key={file.id || i} className="aspect-square bg-slate-100 rounded-xl relative overflow-hidden group cursor-pointer border border-slate-200 hover:border-primary/50 transition-colors">
                            <div className="flex flex-col items-center justify-center h-full p-4">
                                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">
                                    {file.type.includes('image') ? 'image' : file.type.includes('pdf') ? 'picture_as_pdf' : 'description'}
                                </span>
                                <p className="text-xs font-bold text-center text-slate-700 truncate w-full">{file.name}</p>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-[10px] opacity-80">{new Date(file.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// 5a. Client List
const ClientList = ({ onSelect }: { onSelect: (p: any) => void }) => {
    const { canAddClient, isFree } = usePermissions(); // Keep permissions hook for now
    const { clients, isLoadingClients, refreshClients } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredClients = clients.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone?.includes(searchTerm) ||
        p.cpf?.includes(searchTerm)
    );

    const canAdd = canAddClient(clients.length); // Assume hook still expects a number

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400">search</span>
                    <input
                        type="text"
                        placeholder="Buscar clientes..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 items-center">
                    {isFree && (
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                            {clients.length} / 5 Clientes (Grátis)
                        </span>
                    )}
                    <button
                        onClick={refreshClients}
                        disabled={isLoadingClients}
                        className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-xl transition-all"
                        title="Recarregar lista"
                    >
                        <span className={`material-symbols-outlined ${isLoadingClients ? 'animate-spin' : ''}`}>refresh</span>
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={!canAdd}
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group relative"
                    >
                        <span className="material-symbols-outlined text-[20px]">person_add</span> Novo Cliente
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
                                <th className="px-6 py-4 font-bold text-slate-500">Cliente</th>
                                <th className="px-6 py-4 font-bold text-slate-500">Contato</th>
                                <th className="px-6 py-4 font-bold text-slate-500">Cadastro</th>
                                <th className="px-6 py-4 font-bold text-slate-500">Status</th>
                                <th className="px-6 py-4 font-bold text-slate-500">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoadingClients ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">Carregando clientes...</td>
                                </tr>
                            ) : filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-400">
                                        {searchTerm ? 'Nenhum cliente encontrado.' : 'Nenhum cliente cadastrado.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredClients.map(p => (
                                    <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">{p.name?.charAt(0)}</div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{p.name}</p>
                                                    <p className="text-xs text-slate-400">{p.birthDate ? 'Nasc: ' + new Date(p.birthDate).toLocaleDateString() : ''}</p>
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
                                            <button onClick={() => onSelect(p)} className="text-primary font-bold text-sm hover:underline">Ver Detalhes</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={refreshClients}
            />
        </div>
    );
};

// 5b. Client Detail
const ClientDetail = ({ client, onBack }: { client: any, onBack: () => void }) => {
    // Only "files" tab for now, maybe "history" (appointments)
    const [activeTab, setActiveTab] = useState<'files'>('files');

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in slide-in-from-right-4 print:h-auto print:overflow-visible">
            <div className="flex justify-between items-center mb-6 print:hidden">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="size-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <h2 className="text-2xl font-bold text-slate-900">Cliente: <span className="text-slate-500">{client.name}</span></h2>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => window.print()}
                        className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">print</span> <span className="hidden sm:inline">Exportar PDF</span>
                    </button>
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 gap-1">
                        {[
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
            </div>

            <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col print:border-none print:shadow-none">
                {activeTab === 'files' && <FilesTab clientId={client.id} />}
            </div>
        </div>
    );
};

// 5c. Clients View Container
const ClientsView = () => {
    const [view, setView] = useState<'list' | 'detail'>('list');
    const [selectedClient, setSelectedClient] = useState<any>(null);

    const handleSelect = (p: any) => {
        setSelectedClient(p);
        setView('detail');
    };

    const handleBack = () => {
        setSelectedClient(null);
        setView('list');
    };

    if (view === 'detail' && selectedClient) {
        return <ClientDetail client={selectedClient} onBack={handleBack} />;
    }

    return <ClientList onSelect={handleSelect} />;
};

export default ClientsView;

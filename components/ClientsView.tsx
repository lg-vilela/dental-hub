import React, { useState, useEffect } from 'react';
import { useToast } from '../src/contexts/ToastContext';
import { usePermissions } from '../src/hooks/usePermissions';
import { clientService } from '../src/services/clientService';
import { AddClientModal } from './clients/AddClientModal';
import { useAuth } from '../src/contexts/AuthContext';
import { useData } from '../src/contexts/DataContext';

// 5d. Files / Media


// 5a. Client List
// 5a. Client List
const ClientList = () => {
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoadingClients ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-400">Carregando clientes...</td>
                                </tr>
                            ) : filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-400">
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



// 5c. Clients View Container
const ClientsView = () => {
    return <ClientList />;
};

export default ClientsView;

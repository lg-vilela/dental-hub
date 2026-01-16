import React, { useState, useEffect } from 'react';
import { financialService, Transaction } from '../src/services/financialService';
import { budgetsService, Budget } from '../src/services/budgetsService';
import { servicesService, Service } from '../src/services/servicesService';
import { useAuth } from '../src/contexts/AuthContext';
import { useToast } from '../src/contexts/ToastContext';
import { supabase } from '../src/lib/supabase';

// 6a. Cash Flow Dashboard
const CashFlowTab = () => {
    const { clinic } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // Quick Add Form State


    const loadData = async () => {
        setIsLoading(true);
        try {
            const data = await financialService.getDashboardStats();
            setStats({
                income: data.income,
                expense: data.expense,
                balance: data.balance
            });
            // We can get full list too if needed, getDashboardStats returns recent.
            // Let's rely on dashboard stats logic which fetches all.
            // Wait, getDashboardStats calls getTransactions inside.
            // Let's just use getTransactions directly for the list to be sure.
            const all = await financialService.getTransactions();
            setTransactions(all);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const [newTrx, setNewTrx] = useState({ description: '', amount: '', type: 'income', category: 'Tratamento', date: new Date().toISOString().split('T')[0] });
    const { showToast } = useToast();

    useEffect(() => {
        loadData();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();

        // Debugging Clinic Availability
        if (!clinic?.id) {
            console.error('Clinic Data Missing:', { clinic });
            showToast('Erro: Dados da clínica não carregados. Recarregue a página.', 'error');
            return;
        }

        try {
            await financialService.createTransaction({
                clinic_id: clinic.id,
                description: newTrx.description,
                amount: parseFloat(newTrx.amount),
                type: newTrx.type,
                category: newTrx.category,
                date: newTrx.date
            });
            showToast('Transação registrada com sucesso!', 'success');
            setShowAddForm(false);
            setNewTrx({ ...newTrx, description: '', amount: '' });
            loadData();
        } catch (err: any) {
            console.error(err);
            showToast('Erro ao salvar: ' + (err.message || 'Erro desconhecido'), 'error');
        }
    };

    const formatMoney = (val: number) => {
        return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
            {/* Action Bar */}
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-700">Visão Geral</h3>
                <button onClick={() => setShowAddForm(!showAddForm)} className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-700 transition-colors">
                    {showAddForm ? 'Cancelar' : 'Nova Transação'}
                </button>
            </div>

            {/* Quick Add Form */}
            {showAddForm && (
                <form onSubmit={handleAdd} className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-slate-500 mb-1">Descrição</label>
                        <input required type="text" className="w-full px-3 py-2 border rounded-lg" value={newTrx.description} onChange={e => setNewTrx({ ...newTrx, description: e.target.value })} placeholder="Ex: Pagamento Consulta" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Valor</label>
                        <input required type="number" step="0.01" className="w-full px-3 py-2 border rounded-lg" value={newTrx.amount} onChange={e => setNewTrx({ ...newTrx, amount: e.target.value })} placeholder="0.00" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Tipo</label>
                        <select className="w-full px-3 py-2 border rounded-lg" value={newTrx.type} onChange={e => setNewTrx({ ...newTrx, type: e.target.value as any })}>
                            <option value="income">Receita (+)</option>
                            <option value="expense">Despesa (-)</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 h-[42px]">Salvar</button>
                </form>
            )}

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
                    <span className="text-sm font-bold text-slate-500">Receita Total</span>
                    <span className="text-3xl font-bold text-green-600">{formatMoney(stats.income)}</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
                    <span className="text-sm font-bold text-slate-500">Despesas</span>
                    <span className="text-3xl font-bold text-red-600">{formatMoney(stats.expense)}</span>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2">
                    <span className="text-sm font-bold text-slate-500">Balanço</span>
                    <span className={`text-3xl font-bold ${stats.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatMoney(stats.balance)}</span>
                </div>
            </div>

            {/* Transactions List */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <h3 className="font-bold text-slate-900 mb-4">Histórico de Transações</h3>
                <div className="flex-1 overflow-y-auto space-y-4 max-h-[400px]">
                    {isLoading ? (
                        <p className="text-center text-slate-400">Carregando...</p>
                    ) : transactions.length === 0 ? (
                        <p className="text-center text-slate-400 py-8">Nenhuma transação registrada.</p>
                    ) : (
                        transactions.map((t) => (
                            <div key={t.id} className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`size-8 rounded-full flex items-center justify-center ${t.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        <span className="material-symbols-outlined text-sm">{t.type === 'income' ? 'arrow_downward' : 'arrow_upward'}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">{t.description}</p>
                                        <p className="text-xs text-slate-400">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className={`text-sm font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-900'}`}>
                                    {t.type === 'income' ? '+' : '-'} {formatMoney(t.amount)}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

// 6b. Budget / Treatment Plans (Still Mocked or Hidden for now? Let's hide it to avoid confusion or keep as "Coming Soon")
// 6b. Budget / Treatment Plans
const BudgetsTab = () => {
    const { clinic } = useAuth();
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const { showToast } = useToast();

    // Form State
    const [patients, setPatients] = useState<any[]>([]);
    const [availableServices, setAvailableServices] = useState<Service[]>([]);

    const [selectedPatient, setSelectedPatient] = useState('');
    const [notes, setNotes] = useState('');
    const [items, setItems] = useState<{ service_id: string, title: string, quantity: number, unit_price: number }[]>([]);

    useEffect(() => {
        loadBudgets();
    }, []);

    const loadBudgets = async () => {
        setIsLoading(true);
        try {
            const data = await budgetsService.getBudgets();
            setBudgets(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const startCreation = async () => {
        setIsCreating(true);
        // Load dependencies
        try {
            // Fetch simplified patients list
            const { data: pats } = await supabase.from('patients').select('id, full_name').order('full_name');
            setPatients(pats || []);

            const svcs = await servicesService.getServices();
            setAvailableServices(svcs);

            // Reset form
            setItems([]);
            setSelectedPatient('');
            setNotes('');
        } catch (err) {
            console.error(err);
        }
    };

    const addItem = () => {
        setItems([...items, { service_id: '', title: '', quantity: 1, unit_price: 0 }]);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        if (field === 'service_id') {
            const service = availableServices.find(s => s.id === value);
            newItems[index].service_id = value;
            if (service) {
                newItems[index].title = service.title;
                newItems[index].unit_price = service.price;
            }
        } else {
            (newItems[index] as any)[field] = value;
        }
        setItems(newItems);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculateTotal = () => items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);

    const handleSaveBudget = async () => {
        if (!selectedPatient || items.length === 0 || !clinic) return alert('Preencha os dados.');

        try {
            await budgetsService.saveBudget({
                clinic_id: clinic.id,
                patient_id: selectedPatient,
                total_value: calculateTotal(),
                items: items,
                notes: notes
            });
            showToast('Orçamento salvo com sucesso!', 'success');
            setIsCreating(false);
            loadBudgets();
        } catch (error) {
            console.error(error);
            showToast('Erro ao salvar orçamento.', 'error');
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await budgetsService.updateMultiStatus(id, newStatus);
            setBudgets(budgets.map(b => b.id === id ? { ...b, status: newStatus as any } : b));
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-700">Orçamentos & Tratamentos</h3>
                <button
                    onClick={() => isCreating ? setIsCreating(false) : startCreation()}
                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${isCreating ? 'bg-slate-200 text-slate-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                >
                    {isCreating ? 'Cancelar' : 'Novo Orçamento'}
                </button>
            </div>

            {isCreating && (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Paciente</label>
                            <select
                                className="w-full p-3 rounded-xl border border-slate-200 bg-white"
                                value={selectedPatient}
                                onChange={e => setSelectedPatient(e.target.value)}
                            >
                                <option value="">Selecione...</option>
                                {patients.map(p => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Observações</label>
                            <input
                                type="text"
                                className="w-full p-3 rounded-xl border border-slate-200 bg-white"
                                placeholder="Ex: Válido por 15 dias..."
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-bold text-sm text-slate-500">Procedimentos</h4>
                            <button onClick={addItem} className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">add</span> Adicionar Item
                            </button>
                        </div>

                        <div className="space-y-3">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex gap-3 items-center">
                                    <select
                                        className="flex-[2] p-2 rounded-lg border border-slate-200 text-sm"
                                        value={item.service_id}
                                        onChange={e => updateItem(idx, 'service_id', e.target.value)}
                                    >
                                        <option value="">Selecione o serviço...</option>
                                        {availableServices.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Título customizado"
                                        className="flex-[2] p-2 rounded-lg border border-slate-200 text-sm"
                                        value={item.title}
                                        onChange={e => updateItem(idx, 'title', e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        className="w-20 p-2 rounded-lg border border-slate-200 text-sm"
                                        value={item.quantity}
                                        onChange={e => updateItem(idx, 'quantity', parseInt(e.target.value))}
                                        min="1"
                                    />
                                    <input
                                        type="number"
                                        className="w-24 p-2 rounded-lg border border-slate-200 text-sm"
                                        value={item.unit_price}
                                        onChange={e => updateItem(idx, 'unit_price', parseFloat(e.target.value))}
                                    />
                                    <div className="w-24 text-right font-bold text-slate-600 text-sm">
                                        R$ {(item.quantity * item.unit_price).toFixed(2)}
                                    </div>
                                    <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-600">
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            ))}
                            {items.length === 0 && <p className="text-center text-slate-400 text-sm italic py-2">Nenhum item adicionado.</p>}
                        </div>

                        <div className="mt-6 flex justify-end items-center gap-4">
                            <div className="text-right">
                                <span className="block text-xs text-slate-400 uppercase font-bold">Total Estimado</span>
                                <span className="text-2xl font-black text-slate-900">R$ {calculateTotal().toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleSaveBudget}
                                className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all"
                            >
                                Salvar Orçamento
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Data</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Paciente</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Valor</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {budgets.map(b => (
                            <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-sm text-slate-600">{new Date(b.created_at).toLocaleDateString()}</td>
                                <td className="p-4 font-bold text-slate-900">{b.patient?.full_name || 'Desconhecido'}</td>
                                <td className="p-4 font-mono text-sm text-slate-600">R$ {b.total_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase
                                        ${b.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            b.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                                b.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                                                    'bg-slate-100 text-slate-500'}`}>
                                        {b.status}
                                    </span>
                                </td>
                                <td className="p-4 flex gap-2">
                                    {b.status === 'draft' && (
                                        <button onClick={() => handleStatusChange(b.id, 'approved')} className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded hover:bg-green-100">
                                            Aprovar
                                        </button>
                                    )}
                                    {b.status === 'approved' && (
                                        <button
                                            onClick={async () => {
                                                if (confirm('Confirmar pagamento e lançar no caixa?')) {
                                                    try {
                                                        await budgetsService.convertToTransaction(b);
                                                        setBudgets(budgets.map(bg => bg.id === b.id ? { ...bg, status: 'paid' } : bg));
                                                        showToast('Pagamento registrado no caixa!', 'success');
                                                        // Optionally refresh cash flow tab if we switch to it
                                                    } catch (e: any) {
                                                        console.error(e);
                                                        showToast('Erro ao registrar: ' + e.message, 'error');
                                                    }
                                                }
                                            }}
                                            className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100"
                                        >
                                            Receber & Lançar
                                        </button>
                                    )}
                                    <button className="text-slate-400 hover:text-slate-600">
                                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {budgets.length === 0 && !isLoading && (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-400">Nenhum orçamento cadastrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// 6. Financials Container
import PremiumFeature from './common/PremiumFeature';
import { usePermissions } from '../src/hooks/usePermissions';

const FinancialsView = () => {
    const { canAccessFinancials } = usePermissions();
    const [activeTab, setActiveTab] = useState<'cashflow' | 'budgets'>('cashflow');

    return (
        <PremiumFeature access={canAccessFinancials} featureName="Módulo Financeiro">
            <div className="flex flex-col h-[calc(100vh-140px)]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Financeiro</h2>
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 gap-1">
                        {[
                            { id: 'cashflow', label: 'Fluxo de Caixa', icon: 'monitoring' },
                            { id: 'budgets', label: 'Orçamentos', icon: 'receipt_long' },
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
                    {activeTab === 'cashflow' && <CashFlowTab />}
                    {activeTab === 'budgets' && <BudgetsTab />}
                </div>
            </div>
        </PremiumFeature>
    );
};

export default FinancialsView;

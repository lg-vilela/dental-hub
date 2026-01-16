import React, { useState, useEffect } from 'react';
import { financialService, Transaction } from '../src/services/financialService';
import { useAuth } from '../src/contexts/AuthContext';

// 6a. Cash Flow Dashboard
const CashFlowTab = () => {
    const { clinic } = useAuth();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [stats, setStats] = useState({ income: 0, expense: 0, balance: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);

    // Quick Add Form State
    const [newTrx, setNewTrx] = useState({
        description: '',
        amount: '',
        type: 'income' as 'income' | 'expense',
        category: 'Outros',
        date: new Date().toISOString().split('T')[0]
    });

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

    useEffect(() => {
        loadData();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clinic) return;
        try {
            await financialService.createTransaction({
                clinic_id: clinic.id,
                description: newTrx.description,
                amount: parseFloat(newTrx.amount),
                type: newTrx.type,
                category: newTrx.category,
                date: newTrx.date
            });
            setShowAddForm(false);
            setNewTrx({ ...newTrx, description: '', amount: '' });
            loadData();
        } catch (err) {
            alert('Erro ao adicionar transação');
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
const BudgetsTab = () => {
    return (
        <div className="p-12 text-center text-slate-400">
            <span className="material-symbols-outlined text-6xl mb-4">construction</span>
            <p className="text-lg font-bold text-slate-600">Módulo de Orçamentos em Desenvolvimento</p>
            <p className="text-sm">Em breve você poderá criar e aprovar orçamentos integrados aos pacientes.</p>
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

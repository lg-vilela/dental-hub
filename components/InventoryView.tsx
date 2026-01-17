import React, { useState, useEffect } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import { useToast } from '../src/contexts/ToastContext';
import { inventoryService, InventoryItem, Supplier } from '../src/services/inventoryService';

type Tab = 'inventory' | 'suppliers';

const InventoryView = () => {
    const { clinic } = useAuth();
    const { showToast } = useToast();
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>('inventory');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Inventory Form State
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [itemForm, setItemForm] = useState({
        name: '', category: 'Material de Consumo', qty: 0, min: 5, unit: 'Unidades', cost: 0
    });

    // Supplier Form State
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [supplierForm, setSupplierForm] = useState({
        name: '', contact: '', phone: '', email: '', category: 'Geral', tax_id: ''
    });

    useEffect(() => {
        if (clinic?.id) loadData();
    }, [clinic, activeTab]);

    const loadData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'inventory') {
                const data = await inventoryService.getItems();
                setItems(data);
            } else {
                const data = await inventoryService.getSuppliers();
                setSuppliers(data);
            }
        } catch (error) {
            console.error(error);
            showToast('Erro ao carregar dados.', 'error');
        } finally {
            setIsLoading(false);
        }
    };



    const handleSaveItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clinic?.id) return;

        try {
            if (editingItem) {
                await inventoryService.updateItem(editingItem.id, {
                    name: itemForm.name,
                    category: itemForm.category,
                    quantity: Number(itemForm.qty),
                    min_quantity: Number(itemForm.min),
                    unit: itemForm.unit,
                    cost: Number(itemForm.cost)
                });
                showToast('Item atualizado!', 'success');
            } else {
                await inventoryService.createItem({
                    clinic_id: clinic.id,
                    name: itemForm.name,
                    category: itemForm.category,
                    quantity: Number(itemForm.qty),
                    min_quantity: Number(itemForm.min),
                    unit: itemForm.unit,
                    cost: Number(itemForm.cost)
                });
                showToast('Item criado!', 'success');
            }
            closeModal();
            loadData();
        } catch (error) {
            console.error(error);
            showToast('Erro ao salvar item.', 'error');
        }
    };

    const handleSaveSupplier = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clinic?.id) return;

        try {
            if (editingSupplier) {
                await inventoryService.updateSupplier(editingSupplier.id, {
                    name: supplierForm.name,
                    contact_name: supplierForm.contact,
                    phone: supplierForm.phone,
                    email: supplierForm.email,
                    category: supplierForm.category,
                    tax_id: supplierForm.tax_id
                });
                showToast('Fornecedor atualizado!', 'success');
            } else {
                await inventoryService.createSupplier({
                    clinic_id: clinic.id,
                    name: supplierForm.name,
                    contact_name: supplierForm.contact,
                    phone: supplierForm.phone,
                    email: supplierForm.email,
                    category: supplierForm.category,
                    tax_id: supplierForm.tax_id
                });
                showToast('Fornecedor cadastrado!', 'success');
            }
            closeModal();
            loadData();
        } catch (error) {
            console.error(error);
            showToast('Erro ao salvar fornecedor.', 'error');
        }
    };

    const openModal = (item?: any) => {
        if (activeTab === 'inventory') {
            if (item) {
                setEditingItem(item);
                setItemForm({
                    name: item.name, category: item.category, qty: item.quantity,
                    min: item.min_quantity, unit: item.unit, cost: item.cost
                });
            } else {
                setEditingItem(null);
                resetItemForm();
            }
        } else {
            if (item) {
                setEditingSupplier(item);
                setSupplierForm({
                    name: item.name, contact: item.contact_name || '', phone: item.phone || '',
                    email: item.email || '', category: item.category || 'Geral', tax_id: item.tax_id || ''
                });
            } else {
                setEditingSupplier(null);
                resetSupplierForm();
            }
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setEditingSupplier(null);
    };

    const resetItemForm = () => {
        setItemForm({ name: '', category: 'Material de Consumo', qty: 0, min: 5, unit: 'Unidades', cost: 0 });
    };

    const resetSupplierForm = () => {
        setSupplierForm({ name: '', contact: '', phone: '', email: '', category: 'Geral', tax_id: '' });
    };

    const getStatus = (qty: number, min: number) => {
        if (qty <= min) return { label: 'Baixo Estoque', color: 'red' };
        if (qty <= min * 1.5) return { label: 'Atenção', color: 'amber' };
        return { label: 'Normal', color: 'emerald' };
    };

    // KPIs Logic
    const totalValue = items.reduce((acc, item) => acc + (item.cost * item.quantity), 0);
    const criticalItems = items.filter(i => i.quantity <= i.min_quantity).length;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Estoque & Compras</h2>
                <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 gap-1 transition-colors">
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors ${activeTab === 'inventory' ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                        Estoque
                    </button>
                    <button
                        onClick={() => setActiveTab('suppliers')}
                        className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors ${activeTab === 'suppliers' ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                    >
                        <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                        Fornecedores
                    </button>
                </div>
            </div>

            {/* KPIs */}
            {activeTab === 'inventory' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between transition-colors">
                        <div>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Valor em Estoque</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                            </h3>
                        </div>
                        <div className="size-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <span className="material-symbols-outlined">attach_money</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between transition-colors">
                        <div>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Itens Críticos</p>
                            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">{criticalItems} Itens</h3>
                        </div>
                        <div className="size-12 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                            <span className="material-symbols-outlined">warning</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between transition-colors">
                        <div>
                            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">Total de Produtos</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{items.length} SKUs</h3>
                        </div>
                        <div className="size-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <span className="material-symbols-outlined">inventory_2</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden min-h-[400px] transition-colors">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{activeTab === 'inventory' ? 'Estoque Atual' : 'Lista de Fornecedores'}</h3>
                    <button
                        onClick={() => openModal()}
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined">add</span> {activeTab === 'inventory' ? 'Novo Item' : 'Novo Fornecedor'}
                    </button>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center text-slate-400">Carregando dados...</div>
                ) : activeTab === 'inventory' ? (
                    /* Inventory List */
                    items.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                            <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-full mb-4">
                                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-500">inventory_2</span>
                            </div>
                            <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300">Seu estoque está vazio.</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mt-2">Comece adicionando materiais para controlar seu laboratório.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Item</th>
                                        <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Categoria</th>
                                        <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-right">Qtd.</th>
                                        <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-center">Status</th>
                                        <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {items.map(item => {
                                        const status = getStatus(item.quantity, item.min_quantity);
                                        return (
                                            <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                                                    <p className="text-xs text-slate-400">{item.unit}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-bold text-slate-600 dark:text-slate-300">{item.category}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono font-medium text-slate-700 dark:text-slate-300">{item.quantity}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-${status.color}-100 dark:bg-${status.color}-900/30 text-${status.color}-700 dark:text-${status.color}-400 border border-${status.color}-200 dark:border-${status.color}-800`}>
                                                        <div className={`size-1.5 rounded-full bg-${status.color}-500`}></div> {status.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => openModal(item)}
                                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-primary transition-colors"
                                                        title="Editar Item"
                                                    >
                                                        <span className="material-symbols-outlined">edit</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    /* Suppliers List */
                    suppliers.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                            <div className="bg-slate-50 dark:bg-slate-700 p-6 rounded-full mb-4">
                                <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-500">local_shipping</span>
                            </div>
                            <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300">Nenhum fornecedor cadastrado.</h4>
                            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mt-2">Cadastre seus parceiros para facilitar as compras.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                                    <tr>
                                        <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Fornecedor</th>
                                        <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Contato</th>
                                        <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400">Categoria</th>
                                        <th className="px-6 py-4 font-bold text-slate-500 dark:text-slate-400 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                    {suppliers.map(sup => (
                                        <tr key={sup.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-900 dark:text-white">{sup.name}</p>
                                                <p className="text-xs text-slate-400">{sup.email || sup.phone || '-'}</p>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                                {sup.contact_name || '-'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs font-bold text-slate-600 dark:text-slate-300">{sup.category}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => openModal(sup)}
                                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-primary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined">edit</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-in zoom-in-50 duration-300">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">
                            {activeTab === 'inventory' ? (editingItem ? 'Editar Item' : 'Novo Item') : (editingSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor')}
                        </h2>

                        {activeTab === 'inventory' ? (
                            /* Inventory Form */
                            <form onSubmit={handleSaveItem} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Nome do Item</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-700 dark:text-white"
                                        placeholder="Ex: Anestésico Lidocaína"
                                        value={itemForm.name}
                                        onChange={e => setItemForm({ ...itemForm, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Categoria</label>
                                        <select
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium dark:text-white"
                                            value={itemForm.category}
                                            onChange={e => setItemForm({ ...itemForm, category: e.target.value })}
                                        >
                                            <option>Material de Consumo</option>
                                            <option>Medicamentos</option>
                                            <option>Instrumental</option>
                                            <option>Descartáveis</option>
                                            <option>Ortodontia</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Unidade</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm dark:text-white"
                                            placeholder="Ex: Caixas, Unidades"
                                            value={itemForm.unit}
                                            onChange={e => setItemForm({ ...itemForm, unit: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Quantidade Atual</label>
                                        <input
                                            required
                                            type="number"
                                            min="0"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg font-mono font-bold text-slate-800 dark:text-white"
                                            value={Number(itemForm.qty).toString()} // Remove leading zeros
                                            onChange={e => setItemForm({ ...itemForm, qty: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Estoque Mínimo</label>
                                        <input
                                            required
                                            type="number"
                                            min="1"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg font-mono font-medium text-slate-600 dark:text-slate-400"
                                            value={Number(itemForm.min).toString()}
                                            onChange={e => setItemForm({ ...itemForm, min: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Custo Unitário (R$)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono dark:text-white"
                                        placeholder="0.00"
                                        value={itemForm.cost || ''}
                                        onChange={e => setItemForm({ ...itemForm, cost: Number(e.target.value) })}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-black text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.02] transition-all flex justify-center items-center gap-2 mt-4"
                                >
                                    <span className="material-symbols-outlined">save</span>
                                    {editingItem ? 'Salvar Alterações' : 'Adicionar ao Estoque'}
                                </button>
                            </form>
                        ) : (
                            /* Supplier Form */
                            <form onSubmit={handleSaveSupplier} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Nome da Empresa</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-700 dark:text-white"
                                        placeholder="Ex: Dental Cremer"
                                        value={supplierForm.name}
                                        onChange={e => setSupplierForm({ ...supplierForm, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Categoria</label>
                                        <select
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium dark:text-white"
                                            value={supplierForm.category}
                                            onChange={e => setSupplierForm({ ...supplierForm, category: e.target.value })}
                                        >
                                            <option>Geral</option>
                                            <option>Equipamentos</option>
                                            <option>Descartáveis</option>
                                            <option>Laboratório</option>
                                            <option>Manutenção</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Tax ID / CNPJ</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm dark:text-white"
                                            placeholder="Opcional"
                                            value={supplierForm.tax_id}
                                            onChange={e => setSupplierForm({ ...supplierForm, tax_id: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Nome do Contato</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm dark:text-white"
                                        placeholder="Ex: João Silva"
                                        value={supplierForm.contact}
                                        onChange={e => setSupplierForm({ ...supplierForm, contact: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Telefone / WhatsApp</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm dark:text-white"
                                            placeholder="(00) 00000-0000"
                                            value={supplierForm.phone}
                                            onChange={e => setSupplierForm({ ...supplierForm, phone: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm dark:text-white"
                                            placeholder="contato@empresa.com"
                                            value={supplierForm.email}
                                            onChange={e => setSupplierForm({ ...supplierForm, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-black text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.02] transition-all flex justify-center items-center gap-2 mt-4"
                                >
                                    <span className="material-symbols-outlined">save</span>
                                    {editingSupplier ? 'Salvar Fornecedor' : 'Cadastrar Fornecedor'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryView;

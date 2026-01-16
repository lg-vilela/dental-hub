import React, { useState, useEffect } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import { useToast } from '../src/contexts/ToastContext';
import { inventoryService, InventoryItem } from '../src/services/inventoryService';

const InventoryView = () => {
    const { clinic } = useAuth();
    const { showToast } = useToast();
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [formData, setFormData] = useState({
        name: '', category: 'Material de Consumo', qty: 0, min: 5, unit: 'Unidades', cost: 0
    });

    useEffect(() => {
        if (clinic?.id) loadItems();
    }, [clinic]);

    const loadItems = async () => {
        setIsLoading(true);
        try {
            const data = await inventoryService.getItems();
            setItems(data);
        } catch (error) {
            console.error(error);
            showToast('Erro ao carregar estoque.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clinic?.id) return;

        try {
            if (editingItem) {
                // Edit
                await inventoryService.updateItem(editingItem.id, {
                    name: formData.name,
                    category: formData.category,
                    quantity: Number(formData.qty),
                    min_quantity: Number(formData.min),
                    unit: formData.unit,
                    cost: Number(formData.cost)
                });
                showToast('Item atualizado com sucesso!', 'success');
            } else {
                // Create
                await inventoryService.createItem({
                    clinic_id: clinic.id,
                    name: formData.name,
                    category: formData.category,
                    quantity: Number(formData.qty),
                    min_quantity: Number(formData.min),
                    unit: formData.unit,
                    cost: Number(formData.cost)
                });
                showToast('Item adicionado com sucesso!', 'success');
            }
            setIsModalOpen(false);
            setEditingItem(null);
            resetForm();
            loadItems();
        } catch (error) {
            console.error(error);
            showToast('Erro ao salvar item.', 'error');
        }
    };

    const openModal = (item?: InventoryItem) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                category: item.category,
                qty: item.quantity,
                min: item.min_quantity,
                unit: item.unit,
                cost: item.cost
            });
        } else {
            setEditingItem(null);
            resetForm();
        }
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({ name: '', category: 'Material de Consumo', qty: 0, min: 5, unit: 'Unidades', cost: 0 });
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
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500">Valor em Estoque</p>
                        <h3 className="text-2xl font-bold text-slate-900">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalValue)}
                        </h3>
                    </div>
                    <div className="size-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <span className="material-symbols-outlined">attach_money</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500">Itens Críticos</p>
                        <h3 className="text-2xl font-bold text-red-600">{criticalItems} Itens</h3>
                    </div>
                    <div className="size-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                        <span className="material-symbols-outlined">warning</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500">Total de Produtos</p>
                        <h3 className="text-2xl font-bold text-slate-900">{items.length} SKUs</h3>
                    </div>
                    <div className="size-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <span className="material-symbols-outlined">inventory_2</span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 text-lg">Estoque Atual</h3>
                    <button
                        onClick={() => openModal()}
                        className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
                    >
                        <span className="material-symbols-outlined">add</span> Novo Item
                    </button>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center text-slate-400">Carregando estoque...</div>
                ) : items.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                        <div className="bg-slate-50 p-6 rounded-full mb-4">
                            <span className="material-symbols-outlined text-4xl text-slate-300">inventory_2</span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-700">Seu estoque está vazio.</h4>
                        <p className="text-slate-500 text-sm max-w-sm mt-2">Comece adicionando materiais, medicamentos e descartáveis para controlar seu laboratório.</p>
                        <button
                            onClick={() => openModal()}
                            className="mt-6 text-primary font-bold hover:underline"
                        >
                            Adicionar Primeiro Item
                        </button>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 font-bold text-slate-500">Item</th>
                                <th className="px-6 py-4 font-bold text-slate-500">Categoria</th>
                                <th className="px-6 py-4 font-bold text-slate-500 text-right">Qtd.</th>
                                <th className="px-6 py-4 font-bold text-slate-500 text-center">Status</th>
                                <th className="px-6 py-4 font-bold text-slate-500 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map(item => {
                                const status = getStatus(item.quantity, item.min_quantity);
                                return (
                                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{item.name}</p>
                                            <p className="text-xs text-slate-400">{item.unit}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">{item.category}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-mono font-medium text-slate-700">{item.quantity}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-${status.color}-100 text-${status.color}-700 border border-${status.color}-200`}>
                                                <div className={`size-1.5 rounded-full bg-${status.color}-500`}></div> {status.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => openModal(item)}
                                                className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-primary transition-colors"
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
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative animate-in zoom-in-50 duration-300">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <h2 className="text-xl font-black text-slate-900 mb-6">
                            {editingItem ? 'Editar Item' : 'Novo Item no Estoque'}
                        </h2>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nome do Item</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-700"
                                    placeholder="Ex: Anestésico Lidocaína"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoria</label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Material de Consumo</option>
                                        <option>Medicamentos</option>
                                        <option>Instrumental</option>
                                        <option>Descartáveis</option>
                                        <option>Ortodontia</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Unidade</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
                                        placeholder="Ex: Caixas, Unidades"
                                        value={formData.unit}
                                        onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Quantidade Atual</label>
                                    <input
                                        required
                                        type="number"
                                        min="0"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg font-mono font-bold text-slate-800"
                                        value={Number(formData.qty).toString()} // Remove leading zeros
                                        onChange={e => setFormData({ ...formData, qty: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estoque Mínimo</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg font-mono font-medium text-slate-600"
                                        value={Number(formData.min).toString()}
                                        onChange={e => setFormData({ ...formData, min: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Custo Unitário (R$)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                                    placeholder="0.00"
                                    value={formData.cost || ''}
                                    onChange={e => setFormData({ ...formData, cost: Number(e.target.value) })}
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
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryView;

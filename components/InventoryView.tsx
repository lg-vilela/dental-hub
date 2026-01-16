import React, { useState } from 'react';

// 6d. Inventory Management (Phase 7)
const InventoryView = () => {
    const [items, setItems] = useState([
        { id: 1, name: 'Anestésico Lidocaína', cat: 'Medicamentos', qty: 45, min: 20, unit: 'Ampolas', cost: 12.50 },
        { id: 2, name: 'Luvas de Látex (P)', cat: 'Descartáveis', qty: 12, min: 50, unit: 'Caixas', cost: 25.00 }, // Low
        { id: 3, name: 'Resina Composta A2', cat: 'Restaurador', qty: 8, min: 5, unit: 'Seringas', cost: 85.00 },
        { id: 4, name: 'Sugador Descartável', cat: 'Descartáveis', qty: 200, min: 100, unit: 'Unidades', cost: 0.15 },
        { id: 5, name: 'Agulha Gengival 30G', cat: 'Descartáveis', qty: 85, min: 30, unit: 'Unidades', cost: 0.40 },
    ]);

    const getStatus = (qty: number, min: number) => {
        if (qty <= min) return { label: 'Baixo Estoque', color: 'red' };
        if (qty <= min * 1.5) return { label: 'Atenção', color: 'amber' };
        return { label: 'Normal', color: 'emerald' };
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500">Valor em Estoque</p>
                        <h3 className="text-2xl font-bold text-slate-900">R$ 1.840,00</h3>
                    </div>
                    <div className="size-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <span className="material-symbols-outlined">attach_money</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500">Itens Críticos</p>
                        <h3 className="text-2xl font-bold text-red-600">1 Item</h3>
                    </div>
                    <div className="size-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600">
                        <span className="material-symbols-outlined">warning</span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500">Total de Produtos</p>
                        <h3 className="text-2xl font-bold text-slate-900">5 SKUs</h3>
                    </div>
                    <div className="size-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                        <span className="material-symbols-outlined">inventory_2</span>
                    </div>
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-900 text-lg">Estoque Atual</h3>
                    <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors">
                        <span className="material-symbols-outlined">add</span> Novo Item
                    </button>
                </div>
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
                            const status = getStatus(item.qty, item.min);
                            return (
                                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-slate-900">{item.name}</p>
                                        <p className="text-xs text-slate-400">{item.unit}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">{item.cat}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-mono font-medium text-slate-700">{item.qty}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-${status.color}-100 text-${status.color}-700 border border-${status.color}-200`}>
                                            <div className={`size-1.5 rounded-full bg-${status.color}-500`}></div> {status.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined">edit</span></button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryView;

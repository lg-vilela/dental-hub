import React, { useState } from 'react';

// Types for the Odontogram
export type ToothCondition = 'healthy' | 'caries' | 'restoration' | 'crown' | 'missing' | 'implant';

export interface ToothState {
    id: number;
    condition: ToothCondition;
    notes?: string;
}

// SVG Paths for a generic Molar (simplified for MVP)
export const ToothSVG: React.FC<{ num: number; condition?: ToothCondition; onClick: () => void }> = ({ num, condition, onClick }) => {
    // Determine color based on condition
    let fillColor = 'fill-white';
    let strokeColor = 'stroke-slate-300';

    switch (condition) {
        case 'caries': fillColor = 'fill-red-400'; break;
        case 'restoration': fillColor = 'fill-blue-400'; break;
        case 'crown': fillColor = 'fill-amber-300'; break;
        case 'missing': fillColor = 'fill-slate-100 opacity-20'; break;
        case 'implant': fillColor = 'fill-purple-300'; break;
    }

    return (
        <div onClick={onClick} className="flex flex-col items-center gap-1 cursor-pointer group transition-transform hover:scale-110">
            <span className="text-xs font-bold text-slate-400 select-none">{num}</span>
            <svg width="40" height="60" viewBox="0 0 40 60" className={`drop-shadow-sm transition-all ${fillColor} ${strokeColor} stroke-2`}>
                {/* Crown */}
                <path d="M5 15 Q 10 5, 20 5 Q 30 5, 35 15 L 35 35 Q 30 45, 20 45 Q 10 45, 5 35 Z" />
                {/* Root (Visual only) */}
                <path d="M10 45 L 15 55 L 20 45 L 25 55 L 30 45" fill="none" className="stroke-slate-300 opacity-50" />
            </svg>
            {condition && condition !== 'healthy' && (
                <div className={`size-2 rounded-full mt-1 ${fillColor.replace('fill-', 'bg-')}`}></div>
            )}
        </div>
    );
};

// 5a. Odontogram View
const OdontogramView = () => {
    const [selectedTool, setSelectedTool] = useState<ToothCondition | 'clear'>('healthy');
    const [teeth, setTeeth] = useState<Record<number, ToothState>>({});

    // Adult dentition (11-18, 21-28, 31-38, 41-48)
    const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
    const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
    const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38].reverse();
    const lowerRight = [41, 42, 43, 44, 45, 46, 47, 48].reverse();

    const handleToothClick = (id: number) => {
        if (selectedTool === 'clear') {
            const newTeeth = { ...teeth };
            delete newTeeth[id];
            setTeeth(newTeeth);
            return;
        }

        if (selectedTool === 'healthy') {
            // Just unmark for now
            const newTeeth = { ...teeth };
            delete newTeeth[id];
            setTeeth(newTeeth);
            return;
        }

        setTeeth(prev => ({
            ...prev,
            [id]: { id, condition: selectedTool }
        }));
    };

    const tools: { id: ToothCondition | 'clear', label: string, color: string, icon: string }[] = [
        { id: 'caries', label: 'Cárie', color: 'bg-red-500', icon: 'coronavirus' },
        { id: 'restoration', label: 'Restauração', color: 'bg-blue-500', icon: 'build_circle' },
        { id: 'crown', label: 'Coroa', color: 'bg-amber-400', icon: 'diamond' },
        { id: 'implant', label: 'Implante', color: 'bg-purple-500', icon: 'hardware' },
        { id: 'missing', label: 'Ausente', color: 'bg-slate-300', icon: 'cancel' },
        { id: 'clear', label: 'Limpar', color: 'bg-white border text-slate-500', icon: 'backspace' },
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-140px)]">
            {/* Header (Removed in favor of Tab Container) */}

            {/* Odontogram Toolbar */}
            <div className="bg-white p-4 border border-slate-200 rounded-2xl flex justify-center gap-4 shadow-sm z-10 mb-6">
                {tools.map(tool => (
                    <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all w-24 gap-2 ${selectedTool === tool.id ? 'bg-slate-900 text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                    >
                        <div className={`size-8 rounded-full flex items-center justify-center ${tool.id === 'clear' ? '' : tool.color} ${tool.id === 'clear' || selectedTool === tool.id ? '' : 'bg-opacity-20 text-' + tool.color.split('-')[1] + '-600'}`}>
                            {tool.id === 'clear' && <span className="material-symbols-outlined">backspace</span>}
                            {tool.id !== 'clear' && <div className={`size-3 rounded-full bg-white`}></div>}
                        </div>
                        <span className="text-xs font-bold">{tool.label}</span>
                    </button>
                ))}
            </div>

            {/* Canvas */}
            <div className="flex-1 bg-slate-100/50 p-10 overflow-auto flex items-center justify-center relative rounded-3xl border border-slate-200">
                <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-200/60 relative scale-90 sm:scale-100">
                    {/* Crosshair / Midline */}
                    <div className="absolute top-1/2 left-0 w-full h-px bg-slate-100"></div>
                    <div className="absolute top-0 left-1/2 h-full w-px bg-slate-100"></div>

                    {/* Upper Arch */}
                    <div className="flex gap-12 mb-12 relative z-10">
                        <div className="flex gap-2">
                            {upperRight.map(id => <ToothSVG key={id} num={id} condition={teeth[id]?.condition} onClick={() => handleToothClick(id)} />)}
                        </div>
                        <div className="flex gap-2">
                            {upperLeft.map(id => <ToothSVG key={id} num={id} condition={teeth[id]?.condition} onClick={() => handleToothClick(id)} />)}
                        </div>
                    </div>

                    {/* Lower Arch */}
                    <div className="flex gap-12 relative z-10">
                        <div className="flex gap-2">
                            {lowerRight.map(id => <ToothSVG key={id} num={id} condition={teeth[id]?.condition} onClick={() => handleToothClick(id)} />)}
                        </div>
                        <div className="flex gap-2">
                            {lowerLeft.map(id => <ToothSVG key={id} num={id} condition={teeth[id]?.condition} onClick={() => handleToothClick(id)} />)}
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-6 left-6 bg-white p-4 rounded-xl border border-slate-200 shadow-lg max-w-xs animate-in slide-in-from-left-4">
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">info</span>
                        Resumo
                    </h4>
                    <p className="text-sm text-slate-500">
                        {Object.keys(teeth).length === 0
                            ? "Nenhum procedimento marcado."
                            : `${Object.keys(teeth).length} dente(s) com alterações registradas.`
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OdontogramView;

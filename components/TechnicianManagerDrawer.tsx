import React, { useState } from 'react';

interface TechnicianManagerDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    technicians: any[];
    onAdd: (name: string) => void;
    onDelete: (id: string) => void;
}

const TechnicianManagerDrawer: React.FC<TechnicianManagerDrawerProps> = ({
    isOpen,
    onClose,
    technicians,
    onAdd,
    onDelete
}) => {
    const [newName, setNewName] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim()) return;
        onAdd(newName.trim());
        setNewName('');
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-end">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[2.5rem] shadow-2xl p-6 animate-slide-up max-h-[85vh] flex flex-col">
                <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6 shrink-0" />

                <div className="flex items-center justify-between mb-6 shrink-0">
                    <h2 className="text-xl font-black dark:text-white">Gerenciar Técnicos</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mb-8 shrink-0">
                    <div className="flex gap-2">
                        <input
                            autoFocus
                            className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="Nome do novo técnico..."
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-primary text-white px-6 rounded-xl font-bold text-sm active:scale-95 transition-all shadow-lg shadow-primary/20"
                        >
                            Adicionar
                        </button>
                    </div>
                </form>

                <div className="flex-1 overflow-y-auto space-y-3 hide-scrollbar pb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1 mb-2">Seus Técnicos ({technicians.length})</p>
                    {technicians.length > 0 ? (
                        technicians.map((tech) => (
                            <div key={tech.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl group border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                        {tech.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-sm font-bold dark:text-white">{tech.name}</span>
                                </div>
                                <button
                                    onClick={() => onDelete(tech.id)}
                                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                >
                                    <span className="material-symbols-outlined text-xl">delete</span>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center opacity-30 text-center">
                            <span className="material-symbols-outlined text-4xl mb-2">engineering</span>
                            <p className="text-xs font-bold uppercase tracking-tighter">Nenhum técnico cadastrado</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TechnicianManagerDrawer;

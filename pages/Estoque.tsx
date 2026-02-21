
import React, { useState } from 'react';
import Header from '../components/Header';
import { InventoryItem } from '../types';

interface EstoqueProps {
  items: InventoryItem[];
  onAddItem: (item: Omit<InventoryItem, 'id'>) => void;
  onDeleteItem: (id: string) => void;
  onToggleTheme?: () => void;
  onLogout?: () => void;
  isDarkMode?: boolean;
  userPlan?: string;
}

const STRIPE_PRO_LINK = "https://buy.stripe.com/test_aFa3cw9Gcdpf0sW4eDcs800";

const Estoque: React.FC<EstoqueProps> = ({ items, onAddItem, onDeleteItem, onToggleTheme, onLogout, isDarkMode, userPlan }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', model: '', qty: '', cost: '' });

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.qty) return;

    const qty = parseInt(newItem.qty);
    onAddItem({
      name: newItem.name,
      model: newItem.model || 'Geral',
      quantity: qty,
      unitCost: parseFloat(newItem.cost) || 0,
      status: qty < 3 ? 'Estoque Baixo' : 'Disponível'
    });

    setNewItem({ name: '', model: '', qty: '', cost: '' });
    setIsAdding(false);
  };

  const confirmDelete = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja remover "${name}" do estoque?`)) {
      onDeleteItem(id);
    }
  };

  return (
    <div className="flex-1 pb-32 bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 pt-6 pb-2 border-b border-primary/10 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">ERP Reparos</span>
            <h1 className="text-2xl font-extrabold tracking-tight dark:text-white">Estoque</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onToggleTheme}
              className="size-11 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 active:scale-90 transition-all"
            >
              <span className={`material-symbols-outlined ${isDarkMode ? 'text-amber-400' : 'text-primary'}`}>
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center justify-center size-11 rounded-full bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                title="Sair"
                className="size-11 flex items-center justify-center rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 active:scale-90 transition-all text-danger"
              >
                <span className="material-symbols-outlined font-bold">logout</span>
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2 mb-2">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input className="w-full h-11 pl-10 pr-4 bg-white dark:bg-slate-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 shadow-sm placeholder:text-slate-400 dark:text-white" placeholder="Buscar peça ou modelo..." type="text" />
          </div>
          <button className="flex items-center justify-center size-11 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </div>
      </header>

      <div className="flex gap-2 p-4 overflow-x-auto hide-scrollbar">
        {['Todos', 'Estoque Baixo', 'Telas', 'Baterias'].map((f, i) => (
          <button key={f} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold ${i === 0 ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
            {f}
          </button>
        ))}
      </div>

      <main className="px-4 space-y-3">
        {userPlan === 'free' && (
          <div className="bg-gradient-to-r from-violet-600 to-primary rounded-2xl p-4 text-white flex items-center justify-between gap-3 shadow-lg">
            <div>
              <p className="font-black text-sm">Upgrade para Pro</p>
              <p className="text-[11px] opacity-80">Estoque sem limites + recursos avançados</p>
            </div>
            <a
              href={STRIPE_PRO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary px-4 py-2 rounded-xl font-black text-xs shadow-md active:scale-95 transition-all whitespace-nowrap"
            >
              R$ 9,99/mês
            </a>
          </div>
        )}
        {items.length > 0 ? items.map((item) => (
          <div key={item.id} className={`bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border-l-4 flex flex-col gap-3 group relative transition-colors ${item.status === 'Estoque Baixo' ? 'border-red-500' : 'border-emerald-500'}`}>
            <button
              onClick={() => confirmDelete(item.id, item.name)}
              className="absolute top-3 right-3 text-slate-300 hover:text-danger p-1 transition-colors"
            >
              <span className="material-symbols-outlined text-xl">delete</span>
            </button>

            <div className="flex justify-between items-start pr-8">
              <div>
                <h3 className="font-bold text-base leading-tight dark:text-white">{item.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{item.model}</p>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${item.status === 'Estoque Baixo' ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'}`}>
                {item.status === 'Estoque Baixo' && <span className="material-symbols-outlined text-sm mr-1">warning</span>}
                {item.status}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-50 dark:border-slate-800">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-tighter">Quantidade</span>
                <span className={`font-extrabold ${item.status === 'Estoque Baixo' ? 'text-red-600' : 'text-slate-800 dark:text-slate-100'}`}>
                  {item.quantity} <span className="text-[10px] font-normal text-slate-400">unid.</span>
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-tighter">Custo Unitário</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">R$ {item.unitCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-20 flex flex-col items-center justify-center opacity-40">
            <span className="material-symbols-outlined text-6xl mb-4 dark:text-slate-600">inventory</span>
            <p className="text-sm font-bold uppercase tracking-widest dark:text-slate-600">Estoque Vazio</p>
          </div>
        )}
      </main>

      {/* Add Item Drawer */}
      {isAdding && (
        <div className="fixed inset-0 z-[70] flex items-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl p-6 animate-slide-up">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />
            <h2 className="text-xl font-black mb-6 dark:text-white">Novo Item no Estoque</h2>

            <form onSubmit={handleAddItemSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome da Peça</label>
                <input
                  autoFocus
                  required
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white"
                  placeholder="Ex: Tela iPhone 14 Pro"
                  value={newItem.name}
                  onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Modelo/Versão</label>
                <input
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white"
                  placeholder="Ex: Original / A2890"
                  value={newItem.model}
                  onChange={e => setNewItem({ ...newItem, model: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Quantidade</label>
                  <input
                    required
                    type="number"
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white"
                    placeholder="0"
                    value={newItem.qty}
                    onChange={e => setNewItem({ ...newItem, qty: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white"
                    placeholder="0,00"
                    value={newItem.cost}
                    onChange={e => setNewItem({ ...newItem, cost: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20"
                >
                  Adicionar Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Estoque;


import React from 'react';
import Header from '../components/Header';
import { OSStatus, ServiceOrder } from '../types';

interface KanbanProps {
  orders: ServiceOrder[];
  onDeleteOS: (id: string) => void;
  onOpenNewOS: () => void;
  onToggleTheme?: () => void;
  onLogout?: () => void;
  isDarkMode?: boolean;
  userPlan?: string;
}

const STRIPE_PRO_LINK = "https://buy.stripe.com/aFa3cw9Gcdpf0sW4eDcs800";

const Kanban: React.FC<KanbanProps> = ({ orders, onDeleteOS, onOpenNewOS, onToggleTheme, onLogout, isDarkMode, userPlan }) => {
  const columnConfigs = [
    { name: OSStatus.RECEIVED, label: 'Recebido' },
    { name: OSStatus.DIAGNOSIS, label: 'Diagnóstico' },
    { name: OSStatus.WAITING_PARTS, label: 'Aguardando Peças' },
    { name: OSStatus.REPAIRING, label: 'Em Reparo' },
    { name: OSStatus.READY, label: 'Pronto' },
  ];

  const columns = columnConfigs.map(config => ({
    ...config,
    cards: orders.filter(o => o.status === config.name)
  }));

  const confirmDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm(`Tem certeza que deseja excluir a OS #${id}?`)) {
      onDeleteOS(id);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <div className="shrink-0">
        <Header
          title="Kanban de OS"
          showAvatar={true}
          onToggleTheme={onToggleTheme}
          onLogout={onLogout}
          isDarkMode={isDarkMode}
        />
        <div className="flex gap-2 items-center p-4">
          <div className="relative flex-1 group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm shadow-sm dark:text-white"
              placeholder="Buscar por OS, cliente ou aparelho..."
              type="text"
            />
          </div>
        </div>
      </div>

      <main className="flex-1 overflow-x-auto flex gap-4 p-4 hide-scrollbar pb-32">
        {userPlan === 'free' && (
          <div className="min-w-[260px] max-w-[260px] bg-gradient-to-b from-amber-500 to-orange-600 rounded-2xl p-4 text-white flex flex-col justify-between shadow-lg h-fit">
            <div className="mb-3">
              <span className="material-symbols-outlined text-2xl mb-1">workspace_premium</span>
              <p className="font-black text-sm">Plano Pro</p>
              <p className="text-[11px] opacity-80">OS ilimitadas, clientes ilimitados e mais</p>
            </div>
            <a
              href={STRIPE_PRO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-orange-600 px-4 py-2.5 rounded-xl font-black text-xs shadow-md active:scale-95 transition-all text-center block"
            >
              Assinar — R$ 9,99/mês
            </a>
          </div>
        )}
        {columns.map(col => (
          <div key={col.name} className="min-w-[280px] max-w-[280px] flex flex-col h-full">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{col.label}</span>
                <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {col.cards.length}
                </span>
              </div>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto hide-scrollbar pb-4">
              {col.cards.length > 0 ? col.cards.map(card => (
                <div key={card.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 relative group transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-primary font-bold text-sm">#{card.id.substring(0, 6)}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${card.priority === 'Urgente' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        card.priority === 'Média' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}>
                        {card.priority}
                      </span>
                      <button onClick={(e) => confirmDelete(e, card.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm leading-tight mb-1 dark:text-white">{card.customerName}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">smartphone</span> {card.device}
                  </p>
                </div>
              )) : (
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 flex flex-col items-center justify-center opacity-50">
                  <span className="material-symbols-outlined text-2xl mb-1 dark:text-slate-400">drag_indicator</span>
                  <p className="text-[10px] font-bold uppercase tracking-tighter dark:text-slate-400">Vazio</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </main>

      <button onClick={onOpenNewOS} className="fixed bottom-24 right-6 size-14 bg-primary text-white rounded-full shadow-xl shadow-primary/40 flex items-center justify-center hover:scale-105 active:scale-90 transition-all z-30">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};

export default Kanban;

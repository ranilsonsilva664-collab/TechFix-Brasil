
import React, { useState } from 'react';
import Header from '../components/Header';
import { ServiceOrder, FixedExpense } from '../types';

interface FinanceiroProps {
  orders: ServiceOrder[];
  expenses: FixedExpense[];
  onAddExpense: (expense: Omit<FixedExpense, 'id'>) => void;
  onRemoveExpense: (id: string) => void;
  onDeleteOS: (id: string) => void;
  onToggleTheme?: () => void;
  isDarkMode?: boolean;
}

const Financeiro: React.FC<FinanceiroProps> = ({ orders, expenses, onAddExpense, onRemoveExpense, onDeleteOS, onToggleTheme, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState('Geral');
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [newExp, setNewExp] = useState({ 
    category: 'Outros' as FixedExpense['category'], 
    description: '', 
    amount: '' 
  });
  
  const tabs = ['Geral', 'Despesas Fixas', 'Histórico'];

  // Calculations
  const totalGrossRevenue = orders.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const totalLaborRevenue = orders.reduce((acc, curr) => acc + (curr.laborValue || 0), 0);
  const totalPartsCosts = orders.reduce((acc, curr) => acc + (curr.partsValue || 0), 0);
  const totalFixedExpenses = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  // Real Profit = Labor Revenue - Fixed Expenses
  const realProfit = totalLaborRevenue - totalFixedExpenses;

  // Percentage calculations for the analytical plan
  const getPercentage = (value: number) => {
    if (totalGrossRevenue === 0) return 0;
    return (value / totalGrossRevenue) * 100;
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.amount || !newExp.description) return;
    onAddExpense({
      category: newExp.category,
      description: newExp.description,
      amount: parseFloat(newExp.amount)
    });
    setNewExp({ category: 'Outros', description: '', amount: '' });
    setIsAddingExpense(false);
  };

  const confirmDeleteExpense = (id: string, description: string) => {
    if (window.confirm(`Excluir despesa "${description}"?`)) {
      onRemoveExpense(id);
    }
  };

  const confirmDeleteOS = (id: string) => {
    if (window.confirm(`Excluir orçamento/OS #${id} permanentemente?`)) {
      onDeleteOS(id);
    }
  };

  return (
    <div className="flex-1 pb-32 font-display bg-background-light dark:bg-background-dark transition-colors duration-300">
      <Header 
        title="Financeiro" 
        subtitle="Fluxo de Caixa" 
        showAvatar={false} 
        onToggleTheme={onToggleTheme} 
        isDarkMode={isDarkMode} 
      />
      
      <main className="pt-6">
        <div className="px-4 flex items-end justify-between mb-2">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Seu Painel</h2>
          <button className="flex items-center gap-1 text-primary text-sm font-bold active:scale-95 transition-transform">
            Mês Atual
            <span className="material-symbols-outlined text-sm">calendar_month</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 p-4 overflow-x-auto hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex h-10 shrink-0 items-center justify-center rounded-2xl px-6 text-sm font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Geral' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Real Profit Hero Card */}
            <div className="px-4 mt-2">
              <div className="relative overflow-hidden flex flex-col gap-2 rounded-[2.5rem] p-8 bg-gradient-to-br from-primary to-blue-700 text-white shadow-2xl shadow-primary/30">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <span className="material-symbols-outlined text-8xl">account_balance_wallet</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="size-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">Seu Lucro Real (Take-home)</p>
                </div>
                <p className="text-5xl font-black leading-none tracking-tighter">
                  R$ {realProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <div className="flex items-center gap-2 mt-4 bg-white/10 w-fit px-4 py-2 rounded-2xl backdrop-blur-md">
                  <span className="material-symbols-outlined text-base">payments</span>
                  <p className="text-[11px] font-bold uppercase tracking-tight">Mão de obra livre de despesas</p>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 p-4">
              <div className="flex flex-col gap-2 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <span className="material-symbols-outlined text-lg">trending_up</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">Total Mão de Obra</p>
                </div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">R$ {totalLaborRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="flex flex-col gap-2 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-2 text-danger">
                  <span className="material-symbols-outlined text-lg">receipt_long</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">Custos Fixos</p>
                </div>
                <p className="text-2xl font-black text-danger">R$ {totalFixedExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            {/* Plano de Separação Analítico */}
            <section className="px-4 mt-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black tracking-tight dark:text-white">Plano de Separação Analítico</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Visão por Destino</span>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm p-6 space-y-6">
                {/* Real Profit Item */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">person</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold dark:text-slate-200">Seu Lucro Real</p>
                        <p className="text-[10px] text-slate-400 font-medium">Líquido da Mão de Obra</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">R$ {realProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      <p className="text-[9px] font-bold text-slate-400">{getPercentage(realProfit).toFixed(1)}% do faturamento</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.max(0, Math.min(100, getPercentage(realProfit)))}%` }}
                    />
                  </div>
                </div>

                {/* Reinvestment Item */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-2xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">inventory_2</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold dark:text-slate-200">Reinvestimento (Peças)</p>
                        <p className="text-[10px] text-slate-400 font-medium">Reposição de Estoque</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-orange-600 dark:text-orange-400">R$ {totalPartsCosts.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      <p className="text-[9px] font-bold text-slate-400">{getPercentage(totalPartsCosts).toFixed(1)}% do faturamento</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.max(0, Math.min(100, getPercentage(totalPartsCosts)))}%` }}
                    />
                  </div>
                </div>

                {/* Fixed Expenses Item */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl">domain</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold dark:text-slate-200">Contas Fixas</p>
                        <p className="text-[10px] text-slate-400 font-medium">Estrutura e Aluguel</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-red-600 dark:text-red-400">R$ {totalFixedExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      <p className="text-[9px] font-bold text-slate-400">{getPercentage(totalFixedExpenses).toFixed(1)}% do faturamento</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.max(0, Math.min(100, getPercentage(totalFixedExpenses)))}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-xs font-black uppercase tracking-widest text-slate-400">Saldo Total Bruto</span>
                  <span className="text-slate-900 dark:text-white font-black text-2xl">
                    R$ {totalGrossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'Despesas Fixas' && (
          <div className="px-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button 
              onClick={() => setIsAddingExpense(true)}
              className="w-full py-5 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-center gap-3 text-slate-500 font-bold active:scale-[0.98] transition-all hover:border-primary/30 hover:text-primary"
            >
              <span className="material-symbols-outlined">add_circle</span>
              Adicionar Nova Conta
            </button>

            <div className="space-y-3">
              {expenses.length > 0 ? expenses.map(exp => (
                <div key={exp.id} className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 group transition-all">
                  <div className="size-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-2xl">
                      {exp.category === 'Aluguel' ? 'home' : 
                       exp.category === 'Internet' ? 'wifi' :
                       exp.category === 'Luz' ? 'bolt' :
                       exp.category === 'Ferramentas' ? 'build' :
                       exp.category === 'Assinaturas' ? 'subscriptions' : 'receipt_long'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold dark:text-white group-hover:text-primary transition-colors">{exp.description}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em]">{exp.category}</p>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <p className="text-base font-black text-danger">- R$ {exp.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <button 
                      onClick={() => confirmDeleteExpense(exp.id, exp.description)}
                      className="size-10 flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-danger hover:bg-danger/10 rounded-xl transition-all active:scale-90"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-24 opacity-30 flex flex-col items-center gap-4">
                  <div className="size-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl">receipt_long</span>
                  </div>
                  <p className="text-sm font-black uppercase tracking-widest">Nenhuma despesa registrada</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'Histórico' && (
          <section className="px-4 mt-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black tracking-tight dark:text-white">Lucratividade por Serviço</h3>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Últimas OS</span>
            </div>
            <div className="flex flex-col gap-3">
              {orders.length > 0 ? orders.map(order => (
                <div key={order.id} className="flex items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm group">
                  <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 transition-colors group-hover:bg-emerald-100">
                    <span className="material-symbols-outlined text-2xl">trending_up</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold dark:text-white truncate">OS #{order.id} - {order.customerName}</p>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-tight truncate">{order.device}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div className="shrink-0">
                      <p className="text-base font-black text-emerald-600 dark:text-emerald-400">+ R$ {order.laborValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter text-right">Mão de Obra</p>
                    </div>
                    <button 
                      onClick={() => confirmDeleteOS(order.id)}
                      className="size-10 flex items-center justify-center text-slate-300 dark:text-slate-600 hover:text-danger hover:bg-danger/10 rounded-xl transition-all active:scale-90"
                    >
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 text-slate-400 flex flex-col items-center gap-4 bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                  <span className="material-symbols-outlined text-5xl">query_stats</span>
                  <p className="text-xs font-bold uppercase tracking-widest px-8">Nenhum serviço finalizado para exibir lucratividade.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Add Expense Drawer */}
      {isAddingExpense && (
        <div className="fixed inset-0 z-[100] flex items-end">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setIsAddingExpense(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-[3rem] shadow-2xl p-8 animate-slide-up">
            <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-8" />
            <h2 className="text-2xl font-black mb-8 dark:text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-3xl">add_card</span>
              Nova Despesa Fixa
            </h2>
            
            <form onSubmit={handleAddExpenseSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase ml-2 tracking-widest">Categoria</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Aluguel', 'Internet', 'Luz', 'Ferramentas', 'Assinaturas', 'Outros'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewExp({...newExp, category: cat as any})}
                      className={`py-3 px-2 rounded-2xl text-[10px] font-bold uppercase transition-all ${
                        newExp.category === cat 
                          ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase ml-2 tracking-widest">Descrição</label>
                <input 
                  autoFocus
                  required
                  className="w-full px-6 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-base dark:text-white focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Ex: Mensalidade Aluguel Loja"
                  value={newExp.description}
                  onChange={e => setNewExp({...newExp, description: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase ml-2 tracking-widest">Valor da Conta (R$)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">R$</span>
                  <input 
                    required
                    type="number"
                    step="0.01"
                    className="w-full pl-14 pr-6 py-4 bg-slate-100 dark:bg-slate-800 border-none rounded-2xl text-xl dark:text-white font-black focus:ring-2 focus:ring-primary transition-all"
                    placeholder="0,00"
                    value={newExp.amount}
                    onChange={e => setNewExp({...newExp, amount: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="pt-6 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsAddingExpense(false)}
                  className="flex-1 py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black rounded-2xl uppercase text-xs tracking-widest active:scale-95 transition-all"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex-[2] py-5 bg-danger text-white font-black rounded-2xl shadow-xl shadow-danger/20 uppercase text-xs tracking-widest active:scale-95 transition-all"
                >
                  Adicionar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Financeiro;

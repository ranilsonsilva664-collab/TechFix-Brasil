
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis, Tooltip, YAxis } from 'recharts';
import { ServiceOrder, FixedExpense } from '../types';

const STRIPE_PRO_LINK = "https://buy.stripe.com/test_6oEcO07h4"; // Link de teste padrão

interface DashboardProps {
  orders: ServiceOrder[];
  expenses: FixedExpense[];
  onOpenNewOS: () => void;
  onToggleTheme?: () => void;
  onLogout?: () => void;
  isDarkMode?: boolean;
  userPlan?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ orders, expenses, onOpenNewOS, onToggleTheme, onLogout, isDarkMode, userPlan }) => {
  // Cálculos de precisão financeira
  const totalGrossRevenue = orders.reduce((acc, curr) => acc + (curr.value || 0), 0);
  const totalLaborRevenue = orders.reduce((acc, curr) => acc + (curr.laborValue || 0), 0);
  const totalPartsInvestment = orders.reduce((acc, curr) => acc + (curr.partsValue || 0), 0);
  const totalFixedExpenses = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  // Lucro Real = Mão de Obra - Despesas Fixas
  const realProfit = totalLaborRevenue - totalFixedExpenses;

  // Lógica Dinâmica do Gráfico: Calcula o ganho líquido (mão de obra) por dia
  const generateChartData = () => {
    const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const result = [];

    // Iteramos os últimos 7 dias
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Chave de comparação formatada (YYYY-MM-DD)
      const dateStr = date.getFullYear() + '-' +
        String(date.getMonth() + 1).padStart(2, '0') + '-' +
        String(date.getDate()).padStart(2, '0');

      const dayName = labels[date.getDay()];

      // Somamos apenas a mão de obra (ganho real do empresário)
      const dailyLabor = orders.reduce((acc, order) => {
        if (order.createdAt && order.createdAt.startsWith(dateStr)) {
          return acc + (order.laborValue || 0);
        }
        return acc;
      }, 0);

      result.push({
        name: dayName,
        val: dailyLabor,
        fullDate: date.toLocaleDateString('pt-BR'),
        isToday: i === 0
      });
    }
    return result;
  };

  const chartData = generateChartData();

  return (
    <div className="flex-1 pb-32 font-display bg-background-light dark:bg-background-dark transition-colors duration-300">
      <Header
        title="TechFix Brasil"
        subtitle="Bem-vindo,"
        onToggleTheme={onToggleTheme}
        onLogout={onLogout}
        isDarkMode={isDarkMode}
      />

      <main className="p-4 space-y-4">
        {userPlan === 'free' && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-6xl">workspace_premium</span>
            </div>
            <h2 className="text-xl font-black mb-1">Você está no Plano Gratuito</h2>
            <p className="text-sm opacity-90 mb-4 max-w-[200px]">Libere OS ilimitadas, clientes ilimitados e o controle de custos fixos.</p>
            <a
              href={STRIPE_PRO_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-orange-600 px-6 py-2.5 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all inline-block"
            >
              Assinar Pro — R$ 9,99
            </a>
          </div>
        )}

        {/* Botão de Ação Rápida */}
        <button
          onClick={onOpenNewOS}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-primary/30 transition-all active:scale-[0.98]"
        >
          <span className="material-symbols-outlined font-bold">add_circle</span>
          <span className="text-base uppercase tracking-wider">Novo Registro</span>
        </button>

        {/* Métrica Principal: Lucro Real (Ganho Final do Empresário) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center gap-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-slate-900 dark:text-white">
            <span className="material-symbols-outlined text-6xl">account_balance_wallet</span>
          </div>
          <p className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest z-10">Seu Lucro Real (Mão de Obra - Despesas)</p>
          <h2 className={`text-4xl font-black z-10 tracking-tight ${realProfit >= 0 ? 'text-slate-900 dark:text-white' : 'text-danger'}`}>
            R$ {realProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </h2>
          <p className="text-[10px] text-slate-400 font-bold italic z-10">Considerando R$ {totalFixedExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de custos fixos</p>
        </div>

        {/* Grade de Métricas Secundárias */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-2">
            <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-xl">payments</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Receita Bruta</p>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">R$ {totalGrossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-2">
            <div className="size-8 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
              <span className="material-symbols-outlined text-xl">shopping_cart</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Custo Peças</p>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-500">R$ {totalPartsInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seção do Gráfico de Evolução */}
        <section className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-extrabold tracking-tight dark:text-white">Fluxo Financeiro</h3>
              <p className="text-xs text-slate-500">Mão de obra por dia</p>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
              <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              Tempo Real
            </div>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 dark:bg-slate-800 text-white p-3 rounded-xl text-[10px] font-bold shadow-2xl border border-slate-700">
                          <p className="opacity-60 mb-1">{payload[0].payload.fullDate}</p>
                          <p className="text-emerald-400 text-sm">Ganho: R$ {payload[0].value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="val" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.isToday ? '#135bec' : '#10b981'}
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Atividade Recente */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-extrabold tracking-tight dark:text-white">Ganhos Recentes</h3>
            <button className="text-xs font-bold text-primary">Ver Todos</button>
          </div>
          <div className="space-y-3">
            {orders.length > 0 ? orders.slice(0, 5).map(item => (
              <Link to={`/os/${item.id}`} key={item.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-all active:scale-[0.98]">
                <div className="size-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                  <span className="material-symbols-outlined text-xl">trending_up</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate dark:text-white">{item.device}</p>
                  <p className="text-[11px] text-slate-500 font-medium">#{item.id} • {item.customerName}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-black text-emerald-600 dark:text-emerald-400">+ R$ {item.laborValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Mão de Obra</p>
                </div>
              </Link>
            )) : (
              <div className="py-16 flex flex-col items-center justify-center bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800">
                <span className="material-symbols-outlined text-5xl text-slate-200 dark:text-slate-800 mb-2">bar_chart</span>
                <p className="text-slate-400 text-xs italic">Aguardando novos serviços para gerar dados.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;


import React, { useState } from 'react';
import Header from '../components/Header';
import { ServiceOrder, OSStatus } from '../types';

interface ClientesProps {
  customers: any[];
  orders: ServiceOrder[];
  onAddCustomer: (name: string, phone: string) => void;
  onUpdateCustomer: (oldName: string, updates: any) => void;
  onDeleteCustomer: (name: string) => void;
  onDeleteOS: (id: string) => void;
  onToggleTheme?: () => void;
  onLogout?: () => void;
  isDarkMode?: boolean;
  userPlan?: string;
}

const STRIPE_PRO_LINK = "https://buy.stripe.com/aFa3cw9Gcdpf0sW4eDcs800";

const Clientes: React.FC<ClientesProps> = ({
  customers, orders, onAddCustomer, onUpdateCustomer, onDeleteCustomer, onDeleteOS, onToggleTheme, onLogout, isDarkMode, userPlan
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', cpf: '' });
  const [editCustomerData, setEditCustomerData] = useState({ name: '', phone: '', cpf: '' });

  const filteredCustomers = customers.filter(c => {
    // Search filter
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.cpf && c.cpf.includes(searchQuery));

    if (!matchesSearch) return false;

    // Category filter
    if (activeFilter === 'Todos') return true;

    const myOrders = orders.filter(o => o.customerName === c.name);

    if (activeFilter === 'Recentes') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return myOrders.some(o => o.createdAt && new Date(o.createdAt) >= thirtyDaysAgo);
    }

    if (activeFilter === 'Com OS Ativa') {
      return myOrders.some(o => o.status !== OSStatus.READY);
    }

    if (activeFilter === 'Fidelizados') {
      return myOrders.length >= 3;
    }

    if (activeFilter === 'Prontos') {
      return myOrders.some(o => o.status === OSStatus.READY);
    }

    return true;
  });

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name) return;
    onAddCustomer(newCustomer.name, newCustomer.phone);
    setNewCustomer({ name: '', phone: '', cpf: '' });
    setIsAdding(false);
  };

  const handleEditCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;
    onUpdateCustomer(selectedCustomer.name, editCustomerData);
    setSelectedCustomer({ ...selectedCustomer, ...editCustomerData });
    setIsEditing(false);
  };

  const confirmDeleteCustomer = () => {
    if (window.confirm(`Deseja realmente excluir o cliente ${selectedCustomer.name}?`)) {
      onDeleteCustomer(selectedCustomer.name);
      setSelectedCustomer(null);
    }
  };

  const confirmDeleteOS = (id: string) => {
    if (window.confirm(`Excluir OS #${id}?`)) {
      onDeleteOS(id);
    }
  };

  const handleCall = () => {
    if (selectedCustomer?.phone) {
      window.open(`tel:${selectedCustomer.phone.replace(/\D/g, '')}`, '_self');
    }
  };

  const handleWhatsApp = () => {
    if (selectedCustomer?.phone) {
      const cleanPhone = selectedCustomer.phone.replace(/\D/g, '');
      const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
      window.open(`https://wa.me/${formattedPhone}`, '_blank');
    }
  };

  const customerOrders = selectedCustomer
    ? orders.filter(o => o.customerName === selectedCustomer.name)
    : [];

  return (
    <div className="flex-1 pb-32 bg-background-light dark:bg-background-dark">
      <Header
        title="Clientes"
        showAvatar={false}
        onToggleTheme={onToggleTheme}
        onLogout={onLogout}
        isDarkMode={isDarkMode}
      />

      <main className="p-4 space-y-4">
        {userPlan === 'free' && (
          <div className="bg-gradient-to-r from-blue-600 to-primary rounded-2xl p-4 text-white flex items-center justify-between gap-3 shadow-lg">
            <div>
              <p className="font-black text-sm">Upgrade para Pro</p>
              <p className="text-[11px] opacity-80">Clientes ilimitados + histórico completo</p>
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
        {/* Search & Action */}
        <div className="flex gap-2">
          <div className="relative flex-1 group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-900 border-none rounded-xl text-sm placeholder-slate-500 focus:ring-2 focus:ring-primary/50 transition-all dark:text-white"
              placeholder="Nome ou CPF..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-primary text-white size-11 rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined">add</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {['Todos', 'Prontos', 'Recentes', 'Com OS Ativa', 'Fidelizados'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${activeFilter === f ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredCustomers.length > 0 ? filteredCustomers.map((c, index) => (
            <div
              key={index}
              onClick={() => setSelectedCustomer(c)}
              className="flex items-center gap-4 py-4 active:bg-slate-50 dark:active:bg-slate-800/50 transition-colors cursor-pointer"
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                  {c.initials || c.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold truncate dark:text-white">{c.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 uppercase tracking-wider">{orders.filter(o => o.customerName === c.name).length} OS</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <span className="material-symbols-outlined text-[14px]">call</span> {c.phone}
                </p>
              </div>
              <span className="material-symbols-outlined text-slate-300 dark:text-slate-700">chevron_right</span>
            </div>
          )) : (
            <div className="py-20 text-center opacity-40">
              <span className="material-symbols-outlined text-4xl mb-2">person_search</span>
              <p className="text-xs font-bold uppercase tracking-widest">Nenhum cliente encontrado</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Customer Drawer */}
      {isAdding && (
        <div className="fixed inset-0 z-[70] flex items-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl p-6 animate-slide-up">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />
            <h2 className="text-xl font-black mb-6 dark:text-white">Cadastrar Novo Cliente</h2>
            <form onSubmit={handleAddCustomerSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome Completo</label>
                <input required className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white" value={newCustomer.name} onChange={e => setNewCustomer({ ...newCustomer, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Telefone</label>
                  <input className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white" placeholder="(00) 00000-0000" value={newCustomer.phone} onChange={e => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">CPF</label>
                  <input className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white" placeholder="000.000.000-00" value={newCustomer.cpf} onChange={e => setNewCustomer({ ...newCustomer, cpf: e.target.value })} />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl">Cancelar</button>
                <button type="submit" className="flex-[2] py-4 bg-primary text-white font-bold rounded-xl">Salvar Cliente</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Customer Drawer */}
      {isEditing && (
        <div className="fixed inset-0 z-[80] flex items-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditing(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl p-6 animate-slide-up">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />
            <h2 className="text-xl font-black mb-6 dark:text-white">Editar Cliente</h2>
            <form onSubmit={handleEditCustomerSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nome Completo</label>
                <input required className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white" value={editCustomerData.name} onChange={e => setEditCustomerData({ ...editCustomerData, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Telefone</label>
                  <input className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white" value={editCustomerData.phone} onChange={e => setEditCustomerData({ ...editCustomerData, phone: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">CPF</label>
                  <input className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm dark:text-white" value={editCustomerData.cpf || ''} onChange={e => setEditCustomerData({ ...editCustomerData, cpf: e.target.value })} />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-xl">Cancelar</button>
                <button type="submit" className="flex-[2] py-4 bg-primary text-white font-bold rounded-xl">Atualizar Dados</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Details Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[60] flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelectedCustomer(null)} />
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl p-6 animate-slide-up h-[85vh]">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold">
                  {selectedCustomer.initials || selectedCustomer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-tight dark:text-white">{selectedCustomer.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">CPF: {selectedCustomer.cpf || '---'}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setIsEditing(true); setEditCustomerData({ name: selectedCustomer.name, phone: selectedCustomer.phone, cpf: selectedCustomer.cpf }); }} className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center"><span className="material-symbols-outlined">edit</span></button>
                <button onClick={confirmDeleteCustomer} className="size-10 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center"><span className="material-symbols-outlined">delete</span></button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={handleCall}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-semibold text-sm active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-sm">call</span> Ligar
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-semibold text-sm active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-sm">chat</span> WhatsApp
              </button>
            </div>

            <div className="border-b border-slate-100 dark:border-slate-800 flex gap-6 mb-4">
              <button className="pb-3 border-b-2 border-primary text-primary text-sm font-bold">Histórico de OS</button>
              <button className="pb-3 text-slate-400 dark:text-slate-600 text-sm font-medium">Dados Pessoais</button>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[35vh] pr-1 hide-scrollbar">
              {customerOrders.length > 0 ? (
                customerOrders.map((order) => (
                  <div key={order.id} className="relative pl-6 border-l-2 border-slate-100 dark:border-slate-800 py-1">
                    <div className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 ${order.status === OSStatus.READY ? 'bg-green-500' : 'bg-primary'}`}></div>
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-bold text-primary">OS #{order.id.substring(0, 6)}</span>
                          <span className="text-[10px] text-slate-400">{order.timestamp}</span>
                        </div>
                        <p className="text-sm font-medium dark:text-white">{order.device}</p>
                        <p className="text-xs mt-1 font-bold text-slate-600 dark:text-slate-400">R$ {order.value?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} • {order.status}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); confirmDeleteOS(order.id); }} className="text-red-400 hover:text-red-600 ml-2 p-1"><span className="material-symbols-outlined text-lg">delete</span></button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-slate-400 dark:text-slate-600 text-sm italic">Nenhuma ordem de serviço encontrada.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clientes;

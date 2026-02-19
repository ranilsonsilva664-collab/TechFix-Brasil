
import React, { useState } from 'react';
import { OSStatus, ServiceOrder } from '../types';

interface NewOSDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (os: Omit<ServiceOrder, 'id' | 'timestamp'>) => void;
  availableCustomers: { name: string }[];
  onQuickAddCustomer: (name: string, phone: string) => any;
}

const NewOSDrawer: React.FC<NewOSDrawerProps> = ({ isOpen, onClose, onSubmit, availableCustomers, onQuickAddCustomer }) => {
  const [step, setStep] = useState(1);
  const [isAddingQuickCustomer, setIsAddingQuickCustomer] = useState(false);
  const [quickCustomer, setQuickCustomer] = useState({ name: '', phone: '' });

  const [formData, setFormData] = useState({
    customerName: '',
    deviceModel: '',
    serial: '',
    imei: '',
    problem: '',
    priority: 'Média' as 'Baixa' | 'Média' | 'Urgente',
    laborValue: '',
    partsValue: ''
  });

  if (!isOpen) return null;

  const handleQuickAdd = async () => {
    if (!quickCustomer.name) return;
    try {
      const added = await onQuickAddCustomer(quickCustomer.name, quickCustomer.phone);
      if (added && added.name) {
        setFormData({ ...formData, customerName: added.name });
        setIsAddingQuickCustomer(false);
        setQuickCustomer({ name: '', phone: '' });
      }
    } catch (error) {
      console.error("Error in quick add:", error);
      alert("Erro ao cadastrar cliente rapidamente.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const labor = parseFloat(formData.laborValue) || 0;
    const parts = parseFloat(formData.partsValue) || 0;

    onSubmit({
      customerName: formData.customerName,
      device: formData.deviceModel,
      status: OSStatus.RECEIVED,
      priority: formData.priority,
      laborValue: labor,
      partsValue: parts,
      value: labor + parts,
      progress: 0,
      problem: formData.problem,
      serial: formData.serial,
      imei: formData.imei
    });
    // Reset
    setFormData({ customerName: '', deviceModel: '', serial: '', imei: '', problem: '', priority: 'Média', laborValue: '', partsValue: '' });
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end font-display">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6" />

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black">Nova Ordem de Serviço</h2>
          <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase tracking-widest">Passo {step}/3</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-tighter">1. Identificação do Cliente</h3>

              {!isAddingQuickCustomer ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Selecionar Cliente</label>
                  <select
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                    required
                  >
                    <option value="">Selecione um cliente...</option>
                    {availableCustomers.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsAddingQuickCustomer(true)}
                    className="text-xs font-bold text-primary flex items-center gap-1 mt-2 hover:opacity-80 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-xs">add</span> Cadastrar novo cliente
                  </button>
                </div>
              ) : (
                <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-primary/10">
                  <h4 className="text-xs font-bold uppercase text-primary">Cadastro Rápido</h4>
                  <input
                    autoFocus
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                    placeholder="Nome do Cliente"
                    value={quickCustomer.name}
                    onChange={e => setQuickCustomer({ ...quickCustomer, name: e.target.value })}
                  />
                  <input
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                    placeholder="Telefone"
                    value={quickCustomer.phone}
                    onChange={e => setQuickCustomer({ ...quickCustomer, phone: e.target.value })}
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingQuickCustomer(false)}
                      className="flex-1 py-2 text-xs font-bold text-slate-500 bg-slate-200 dark:bg-slate-700 rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickAdd}
                      className="flex-[2] py-2 text-xs font-bold text-white bg-primary rounded-lg"
                    >
                      Adicionar e Selecionar
                    </button>
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={!formData.customerName || isAddingQuickCustomer}
                onClick={() => setStep(2)}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl disabled:opacity-50 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
              >
                Próximo: Dados do Aparelho
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-tighter">2. Check-in do Aparelho (Entrada)</h3>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Modelo do Dispositivo</label>
                <input
                  autoFocus
                  required
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                  placeholder="Ex: iPhone 13 Pro Max"
                  value={formData.deviceModel}
                  onChange={e => setFormData({ ...formData, deviceModel: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Nº Serial</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="S/N"
                    value={formData.serial}
                    onChange={e => setFormData({ ...formData, serial: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">IMEI</label>
                  <input
                    className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                    placeholder="IMEI 1"
                    value={formData.imei}
                    onChange={e => setFormData({ ...formData, imei: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold rounded-xl active:scale-95 transition-all"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  disabled={!formData.deviceModel}
                  onClick={() => setStep(3)}
                  className="flex-[2] py-4 bg-primary text-white font-bold rounded-xl disabled:opacity-50 active:scale-[0.98] transition-all"
                >
                  Próximo: Diagnóstico
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-tighter">3. Diagnóstico & Valores</h3>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Descrição do Defeito</label>
                <textarea
                  autoFocus
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                  placeholder="Descreva o que o cliente relatou..."
                  value={formData.problem}
                  onChange={e => setFormData({ ...formData, problem: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Prioridade</label>
                <select
                  className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20"
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                >
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Urgente">Urgente</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Mão de Obra (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 bg-emerald-50 dark:bg-emerald-900/10 border-none rounded-xl text-sm focus:ring-2 focus:ring-success/20 font-bold text-success"
                    placeholder="0,00"
                    value={formData.laborValue}
                    onChange={e => setFormData({ ...formData, laborValue: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase ml-1">Peças (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-4 py-3 bg-blue-50 dark:bg-blue-900/10 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 font-bold text-primary"
                    placeholder="0,00"
                    value={formData.partsValue}
                    onChange={e => setFormData({ ...formData, partsValue: e.target.value })}
                  />
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex justify-between items-center border border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black uppercase tracking-widest text-slate-400">Total Geral</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  R$ {((parseFloat(formData.laborValue) || 0) + (parseFloat(formData.partsValue) || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 font-bold rounded-xl active:scale-95 transition-all"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
                >
                  Finalizar Registro
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default NewOSDrawer;

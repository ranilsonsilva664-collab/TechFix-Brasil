
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { OSStatus, ServiceOrder } from '../types';
import TechnicianManagerDrawer from '../components/TechnicianManagerDrawer';

interface OSDetailsProps {
  orders: ServiceOrder[];
  onUpdateOS: (id: string, updates: Partial<ServiceOrder>) => void;
  onDeleteOS: (id: string) => void;
  technicians: any[];
  onAddTechnician: (name: string) => void;
  onDeleteTechnician: (id: string) => void;
}

const OSDetails: React.FC<OSDetailsProps> = ({
  orders,
  onUpdateOS,
  onDeleteOS,
  technicians,
  onAddTechnician,
  onDeleteTechnician
}) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const os = orders.find(o => o.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [technician, setTechnician] = useState(os?.technician || 'Não atribuído');
  const [progress, setProgress] = useState(os?.progress || 0);
  const [isSaving, setIsSaving] = useState(false);
  const [isTechManagerOpen, setIsTechManagerOpen] = useState(false);

  // Edit fields
  const [editData, setEditData] = useState({
    device: os?.device || '',
    laborValue: os?.laborValue || 0,
    partsValue: os?.partsValue || 0,
    priority: os?.priority || 'Média'
  });

  useEffect(() => {
    if (os) {
      setTechnician(os.technician || 'Não atribuído');
      setProgress(os.progress || 0);
      setEditData({
        device: os.device,
        laborValue: os.laborValue || 0,
        partsValue: os.partsValue || 0,
        priority: os.priority
      });
    }
  }, [os]);

  if (!os) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <span className="material-symbols-outlined text-6xl text-slate-300">search_off</span>
        <h2 className="text-xl font-bold">OS não encontrada</h2>
        <button onClick={() => navigate('/')} className="bg-primary text-white px-6 py-2 rounded-xl font-bold">Voltar ao Painel</button>
      </div>
    );
  }

  const handleSaveMaintenance = () => {
    setIsSaving(true);
    onUpdateOS(os.id, {
      technician: technician === 'Não atribuído' ? undefined : technician,
      progress,
      ...editData,
      value: (Number(editData.laborValue) || 0) + (Number(editData.partsValue) || 0)
    });
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, 500);
  };

  const handleMarkAsCompleted = () => {
    onUpdateOS(os.id, { progress: 100, status: OSStatus.READY });
    setProgress(100);
  };

  const confirmDelete = () => {
    if (window.confirm(`Excluir permanentemente esta OS?`)) {
      onDeleteOS(os.id);
      navigate(-1);
    }
  };

  return (
    <div className="flex-1 bg-background-light dark:bg-background-dark pb-40 font-display">
      <header className="sticky top-0 z-50 flex items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 pb-2 justify-between border-b border-slate-200 dark:border-slate-800">
        <div onClick={() => navigate(-1)} className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center cursor-pointer">
          <span className="material-symbols-outlined">arrow_back</span>
        </div>
        <div className="flex flex-col items-center flex-1">
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">OS #{os.id}</h2>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${os.status === OSStatus.READY ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
            }`}>
            {os.status}
          </span>
        </div>
        <div className="flex w-12 items-center justify-end gap-2">
          <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center justify-center rounded-lg size-10 ${isEditing ? 'text-primary' : 'text-slate-400'}`}>
            <span className="material-symbols-outlined">{isEditing ? 'close' : 'edit'}</span>
          </button>
        </div>
      </header>

      <main className="w-full space-y-6 pt-4">
        {/* Gestão do Reparo */}
        <section className="px-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-primary/10 space-y-5">
            <h3 className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">engineering</span>
              Gestão do Reparo
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Técnico Responsável</label>
                <button
                  onClick={() => setIsTechManagerOpen(true)}
                  className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-1 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">settings</span>
                  Gerenciar
                </button>
              </div>
              <div className="relative group">
                <select
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 appearance-none dark:text-white"
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                >
                  <option value="Não atribuído">Selecione o técnico...</option>
                  {technicians.map(tech => (
                    <option key={tech.id} value={tech.name}>{tech.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xl">unfold_more</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Progresso Atual</label>
                <span className={`text-sm font-black ${progress === 100 ? 'text-success' : 'text-primary'}`}>{progress}%</span>
              </div>
              <input
                type="range" min="0" max="100" step="5" value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        </section>

        {/* Dados do Cliente */}
        <section>
          <h3 className="text-slate-900 dark:text-white text-lg font-bold px-4 pb-2">Dados do Cliente</h3>
          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 mx-4 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">{os.customerName.charAt(0)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-900 dark:text-white text-base font-bold truncate">{os.customerName}</p>
              <p className="text-slate-500 text-sm">Cliente cadastrado no sistema</p>
            </div>
          </div>
        </section>

        {/* Detalhes do Aparelho */}
        <section className="px-4">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold pb-2">Aparelho (Entrada)</h3>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Modelo do Aparelho</label>
              {isEditing ? (
                <input className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm" value={editData.device} onChange={e => setEditData({ ...editData, device: e.target.value })} />
              ) : (
                <p className="text-slate-900 dark:text-white font-bold">{os.device}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Prioridade</label>
              {isEditing ? (
                <select className="w-full p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm" value={editData.priority} onChange={e => setEditData({ ...editData, priority: e.target.value as any })}>
                  <option value="Baixa">Baixa</option>
                  <option value="Média">Média</option>
                  <option value="Urgente">Urgente</option>
                </select>
              ) : (
                <span className={`text-xs font-bold uppercase ${os.priority === 'Urgente' ? 'text-red-500' : 'text-blue-500'}`}>{os.priority}</span>
              )}
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="px-4">
          <h3 className="text-slate-900 dark:text-white text-lg font-bold pb-2">Valores</h3>
          <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 divide-y dark:divide-slate-800">
            <div className="p-4 flex justify-between items-center">
              <p className="text-slate-500 text-sm font-medium">Mão de Obra</p>
              {isEditing ? (
                <input type="number" className="w-24 text-right p-1 bg-slate-50 dark:bg-slate-800 rounded text-sm" value={editData.laborValue} onChange={e => setEditData({ ...editData, laborValue: Number(e.target.value) })} />
              ) : (
                <p className="text-slate-900 dark:text-white font-bold">R$ {os.laborValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              )}
            </div>
            <div className="p-4 flex justify-between items-center">
              <p className="text-slate-500 text-sm font-medium">Peças</p>
              {isEditing ? (
                <input type="number" className="w-24 text-right p-1 bg-slate-50 dark:bg-slate-800 rounded text-sm" value={editData.partsValue} onChange={e => setEditData({ ...editData, partsValue: Number(e.target.value) })} />
              ) : (
                <p className="text-slate-900 dark:text-white font-bold">R$ {os.partsValue?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              )}
            </div>
          </div>
        </section>

        {isEditing && (
          <div className="px-4">
            <button onClick={handleSaveMaintenance} disabled={isSaving} className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
              {isSaving ? 'Salvando...' : 'Salvar Todas as Edições'}
            </button>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3 z-50 max-w-md mx-auto">
        <div className="flex gap-3">
          <button onClick={confirmDelete} className="flex-1 flex items-center justify-center gap-2 h-14 border border-red-200 dark:border-red-900/30 text-red-500 font-bold rounded-xl transition-colors active:scale-[0.98]">
            <span className="material-symbols-outlined text-[20px]">delete</span> Excluir
          </button>
          <button onClick={handleMarkAsCompleted} disabled={os.status === OSStatus.READY} className={`flex-[1.5] flex items-center justify-center gap-2 h-14 font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] ${os.status === OSStatus.READY ? 'bg-success text-white opacity-90' : 'bg-emerald-600 text-white'}`}>
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            {os.status === OSStatus.READY ? 'Concluído' : 'Marcar como Pronto'}
          </button>
        </div>
      </footer>

      <TechnicianManagerDrawer
        isOpen={isTechManagerOpen}
        onClose={() => setIsTechManagerOpen(false)}
        technicians={technicians}
        onAdd={onAddTechnician}
        onDelete={onDeleteTechnician}
      />
    </div>
  );
};

export default OSDetails;


export enum OSStatus {
  RECEIVED = 'Recebido',
  DIAGNOSIS = 'Diagnóstico',
  WAITING_PARTS = 'Aguardando Peças',
  REPAIRING = 'Em Reparo',
  READY = 'Pronto'
}

export interface ServiceOrder {
  id: string;
  customerName: string;
  device: string;
  status: OSStatus;
  priority: 'Baixa' | 'Média' | 'Urgente';
  timestamp: string;
  createdAt: string; // ISO format for reliable date calculations
  technician?: string;
  progress?: number;
  value?: number;
  laborValue?: number;
  partsValue?: number;
}

export interface Transaction {
  id: string;
  description: string;
  date: string;
  type: 'ENTRADA' | 'SAÍDA';
  amount: number;
  icon: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  model: string;
  quantity: number;
  unitCost: number;
  status: 'Estoque Baixo' | 'Disponível';
}

export interface FixedExpense {
  id: string;
  category: 'Aluguel' | 'Internet' | 'Luz' | 'Ferramentas' | 'Assinaturas' | 'Outros';
  description: string;
  amount: number;
}

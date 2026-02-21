
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Financeiro from './pages/Financeiro';
import Kanban from './pages/Kanban';
import Clientes from './pages/Clientes';
import Estoque from './pages/Estoque';
import OSDetails from './pages/OSDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import SuccessUpgrade from './pages/SuccessUpgrade';
import NewOSDrawer from './components/NewOSDrawer';
import { OSStatus, ServiceOrder, FixedExpense, InventoryItem } from './types';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { dbService } from './lib/db';

const Navigation = () => {
  const location = useLocation();
  const hideNavOn = ['/login', '/register', '/os/'];
  const shouldHide = hideNavOn.some(path => location.pathname.startsWith(path));

  if (shouldHide) return null;

  const navItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/' },
    { label: 'Finanças', icon: 'analytics', path: '/financeiro' },
    { label: 'Kanban', icon: 'account_tree', path: '/kanban' },
    { label: 'Clientes', icon: 'group', path: '/clientes' },
    { label: 'Estoque', icon: 'inventory_2', path: '/estoque' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg px-2 pb-8 pt-3 shadow-2xl max-w-md mx-auto">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${location.pathname === item.path ? 'text-primary' : 'text-slate-400 dark:text-slate-500'
            }`}
        >
          <span className={`material-symbols-outlined text-[28px] ${location.pathname === item.path ? 'fill-1' : ''}`}>
            {item.icon}
          </span>
          <p className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</p>
        </Link>
      ))}
    </nav>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isNewOSOpen, setIsNewOSOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Shared states
  const [customers, setCustomers] = useState<any[]>([]);
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  // Auth initialization and Firestore subscriptions
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setUserId(user ? user.uid : null);
    });

    return () => unsubscribeAuth();
  }, []);

  // Set up Firestore listeners when userId changes
  useEffect(() => {
    if (!userId) {
      setCustomers([]);
      setServiceOrders([]);
      setFixedExpenses([]);
      setInventory([]);
      setTechnicians([]);
      return;
    }

    const unsubCustomers = dbService.subscribeCustomers(userId, setCustomers);
    const unsubOrders = dbService.subscribeOrders(userId, setServiceOrders);
    const unsubInventory = dbService.subscribeInventory(userId, setInventory);
    const unsubExpenses = dbService.subscribeExpenses(userId, setFixedExpenses);
    const unsubTechnicians = dbService.subscribeTechnicians(userId, setTechnicians);
    const unsubProfile = dbService.subscribeProfile(userId, setUserProfile);

    return () => {
      unsubCustomers();
      unsubOrders();
      unsubInventory();
      unsubExpenses();
      unsubTechnicians();
      unsubProfile();
    };
  }, [userId]);

  // Sync dark mode with HTML class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const handleLogout = () => signOut(auth);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="animate-spin material-symbols-outlined text-primary text-4xl">progress_activity</div>
      </div>
    );
  }

  // OS Handlers
  const handleCreateOS = async (newOS: Omit<ServiceOrder, 'id' | 'timestamp' | 'createdAt'>) => {
    if (!userId) return;

    // Plan Limits
    if (userProfile?.plan === 'free' && serviceOrders.length >= 5) {
      alert("Limite do Plano Gratuito atingido: Máximo de 5 OS. Faça upgrade para o Pro!");
      return;
    }

    try {
      const now = new Date();
      const osData = {
        ...newOS,
        timestamp: now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        progress: 0,
        status: OSStatus.RECEIVED
      };

      // Quick update for customer stats
      const customer = customers.find(c => c.name === newOS.customerName);
      if (customer) {
        await dbService.updateCustomer(userId, customer.id, {
          os: (customer.os || 0) + 1,
          lastVisit: 'Agora'
        });
      }

      await dbService.addOrder(userId, osData as any);
      setIsNewOSOpen(false);
    } catch (err: any) {
      console.error("Failed to create OS:", err);
      alert(`Erro ao criar OS: ${err.message}`);
      setGlobalError(`Erro ao criar OS: ${err.message}`);
    }
  };

  const handleUpdateOS = async (id: string, updates: Partial<ServiceOrder>) => {
    if (!userId) return;
    try {
      const os = serviceOrders.find(o => o.id === id);
      if (!os) return;

      let newStatus = updates.status || os.status;
      if (updates.progress !== undefined) {
        if (updates.progress === 100) newStatus = OSStatus.READY;
        else if (updates.progress > 0 && os.status === OSStatus.RECEIVED) newStatus = OSStatus.REPAIRING;
      }

      await dbService.updateOrder(userId, id, { ...updates, status: newStatus });
    } catch (err: any) {
      console.error("Failed to update OS:", err);
      alert(`Erro ao atualizar OS: ${err.message}`);
      setGlobalError(`Erro ao atualizar OS: ${err.message}`);
    }
  };

  const handleDeleteOS = async (id: string) => {
    if (!userId) return;
    try {
      const osToDelete = serviceOrders.find(o => o.id === id);
      if (osToDelete) {
        const customer = customers.find(c => c.name === osToDelete.customerName);
        if (customer) {
          await dbService.updateCustomer(userId, customer.id, {
            os: Math.max(0, (customer.os || 0) - 1)
          });
        }
      }
      await dbService.deleteOrder(userId, id);
    } catch (err: any) {
      console.error("Failed to delete OS:", err);
      alert(`Erro ao excluir OS: ${err.message}`);
      setGlobalError(`Erro ao excluir OS: ${err.message}`);
    }
  };

  // Customer Handlers
  const handleAddCustomer = async (name: string, phone: string) => {
    if (!userId) return;

    // Plan Limits
    if (userProfile?.plan === 'free' && customers.length >= 5) {
      alert("Limite do Plano Gratuito atingido: Máximo de 5 Clientes. Faça upgrade para o Pro!");
      return;
    }

    try {
      const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const customerData = {
        id: initials || '??',
        initials: initials || '??',
        name: name,
        os: 0,
        phone: phone || '(00) 00000-0000',
        lastVisit: 'Recém cadastrado'
      };
      const docRef = await dbService.addCustomer(userId, customerData);
      return { ...customerData, id: docRef.id };
    } catch (err: any) {
      console.error("Failed to add customer:", err);
      alert(`Erro ao adicionar cliente: ${err.message}`);
      setGlobalError(`Erro ao adicionar cliente: ${err.message}`);
    }
  };

  const handleUpdateCustomer = async (oldName: string, updates: { name: string, phone: string, cpf?: string }) => {
    if (!userId) return;
    try {
      const customer = customers.find(c => c.name === oldName);
      if (!customer) return;

      await dbService.updateCustomer(userId, customer.id, updates);

      // Update customer name in all their OS
      const updatesPromises = serviceOrders
        .filter(os => os.customerName === oldName)
        .map(os => dbService.updateOrder(userId, os.id, { customerName: updates.name }));

      await Promise.all(updatesPromises);
    } catch (err: any) {
      console.error("Failed to update customer:", err);
      alert(`Erro ao atualizar cliente: ${err.message}`);
      setGlobalError(`Erro ao atualizar cliente: ${err.message}`);
    }
  };

  const handleDeleteCustomer = async (name: string) => {
    if (!userId) return;
    try {
      const customer = customers.find(c => c.name === name);
      if (!customer) return;
      await dbService.deleteCustomer(userId, customer.id);
    } catch (err: any) {
      console.error("Failed to delete customer:", err);
      alert(`Erro ao excluir cliente: ${err.message}`);
      setGlobalError(`Erro ao excluir cliente: ${err.message}`);
    }
  };

  // Inventory Handlers
  const handleAddItem = async (item: Omit<InventoryItem, 'id'>) => {
    if (!userId) return;
    try {
      await dbService.addInventoryItem(userId, item);
    } catch (err: any) {
      console.error("Failed to add item:", err);
      alert(`Erro ao adicionar item: ${err.message}`);
      setGlobalError(`Erro ao adicionar item: ${err.message}`);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!userId) return;
    try {
      await dbService.deleteInventoryItem(userId, id);
    } catch (err: any) {
      console.error("Failed to delete item:", err);
      alert(`Erro ao excluir item: ${err.message}`);
      setGlobalError(`Erro ao excluir item: ${err.message}`);
    }
  };

  // Expense Handlers
  const handleAddExpense = async (expense: Omit<FixedExpense, 'id'>) => {
    if (!userId) return;
    try {
      await dbService.addExpense(userId, expense);
    } catch (err: any) {
      console.error("Failed to add expense:", err);
      alert(`Erro ao adicionar despesa: ${err.message}`);
      setGlobalError(`Erro ao adicionar despesa: ${err.message}`);
    }
  };

  const handleRemoveExpense = async (id: string) => {
    if (!userId) return;
    try {
      await dbService.deleteExpense(userId, id);
    } catch (err: any) {
      console.error("Failed to remove expense:", err);
      alert(`Erro ao excluir despesa: ${err.message}`);
      setGlobalError(`Erro ao excluir despesa: ${err.message}`);
    }
  };

  // Technician Handlers
  const handleAddTechnician = async (name: string) => {
    if (!userId) return;
    try {
      await dbService.addTechnician(userId, name);
    } catch (err: any) {
      console.error("Failed to add technician:", err);
      alert(`Erro ao cadastrar técnico: ${err.message}`);
    }
  };

  const handleDeleteTechnician = async (id: string) => {
    if (!userId) return;
    try {
      await dbService.deleteTechnician(userId, id);
    } catch (err: any) {
      console.error("Failed to delete technician:", err);
      alert(`Erro ao excluir técnico: ${err.message}`);
    }
  };

  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen relative bg-background-light dark:bg-background-dark font-display transition-colors duration-300">
        {globalError && (
          <div className="fixed top-0 left-0 right-0 z-[200] bg-red-600 text-white p-4 text-xs font-bold flex justify-between items-center animate-in slide-in-from-top duration-300">
            <span className="flex-1">{globalError}</span>
            <button onClick={() => setGlobalError(null)} className="ml-2 font-black">X</button>
          </div>
        )}
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login onLogin={() => { }} />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <div className="flex-1 flex flex-col max-w-md mx-auto w-full relative">
                  <Routes>
                    <Route path="/" element={<Dashboard orders={serviceOrders} expenses={fixedExpenses} onOpenNewOS={() => setIsNewOSOpen(true)} onToggleTheme={toggleTheme} onLogout={handleLogout} isDarkMode={isDarkMode} userPlan={userProfile?.plan} />} />
                    <Route path="/financeiro" element={<Financeiro orders={serviceOrders} expenses={fixedExpenses} onAddExpense={handleAddExpense} onRemoveExpense={handleRemoveExpense} onDeleteOS={handleDeleteOS} onToggleTheme={toggleTheme} onLogout={handleLogout} isDarkMode={isDarkMode} userPlan={userProfile?.plan} />} />
                    <Route path="/kanban" element={<Kanban orders={serviceOrders} onDeleteOS={handleDeleteOS} onOpenNewOS={() => setIsNewOSOpen(true)} onToggleTheme={toggleTheme} onLogout={handleLogout} isDarkMode={isDarkMode} userPlan={userProfile?.plan} />} />
                    <Route path="/clientes" element={<Clientes customers={customers} orders={serviceOrders} onUpdateCustomer={handleUpdateCustomer} onDeleteCustomer={handleDeleteCustomer} onDeleteOS={handleDeleteOS} onAddCustomer={handleAddCustomer} onToggleTheme={toggleTheme} onLogout={handleLogout} isDarkMode={isDarkMode} userPlan={userProfile?.plan} />} />
                    <Route path="/estoque" element={<Estoque items={inventory} onAddItem={handleAddItem} onDeleteItem={handleDeleteItem} onToggleTheme={toggleTheme} onLogout={handleLogout} isDarkMode={isDarkMode} userPlan={userProfile?.plan} />} />
                    <Route path="/success-upgrade" element={<SuccessUpgrade />} />
                    <Route path="/os/:id" element={<OSDetails orders={serviceOrders} technicians={technicians} onUpdateOS={handleUpdateOS} onDeleteOS={handleDeleteOS} onAddTechnician={handleAddTechnician} onDeleteTechnician={handleDeleteTechnician} />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                  <Navigation />

                  <NewOSDrawer
                    isOpen={isNewOSOpen}
                    onClose={() => setIsNewOSOpen(false)}
                    onSubmit={handleCreateOS}
                    availableCustomers={customers}
                    onQuickAddCustomer={handleAddCustomer}
                  />
                </div>
              ) : (
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              )
            }
          />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;

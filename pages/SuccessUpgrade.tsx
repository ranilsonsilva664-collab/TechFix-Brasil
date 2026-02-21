
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dbService } from '../lib/db';
import { auth } from '../lib/firebase';

const SuccessUpgrade: React.FC = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        const updatePlan = async () => {
            const user = auth.currentUser;
            if (user) {
                try {
                    await dbService.updateProfile(user.uid, {
                        plan: 'pro',
                        upgradedAt: new Date().toISOString()
                    });
                    setStatus('success');
                    setTimeout(() => navigate('/'), 3000);
                } catch (err) {
                    console.error("Error updating plan:", err);
                    setStatus('error');
                }
            } else {
                navigate('/login');
            }
        };

        updatePlan();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-6 text-center">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 dark:border-slate-800 animate-fade-in">
                {status === 'loading' && (
                    <div className="space-y-6">
                        <div className="size-20 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <h1 className="text-2xl font-black dark:text-white">Processando Upgrade...</h1>
                        <p className="text-slate-500">Estamos ativando seus recursos Pro, um momento!</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="space-y-6">
                        <div className="size-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto scale-110">
                            <span className="material-symbols-outlined text-5xl">check_circle</span>
                        </div>
                        <h1 className="text-3xl font-black dark:text-white">Upgrade Concluído!</h1>
                        <p className="text-slate-500 font-medium">Parabéns! Você agora é um usuário **Pro**. Você será redirecionado em instantes.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30"
                        >
                            Ir para Dashboard
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6">
                        <div className="size-20 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto">
                            <span className="material-symbols-outlined text-5xl">error</span>
                        </div>
                        <h1 className="text-2xl font-black dark:text-white">Ops! Algo deu errado.</h1>
                        <p className="text-slate-500">Não conseguimos atualizar seu plano no momento. Entre em contato com o suporte.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-2xl"
                        >
                            Voltar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuccessUpgrade;

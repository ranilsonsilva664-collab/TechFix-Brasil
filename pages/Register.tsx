import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { dbService } from '../lib/db';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const selectedPlan = searchParams.get('plan');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, {
                displayName: name
            });

            // Save plan to character profile
            await dbService.updateProfile(userCredential.user.uid, {
                name: name,
                email: email,
                plan: selectedPlan || 'free',
                createdAt: new Date().toISOString()
            });

            if (selectedPlan === 'pro') {
                window.location.href = 'https://buy.stripe.com/aFa3cw9Gcdpf0sW4eDcs800';
            } else {
                navigate('/');
            }
        } catch (err: any) {
            console.error('Registration error:', err);
            if (err.code === 'auth/email-already-in-use') {
                setError('Este e-mail já está em uso.');
            } else if (err.code === 'auth/weak-password') {
                setError('A senha deve ter pelo menos 6 caracteres.');
            } else if (err.code === 'auth/invalid-email') {
                setError('E-mail inválido.');
            } else if (err.code === 'auth/operation-not-allowed') {
                setError('O cadastro por e-mail/senha não está ativado no Firebase Console.');
            } else if (err.code === 'auth/configuration-not-found' || err.code === 'auth/invalid-api-key') {
                setError('Erro de configuração do Firebase. Verifique suas chaves no arquivo .env.local.');
            } else {
                setError(`Erro: ${err.message || 'Ocorreu um erro ao criar a conta. Tente novamente.'}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background-light dark:bg-background-dark">
            <div className="w-full max-w-[420px] flex flex-col gap-8">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-white text-5xl">person_add</span>
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Criar Conta</h1>
                        <p className="text-slate-500 text-base font-medium">Cadastre sua assistência no TechFix</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col gap-6">
                        <div>
                            <h2 className="text-slate-900 dark:text-white text-xl font-bold">Informações básicas</h2>
                            <p className="text-slate-500 text-sm mt-1">Prencha os dados para começar</p>
                        </div>

                        {selectedPlan && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 w-fit">
                                    <span className="material-symbols-outlined text-primary text-sm font-black">verified</span>
                                    <span className="text-primary text-[10px] font-black uppercase tracking-widest leading-none">
                                        Plano Selecionado: {selectedPlan === 'pro' ? 'PROFISSIONAL' : 'GRATUITO'}
                                    </span>
                                </div>
                                {selectedPlan === 'pro' && (
                                    <p className="text-[11px] text-slate-500 font-medium">
                                        💳 Após criar sua conta, você será redirecionado ao Stripe para concluir o pagamento.
                                    </p>
                                )}
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-3 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">error</span>
                                {error}
                            </div>
                        )}

                        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-2">
                                <label className="text-slate-900 dark:text-slate-200 text-sm font-semibold ml-1">Nome Completo</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                                    <input
                                        className="w-full pl-12 pr-4 h-14 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="Seu nome"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-slate-900 dark:text-slate-200 text-sm font-semibold ml-1">E-mail</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                                    <input
                                        className="w-full pl-12 pr-4 h-14 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="exemplo@email.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-slate-900 dark:text-slate-200 text-sm font-semibold ml-1">Senha</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                                    <input
                                        className="w-full pl-12 pr-12 h-14 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                        placeholder="Mínimo 6 caracteres"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button
                                className={`w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-lg shadow-md shadow-primary/30 transition-all flex items-center justify-center gap-2 mt-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="animate-spin material-symbols-outlined text-xl">progress_activity</span>
                                ) : (
                                    <>
                                        <span>Criar Conta</span>
                                        <span className="material-symbols-outlined text-xl">person_add</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <p className="text-slate-500 text-sm">Já tem uma conta? <Link className="text-primary font-bold hover:underline" to="/login">Acesse agora</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;

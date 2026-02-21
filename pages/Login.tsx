import React, { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('contato@techfix.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
      onLogin();
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential') {
        setError('E-mail ou senha inválidos.');
      } else if (err.code === 'auth/user-not-found') {
        setError('Usuário não encontrado.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('O login por e-mail/senha não está ativado no Firebase Console.');
      } else if (err.code === 'auth/configuration-not-found' || err.code === 'auth/invalid-api-key') {
        setError('Erro de configuração do Firebase. Verifique o arquivo .env.local.');
      } else {
        setError(`Erro: ${err.message || 'Ocorreu um erro ao fazer login. Tente novamente.'}`);
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
            <span className="material-symbols-outlined text-white text-5xl">smartphone</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">Repair ERP</h1>
            <p className="text-slate-500 text-base font-medium">Gestão inteligente para sua assistência</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-slate-900 dark:text-white text-xl font-bold">Acesse sua conta</h2>
              <p className="text-slate-500 text-sm mt-1">Insira suas credenciais para continuar</p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-3 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
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
                    placeholder="Sua senha"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <span className="material-symbols-outlined text-xl">visibility</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <a className="text-primary text-sm font-semibold hover:underline" href="#">Esqueci minha senha</a>
              </div>

              <button
                className={`w-full bg-primary hover:bg-primary/90 text-white font-bold h-14 rounded-lg shadow-md shadow-primary/30 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-spin material-symbols-outlined text-xl">progress_activity</span>
                ) : (
                  <>
                    <span>Entrar</span>
                    <span className="material-symbols-outlined text-xl">arrow_forward</span>
                  </>
                )}
              </button>
            </form>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">Segurança</span>
              <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            </div>

            <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-medium">
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Criptografia ponta a ponta
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <p className="text-slate-500 text-sm">Não tem conta? <Link className="text-primary font-bold hover:underline" to="/register">Cadastre-se</Link></p>
          <div className="flex items-center gap-6 mt-4 opacity-60">
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-[#4c669a]">support_agent</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">Suporte</span>
            </div>
            <div className="h-8 w-px bg-slate-300"></div>
            <div className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-[#4c669a]">language</span>
              <span className="text-[10px] font-bold uppercase tracking-tighter">PT-BR</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

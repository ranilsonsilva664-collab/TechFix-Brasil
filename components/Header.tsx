
import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showAvatar?: boolean;
  onToggleTheme?: () => void;
  onLogout?: () => void;
  isDarkMode?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, showAvatar = true, onToggleTheme, onLogout, isDarkMode }) => {
  return (
    <header className="sticky top-0 z-30 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md px-4 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showAvatar && (
          <div className="size-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-2xl">account_circle</span>
          </div>
        )}
        <div>
          {subtitle && <p className="text-[10px] font-bold uppercase tracking-wider text-primary dark:text-primary/80">{subtitle}</p>}
          <h1 className="text-lg font-extrabold leading-tight tracking-tight dark:text-white">{title}</h1>
        </div>
      </div>
      <div className="flex gap-2">
        {/* Botão para Me Apertar (Troca de Tema) */}
        <button
          onClick={onToggleTheme}
          title="Mudar Tema"
          className="size-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 active:scale-90 transition-all group overflow-hidden"
        >
          <span className={`material-symbols-outlined transition-all duration-500 ${isDarkMode ? 'text-amber-400 rotate-[360deg]' : 'text-primary'}`}>
            {isDarkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {onLogout && (
          <button
            onClick={onLogout}
            title="Sair"
            className="size-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 active:scale-90 transition-all text-danger"
          >
            <span className="material-symbols-outlined font-bold">logout</span>
          </button>
        )}

        <button className="size-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700">
          <span className="material-symbols-outlined text-primary">notifications</span>
        </button>
      </div>
    </header>
  );
};

export default Header;

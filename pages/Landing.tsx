
import React from 'react';
import { Link } from 'react-router-dom';

const Landing: React.FC = () => {
    return (
        <div className="min-h-screen bg-background-dark text-slate-100 overflow-x-hidden selection:bg-primary/30">
            {/* HEADER */}
            <header className="fixed top-0 left-0 right-0 z-[100] bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 py-4 px-6 sm:px-12 flex items-center justify-between animate-slide-up">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">build</span>
                    </div>
                    <h1 className="text-lg font-black tracking-tighter text-white uppercase">
                        TechFix <span className="text-primary">Repair ERP</span>
                    </h1>
                </div>

                <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 dark:text-slate-400">
                    <a href="#como-funciona" className="hover:text-primary transition-colors">Como funciona</a>
                    <a href="#beneficios" className="hover:text-primary transition-colors">Benefícios</a>
                    <a href="#planos" className="hover:text-primary transition-colors">Planos</a>
                </nav>

                <div className="flex items-center gap-4">
                    <Link to="/login" className="text-sm font-bold text-slate-900 dark:text-white hover:text-primary transition-colors">
                        Acessar
                    </Link>
                    <Link to="/register?plan=free" className="hidden sm:inline-flex bg-primary text-white text-sm font-black px-6 py-2.5 rounded-full hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25">
                        Começar grátis
                    </Link>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="pt-32 pb-20 px-6 sm:px-12 max-w-7xl mx-auto flex flex-col items-center text-center animate-fade-in-scale">
                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                    Gestor financeiro inteligente para assistências
                </span>
                <h2 className="text-4xl sm:text-6xl font-black text-white leading-[1.1] mb-6 max-w-4xl tracking-tighter">
                    Você está lucrando de verdade… <span className="text-gradient">ou só girando dinheiro?</span>
                </h2>
                <p className="text-lg text-slate-400 mb-10 max-w-2xl font-medium leading-relaxed">
                    Se você mistura dinheiro de peça com mão de obra, no fim do mês parece que entrou… mas você não sabe quanto realmente sobrou. Com o TechFix, você separa automaticamente:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 w-full max-w-4xl">
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 shadow-sm animate-float flex flex-col items-center text-center" style={{ animationDelay: '0s' }}>
                        <span className="material-symbols-outlined text-primary text-3xl mb-4">build</span>
                        <h3 className="font-bold text-white mb-2">Mão de obra</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Lucro Real</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 shadow-sm animate-float flex flex-col items-center text-center" style={{ animationDelay: '0.2s' }}>
                        <span className="material-symbols-outlined text-orange-500 text-3xl mb-4">inventory_2</span>
                        <h3 className="font-bold text-white mb-2">Peças</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Reinvestimento</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 shadow-sm animate-float flex flex-col items-center text-center" style={{ animationDelay: '0.4s' }}>
                        <span className="material-symbols-outlined text-green-500 text-3xl mb-4">savings</span>
                        <h3 className="font-bold text-white mb-2">Saldo Final</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Crescimento</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/register?plan=free" className="bg-primary text-white font-black px-10 py-5 rounded-2xl hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/30 text-lg">
                        Começar Grátis Agora
                    </Link>
                    <a href="#planos" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black px-10 py-5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 text-lg">
                        Ver Planos
                    </a>
                </div>

                <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-60">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">bolt</span>
                        <span className="text-xs font-bold uppercase tracking-tighter">Setup rápido</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">analytics</span>
                        <span className="text-xs font-bold uppercase tracking-tighter">Visual limpo</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">task_alt</span>
                        <span className="text-xs font-bold uppercase tracking-tighter">Clareza por OS</span>
                    </div>
                </div>
            </section>

            {/* THE PROBLEM */}
            <section className="py-24 px-6 sm:px-12 bg-slate-900/30">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-white mb-6 tracking-tighter">
                            O erro mais comum nas assistências técnicas
                        </h2>
                        <p className="text-lg text-slate-400 font-medium">
                            Muita gente trabalha muito e ainda assim não sabe o lucro do mês, porque:
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="flex gap-4 p-6 bg-slate-900 border border-slate-800 shadow-sm rounded-3xl">
                            <div className="w-12 h-12 shrink-0 rounded-2xl bg-red-500/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-500">error</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Mistura custos</h4>
                                <p className="text-sm text-slate-400">Você mistura custo de peça com ganho de mão de obra e perde a visão real.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-6 bg-slate-900 border border-slate-800 shadow-sm rounded-3xl">
                            <div className="w-12 h-12 shrink-0 rounded-2xl bg-red-500/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-500">shopping_cart_off</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Compra no escuro</h4>
                                <p className="text-sm text-slate-400">Repõe estoque sem saber se aquele serviço realmente deixou margem.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-6 bg-slate-900 border border-slate-800 shadow-sm rounded-3xl">
                            <div className="w-12 h-12 shrink-0 rounded-2xl bg-red-500/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-500">trending_down</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Pobreza de margem</h4>
                                <p className="text-sm text-slate-400">Cresce em volume de serviço, mas o dinheiro no caixa continua o mesmo.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-6 bg-slate-900 border border-slate-800 shadow-sm rounded-3xl">
                            <div className="w-12 h-12 shrink-0 rounded-2xl bg-red-500/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-500">psychology</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-1">Decisão no "achismo"</h4>
                                <p className="text-sm text-slate-400">Toma decisões importantes baseadas no que acha, não em números reais.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 p-8 rounded-3xl bg-primary/10 border border-primary/20 text-center">
                        <p className="text-xl font-bold text-slate-200 italic">
                            "O problema não é falta de trabalho. É falta de separação financeira."
                        </p>
                    </div>
                </div>
            </section>

            {/* THE SOLUTION */}
            <section id="como-funciona" className="py-24 px-6 sm:px-12">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
                    <div className="flex-1 order-2 md:order-1">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative p-8 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-primary">build</span>
                                            <span className="font-bold text-sm">Mão de Obra</span>
                                        </div>
                                        <span className="text-green-500 font-black">LUCRO REAL</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <span className="material-symbols-outlined text-orange-500">inventory_2</span>
                                            <span className="font-bold text-sm">Custo de Peças</span>
                                        </div>
                                        <span className="text-orange-500 font-bold">REPOSIÇÃO</span>
                                    </div>
                                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <span className="font-black text-slate-900 dark:text-white">Saldo em Caixa</span>
                                            <span className="text-2xl font-black text-primary">R$ Resultado</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 order-1 md:order-2">
                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-8 leading-tight tracking-tighter">
                            Plano de Separação: <br />
                            <span className="text-primary italic">o financeiro do jeito certo</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 font-medium">
                            A cada OS, o sistema organiza o dinheiro pra você enxergar o que é custo e o que é ganho. Você separa o custo das peças para novas compras e mantém a mão de obra como seu verdadeiro ganho.
                        </p>
                        <ul className="space-y-4">
                            {['Mão de Obra (Ganho do negócio)', 'Custo de Peças (Reinvestimento)', 'Saldo final em caixa (Automático)'].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-300">
                                    <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-[14px]">
                                        <span className="material-symbols-outlined">check</span>
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* BENEFITS */}
            <section id="beneficios" className="py-24 px-6 sm:px-12 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl sm:text-4xl font-black mb-6 tracking-tighter">O que você passa a controlar</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto font-medium">Adeus planilhas confusas. Tenha o poder da informação real em suas mãos.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: 'Lucro por OS', desc: 'Saiba quais serviços realmente dão dinheiro e quais só fazem “girar”.', icon: 'payments' },
                            { title: 'Decisão com clareza', desc: 'Você enxerga custos e ganhos sem fazer conta manual e sem planilha.', icon: 'insights' },
                            { title: 'Gestão profissional', desc: 'Controle clientes, histórico, valores e organização em um painel simples.', icon: 'shield_person' }
                        ].map((beneficio, i) => (
                            <div key={i} className="group p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-8 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                    <span className="material-symbols-outlined text-3xl">{beneficio.icon}</span>
                                </div>
                                <h3 className="text-xl font-black mb-4">{beneficio.title}</h3>
                                <p className="text-slate-400 leading-relaxed font-medium">{beneficio.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PLANS */}
            <section id="planos" className="py-24 px-6 sm:px-12">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">Escolha seu plano</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-2xl mx-auto">
                            Comece no gratuito e faça upgrade quando quiser. <br className="hidden sm:block" />
                            <span className="text-primary font-bold">👉 Ao clicar em qualquer plano, você vai direto para o cadastro.</span>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* FREE PLAN */}
                        <div className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm">
                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Gratuito</h3>
                                <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mb-6 leading-tight">Para organizar o básico e começar com clareza.</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-slate-900 dark:text-white text-4xl font-black tracking-tighter">R$ 0</span>
                                    <span className="text-slate-500 font-bold">/mês</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 mb-10">
                                {['Até 11 OS', 'Até 5 clientes', 'Plano de Separação', '5 Despesas Fixas (Teste)'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-300">
                                        <span className="material-symbols-outlined text-green-500 text-xl font-black">check</span>
                                        <span className="text-sm">{item}</span>
                                    </div>
                                ))}
                                {['Custo Fixo', 'Relatórios avançados'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 font-bold text-slate-400/50">
                                        <span className="material-symbols-outlined text-xl">close</span>
                                        <span className="text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <Link to="/register?plan=free" className="w-full py-4 px-6 rounded-2xl border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center">
                                Começar no Gratuito
                            </Link>
                        </div>

                        {/* PRO PLAN */}
                        <div className="p-10 rounded-[2.5rem] bg-slate-900 text-white flex flex-col shadow-2xl shadow-primary/20 relative overflow-hidden border border-primary/20">
                            <div className="absolute top-0 right-0 px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] transform rotate-45 translate-x-12 translate-y-8">Popular</div>

                            <div className="mb-8">
                                <h3 className="text-2xl font-black mb-2">Plano Pro</h3>
                                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-6 leading-tight">Para quem quer controle total e lucro real mês a mês.</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-black tracking-tighter">R$ 9,99</span>
                                    <span className="text-slate-500 font-bold">/mês</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 mb-10">
                                <div className="text-primary font-black text-xs uppercase tracking-widest mb-4">Inclui tudo do Gratuito +</div>
                                {['OS sem limite', 'Clientes sem limite', 'Custo Fixo (liberado)', 'Relatórios completos', 'Visão de lucro mensal real'].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 font-bold">
                                        <span className="material-symbols-outlined text-primary text-xl font-black">lock_open</span>
                                        <span className="text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <a
                                href="https://buy.stripe.com/aFa3cw9Gcdpf0sW4eDcs800"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-5 px-6 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/30 text-center block"
                            >
                                Assinar Pro — R$ 9,99
                            </a>
                            <p className="text-center text-[10px] text-slate-500 mt-4 font-bold uppercase tracking-widest">Pagamento seguro via Stripe • PIX ou Cartão</p>
                            <p className="text-center text-[9px] text-slate-600/60 mt-1 font-medium">Cadastre-se antes de pagar para ativar o plano automaticamente</p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-lg font-bold text-slate-600 dark:text-slate-400 italic">
                            "Aqui você para de “achar” que está lucrando — você tem certeza."
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-24 px-6 sm:px-12 bg-primary/5">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">
                        Você pode continuar trabalhando e torcendo pra sobrar dinheiro… ou pode controlar seu lucro como empresa.
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register?plan=free" className="bg-primary text-white font-black px-12 py-5 rounded-2xl hover:bg-primary/90 transition-all text-xl shadow-xl shadow-primary/30">
                            Começar Grátis agora
                        </Link>
                        <Link to="/login" className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black px-12 py-5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-800 text-xl">
                            Acessar Plataforma
                        </Link>
                    </div>
                    <p className="mt-8 text-sm text-slate-500 font-bold uppercase tracking-widest">Já tem conta? Continue de onde parou</p>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 px-6 sm:px-12 border-t border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-slate-900 dark:bg-white flex items-center justify-center">
                            <span className="material-symbols-outlined text-[16px] text-white dark:text-slate-900">build</span>
                        </div>
                        <p className="font-black text-sm tracking-tighter uppercase">TechFix Repair ERP <span className="text-slate-400 font-medium">© 2026</span></p>
                    </div>

                    <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-slate-500">
                        <a href="#planos" className="hover:text-primary transition-colors">Planos</a>
                        <Link to="/login" className="hover:text-primary transition-colors">Acessar</Link>
                        <a href="https://wa.me/seu-numero" className="hover:text-primary transition-colors">Suporte</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Landing;

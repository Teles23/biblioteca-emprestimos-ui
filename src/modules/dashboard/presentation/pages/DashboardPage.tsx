export function DashboardPage() {
    const stats = [
        { label: 'Total de Livros', value: '124', icon: '📚', color: 'bg-accent/10 text-accent' },
        { label: 'Empréstimos Ativos', value: '18', icon: '🤝', color: 'bg-success/10 text-success' },
        { label: 'Livros Atrasados', value: '4', icon: '⚠️', color: 'bg-danger/10 text-danger' },
        { label: 'Novos Leitores (Mês)', value: '12', icon: '👥', color: 'bg-info/10 text-info' },
    ];

    return (
        <div className="p-6 max-w-[1200px] mx-auto animate-in fade-in duration-700">
            <div className="mb-8">
                <h1 className="text-[24px] font-extrabold text-white tracking-tight leading-none mb-1.5">
                    Painel de Controle 📊
                </h1>
                <p className="text-[13px] text-sidebar-text">
                    Bem-vindo ao LibraManager. Aqui está o resumo das atividades da biblioteca.
                </p>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-surface border border-border rounded-lg p-6 flex items-start justify-between shadow-sm hover:translate-y-[-2px] transition-all cursor-default">
                        <div>
                            <p className="text-[12px] font-bold text-text-muted uppercase tracking-wider mb-2">{stat.label}</p>
                            <h3 className="text-[28px] font-black text-white">{stat.value}</h3>
                        </div>
                        <div className={`w-10 h-10 rounded-sm flex items-center justify-center text-xl ${stat.color}`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* RECENT ACTIVITY */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-surface border border-border rounded-lg overflow-hidden flex flex-col h-full">
                        <div className="p-5 border-b border-border bg-surface-2 flex items-center justify-between">
                            <h2 className="text-[16px] font-bold text-white">Atividades Recentes</h2>
                            <button className="text-[11px] font-bold text-accent hover:underline uppercase tracking-widest">Ver tudo</button>
                        </div>
                        <div className="flex-1 p-5 space-y-5">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex items-start gap-4">
                                    <div className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center shrink-0">👤</div>
                                    <div className="flex-1">
                                        <p className="text-[13px] text-white">
                                            <span className="font-bold">Thiago Teles</span> retirou o livro <span className="text-accent underline cursor-pointer font-medium">Clean Architecture</span>
                                        </p>
                                        <p className="text-[11px] text-text-muted mt-0.5">há 2 horas atrás</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* QUICK ACTIONS */}
                <div className="space-y-6">
                    <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
                        <h2 className="text-[16px] font-bold text-white mb-4">Ações Rápidas</h2>
                        <div className="space-y-3">
                            <button className="w-full bg-accent/10 border border-accent/20 text-accent font-bold py-2.5 rounded-sm text-[13px] hover:bg-accent/20 transition-all flex items-center justify-center gap-2">
                                🤝 Registrar Empréstimo
                            </button>
                            <button className="w-full bg-white/5 border border-white/10 text-white font-bold py-2.5 rounded-sm text-[13px] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                📚 Cadastrar Livro
                            </button>
                            <button className="w-full bg-white/5 border border-white/10 text-white font-bold py-2.5 rounded-sm text-[13px] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                                👥 Novo Leitor
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

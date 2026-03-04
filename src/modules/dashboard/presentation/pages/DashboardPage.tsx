import { useAuth } from '../../../shared/contexts/AuthContext';
import { Link } from 'react-router-dom';

export function DashboardPage() {
    const { user } = useAuth();

    const stats = [
        { label: 'Total de Livros', value: '248', icon: '📚', type: 'accent', change: '↑ +12 este mês', trend: 'up' },
        { label: 'Usuários Cadastrados', value: '134', icon: '👥', type: 'info', change: '↑ +5 esta semana', trend: 'up' },
        { label: 'Empréstimos Ativos', value: '47', icon: '📖', type: 'success', change: '↑ +8 hoje', trend: 'up' },
        { label: 'Livros em Atraso', value: '3', icon: '⚠️', type: 'danger', change: '↓ Ação necessária', trend: 'down' },
    ];

    const activities = [
        { dot: 'success', text: '<strong>Maria Oliveira</strong> devolveu <em>O Hobbit</em>', time: 'há 12 minutos' },
        { dot: 'info', text: '<strong>Carlos Santos</strong> emprestou <em>1984 - George Orwell</em>', time: 'há 38 minutos' },
        { dot: 'warning', text: '<strong>Luciana Ferreira</strong> tem devolução prevista para <em>hoje</em>', time: 'há 1 hora' },
    ];

    const overdueItems = [
        { title: 'Dom Casmurro', user: 'Pedro Alves', days: '3 dias' },
        { title: 'Memórias Póstumas', user: 'Fernanda Costa', days: '7 dias' },
    ];

    return (
        <div className="animate-in fade-in duration-700">
            {/* WELCOME BAR */}
            <div className="bg-gradient-to-br from-[#0f1117] to-[#1a1f2e] rounded-[10px] p-6 mb-6 flex items-center justify-between text-white relative overflow-hidden shadow-lg">
                <div className="relative z-10">
                    <h2 className="text-[20px] font-bold tracking-tight mb-1">Bom dia, {user?.name?.split(' ')[0] || 'Admin'}! 👋</h2>
                    <p className="text-[13px] text-sidebar-text">Você tem <strong className="text-accent">3 devoluções em atraso</strong> e 2 empréstimos para hoje.</p>
                </div>
                <Link to="/emprestimos" className="btn btn-primary relative z-10">Ver empréstimos →</Link>
                <div className="absolute right-7 top-1/2 -translate-y-1/2 text-[80px] opacity-[0.07] pointer-events-none select-none">📚</div>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, i) => (
                    <div key={i} className={`stat-card ${stat.type}`}>
                        <div className={`w-10 h-10 rounded-[6px] mb-3.5 flex items-center justify-center text-[18px] ${stat.type === 'accent' ? 'bg-accent/10' :
                                stat.type === 'info' ? 'bg-info/10' :
                                    stat.type === 'success' ? 'bg-success/10' : 'bg-danger/10'
                            }`}>
                            {stat.icon}
                        </div>
                        <div className="stat-value">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                        <div className={`mt-2.5 flex items-center gap-1 text-[11px] font-medium ${stat.trend === 'up' ? 'text-success' : 'text-danger'
                            }`}>
                            {stat.change}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5">
                {/* RECENT ACTIVITY */}
                <div className="bg-white rounded-[10px] border border-border shadow-sm flex flex-col">
                    <div className="px-5 py-[18px] border-b border-border flex items-center justify-between">
                        <h3 className="text-[14px] font-bold text-text-primary">Atividade Recente</h3>
                        <Link to="/historico" className="text-[12px] font-bold text-text-secondary hover:text-accent transition-colors">Ver tudo →</Link>
                    </div>
                    <div className="p-5 flex-1">
                        <div className="space-y-0">
                            {activities.map((act, i) => (
                                <div key={i} className="flex gap-3 py-3 border-b border-surface-3 last:border-0">
                                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${act.dot === 'success' ? 'bg-success' :
                                            act.dot === 'info' ? 'bg-info' : 'bg-warning'
                                        }`}></div>
                                    <div>
                                        <div className="text-[13px] text-text-primary" dangerouslySetInnerHTML={{ __html: act.text }}></div>
                                        <div className="text-[11px] text-text-muted mt-0.5">{act.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* OVERDUE / SUMMARY */}
                <div className="bg-white rounded-[10px] border border-border shadow-sm">
                    <div className="px-5 py-[18px] border-b border-border flex items-center justify-between">
                        <h3 className="text-[14px] font-bold text-danger">⚠️ Em Atraso</h3>
                        <Link to="/emprestimos" className="text-[12px] font-bold text-text-secondary hover:text-accent transition-colors">Gerenciar</Link>
                    </div>
                    <div className="p-5">
                        <div className="space-y-0">
                            {overdueItems.map((item, i) => (
                                <div key={i} className="flex items-center justify-between py-2.5 border-b border-surface-3 last:border-0">
                                    <div>
                                        <div className="text-[13px] font-semibold text-text-primary">{item.title}</div>
                                        <div className="text-[11px] text-text-muted">{item.user}</div>
                                    </div>
                                    <span className="text-[11px] font-bold text-danger bg-danger/10 rounded-[4px] px-1.5 py-0.5">{item.days}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t border-border">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[13px] font-bold uppercase tracking-wider text-text-secondary">Resumo do Acervo</span>
                                <div className="h-px flex-1 bg-border"></div>
                            </div>
                            <div className="grid grid-cols-2 gap-2.5">
                                <div className="bg-success/10 rounded-[6px] p-3 text-center">
                                    <div className="text-[20px] font-bold text-success font-mono">201</div>
                                    <div className="text-[11px] text-success/80 font-medium">Disponíveis</div>
                                </div>
                                <div className="bg-warning/10 rounded-[6px] p-3 text-center">
                                    <div className="text-[20px] font-bold text-warning font-mono">47</div>
                                    <div className="text-[11px] text-warning/80 font-medium">Emprestados</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

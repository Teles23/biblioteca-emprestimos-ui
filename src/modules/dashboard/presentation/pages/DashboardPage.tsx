import { useAuth } from '../../../../shared/contexts/useAuth';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DashboardService, type DashboardStats } from '../../data/services/DashboardService';
import { formatRelativeDate, getBrazilGreeting } from '../../../../shared/utils/date';

export function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string>(() => getBrazilGreeting());

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const stats = await DashboardService.getStats();
        setData(stats);
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar dados do dashboard.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setGreeting(getBrazilGreeting());
    }, 60000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="text-accent animate-pulse font-bold">Carregando dados...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-10 text-center">
        <div className="bg-danger-soft border border-danger/20 text-danger p-6 rounded-lg">
          <p className="font-bold mb-2">Ops!</p>
          <p>{error || 'Não foi possível carregar os dados.'}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary mt-4">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="bg-gradient-to-br from-[#0f1117] to-[#1a1f2e] rounded-lg p-7 mb-6 flex items-center justify-between text-white relative overflow-hidden shadow-lg border border-white/5">
        <div className="relative z-10">
          <h2 className="text-[20px] font-bold tracking-tight mb-1">
            {greeting}, {user?.name?.split(' ')[0] || 'Admin'}! 👋
          </h2>
          <p className="text-[13px] text-sidebar-text">
            Você tem{' '}
            <strong className="text-accent">
              {data.stats.find((s) => s.type === 'danger')?.value || 0} devoluções em atraso
            </strong>
            .
          </p>
        </div>
        <Link to="/emprestimos" className="btn btn-primary relative z-10">
          Ver empréstimos →
        </Link>
        <div className="absolute right-7 top-1/2 -translate-y-1/2 text-[80px] opacity-[0.07] pointer-events-none select-none">
          📚
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {data.stats.map((stat, i) => (
          <div key={i} className={`stat-card ${stat.type}`}>
            <div
              className={`w-10 h-10 rounded-sm mb-3.5 flex items-center justify-center text-[18px] ${
                stat.type === 'accent'
                  ? 'bg-accent-soft text-accent'
                  : stat.type === 'info'
                    ? 'bg-info-soft text-info'
                    : stat.type === 'success'
                      ? 'bg-success-soft text-success'
                      : 'bg-danger-soft text-danger'
              }`}
            >
              {stat.icon}
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
            <div
              className={`mt-2.5 flex items-center gap-1 text-[11px] font-medium ${
                stat.trend === 'up' ? 'text-success' : 'text-danger'
              }`}
            >
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-5 mt-5">
        <div className="bg-white rounded-[10px] border border-border shadow-sm flex flex-col overflow-hidden">
          <div className="px-5 py-[18px] border-b border-border flex items-center justify-between">
            <h3 className="text-[14px] font-bold text-text-primary">Atividade Recente</h3>
            <Link to="/historico" className="btn btn-ghost btn-sm">
              Ver tudo →
            </Link>
          </div>
          <div className="p-5 flex-1">
            <div className="space-y-0">
              {data.activities.length > 0 ? (
                data.activities.map((act, i) => (
                  <div
                    key={i}
                    className="flex gap-3 py-3 border-b border-surface-3 last:border-0 hover:bg-surface-2/50 transition-colors px-1 -mx-1 rounded-sm"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        act.type === 'success'
                          ? 'bg-success'
                          : act.type === 'info'
                            ? 'bg-info'
                            : act.type === 'warning'
                              ? 'bg-warning'
                              : 'bg-danger'
                      }`}
                    ></div>
                    <div>
                      <div className="text-[13px] text-text-primary" dangerouslySetInnerHTML={{ __html: act.text }}></div>
                      <div className="text-[11px] text-text-muted mt-0.5">{formatRelativeDate(act.time)}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-text-muted py-10 text-[13px]">Nenhuma atividade recente encontrada.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-[10px] border border-border shadow-sm overflow-hidden">
            <div className="px-5 py-[18px] border-b border-border flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-danger">⚠️ Em Atraso</h3>
              <Link to="/emprestimos" className="btn btn-ghost btn-sm">
                Gerenciar
              </Link>
            </div>
            <div className="p-5">
              <div className="space-y-0">
                {data.overdueItems.length > 0 ? (
                  data.overdueItems.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-surface-3 last:border-0">
                      <div>
                        <div className="text-[13px] font-semibold text-text-primary">{item.title}</div>
                        <div className="text-[11px] text-text-muted">{item.user}</div>
                      </div>
                      <span className="text-[11px] font-bold text-danger bg-danger-soft rounded-[4px] px-1.5 py-0.5">
                        {item.days}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-success py-4 text-[13px] font-medium">Nenhum empréstimo em atraso! 🎉</p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-2 mb-3 px-1 text-[13px] font-bold uppercase tracking-wider text-text-secondary select-none">
                  Resumo do Acervo
                  <div className="h-px flex-1 bg-border/60"></div>
                </div>
                <div className="grid grid-cols-2 gap-2.5 mt-2.5">
                  <div className="bg-success-soft rounded-sm p-3 text-center border border-success/10">
                    <div className="text-[20px] font-bold text-[#16a34a] font-mono leading-none">{data.summary.available}</div>
                    <div className="text-[11px] text-[#16a34a] mt-1 font-medium">Disponíveis</div>
                  </div>
                  <div className="bg-warning-soft rounded-sm p-3 text-center border border-warning/10">
                    <div className="text-[20px] font-bold text-[#d97706] font-mono leading-none">{data.summary.borrowed}</div>
                    <div className="text-[11px] text-[#d97706] mt-1 font-medium">Emprestados</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

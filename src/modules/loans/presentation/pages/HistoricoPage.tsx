import { useEffect, useState, useCallback } from 'react';
import { LoanRepositoryImpl } from '../../infrastructure/LoanRepositoryImpl';
import type { Loan } from '../../../../shared/types';

export function HistoricoPage() {
    const [history, setHistory] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const repository = new LoanRepositoryImpl();

    const fetchHistory = useCallback(async () => {
        try {
            setLoading(true);
            const data = await repository.history({});
            setHistory(data);
        } catch (err: unknown) {
            console.error('Erro ao carregar histórico:', err);
            setError('Erro ao carregar histórico.');
        } finally {
            setLoading(false);
        }
    }, [repository]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    return (
        <div className="animate-in fade-in duration-500">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Histórico de Operações 📜</h1>
                    <p>Registro completo de todos os empréstimos realizados e finalizados.</p>
                </div>
            </div>

            {error && (
                <div className="bg-danger-soft border border-danger/20 text-danger p-4 rounded-[10px] mb-6 text-[13.5px]">
                    <span>⚠️</span> {error}
                </div>
            )}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Livro</th>
                            <th>Leitor</th>
                            <th>Datas Operação</th>
                            <th>Status / Devolução</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={4} className="py-8 text-center">
                                        <div className="h-4 bg-surface-3 rounded w-3/4 mx-auto" />
                                    </td>
                                </tr>
                            ))
                        ) : history.length > 0 ? (
                            history.map((loan) => (
                                <tr key={loan.id}>
                                    <td>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-[4px] bg-surface-2 flex items-center justify-center shrink-0">📖</div>
                                            <div className="font-bold text-[13.5px] text-text-primary">{loan.book?.title}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="user-cell">
                                            <div className="avatar" style={{ width: '24px', height: '24px', fontSize: '9px', background: 'var(--surface-3)' }}>
                                                {loan.user?.name?.substring(0, 2).toUpperCase() || '??'}
                                            </div>
                                            <span className="text-[13px]">{loan.user?.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-[11px] uppercase text-text-muted font-bold">Retirada: {new Date(loan.loanDate).toLocaleDateString()}</div>
                                        <div className="text-[11px] uppercase text-text-muted font-bold">Prevista: {new Date(loan.dueDate).toLocaleDateString()}</div>
                                    </td>
                                    <td>
                                        <div className="flex flex-col gap-1.5">
                                            <span className={`badge ${loan.status === 'RETURNED' ? 'badge-success' :
                                                loan.status === 'OVERDUE' ? 'badge-danger' : 'badge-warning'
                                                }`}>
                                                {loan.status === 'RETURNED' ? 'Devolvido' :
                                                    loan.status === 'OVERDUE' ? 'Em Atraso' : 'Ativo'}
                                            </span>
                                            {loan.returnDate && (
                                                <span className="text-[11px] text-text-secondary font-medium">
                                                    Finalizado em {new Date(loan.returnDate).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-text-muted">
                                    Nenhum registro encontrado no histórico.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

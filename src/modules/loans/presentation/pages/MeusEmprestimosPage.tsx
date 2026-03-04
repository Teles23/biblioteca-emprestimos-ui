import { useEffect, useState, useCallback, useMemo } from 'react';
import { LoanRepositoryImpl } from '../../infrastructure/LoanRepositoryImpl';
import type { Loan } from '../../../../shared/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function MeusEmprestimosPage() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const repository = useMemo(() => new LoanRepositoryImpl(), []);

    const loadMyLoans = useCallback(async () => {
        try {
            setLoading(true);
            const data = await repository.listMyLoans();
            setLoans(data);
        } catch (err: any) {
            setError('Erro ao carregar seus empréstimos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadMyLoans();
    }, [loadMyLoans]);

    return (
        <div className="animate-in fade-in duration-500">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Meus Empréstimos 📖</h1>
                    <p>Acompanhe os livros que estão com você e seus prazos de devolução.</p>
                </div>
            </div>

            {error && (
                <div className="bg-danger-soft border border-danger/20 text-danger p-4 rounded-[10px] mb-6">
                    <span>⚠️</span> {error}
                </div>
            )}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Livro</th>
                            <th>Data Retirada</th>
                            <th>Data Devolução</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={4} className="py-8 text-center">
                                        <div className="h-4 bg-surface-3 rounded w-3/4 mx-auto" />
                                    </td>
                                </tr>
                            ))
                        ) : loans.length > 0 ? (
                            loans.map((loan) => (
                                <tr key={loan.id} className={loan.status === 'OVERDUE' ? 'bg-danger/[0.03]' : ''}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-12 bg-surface-2 rounded border border-border flex items-center justify-center text-xl shrink-0">📖</div>
                                            <div>
                                                <div className="font-bold text-text-primary">{loan.book?.title}</div>
                                                <div className="text-[11px] text-text-muted">{loan.book?.category?.name || 'Literatura'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-[13px] text-text-secondary">
                                            {format(new Date(loan.loanDate), "dd 'de' MMMM", { locale: ptBR })}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`text-[13px] font-semibold ${loan.status === 'OVERDUE' ? 'text-danger' : 'text-accent'}`}>
                                            {format(new Date(loan.dueDate), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                                            {loan.lateDays > 0 && <span className="ml-1 text-[11px] font-black underline">({loan.lateDays}d de atraso)</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${loan.status === 'OVERDUE' ? 'badge-danger' :
                                            loan.status === 'RETURNED' ? 'badge-success' : 'badge-warning'
                                            }`}>
                                            {loan.status === 'OVERDUE' ? '● Em Atraso' :
                                                loan.status === 'RETURNED' ? '● Devolvido' : '● Com você'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-16 text-center">
                                    <div className="text-[40px] mb-2 opacity-20">📚</div>
                                    <div className="text-[14px] font-bold text-text-primary">Você não possui empréstimos ativos</div>
                                    <div className="text-[12px] text-text-secondary mt-1">Explore nosso acervo e escolha sua próxima leitura!</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

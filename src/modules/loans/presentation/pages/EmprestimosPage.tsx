import { useLoans } from '../hooks/useLoans';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '../../../../shared/utils/error'; // Added import for getErrorMessage
import { ConfirmDialog } from '../../../../shared/ui/ConfirmDialog';
import { useToast } from '../../../../shared/ui/useToast';
import { formatDateBR } from '../../../../shared/utils/date';

export function EmprestimosPage() {
    const { loans, loading, error, fetchActiveLoans, returnBook } = useLoans();
    const toast = useToast();
    const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'OVERDUE'>('ALL');
    const [loanToReturn, setLoanToReturn] = useState<string | null>(null);
    const [isReturning, setIsReturning] = useState(false);

    useEffect(() => {
        fetchActiveLoans();
    }, [fetchActiveLoans]);

    const handleReturn = (id: string) => {
        setLoanToReturn(id);
    };

    const handleConfirmReturn = async () => {
        if (!loanToReturn) {
            return;
        }

        try {
            setIsReturning(true);
            const returned = await returnBook(loanToReturn);

            if (returned) {
                toast.success('Devolução registrada com sucesso.');
                setLoanToReturn(null);
            } else {
                toast.error('Não foi possível registrar a devolução.');
            }
        } catch (err: unknown) {
            console.error("Error returning book:", getErrorMessage(err, 'Erro ao devolver livro.'));
            toast.error(getErrorMessage(err, 'Erro ao devolver livro.'));
        } finally {
            setIsReturning(false);
        }
    };

    const filteredLoans = loans.filter(loan => {
        if (filter === 'ACTIVE') return loan.status === 'ACTIVE';
        if (filter === 'OVERDUE') return loan.status === 'OVERDUE';
        return true;
    });

    const activeCount = loans.filter(l => l.status === 'ACTIVE').length;
    const overdueCount = loans.filter(l => l.status === 'OVERDUE').length;

    return (
        <div className="animate-in fade-in duration-500">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Empréstimos 🤝</h1>
                    <p>Controle de livros emprestados e devoluções</p>
                </div>

                <Link to="/emprestimos/novo" className="btn btn-primary">
                    <span>➕</span> Registrar Empréstimo
                </Link>
            </div>

            {/* MINI STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-surface border border-border rounded-[10px] p-4 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 bg-info/10 rounded-[6px] flex items-center justify-center text-[20px]">📖</div>
                    <div>
                        <div className="text-[22px] font-bold font-mono text-text-primary">{activeCount + overdueCount}</div>
                        <div className="text-[12px] text-text-secondary">Empréstimos Ativos</div>
                    </div>
                </div>
                <div className="bg-surface border border-border rounded-[10px] p-4 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 bg-warning/10 rounded-[6px] flex items-center justify-center text-[20px]">⏳</div>
                    <div>
                        <div className="text-[22px] font-bold font-mono text-text-primary">0</div>
                        <div className="text-[12px] text-text-secondary">Vencem Hoje</div>
                    </div>
                </div>
                <div className="bg-surface border border-border rounded-[10px] p-4 flex items-center gap-4 shadow-sm">
                    <div className="w-10 h-10 bg-danger/10 rounded-[6px] flex items-center justify-center text-[20px]">⚠️</div>
                    <div>
                        <div className="text-[22px] font-bold font-mono text-danger">{overdueCount}</div>
                        <div className="text-[12px] text-text-secondary">Em Atraso</div>
                    </div>
                </div>
            </div>

            <div className="toolbar">
                <div className="toolbar-search">
                    <span>🔍</span>
                    <input type="text" placeholder="Buscar por livro ou usuário..." className="bg-transparent border-none outline-none text-[13px] w-full" />
                </div>
                <div className="toolbar-filters">
                    <select
                        className="bg-surface border border-border rounded-[6px] px-3 py-2 text-[12.5px] outline-none"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as 'ALL' | 'ACTIVE' | 'OVERDUE')} // Removed 'any' type cast
                    >
                        <option value="ALL">Todos os status</option>
                        <option value="ACTIVE">Ativos</option>
                        <option value="OVERDUE">Em atraso</option>
                    </select>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Livro</th>
                            <th>Usuário</th>
                            <th>Empréstimo</th>
                            <th>Devolução</th>
                            <th>Status</th>
                            <th className="text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={6} className="py-8 text-center">
                                        <div className="h-4 bg-surface-3 rounded w-3/4 mx-auto" />
                                    </td>
                                </tr>
                            ))
                        ) : error ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-danger">
                                    {error}
                                </td>
                            </tr>
                        ) : filteredLoans.length > 0 ? (
                            filteredLoans.map((loan) => (
                                <tr key={loan.id} className={loan.status === 'OVERDUE' ? 'bg-danger/[0.03]' : ''}>
                                    <td>
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 ${loan.status === 'OVERDUE' ? 'bg-danger/20' : 'bg-accent/20'
                                                }`}>📖</div>
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
                                    <td className="text-[13px] text-text-secondary">{formatDateBR(loan.loanDate)}</td>
                                    <td>
                                        <div className={`text-[13px] ${loan.status === 'OVERDUE' ? 'text-danger font-bold' : 'text-text-primary'}`}>
                                            {formatDateBR(loan.dueDate)}
                                            {loan.lateDays > 0 && <span className="ml-1 text-[11px] opacity-70">({loan.lateDays}d)</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${loan.status === 'OVERDUE' ? 'badge-danger' : 'badge-warning'}`}>
                                            ● {loan.status === 'OVERDUE' ? 'Atrasado' : 'Ativo'}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <button onClick={() => handleReturn(loan.id)} className="btn btn-primary btn-sm">
                                            ↩ Devolver
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-text-muted">
                                    Nenhum empréstimo encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmDialog
                isOpen={Boolean(loanToReturn)}
                title="Confirmar devolução"
                description="Ao confirmar, o livro será marcado como devolvido e ficará disponível novamente."
                confirmLabel="Confirmar devolução"
                cancelLabel="Cancelar"
                isLoading={isReturning}
                onCancel={() => setLoanToReturn(null)}
                onConfirm={handleConfirmReturn}
            />
        </div>
    );
}



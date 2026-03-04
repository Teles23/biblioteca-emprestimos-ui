import { useLoans } from '../hooks/useLoans';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function EmprestimosPage() {
    const { loans, loading, error, fetchActiveLoans, returnBook } = useLoans();
    const [filter, setFilter] = useState<'ACTIVE' | 'OVERDUE'>('ACTIVE');

    useEffect(() => {
        fetchActiveLoans();
    }, [fetchActiveLoans]);

    const handleReturn = async (id: string) => {
        if (window.confirm('Confirmar devolução do livro?')) {
            await returnBook(id);
        }
    };

    return (
        <div className="p-6 max-w-[1200px] mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[24px] font-extrabold text-white tracking-tight leading-none mb-1.5">
                        Empréstimos 🤝
                    </h1>
                    <p className="text-[13px] text-sidebar-text">
                        Gerencie as retiradas e devoluções de livros.
                    </p>
                </div>

                <Link
                    to="/emprestimos/novo"
                    className="bg-accent text-[#0f1117] px-5 py-2.5 rounded-sm font-bold text-[13px] hover:bg-accent-dark transition-all flex items-center gap-2 w-fit"
                >
                    <span>➕</span> Registrar Empréstimo
                </Link>
            </div>

            <div className="flex gap-2 mb-6 border-b border-border pb-px">
                <button
                    onClick={() => setFilter('ACTIVE')}
                    className={`px-4 py-2 text-[13px] font-bold transition-all border-b-2 ${filter === 'ACTIVE' ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-white'}`}
                >
                    Ativos
                </button>
                <button
                    onClick={() => setFilter('OVERDUE')}
                    className={`px-4 py-2 text-[13px] font-bold transition-all border-b-2 ${filter === 'OVERDUE' ? 'border-accent text-accent' : 'border-transparent text-text-muted hover:text-white'}`}
                >
                    Atrasados
                </button>
            </div>

            {error && (
                <div className="bg-danger-soft border border-danger/20 text-danger p-4 rounded-sm mb-6 text-[13px]">
                    ⚠️ {error}
                </div>
            )}

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="py-20 text-center text-text-muted bg-surface rounded-lg border border-border">Carregando empréstimos...</div>
                ) : loans.length > 0 ? (
                    loans.map((loan) => (
                        <div key={loan.id} className="bg-surface border border-border rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/20 transition-all">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-16 bg-surface-2 rounded-sm border border-border flex items-center justify-center text-2xl shrink-0">📖</div>
                                <div>
                                    <h3 className="font-bold text-white text-[15px] mb-1">{loan.book?.title}</h3>
                                    <div className="flex items-center gap-2 text-[12px] text-text-secondary">
                                        <span className="font-medium text-text-primary">{loan.user?.name}</span>
                                        <span className="text-white/10">•</span>
                                        <span>{loan.user?.email}</span>
                                    </div>
                                    <div className="mt-3 flex flex-wrap gap-4 text-[11px] uppercase tracking-wider font-extrabold">
                                        <div className="flex flex-col">
                                            <span className="text-text-muted mb-0.5">Retirada</span>
                                            <span className="text-white">{new Date(loan.loanDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-text-muted mb-0.5">Entrega</span>
                                            <span className={`${loan.status === 'OVERDUE' ? 'text-danger' : 'text-accent'}`}>
                                                {new Date(loan.dueDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {loan.lateDays > 0 && (
                                    <div className="px-3 py-2 bg-danger/10 border border-danger/20 rounded-sm text-center">
                                        <p className="text-[9px] text-danger font-black uppercase tracking-tighter">Atraso</p>
                                        <p className="text-[14px] text-danger font-black leading-none">{loan.lateDays} dias</p>
                                    </div>
                                )}
                                <button
                                    onClick={() => handleReturn(loan.id)}
                                    className="bg-white/5 border border-white/10 text-white hover:bg-success hover:border-success hover:text-white h-12 px-6 rounded-sm font-bold text-[13px] transition-all"
                                >
                                    Confirmar Devolução
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center text-text-muted bg-surface rounded-lg border border-dashed border-border">
                        Nenhum empréstimo {filter === 'ACTIVE' ? 'ativo' : 'atrasado'} encontrado.
                    </div>
                )}
            </div>
        </div>
    );
}

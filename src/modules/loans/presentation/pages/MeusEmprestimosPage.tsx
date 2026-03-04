import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoanRepositoryImpl } from '../../infrastructure/LoanRepositoryImpl';
import type { Loan } from '../../../../shared/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function MeusEmprestimosPage() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const repository = new LoanRepositoryImpl();

    useEffect(() => {
        async function loadMyLoans() {
            try {
                setLoading(true);
                const data = await repository.listMyLoans();
                setLoans(data);
            } catch (err) {
                setError('Erro ao carregar seus empréstimos.');
            } finally {
                setLoading(false);
            }
        }
        loadMyLoans();
    }, []);

    return (
        <div className="p-6 animate-in fade-in duration-700">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-[28px] font-extrabold text-white tracking-tight">Meus Empréstimos 📚</h1>
                    <p className="text-text-muted text-[14px]">Acompanhe seus livros emprestados e prazos de devolução.</p>
                </div>
                <Link to="/" className="bg-surface-2 border border-border text-white px-4 py-2 rounded-sm text-[13px] font-bold hover:bg-surface transition-all">
                    Início
                </Link>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="bg-danger/10 border border-danger/20 p-4 rounded-sm text-danger text-[14px]">
                    {error}
                </div>
            ) : loans.length === 0 ? (
                <div className="bg-surface border border-border p-12 rounded-lg text-center shadow-xl">
                    <div className="text-[48px] mb-4">📖</div>
                    <h3 className="text-white font-bold text-[18px] mb-2">Nenhum empréstimo encontrado</h3>
                    <p className="text-text-muted text-[14px]">Você não possui empréstimos ativos no momento.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loans.map(loan => (
                        <div key={loan.id} className="bg-surface border border-border rounded-lg p-6 shadow-xl hover:border-accent transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-accent/10 rounded-lg text-[24px] group-hover:scale-110 transition-transform">
                                    📘
                                </div>
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${loan.status === 'ACTIVE' ? 'bg-success/20 text-success' : 'bg-text-muted/20 text-text-muted'
                                    }`}>
                                    {loan.status === 'ACTIVE' ? 'Ativo' : 'Devolvido'}
                                </span>
                            </div>
                            <h3 className="text-white font-bold text-[16px] mb-2 line-clamp-1">{loan.book?.title}</h3>
                            <div className="space-y-2 mb-6">
                                <div className="flex items-center justify-between text-[12px]">
                                    <span className="text-text-muted">Retirada:</span>
                                    <span className="text-white font-medium">
                                        {format(new Date(loan.loanDate), "dd 'de' MMM", { locale: ptBR })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-[12px]">
                                    <span className="text-text-muted">Devolução prevista:</span>
                                    <span className="text-accent font-bold">
                                        {format(new Date(loan.dueDate), "dd 'de' MMM", { locale: ptBR })}
                                    </span>
                                </div>
                            </div>
                            {loan.status === 'ACTIVE' && (
                                <div className="pt-4 border-t border-border flex items-center justify-between">
                                    <span className="text-[11px] text-text-muted italic">Fique atento ao prazo!</span>
                                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(232,168,56,0.6)]"></div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

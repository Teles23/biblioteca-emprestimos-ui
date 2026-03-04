import { useEffect, useState } from 'react';
import { LoanRepositoryImpl } from '../../infrastructure/LoanRepositoryImpl';
import type { Loan } from '../../../../shared/types';

export function HistoricoPage() {
    const [history, setHistory] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const repository = new LoanRepositoryImpl();

    useEffect(() => {
        async function loadHistory() {
            try {
                setLoading(true);
                const data = await repository.history({});
                setHistory(data);
            } catch (err) {
                setError('Erro ao carregar histórico.');
            } finally {
                setLoading(false);
            }
        }
        loadHistory();
    }, []);

    return (
        <div className="p-6 max-w-[1200px] mx-auto animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-[24px] font-extrabold text-white tracking-tight leading-none mb-1.5">
                    Histórico Sugerido 📜
                </h1>
                <p className="text-[13px] text-sidebar-text">
                    Registro completo de todos os empréstimos realizados e finalizados.
                </p>
            </div>

            {error && (
                <div className="bg-danger-soft border border-danger/20 text-danger p-4 rounded-sm mb-6 text-[13px]">
                    ⚠️ {error}
                </div>
            )}

            <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface-2 border-b border-border">
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-muted">Livro</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-muted">Leitor</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-muted">Datas</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-muted">Status / Devolução</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan={4} className="px-6 py-10 text-center text-text-muted">Carregando histórico...</td></tr>
                        ) : history.length > 0 ? (
                            history.map((loan) => (
                                <tr key={loan.id} className="hover:bg-white/[0.01] transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-[14px] text-white underline-none">{loan.book?.title}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[13px] text-white font-medium">{loan.user?.name}</div>
                                        <div className="text-[11px] text-text-secondary">{loan.user?.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[11px] uppercase text-text-muted mb-0.5 font-bold">Retirada: {new Date(loan.loanDate).toLocaleDateString()}</div>
                                        <div className="text-[11px] uppercase text-text-muted font-bold">Prevista: {new Date(loan.dueDate).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm w-fit border ${loan.status === 'RETURNED' ? 'bg-success/10 border-success/20 text-success' :
                                                loan.status === 'OVERDUE' ? 'bg-danger/10 border-danger/20 text-danger' :
                                                    'bg-accent/10 border-accent/20 text-accent'
                                                }`}>
                                                {loan.status}
                                            </span>
                                            {loan.returnDate && (
                                                <span className="text-[11px] text-text-secondary">
                                                    Devolvido em {new Date(loan.returnDate).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={4} className="px-6 py-10 text-center text-text-muted">Nenhum registro encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

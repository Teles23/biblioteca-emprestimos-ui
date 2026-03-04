import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoanRepositoryImpl } from '../../infrastructure/LoanRepositoryImpl';
import { BookRepositoryImpl } from '../../../books/infrastructure/BookRepositoryImpl';
import { UserRepositoryImpl } from '../../../users/infrastructure/UserRepositoryImpl';
import type { Book, User } from '../../../../shared/types';

const loanSchema = z.object({
    bookId: z.string().min(1, 'Selecione um livro'),
    userId: z.string().min(1, 'Selecione um leitor'),
});

type LoanFormValues = z.infer<typeof loanSchema>;

export function RegistrarEmprestimoPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [books, setBooks] = useState<Book[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const loanRepo = new LoanRepositoryImpl();
    const bookRepo = new BookRepositoryImpl();
    const userRepo = new UserRepositoryImpl();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoanFormValues>({
        resolver: zodResolver(loanSchema),
    });

    useEffect(() => {
        async function loadData() {
            try {
                const [booksData, usersData] = await Promise.all([
                    bookRepo.list(),
                    userRepo.list()
                ]);
                // Apenas livros disponíveis
                setBooks(booksData.filter(b => b.status === 'AVAILABLE'));
                setUsers(usersData);
            } catch (err) {
                setError('Erro ao carregar dados auxiliares.');
            } finally {
                setDataLoading(false);
            }
        }
        loadData();
    }, []);

    const onSubmit = async (data: LoanFormValues) => {
        try {
            setLoading(true);
            setError(null);
            await loanRepo.create(data);
            navigate('/emprestimos');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao registrar empréstimo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-[700px] mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <Link to="/emprestimos" className="text-[12px] text-accent hover:underline mb-2 inline-block">
                    ← Voltar para empréstimos
                </Link>
                <h1 className="text-[24px] font-extrabold text-white tracking-tight">
                    Registrar Novo Empréstimo 🤝
                </h1>
            </div>

            <div className="bg-surface border border-border rounded-lg p-8 shadow-xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-semibold text-text-primary tracking-wide">Selecione o Livro</label>
                        <select
                            {...register('bookId')}
                            className={`p-2.5 bg-surface-2 border border-border rounded-sm text-[13.5px] w-full outline-none focus:border-accent appearance-none transition-all ${errors.bookId ? 'border-danger' : ''}`}
                        >
                            <option value="">Selecione um exemplar disponível...</option>
                            {books.map(book => (
                                <option key={book.id} value={book.id}>{book.title}</option>
                            ))}
                        </select>
                        {errors.bookId && <span className="text-[11px] text-danger font-medium">{errors.bookId.message}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-semibold text-text-primary tracking-wide">Selecione o Leitor / Usuário</label>
                        <select
                            {...register('userId')}
                            className={`p-2.5 bg-surface-2 border border-border rounded-sm text-[13.5px] w-full outline-none focus:border-accent appearance-none transition-all ${errors.userId ? 'border-danger' : ''}`}
                        >
                            <option value="">Selecione o usuário...</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                            ))}
                        </select>
                        {errors.userId && <span className="text-[11px] text-danger font-medium">{errors.userId.message}</span>}
                    </div>

                    <div className="p-4 bg-accent/5 border border-accent/10 rounded-sm">
                        <p className="text-[12px] text-accent leading-relaxed">
                            <strong>Observação:</strong> O prazo de devolução padrão é de <span className="font-bold underline">14 dias</span> a partir de hoje.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-danger-soft border border-danger/20 text-danger p-3 rounded-sm text-[13px] font-medium">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
                        <Link to="/emprestimos" className="text-[13px] font-bold text-text-muted hover:text-white transition-colors">Cancelar</Link>
                        <button
                            type="submit"
                            disabled={loading || dataLoading}
                            className="bg-accent text-[#0f1117] px-8 py-2.5 rounded-sm font-bold text-[14px] hover:bg-accent-dark transition-all shadow-[0_4px_12px_rgba(232,168,56,0.3)] disabled:opacity-50"
                        >
                            {loading ? 'Processando...' : 'Confirmar Empréstimo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

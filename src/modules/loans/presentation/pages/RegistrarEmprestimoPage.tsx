import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { LoanRepositoryImpl } from '../../infrastructure/LoanRepositoryImpl';
import { BookRepositoryImpl } from '../../../books/infrastructure/BookRepositoryImpl';
import { UserRepositoryImpl } from '../../../users/infrastructure/UserRepositoryImpl';
import type { Book, User } from '../../../../shared/types';

import { loanSchema, type LoanFormValues } from '../schemas/loan.schema';

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
        <div className="animate-in fade-in duration-500">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Registrar Novo Empréstimo 🤝</h1>
                    <p>Preencha os dados abaixo para vincular um livro a um leitor</p>
                </div>
                <Link to="/emprestimos" className="btn btn-secondary">
                    ← Voltar
                </Link>
            </div>

            <div className="card max-w-[800px]">
                <div className="card-header">
                    <div className="card-title">Dados da Transação</div>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-grid">
                            <div className="form-group span-2">
                                <label>Livro Disponível <span className="req">*</span></label>
                                <select
                                    {...register('bookId')}
                                    className={errors.bookId ? 'border-danger' : ''}
                                >
                                    <option value="">Selecione um exemplar...</option>
                                    {books.map(book => (
                                        <option key={book.id} value={book.id}>{book.title}</option>
                                    ))}
                                </select>
                                {errors.bookId && <span className="text-[11px] text-danger mt-1">{errors.bookId.message}</span>}
                            </div>

                            <div className="form-group span-2">
                                <label>Leitor / Usuário <span className="req">*</span></label>
                                <select
                                    {...register('userId')}
                                    className={errors.userId ? 'border-danger' : ''}
                                >
                                    <option value="">Selecione quem está retirando...</option>
                                    {users.map(user => (
                                        <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                                    ))}
                                </select>
                                {errors.userId && <span className="text-[11px] text-danger mt-1">{errors.userId.message}</span>}
                            </div>
                        </div>

                        <div className="alert alert-info mt-6">
                            ℹ️ O prazo de devolução é calculado automaticamente para <strong>14 dias</strong> a partir de hoje.
                        </div>

                        {error && (
                            <div className="alert alert-info mt-4 bg-danger/10 text-danger border-danger/20">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="form-actions mt-8">
                            <button type="submit" disabled={loading || dataLoading} className="btn btn-primary">
                                {loading ? 'Processando...' : 'Confirmar Empréstimo'}
                            </button>
                            <Link to="/emprestimos" className="btn btn-secondary">Cancelar</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

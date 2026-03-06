import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { getErrorMessage } from '../../../../shared/utils/error';
import { LoanRepositoryImpl } from '../../infrastructure/LoanRepositoryImpl';
import { BookRepositoryImpl } from '../../../books/infrastructure/BookRepositoryImpl';
import { UserRepositoryImpl } from '../../../users/infrastructure/UserRepositoryImpl';
import type { Book, User } from '../../../../shared/types';
import { useToast } from '../../../../shared/ui/useToast';

import { loanSchema, type LoanFormValues } from '../schemas/loan.schema';

export function RegistrarEmprestimoPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [books, setBooks] = useState<Book[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const loanRepo = useMemo(() => new LoanRepositoryImpl(), []);
    const bookRepo = useMemo(() => new BookRepositoryImpl(), []);
    const userRepo = useMemo(() => new UserRepositoryImpl(), []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoanFormValues>({
        resolver: zodResolver(loanSchema),
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                setDataLoading(true);
                const [booksData, usersData] = await Promise.all([
                    bookRepo.list(),
                    userRepo.list()
                ]);
                setBooks(booksData);
                setUsers(usersData);
            } catch {
                setError('Erro ao carregar dados necessários.');
            } finally {
                setDataLoading(false);
            }
        };
        loadData();
    }, [bookRepo, userRepo]);

    const onSubmit = async (data: LoanFormValues) => {
        try {
            setLoading(true);
            setError(null);
            await loanRepo.create(data);
            toast.success('Empréstimo registrado com sucesso.');
            navigate('/emprestimos');
        } catch (err: unknown) {
            const message = getErrorMessage(err, 'Erro ao processar.');
            setError(message);
            toast.error(message);
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

                        <div className="note note-info mt-6">
                            ℹ️ O prazo de devolução é calculado automaticamente para <strong>14 dias</strong> a partir de hoje.
                        </div>

                        {error && <p className="mt-4 text-[12px] text-danger font-medium">⚠️ {error}</p>}

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



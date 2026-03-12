import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { getErrorMessage } from '../../../../shared/utils/error';
import { LoanRepositoryImpl } from '../../infrastructure/LoanRepositoryImpl';
import { BookRepositoryImpl } from '../../../books/infrastructure/BookRepositoryImpl';
import { UserRepositoryImpl } from '../../../users/infrastructure/UserRepositoryImpl';
import type { Book, User } from '../../../../shared/types';
import { useToast } from '../../../../shared/ui/useToast';
import { formatDateBR } from '../../../../shared/utils/date';
import { addDays } from 'date-fns';
import { loanSchema, type LoanFormValues } from '../schemas/loan.schema';
import { useAuth } from '../../../../shared/contexts/useAuth';

export function RegistrarEmprestimoPage() {
    const { user } = useAuth();
    const isAdmin = user?.roles.includes('ROLE_ADMIN') ?? false;
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const [books, setBooks] = useState<Book[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    const loanRepo = useMemo(() => new LoanRepositoryImpl(), []);
    const bookRepo = useMemo(() => new BookRepositoryImpl(), []);
    const userRepo = useMemo(() => new UserRepositoryImpl(), []);

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<LoanFormValues>({
        resolver: zodResolver(loanSchema),
        defaultValues: {
            loanDate: new Date().toISOString().split('T')[0],
            userId: isAdmin ? '' : (user?.id ?? '')
        }
    });

    const selectedBookId = useWatch({ control, name: 'bookId' });
    const selectedUserId = useWatch({ control, name: 'userId' });
    const watchedLoanDate = useWatch({ control, name: 'loanDate' }) || new Date().toISOString().split('T')[0];

    const selectedBook = useMemo(() => books.find(b => b.id === selectedBookId), [books, selectedBookId]);
    const selectedUser = useMemo(() => users.find(u => u.id === selectedUserId), [users, selectedUserId]);

    const loanDateObj = useMemo(() => new Date(watchedLoanDate + 'T12:00:00'), [watchedLoanDate]);
    const dueDate = useMemo(() => addDays(loanDateObj, 14), [loanDateObj]);

    useEffect(() => {
        if (!isAdmin && user?.id) {
            setValue('userId', user.id, { shouldValidate: true });
        }
    }, [isAdmin, setValue, user?.id]);

    useEffect(() => {
        setShowDetails(Boolean(selectedBook));
    }, [selectedBook]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setDataLoading(true);
                const booksData = await bookRepo.list();
                setBooks(booksData.filter(b => b.status === 'AVAILABLE'));

                if (isAdmin) {
                    const usersData = await userRepo.list();
                    setUsers(usersData);
                }
            } catch {
                setError('Erro ao carregar dados necessários.');
            } finally {
                setDataLoading(false);
            }
        };
        loadData();
    }, [bookRepo, userRepo, isAdmin]);

    const onSubmit = async (data: LoanFormValues) => {
        try {
            setLoading(true);
            setError(null);

            const finalLoanDate = new Date(data.loanDate! + 'T12:00:00');
            const finalDueDate = addDays(finalLoanDate, 14);

            await loanRepo.create({
                ...data,
                loanDate: finalLoanDate.toISOString(),
                dueDate: finalDueDate.toISOString()
            });

            toast.success('Empréstimo registrado com sucesso.');
            navigate(isAdmin ? '/emprestimos' : '/meus-emprestimos');
        } catch (err: unknown) {
            const message = getErrorMessage(err, 'Erro ao processar.');
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const backPath = isAdmin ? '/emprestimos' : '/meus-emprestimos';

    return (
        <div className="animate-in fade-in duration-500">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Registrar Empréstimo 🤝</h1>
                    <p>Registre um novo empréstimo de livro</p>
                </div>
                <Link to={backPath} className="btn btn-secondary">
                    ← Voltar
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
                {/* FORM */}
                <div className="card">
                    <div className="card-header flex justify-between items-center">
                        <div className="card-title">Dados do Empréstimo</div>
                        <span className="badge badge-neutral">Novo</span>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="form-grid gap-5">
                                <div className="form-group span-2">
                                    <label>Selecionar Livro <span className="req">*</span></label>
                                    <select
                                        {...register('bookId')}
                                        className={errors.bookId ? 'border-danger' : ''}
                                    >
                                        <option value="">— Selecione um livro disponível —</option>
                                        {books.map(book => (
                                            <option key={book.id} value={book.id}>{book.title}</option>
                                        ))}
                                    </select>
                                    {errors.bookId && <span className="text-[11px] text-danger mt-1">{errors.bookId.message}</span>}

                                    {selectedBook && (
                                        <div className="flex items-center gap-3 p-3 bg-surface-2 rounded-md mt-2 border border-border/50">
                                            <div className="w-8 h-10 rounded-[3px] bg-accent/20 flex items-center justify-center text-[14px]">📖</div>
                                            <div>
                                                <div className="text-[13px] font-bold text-text-primary">{selectedBook.title}</div>
                                                <div className="text-[11px] text-text-muted">
                                                    {selectedBook.authors?.map(a => a.name).join(', ')} · {selectedBook.category?.name}
                                                </div>
                                                <span className="badge badge-success mt-1">● Disponível</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setShowDetails((open) => !open)}
                                                className="icon-btn ml-auto"
                                                aria-label={showDetails ? 'Ocultar detalhes' : 'Ver detalhes'}
                                                title={showDetails ? 'Ocultar detalhes' : 'Ver detalhes'}
                                            >
                                                ℹ️
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {isAdmin ? (
                                    <div className="form-group span-2">
                                        <label>Selecionar Usuário <span className="req">*</span></label>
                                        <select
                                            {...register('userId')}
                                            className={errors.userId ? 'border-danger' : ''}
                                        >
                                            <option value="">— Selecione um usuário —</option>
                                            {users.map(userItem => (
                                                <option key={userItem.id} value={userItem.id}>{userItem.name} ({userItem.email})</option>
                                            ))}
                                        </select>
                                        {errors.userId && <span className="text-[11px] text-danger mt-1">{errors.userId.message}</span>}
                                    </div>
                                ) : (
                                    <div className="form-group span-2">
                                        <label>Usuário</label>
                                        <input
                                            type="text"
                                            value={user ? `${user.name || 'Usuário'} (${user.email})` : ''}
                                            disabled
                                            className="bg-surface-2 cursor-not-allowed"
                                        />
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 span-2">
                                    <div className="form-group">
                                        <label>Data do Empréstimo</label>
                                        <input
                                            type="date"
                                            {...register('loanDate')}
                                            className="bg-surface-2"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Devolução Prevista</label>
                                        <input type="text" value={formatDateBR(dueDate)} disabled className="bg-surface-2 cursor-not-allowed" />
                                        <div className="text-[10px] text-text-muted mt-1 font-medium italic">Calculada automaticamente: +14 dias</div>
                                    </div>
                                </div>
                            </div>

                            {error && <p className="mt-4 text-[12px] text-danger font-medium">⚠️ {error}</p>}

                            <div className="form-actions mt-8">
                                <button type="submit" disabled={loading || dataLoading} className="btn btn-primary">
                                    {loading ? 'Processando...' : '📖 Confirmar Empréstimo'}
                                </button>
                                <Link to={backPath} className="btn btn-secondary">Cancelar</Link>
                            </div>
                        </form>
                    </div>
                </div>

                {/* PREVIEW SIDEBAR */}
                <div className="flex flex-col gap-4">
                    <div className="bg-[#0f1117] rounded-[10px] p-5 text-white shadow-lg border border-white/5 animate-in slide-in-from-right duration-300">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[#a0a8b8] mb-4">Resumo do Empréstimo</div>

                        <div className="mb-4">
                            <div className="text-[10px] uppercase text-[#a0a8b8] font-semibold tracking-wider">Livro</div>
                            <div className="text-[14px] font-medium mt-0.5">{selectedBook?.title || '—'}</div>
                        </div>

                        {showDetails && selectedBook && (
                            <div className="mb-4 space-y-2 text-[12px] text-[#c6ccd8]">
                                <div><strong>Ano:</strong> {selectedBook.publicationYear || '—'}</div>
                                <div><strong>Editora:</strong> {selectedBook.publisher || '—'}</div>
                                <div><strong>Páginas:</strong> {selectedBook.pages || '—'}</div>
                                {selectedBook.synopsis && (
                                    <div><strong>Sinopse:</strong> {selectedBook.synopsis.length > 140 ? `${selectedBook.synopsis.slice(0, 140)}…` : selectedBook.synopsis}</div>
                                )}
                            </div>
                        )}

                        <div className="mb-4">
                            <div className="text-[10px] uppercase text-[#a0a8b8] font-semibold tracking-wider">Usuário</div>
                            <div className="text-[14px] font-medium mt-0.5">{selectedUser?.name || user?.name || '—'}</div>
                        </div>

                        <div className="mb-4">
                            <div className="text-[10px] uppercase text-[#a0a8b8] font-semibold tracking-wider">Data Empréstimo</div>
                            <div className="text-[13px] font-mono text-accent mt-0.5">{formatDateBR(loanDateObj)}</div>
                        </div>

                        <div className="mb-4">
                            <div className="text-[10px] uppercase text-[#a0a8b8] font-semibold tracking-wider">Devolução Prevista</div>
                            <div className="text-[13px] font-mono text-success mt-0.5">{formatDateBR(dueDate)}</div>
                        </div>

                        <div className="pt-4 mt-2 border-t border-white/10">
                            <div className="text-[10px] uppercase text-[#a0a8b8] font-semibold tracking-wider">Status após registro</div>
                            <div className="mt-2">
                                <span className="badge badge-warning">● Emprestado</span>
                            </div>
                        </div>
                    </div>

                    <div className="note note-info text-[12.5px] leading-relaxed">
                        ℹ️ Apenas livros com status <strong>Disponível</strong> aparecem na lista de seleção. O status do livro será alterado para <strong>Emprestado</strong> automaticamente.
                    </div>
                </div>
            </div>
        </div>
    );
}

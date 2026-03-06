import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect, useState, useMemo } from 'react';
import { getErrorMessage } from '../../../../shared/utils/error';
import { BookRepositoryImpl } from '../../infrastructure/BookRepositoryImpl';
import { AuthorRepositoryImpl } from '../../../authors/infrastructure/AuthorRepositoryImpl';
import { CategoryRepositoryImpl } from '../../../categories/infrastructure/CategoryRepositoryImpl';
import type { Author, Category } from '../../../../shared/types';
import { useToast } from '../../../../shared/ui/useToast';

import { bookSchema, type BookFormValues } from '../schemas/book.schema';

export function CadastroLivroPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [authors, setAuthors] = useState<Author[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const bookRepo = useMemo(() => new BookRepositoryImpl(), []);
    const authorRepo = useMemo(() => new AuthorRepositoryImpl(), []);
    const categoryRepo = useMemo(() => new CategoryRepositoryImpl(), []);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<BookFormValues>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            authorIds: [],
        }
    });

    const selectedAuthorIds = watch('authorIds') || [];

    useEffect(() => {
        if (id) {
            const loadData = async () => {
                try {
                    setLoading(true);
                    const [bookData, authorsData, categoriesData] = await Promise.all([
                        bookRepo.findById(id),
                        authorRepo.list(),
                        categoryRepo.list()
                    ]);
                    setAuthors(authorsData || []);
                    setCategories(categoriesData || []);

                    setValue('title', bookData.title);
                    setValue('publicationYear', bookData.publicationYear);
                    setValue('categoryId', bookData.categoryId);
                    setValue('authorIds', bookData.authors?.map((a: Author) => a.id) || []);
                } catch {
                    setError('Erro ao carregar dados do livro.');
                } finally {
                    setLoading(false);
                }
            };
            loadData();
        } else {
            const loadOptions = async () => {
                try {
                    const [authorsData, categoriesData] = await Promise.all([
                        authorRepo.list(),
                        categoryRepo.list()
                    ]);
                    setAuthors(authorsData || []);
                    setCategories(categoriesData || []);
                } catch {
                    setError('Erro ao carregar opções.');
                }
            };
            loadOptions();
        }
    }, [id, bookRepo, authorRepo, categoryRepo, setValue]);

    const onSubmit = async (data: BookFormValues) => {
        try {
            setLoading(true);
            setError(null);
            if (id) {
                await bookRepo.update(id, data);
            } else {
                await bookRepo.create(data);
            }
            toast.success(id ? 'Livro atualizado com sucesso.' : 'Livro cadastrado com sucesso.');
            navigate('/livros');
        } catch (err: unknown) {
            const message = getErrorMessage(err, 'Erro ao salvar livro.');
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const toggleAuthor = (authorId: string) => {
        const current = [...(selectedAuthorIds || [])];
        const index = current.indexOf(authorId);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(authorId);
        }
        setValue('authorIds', current, { shouldValidate: true, shouldDirty: true });
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>{id ? 'Editar Livro' : 'Cadastrar Livro'} 📚</h1>
                    <p>{id ? 'Atualize as informações do livro no acervo' : 'Preencha os dados do novo livro para o acervo'}</p>
                </div>
                <Link to="/livros" className="btn btn-secondary">
                    ← Voltar
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
                    {/* FORM CARD */}
                    <div className="card">
                        <div className="card-header">
                            <div className="card-title">Informações do Livro</div>
                            <span className="badge badge-neutral">{id ? 'Edição' : 'Novo'}</span>
                        </div>
                        <div className="card-body">
                            <div className="form-grid form-grid-2">
                                <div className="form-group span-2">
                                    <label>Título <span className="req">*</span></label>
                                    <input
                                        {...register('title')}
                                        type="text"
                                        placeholder="Ex: Dom Casmurro"
                                        className={errors.title ? 'border-danger' : ''}
                                    />
                                    {errors.title && <span className="text-[11px] text-danger mt-1">{errors.title.message}</span>}
                                    <div className="form-hint">O título deve ser claro e completo.</div>
                                </div>

                                <div className="form-group">
                                    <label>Ano de Publicação <span className="req">*</span></label>
                                    <input
                                        {...register('publicationYear', { valueAsNumber: true })}
                                        type="number"
                                        placeholder="AAAA"
                                        className={errors.publicationYear ? 'border-danger' : ''}
                                    />
                                    {errors.publicationYear && <span className="text-[11px] text-danger mt-1">{errors.publicationYear.message}</span>}
                                </div>

                                <div className="form-group">
                                    <label>ISBN (Opcional)</label>
                                    <input
                                        type="text"
                                        placeholder="978-85-..."
                                    />
                                </div>

                                <div className="form-group span-2">
                                    <label>Categoria <span className="req">*</span></label>
                                    <select
                                        {...register('categoryId')}
                                        className={errors.categoryId ? 'border-danger' : ''}
                                    >
                                        <option value="">Selecione uma categoria</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    {errors.categoryId && <span className="text-[11px] text-danger mt-1">{errors.categoryId.message}</span>}
                                </div>

                                <div className="form-group span-2">
                                    <label>Autores <span className="req">*</span> <span className="text-text-muted font-normal">(mínimo 1)</span></label>
                                    <div className="flex flex-wrap gap-2 mb-3 min-h-[40px] p-2 bg-surface-2 border border-border rounded-sm">
                                        {selectedAuthorIds.length > 0 ? (
                                            selectedAuthorIds.map(id => {
                                                const author = authors.find(a => a.id === id);
                                                return author ? (
                                                    <span key={id} className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent border border-accent/30 rounded-full text-[12px] font-bold">
                                                        {author.name}
                                                        <button type="button" onClick={() => toggleAuthor(id)} className="hover:text-white">×</button>
                                                    </span>
                                                ) : null;
                                            })
                                        ) : (
                                            <span className="text-[12px] text-text-muted italic">Nenhum autor selecionado</span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 h-[150px] overflow-y-auto p-2 bg-surface-2 border border-border rounded-sm main-scrollbar">
                                        {authors.map(author => (
                                            <div
                                                key={author.id}
                                                onClick={() => toggleAuthor(author.id)}
                                                className={`p-2 rounded-sm cursor-pointer text-[12px] transition-all border ${selectedAuthorIds.includes(author.id)
                                                    ? 'bg-accent/10 border-accent/20 text-accent'
                                                    : 'border-transparent hover:bg-white/5'
                                                    }`}
                                            >
                                                {selectedAuthorIds.includes(author.id) ? '✅' : '👤'} {author.name}
                                            </div>
                                        ))}
                                    </div>
                                    {errors.authorIds && <span className="text-[11px] text-danger mt-1">{errors.authorIds.message}</span>}
                                </div>
                            </div>

                            {error && <p className="mt-4 text-[12px] text-danger font-medium">⚠️ {error}</p>}

                            <div className="form-actions mt-8">
                                <button type="submit" disabled={loading} className="btn btn-primary">
                                    {loading ? 'Salvando...' : '💾 Salvar Livro'}
                                </button>
                                <Link to="/livros" className="btn btn-secondary">Cancelar</Link>
                            </div>
                        </div>
                    </div>

                    {/* SIDEBAR INFO */}
                    <div className="flex flex-col gap-4">
                        <div className="card">
                            <div className="card-header"><div className="card-title">Status</div></div>
                            <div className="card-body">
                                <div className="form-group">
                                    <label>Status Inicial</label>
                                    <select disabled={!!id}>
                                        <option value="AVAILABLE">Disponível</option>
                                        <option value="BORROWED">Emprestado</option>
                                    </select>
                                    <div className="form-hint">Novos livros são cadastrados como <strong>disponível</strong> por padrão</div>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <div className="card-header"><div className="card-title">Capa do Livro</div></div>
                            <div className="card-body">
                                <div className="border-2 border-dashed border-border rounded-sm p-8 text-center cursor-pointer hover:border-accent transition-all text-text-muted">
                                    <div className="text-[32px] mb-2">🖼️</div>
                                    <div className="text-[13px] font-bold">Arraste ou clique</div>
                                    <div className="text-[11px]">PNG, JPG até 5MB</div>
                                </div>
                            </div>
                        </div>

                        <div className="note note-info">
                            ℹ️ O livro ficará visível para todos após o salvamento.
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}



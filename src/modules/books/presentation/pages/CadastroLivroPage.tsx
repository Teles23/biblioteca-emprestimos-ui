import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BookRepositoryImpl } from '../../infrastructure/BookRepositoryImpl';
import { AuthorRepositoryImpl } from '../../../authors/infrastructure/AuthorRepositoryImpl';
import { CategoryRepositoryImpl } from '../../../categories/infrastructure/CategoryRepositoryImpl';
import type { Author, Category } from '../../../../shared/types';

const bookSchema = z.object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
    publicationYear: z.coerce.number()
        .min(1500, 'Ano inválido')
        .max(new Date().getFullYear() + 1, 'Ano futuro não permitido'),
    categoryId: z.string().min(1, 'Selecione uma categoria'),
    authorIds: z.array(z.string()).min(1, 'Selecione pelo menos um autor'),
});

type BookFormValues = z.infer<typeof bookSchema>;

export function CadastroLivroPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [authors, setAuthors] = useState<Author[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const bookRepo = new BookRepositoryImpl();
    const authorRepo = new AuthorRepositoryImpl();
    const categoryRepo = new CategoryRepositoryImpl();

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

    const selectedAuthorIds = watch('authorIds');

    useEffect(() => {
        async function loadData() {
            try {
                const [authorsData, categoriesData] = await Promise.all([
                    authorRepo.list(),
                    categoryRepo.list()
                ]);
                setAuthors(authorsData);
                setCategories(categoriesData);

                if (id) {
                    const book = await bookRepo.findById(id);
                    setValue('title', book.title);
                    setValue('publicationYear', book.publicationYear);
                    setValue('categoryId', book.categoryId);
                    setValue('authorIds', book.authors.map(a => a.id));
                }
            } catch (err: any) {
                setError('Erro ao carregar dados complementares (autores/categorias).');
            }
        }
        loadData();
    }, [id]);

    const onSubmit = async (data: BookFormValues) => {
        try {
            setLoading(true);
            setError(null);
            if (id) {
                await bookRepo.update(id, data);
            } else {
                await bookRepo.create(data);
            }
            navigate('/livros');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao salvar livro.');
        } finally {
            setLoading(false);
        }
    };

    const toggleAuthor = (authorId: string) => {
        const current = [...selectedAuthorIds];
        const index = current.indexOf(authorId);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(authorId);
        }
        setValue('authorIds', current);
    };

    return (
        <div className="p-6 max-w-[800px] mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <Link to="/livros" className="text-[12px] text-accent hover:underline mb-2 inline-block">
                    ← Voltar para listagem
                </Link>
                <h1 className="text-[24px] font-extrabold text-white tracking-tight">
                    {id ? 'Editar Livro' : 'Novo Livro'} 📚
                </h1>
            </div>

            <div className="bg-surface border border-border rounded-lg p-8 shadow-xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-[12px] font-semibold text-text-primary tracking-wide">Título do Livro</label>
                            <input
                                {...register('title')}
                                type="text"
                                placeholder="Ex: O Senhor dos Anéis"
                                className={`p-2.5 bg-surface-2 border border-border rounded-sm text-[13.5px] w-full outline-none focus:border-accent transition-all ${errors.title ? 'border-danger' : ''}`}
                            />
                            {errors.title && <span className="text-[11px] text-danger font-medium">{errors.title.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-semibold text-text-primary tracking-wide">Ano de Publicação</label>
                            <input
                                {...register('publicationYear', { valueAsNumber: true })}
                                type="number"
                                placeholder="Ex: 1954"
                                className={`p-2.5 bg-surface-2 border border-border rounded-sm text-[13.5px] w-full outline-none focus:border-accent transition-all ${errors.publicationYear ? 'border-danger' : ''}`}
                            />
                            {errors.publicationYear && <span className="text-[11px] text-danger font-medium">{errors.publicationYear.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-semibold text-text-primary tracking-wide">Categoria</label>
                            <select
                                {...register('categoryId')}
                                className={`p-2.5 bg-surface-2 border border-border rounded-sm text-[13.5px] w-full outline-none focus:border-accent transition-all appearance-none ${errors.categoryId ? 'border-danger' : ''}`}
                            >
                                <option value="">Selecione uma categoria...</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            {errors.categoryId && <span className="text-[11px] text-danger font-medium">{errors.categoryId.message}</span>}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-semibold text-text-primary tracking-wide">Selecione os Autores</label>
                        <div className="bg-surface-2 border border-border rounded-sm p-4 h-[180px] overflow-y-auto main-scrollbar grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {authors.map(author => (
                                <div
                                    key={author.id}
                                    onClick={() => toggleAuthor(author.id)}
                                    className={`flex items-center gap-2 p-2 rounded-sm cursor-pointer border transition-all ${selectedAuthorIds.includes(author.id)
                                        ? 'bg-accent/10 border-accent text-accent'
                                        : 'border-transparent text-sidebar-text hover:bg-white/5'
                                        }`}
                                >
                                    <span className="text-[14px]">{selectedAuthorIds.includes(author.id) ? '✅' : '👤'}</span>
                                    <span className="text-[12.5px] font-medium truncate">{author.name}</span>
                                </div>
                            ))}
                        </div>
                        {errors.authorIds && <span className="text-[11px] text-danger font-medium">{errors.authorIds.message}</span>}
                    </div>

                    {error && (
                        <div className="bg-danger-soft border border-danger/20 text-danger p-3 rounded-sm text-[13px] font-medium animate-in fade-in zoom-in duration-300">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
                        <Link to="/livros" className="text-[13px] font-bold text-text-muted hover:text-white transition-colors">Cancelar</Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-accent text-[#0f1117] px-8 py-2.5 rounded-sm font-bold text-[14px] hover:bg-accent-dark transition-all shadow-[0_4px_12px_rgba(232,168,56,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Salvando...' : (id ? 'Atualizar Livro' : 'Salvar Livro')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

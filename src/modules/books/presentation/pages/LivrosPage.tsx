import { useBooks } from '../hooks/useBooks';
import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { CategoryRepositoryImpl } from '../../../categories/infrastructure/CategoryRepositoryImpl';
import type { Category } from '../../../../shared/types';
import { ConfirmDialog } from '../../../../shared/ui/ConfirmDialog';
import { useToast } from '../../../../shared/ui/useToast';

export function LivrosPage() {
    const { books, loading, error, deleteBook, refresh } = useBooks();
    const toast = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [categoryFilter, setCategoryFilter] = useState('ALL');
    const [categories, setCategories] = useState<Category[]>([]);
    const [bookToDelete, setBookToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const categoryRepo = useMemo(() => new CategoryRepositoryImpl(), []);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await categoryRepo.list();
                setCategories(data);
            } catch (err) {
                console.error("Erro ao carregar categorias para filtro", err);
            }
        };
        loadCategories();
    }, [categoryRepo]);

    const filteredBooks = books.filter((book) => {
        const matchesSearch = 
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.authors.some(author => author.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = statusFilter === 'ALL' || book.status === statusFilter;
        const matchesCategory = categoryFilter === 'ALL' || book.categoryId === categoryFilter;

        return matchesSearch && matchesStatus && matchesCategory;
    });

    const handleDelete = (id: string) => {
        setBookToDelete(id);
    };

    const handleConfirmDelete = async () => {
        if (!bookToDelete) {
            return;
        }

        try {
            setIsDeleting(true);
            const deleted = await deleteBook(bookToDelete);

            if (deleted) {
                toast.success('Livro excluído com sucesso.');
                setBookToDelete(null);
            } else {
                toast.error('Não foi possível excluir o livro.');
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Livros</h1>
                    <p>Gerencie o acervo completo da biblioteca</p>
                </div>

                <Link to="/livros/novo" className="btn btn-primary">
                    + Adicionar Livro
                </Link>
            </div>

            <div className="toolbar">
                <div className="toolbar-search">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por título, autor ou ISBN..."
                        className="w-full bg-transparent border-none outline-none text-[13px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="toolbar-filters">
                    <select 
                        className="filter-select"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value="ALL">Todas as categorias</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <select 
                        className="filter-select"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">Todos os status</option>
                        <option value="AVAILABLE">Disponível</option>
                        <option value="BORROWED">Emprestado</option>
                    </select>
                </div>

                <div className="toolbar-right">
                    <button onClick={refresh} className="btn btn-secondary btn-sm">
                        ⬇ Exportar
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-danger-soft border border-danger/20 text-danger p-4 rounded-[10px] mb-6 text-[13.5px] flex items-center gap-3">
                    <span>⚠️</span> {error}
                </div>
            )}

            <div className="table-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Livro</th>
                            <th>Autores</th>
                            <th>Categoria</th>
                            <th>Ano</th>
                            <th>Status</th>
                            <th>Ações</th>
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
                        ) : filteredBooks.length > 0 ? (
                            filteredBooks.map((book) => (
                                <tr key={book.id}>
                                    <td>
                                        <div className="book-cell">
                                            <div className="book-thumb" style={{ background: 'linear-gradient(135deg, var(--accent), #f3c26a)' }}>📖</div>
                                            <div className="book-cell-info">
                                                <div className="book-cell-title">{book.title}</div>
                                                <div className="book-cell-meta">ISBN: {book.id.substring(0, 8).toUpperCase()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="tag-list">
                                            {book.authors.map(a => (
                                                <span key={a.id} className="tag">{a.name}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>{book.category?.name || 'Geral'}</td>
                                    <td>{book.publicationYear}</td>
                                    <td>
                                        <span className={`badge ${book.status === 'AVAILABLE' ? 'badge-success' : 'badge-warning'}`}>
                                            ● {book.status === 'AVAILABLE' ? 'Disponível' : 'Emprestado'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <Link to={`/livros/${book.id}/editar`} className="btn btn-secondary btn-sm btn-icon" title="Editar">✏️</Link>
                                            <button onClick={() => handleDelete(book.id)} className="btn btn-danger btn-sm btn-icon" title="Excluir">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-text-muted">
                                    Nenhum livro encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
                <div className="pagination">
                    <div className="pagination-info">Mostrando {filteredBooks.length} de {books.length} livros</div>
                    <div className="pagination-pages">
                        <button className="page-btn active">1</button>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                isOpen={Boolean(bookToDelete)}
                title="Excluir livro"
                description="Essa ação remove o livro do acervo e não poderá ser desfeita."
                confirmLabel="Excluir livro"
                cancelLabel="Cancelar"
                isLoading={isDeleting}
                onCancel={() => setBookToDelete(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}

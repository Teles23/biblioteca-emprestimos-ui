import { useBooks } from '../hooks/useBooks';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function LivrosPage() {
    const { books, loading, error, deleteBook, refresh } = useBooks();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.authors.some(author => author.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este livro?')) {
            await deleteBook(id);
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Gestão de Acervo 📚</h1>
                    <p>Visualize, adicione e gerencie os livros disponíveis na biblioteca.</p>
                </div>

                <Link to="/livros/novo" className="btn btn-primary">
                    <span>➕</span> Adicionar Livro
                </Link>
            </div>

            <div className="toolbar">
                <div className="toolbar-search">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por título ou autor..."
                        className="w-full bg-transparent border-none outline-none text-[13px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="toolbar-right">
                    <button onClick={refresh} className="btn btn-secondary btn-sm">
                        🔄 Atualizar
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-danger-soft border border-danger/20 text-danger p-4 rounded-[10px] mb-6 text-[13.5px] flex items-center gap-3">
                    <span>⚠️</span> {error}
                </div>
            )}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Autores</th>
                            <th>Categoria</th>
                            <th>Status</th>
                            <th className="text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="py-8 text-center">
                                        <div className="h-4 bg-surface-3 rounded w-3/4 mx-auto" />
                                    </td>
                                </tr>
                            ))
                        ) : filteredBooks.length > 0 ? (
                            filteredBooks.map((book) => (
                                <tr key={book.id}>
                                    <td>
                                        <div className="font-bold text-text-primary">{book.title}</div>
                                        <div className="text-[11px] text-text-muted mt-0.5">Ano: {book.publicationYear}</div>
                                    </td>
                                    <td>
                                        <div className="text-text-secondary">
                                            {book.authors.map(a => a.name).join(', ')}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="tag">
                                            {book.category?.name || 'Geral'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${book.status === 'AVAILABLE' ? 'badge-success' : 'badge-warning'}`}>
                                            {book.status === 'AVAILABLE' ? 'Disponível' : 'Emprestado'}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <div className="actions-cell justify-end">
                                            <Link to={`/livros/${book.id}/editar`} className="icon-btn" title="Editar">✏️</Link>
                                            <button onClick={() => handleDelete(book.id)} className="icon-btn text-danger" title="Excluir">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-text-muted">
                                    Nenhum livro encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

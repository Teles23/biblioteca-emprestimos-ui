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
        <div className="p-6 max-w-[1200px] mx-auto animate-in fade-in duration-500">
            {/* HEADER DA PÁGINA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[24px] font-extrabold text-white tracking-tight leading-none mb-1.5">
                        Gestão de Acervo 📚
                    </h1>
                    <p className="text-[13px] text-sidebar-text">
                        Visualize, adicione e gerencie os livros disponíveis na biblioteca.
                    </p>
                </div>

                <Link
                    to="/livros/novo"
                    className="bg-accent text-[#0f1117] px-5 py-2.5 rounded-sm font-bold text-[13px] hover:bg-accent-dark transition-all shadow-[0_4px_12px_rgba(232,168,56,0.2)] flex items-center gap-2 w-fit"
                >
                    <span>➕</span> Adicionar Livro
                </Link>
            </div>

            {/* TOOLBAR / FILTROS */}
            <div className="bg-surface border border-border rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por título ou autor..."
                        className="w-full bg-surface-2 border border-border rounded-sm py-2 pl-9 pr-4 text-[13.5px] outline-none focus:border-accent transition-colors"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button
                    onClick={refresh}
                    className="px-4 py-2 border border-border rounded-sm text-[13px] font-medium text-text-primary hover:bg-white/5 transition-colors flex items-center gap-2"
                >
                    🔄 Atualizar
                </button>
            </div>

            {/* MENSAGEM DE ERRO */}
            {error && (
                <div className="bg-danger-soft border border-danger/20 text-danger p-4 rounded-lg mb-6 text-[13.5px] flex items-center gap-3">
                    <span>⚠️</span> {error}
                </div>
            )}

            {/* TABELA DE DADOS */}
            <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface-2 border-b border-border">
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-muted">Título</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-muted">Autores</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-muted">Categoria</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-muted">Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-muted text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8">
                                            <div className="h-4 bg-white/5 rounded w-3/4 mx-auto" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredBooks.length > 0 ? (
                                filteredBooks.map((book) => (
                                    <tr key={book.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-[14px] text-white group-hover:text-accent transition-colors">
                                                {book.title}
                                            </div>
                                            <div className="text-[11px] text-text-muted mt-0.5">Ano: {book.publicationYear}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-[13px] text-text-secondary">
                                                {book.authors.map(a => a.name).join(', ')}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[12px] bg-white/5 px-2 py-1 rounded-sm border border-white/5">
                                                {book.category?.name || 'Geral'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${book.status === 'AVAILABLE'
                                                    ? 'bg-success/10 text-success border border-success/20'
                                                    : 'bg-warning/10 text-warning border border-warning/20'
                                                }`}>
                                                {book.status === 'AVAILABLE' ? 'Disponível' : 'Emprestado'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/livros/${book.id}/editar`}
                                                    className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center hover:bg-accent hover:text-[#0f1117] transition-all"
                                                    title="Editar"
                                                >
                                                    ✏️
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(book.id)}
                                                    className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center hover:bg-danger hover:text-white transition-all underline-none"
                                                    title="Excluir"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-text-muted text-[13.5px]">
                                        Nenhum livro encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* RODAPÉ TABELA / PAGINAÇÃO (ESTÁTICA) */}
                <div className="px-6 py-4 bg-surface-2 flex items-center justify-between border-t border-border">
                    <div className="text-[12px] text-text-muted">
                        Mostrando <b>{filteredBooks.length}</b> registros
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="px-3 py-1 text-[12px] bg-white/5 rounded-sm hover:bg-white/10 transition-colors disabled:opacity-30" disabled>Anterior</button>
                        <button className="px-3 py-1 text-[12px] bg-accent text-[#0f1117] font-bold rounded-sm">1</button>
                        <button className="px-3 py-1 text-[12px] bg-white/5 rounded-sm hover:bg-white/10 transition-colors">Próximo</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

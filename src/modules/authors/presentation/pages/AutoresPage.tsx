import { useAuthors } from '../hooks/useAuthors';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function AutoresPage() {
    const { authors, loading, error, deleteAuthor, refresh } = useAuthors();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAuthors = authors.filter((a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este autor?')) {
            await deleteAuthor(id);
        }
    };

    return (
        <div className="p-6 max-w-[1000px] mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[24px] font-extrabold text-white tracking-tight leading-none mb-1.5">
                        Autores ✍️
                    </h1>
                    <p className="text-[13px] text-sidebar-text">
                        Gerencie os escritores e biógrafos cadastrados no sistema.
                    </p>
                </div>

                <Link
                    to="/autores/novo"
                    className="bg-accent text-[#0f1117] px-5 py-2.5 rounded-sm font-bold text-[13px] hover:bg-accent-dark transition-all flex items-center gap-2 w-fit"
                >
                    <span>➕</span> Novo Autor
                </Link>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4 mb-6 flex gap-4">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        className="w-full bg-surface-2 border border-border rounded-sm py-2 pl-9 pr-4 text-[13.5px] outline-none focus:border-accent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={refresh} className="px-4 py-2 border border-border rounded-sm text-[13px] hover:bg-white/5">🔄</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-text-muted">Carregando autores...</div>
                ) : filteredAuthors.length > 0 ? (
                    filteredAuthors.map((author) => (
                        <div key={author.id} className="bg-surface border border-border rounded-lg p-5 hover:border-accent transition-all group relative">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-white text-[15px] group-hover:text-accent transition-colors">{author.name}</h3>
                                <div className="flex gap-2">
                                    <Link to={`/autores/${author.id}/editar`} className="text-[14px] hover:grayscale-0 grayscale transition-all">✏️</Link>
                                    <button onClick={() => handleDelete(author.id)} className="text-[14px] hover:grayscale-0 grayscale transition-all">🗑️</button>
                                </div>
                            </div>
                            <p className="text-[12px] text-text-secondary line-clamp-3 leading-relaxed">
                                {author.biography || 'Sem biografia cadastrada.'}
                            </p>
                            <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-text-muted">
                                Cadastrado em {new Date(author.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-text-muted bg-surface rounded-lg border border-dashed border-border">
                        Nenhum autor encontrado.
                    </div>
                )}
            </div>
        </div>
    );
}

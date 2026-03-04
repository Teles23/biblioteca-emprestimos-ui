import { useCategories } from '../hooks/useCategories';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function CategoriasPage() {
    const { categories, loading, deleteCategory, refresh } = useCategories();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCategories = categories.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
            await deleteCategory(id);
        }
    };

    return (
        <div className="p-6 max-w-[800px] mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[24px] font-extrabold text-white tracking-tight leading-none mb-1.5">
                        Categorias 🏷️
                    </h1>
                    <p className="text-[13px] text-sidebar-text">
                        Organize seu acervo por gêneros e classificações.
                    </p>
                </div>

                <Link
                    to="/categorias/nova"
                    className="bg-accent text-[#0f1117] px-5 py-2.5 rounded-sm font-bold text-[13px] hover:bg-accent-dark transition-all flex items-center gap-2 w-fit"
                >
                    <span>➕</span> Nova Categoria
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

            <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-surface-2 border-b border-border">
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-muted">Nome da Categoria</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-muted text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan={2} className="px-6 py-10 text-center text-text-muted">Carregando...</td></tr>
                        ) : filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <span className="font-bold text-[14px] text-white group-hover:text-accent transition-colors">{cat.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link to={`/categorias/${cat.id}/editar`} className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center hover:bg-accent hover:text-[#0f1117] transition-all">✏️</Link>
                                            <button onClick={() => handleDelete(cat.id)} className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center hover:bg-danger hover:text-white transition-all">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={2} className="px-6 py-10 text-center text-text-muted">Nenhuma categoria encontrada.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

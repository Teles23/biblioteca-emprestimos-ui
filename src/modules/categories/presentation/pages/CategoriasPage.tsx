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
        <div className="animate-in fade-in duration-500">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Categorias 🏷️</h1>
                    <p>Organize seu acervo por gêneros e classificações.</p>
                </div>

                <Link to="/categorias/nova" className="btn btn-primary">
                    <span>➕</span> Nova Categoria
                </Link>
            </div>

            <div className="toolbar">
                <div className="toolbar-search">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        className="w-full bg-transparent border-none outline-none text-[13px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="toolbar-right">
                    <button onClick={refresh} className="btn btn-secondary btn-sm">🔄 Atualizar</button>
                </div>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Nome da Categoria</th>
                            <th>Status</th>
                            <th className="text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={3} className="py-8 text-center">
                                        <div className="h-4 bg-surface-3 rounded w-3/4 mx-auto" />
                                    </td>
                                </tr>
                            ))
                        ) : filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => (
                                <tr key={cat.id}>
                                    <td>
                                        <div className="font-bold text-text-primary">{cat.name}</div>
                                    </td>
                                    <td>
                                        <span className="badge badge-success">Ativa</span>
                                    </td>
                                    <td className="text-right">
                                        <div className="actions-cell justify-end">
                                            <Link to={`/categorias/${cat.id}/editar`} className="icon-btn" title="Editar">✏️</Link>
                                            <button onClick={() => handleDelete(cat.id)} className="icon-btn text-danger" title="Excluir">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="py-12 text-center text-text-muted">
                                    Nenhuma categoria encontrada.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

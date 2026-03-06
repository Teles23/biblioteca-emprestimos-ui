import { useAuthors } from '../hooks/useAuthors';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ConfirmDialog } from '../../../../shared/ui/ConfirmDialog';
import { useToast } from '../../../../shared/ui/useToast';

export function AutoresPage() {
    const { authors, loading, error, deleteAuthor, refresh } = useAuthors();
    const toast = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [authorToDelete, setAuthorToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const filteredAuthors = authors.filter((a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: string) => {
        setAuthorToDelete(id);
    };

    const handleConfirmDelete = async () => {
        if (!authorToDelete) {
            return;
        }

        try {
            setIsDeleting(true);
            const deleted = await deleteAuthor(authorToDelete);

            if (deleted) {
                toast.success('Autor excluído com sucesso.');
                setAuthorToDelete(null);
            } else {
                toast.error('Não foi possível excluir o autor.');
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Autores ✍️</h1>
                    <p>Gerencie os escritores e biógrafos cadastrados no sistema.</p>
                </div>

                <Link to="/autores/novo" className="btn btn-primary">
                    <span>➕</span> Novo Autor
                </Link>
            </div>

            <div className="toolbar">
                <div className="toolbar-search">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por nome do autor..."
                        className="w-full bg-transparent border-none outline-none text-[13px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="toolbar-right">
                    <button onClick={refresh} className="btn btn-secondary btn-sm">🔄 Atualizar</button>
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
                            <th>Autor</th>
                            <th>Biografia</th>
                            <th>Cadastrado em</th>
                            <th className="text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={4} className="py-8 text-center">
                                        <div className="h-4 bg-surface-3 rounded w-3/4 mx-auto" />
                                    </td>
                                </tr>
                            ))
                        ) : filteredAuthors.length > 0 ? (
                            filteredAuthors.map((author) => (
                                <tr key={author.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="avatar" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))', color: '#0f1117' }}>
                                                {author.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="user-cell-name">{author.name}</div>
                                                <div className="user-cell-email">Escritor</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ maxWidth: '300px' }}>
                                        <p className="text-text-secondary line-clamp-2 text-[12.5px]">
                                            {author.biography || 'Sem biografia cadastrada.'}
                                        </p>
                                    </td>
                                    <td>
                                        <div className="text-text-secondary text-[13px]">
                                            {new Date(author.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        <div className="actions-cell justify-end">
                                            <Link to={`/autores/${author.id}/editar`} className="icon-btn" title="Editar">✏️</Link>
                                            <button onClick={() => handleDelete(author.id)} className="icon-btn text-danger" title="Excluir">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-text-muted font-medium">
                                    Nenhum autor encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmDialog
                isOpen={Boolean(authorToDelete)}
                title="Excluir autor"
                description="Essa ação remove o autor do cadastro e não poderá ser desfeita."
                confirmLabel="Excluir autor"
                cancelLabel="Voltar"
                isLoading={isDeleting}
                onCancel={() => setAuthorToDelete(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}

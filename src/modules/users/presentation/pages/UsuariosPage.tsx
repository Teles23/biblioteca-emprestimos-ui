import { useUsers } from '../hooks/useUsers';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export function UsuariosPage() {
    const { users, loading, error, deleteUser, refresh } = useUsers();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter((u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja remover este usuário?')) {
            await deleteUser(id);
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>Usuários e Leitores 👥</h1>
                    <p>Gerencie as permissões e dados dos usuários do sistema.</p>
                </div>

                <Link to="/usuarios/novo" className="btn btn-primary">
                    <span>➕</span> Novo Usuário
                </Link>
            </div>

            <div className="toolbar">
                <div className="toolbar-search">
                    <span>🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por nome ou e-mail..."
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
                <div className="bg-danger-soft border border-danger/20 text-danger p-4 rounded-[10px] mb-6 text-[13.5px]">
                    <span>⚠️</span> {error}
                </div>
            )}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Usuário</th>
                            <th>Telefone</th>
                            <th>Permissões</th>
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
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id}>
                                    <td>
                                        <div className="user-cell">
                                            <div className="avatar" style={{ background: 'linear-gradient(135deg, var(--info), var(--info-dark))', color: '#fff' }}>
                                                {user.name?.substring(0, 2).toUpperCase() || '??'}
                                            </div>
                                            <div>
                                                <div className="user-cell-name">{user.name || 'Sem Nome'}</div>
                                                <div className="user-cell-email">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="text-[13px] text-text-secondary">{user.phone || '—'}</span>
                                    </td>
                                    <td>
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.map(role => (
                                                <span key={role} className={`badge ${role === 'ROLE_ADMIN' ? 'badge-info' : 'badge-neutral'}`}>
                                                    {role.replace('ROLE_', '')}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="text-right">
                                        <div className="actions-cell justify-end">
                                            <button onClick={() => handleDelete(user.id)} className="icon-btn text-danger" title="Excluir">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="py-12 text-center text-text-muted">
                                    Nenhum usuário encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

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
        <div className="p-6 max-w-[1200px] mx-auto animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-[24px] font-extrabold text-white tracking-tight leading-none mb-1.5">
                        Usuários e Leitores 👥
                    </h1>
                    <p className="text-[13px] text-sidebar-text">
                        Gerencie as permissões e dados dos usuários do sistema.
                    </p>
                </div>

                <Link
                    to="/usuarios/novo"
                    className="bg-accent text-[#0f1117] px-5 py-2.5 rounded-sm font-bold text-[13px] hover:bg-accent-dark transition-all flex items-center gap-2 w-fit"
                >
                    <span>➕</span> Novo Usuário
                </Link>
            </div>

            <div className="bg-surface border border-border rounded-lg p-4 mb-6 flex gap-4">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por nome ou e-mail..."
                        className="w-full bg-surface-2 border border-border rounded-sm py-2 pl-9 pr-4 text-[13.5px] outline-none focus:border-accent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button onClick={refresh} className="px-4 py-2 border border-border rounded-sm text-[13px] hover:bg-white/5">🔄</button>
            </div>

            {error && (
                <div className="bg-danger-soft border border-danger/20 text-danger p-4 rounded-lg mb-6 text-[13.5px]">
                    ⚠️ {error}
                </div>
            )}

            <div className="bg-surface border border-border rounded-lg overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-surface-2 border-b border-border">
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-muted">Usuário</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-muted">Telefone</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-muted">Regras (Roles)</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-text-muted text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan={4} className="px-6 py-10 text-center text-text-muted">Carregando...</td></tr>
                        ) : filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-[12px]">
                                                {user.name?.substring(0, 2).toUpperCase() || '??'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-[14px] text-white underline-none">{user.name || 'Sem Nome'}</div>
                                                <div className="text-[11px] text-text-secondary">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[13px] text-text-secondary">{user.phone || 'N/A'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.map(role => (
                                                <span key={role} className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${role === 'ROLE_ADMIN' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-white/5 border-white/5 text-sidebar-text'
                                                    }`}>
                                                    {role.replace('ROLE_', '')}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="w-8 h-8 rounded-sm bg-white/5 flex items-center justify-center hover:bg-danger hover:text-white transition-all"
                                            title="Excluir"
                                        >
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={4} className="px-6 py-10 text-center text-text-muted">Nenhum usuário encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

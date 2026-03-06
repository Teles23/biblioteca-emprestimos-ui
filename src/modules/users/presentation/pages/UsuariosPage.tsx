import { useUsers } from '../hooks/useUsers';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ConfirmDialog } from '../../../../shared/ui/ConfirmDialog';
import { useToast } from '../../../../shared/ui/useToast';

export function UsuariosPage() {
  const { users, loading, error, deleteUser, refresh } = useUsers();
  const toast = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredUsers = useMemo(() => users.filter((u) => {
    const matchesSearch = u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.roles.includes(roleFilter);
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  }), [users, searchTerm, roleFilter, statusFilter]);

  const handleDelete = (id: string) => {
    setUserToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) {
      return;
    }

    try {
      setIsDeleting(true);
      const deleted = await deleteUser(userToDelete);

      if (deleted) {
        toast.success('Usuário removido com sucesso.');
        setUserToDelete(null);
      } else {
        toast.error('Não foi possível remover o usuário.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Usuários</h1>
          <p>Gerencie os leitores e administradores do sistema</p>
        </div>
        <Link to="/usuarios/leitores/novo" className="btn btn-primary">+ Cadastrar Leitor</Link>
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

        <div className="toolbar-filters">
          <select className="filter-select" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="ALL">Todas as roles</option>
            <option value="ROLE_ADMIN">ROLE_ADMIN</option>
            <option value="ROLE_USER">ROLE_USER</option>
          </select>
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="ALL">Todos os status</option>
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
          </select>
        </div>

        <div className="toolbar-right">
          <button onClick={refresh} className="btn btn-secondary btn-sm">⬇ Exportar</button>
        </div>
      </div>

      {error && <div className="bg-danger-soft border border-danger/20 text-danger p-4 rounded-[10px] mb-6 text-[13px]">{error}</div>}

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Telefone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="py-8 text-center"><div className="h-4 bg-surface-3 rounded w-3/4 mx-auto" /></td>
                </tr>
              ))
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <div className="avatar">{user.name?.substring(0, 2).toUpperCase() || 'US'}</div>
                      <div>
                        <div className="user-cell-name">{user.name}</div>
                        <div className="user-cell-email">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--text-secondary)' }}>{user.phone || '—'}</td>
                  <td>
                    {user.roles.map((role) => (
                      <span key={role} className={`badge ${role === 'ROLE_ADMIN' ? 'badge-warning' : 'badge-info'} mr-1`}>{role}</span>
                    ))}
                  </td>
                  <td>
                    <span className={`badge ${user.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'}`}>
                      ● {user.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button onClick={() => handleDelete(user.id)} className="btn btn-danger btn-sm btn-icon" title="Excluir">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-text-muted">Nenhum usuário encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          <div className="pagination-info">Mostrando {filteredUsers.length} de {users.length} usuários</div>
          <div className="pagination-pages"><span className="page-btn active">1</span></div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={Boolean(userToDelete)}
        title="Remover usuário"
        description="Essa ação remove o usuário do sistema e não poderá ser desfeita."
        confirmLabel="Remover usuário"
        cancelLabel="Cancelar"
        isLoading={isDeleting}
        onCancel={() => setUserToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

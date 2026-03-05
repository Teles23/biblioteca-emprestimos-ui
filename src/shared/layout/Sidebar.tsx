import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

const menuItems = [
  {
    section: 'Menu Principal',
    items: [
      { path: '/', label: 'Dashboard', icon: '⊞' },
      { path: '/livros', label: 'Livros', icon: '📚' },
      { path: '/autores', label: 'Autores', icon: '✍️' },
      { path: '/categorias', label: 'Categorias', icon: '🏷️' },
      { path: '/usuarios', label: 'Usuários', icon: '👥', adminOnly: true },
      { path: '/meus-emprestimos', label: 'Meus Empréstimos', icon: '📖' },
      { path: '/emprestimos', label: 'Empréstimos', icon: '📖', adminOnly: true },
      { path: '/historico', label: 'Histórico', icon: '🕐', adminOnly: true },
    ],
  },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon"><img src="/favicon.svg" alt="LibraManager" className="w-5 h-5" /></div>
        <div className="sidebar-logo-text">
          LibraManager
          <span>Sistema de Biblioteca</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((section, idx) => (
          <div key={idx}>
            <div className="nav-section-label">{section.section}</div>
            {section.items.map((item) => {
              if (item.adminOnly && !user?.roles.includes('ROLE_ADMIN')) {
                return null;
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        ))}

        <div className="nav-section-label" style={{ marginTop: 8 }}>Conta</div>
        <button type="button" onClick={handleLogout} className="nav-item w-full text-left">
          <span className="icon">🚪</span>
          Sair
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="user-card" onClick={() => navigate('/perfil')}>
          <div className="user-avatar" title={user?.name}>
            {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'Admin Sistema'}</div>
            <div className="user-role">{user?.roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER'}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}


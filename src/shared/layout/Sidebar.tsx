import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../contexts/useAuth';
import { getPrimaryRoleLabel } from '../utils/roles';

const menuItems = [
  {
    section: 'Menu Principal',
    items: [
      { path: '/', label: 'Dashboard', icon: '⊞', adminOnly: true },
      { path: '/livros', label: 'Livros', icon: '📚', adminOnly: true },
      { path: '/autores', label: 'Autores', icon: '✍️', adminOnly: true },
      { path: '/categorias', label: 'Categorias', icon: '🏷️', adminOnly: true },
      { path: '/usuarios', label: 'Usuários', icon: '👥', adminOnly: true },
      { path: '/meus-emprestimos', label: 'Meus Empréstimos', icon: '📖' },
      { path: '/meus-emprestimos/novo', label: 'Novo Empréstimo', icon: '➕', readerOnly: true },
      { path: '/emprestimos', label: 'Empréstimos', icon: '📖', adminOnly: true },
      { path: '/historico', label: 'Histórico', icon: '🕐', adminOnly: true },
    ],
  },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.roles.includes('ROLE_ADMIN') ?? false;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className={`sidebar ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} transition-transform fixed inset-y-0 left-0 z-50`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <img src="/favicon.svg" alt="LibraManager" className="w-5 h-5" />
        </div>
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
              if (item.adminOnly && !isAdmin) {
                return null;
              }
              if (item.readerOnly && isAdmin) {
                return null;
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/meus-emprestimos'}
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                  onClick={onClose}
                >
                  <span className="icon">{item.icon}</span>
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        ))}

      </nav>

      <div className="sidebar-footer">
        <div className="user-menu" ref={menuRef}>
          <div className="user-card">
            <div className="user-avatar" title={user?.name}>
              {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="user-info">
              <div className="user-name">
                <span>{user?.name || 'Admin Sistema'}</span>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setMenuOpen((open) => !open);
                  }}
                  className="user-menu-toggle"
                  aria-label="Abrir menu do usuário"
                  title="Abrir menu"
                >
                  ▾
                </button>
              </div>
              <div className="user-role">{getPrimaryRoleLabel(user?.roles)}</div>
            </div>
          </div>

          {menuOpen && (
            <div className="user-menu-dropdown">
              <button type="button" onClick={handleLogout} className="user-menu-item">
                <span className="icon">↪</span>
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

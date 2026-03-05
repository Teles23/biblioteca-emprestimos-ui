import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

const menuItems = [
    { section: 'Principal', items: [
        { path: '/', label: 'Dashboard', icon: '📊' },
    ]},
    { section: 'Catálogo', items: [
        { path: '/livros', label: 'Livros', icon: '📚' },
        { path: '/autores', label: 'Autores', icon: '✍️' },
        { path: '/categorias', label: 'Categorias', icon: '🏷️' },
    ]},
    { section: 'Gestão', items: [
        { path: '/usuarios', label: 'Usuários', icon: '👥', adminOnly: true },
        { path: '/meus-emprestimos', label: 'Meus Empréstimos', icon: '📖' },
        { path: '/emprestimos', label: 'Empréstimos', icon: '🤝', adminOnly: true },
        { path: '/historico', label: 'Histórico', icon: '📜', adminOnly: true },
    ]}
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
                <div className="sidebar-logo-icon">📚</div>
                <div className="sidebar-logo-text">
                    LibraManager
                    <span>Library System</span>
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((section, idx) => (
                    <div key={idx} className="mb-4 last:mb-0">
                        <div className="nav-section-label">{section.section}</div>
                        {section.items.map((item) => {
                            if (item.adminOnly && !user?.roles.includes('ROLE_ADMIN')) {
                                return null;
                            }

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `nav-item ${isActive ? 'active' : ''}`
                                    }
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
                <div className="user-card" onClick={() => navigate('/perfil')}>
                    <div className="user-avatar" title={user?.name}>
                        {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                    </div>
                    <div className="user-info">
                        <div className="user-name">{user?.name || 'Administrador'}</div>
                        <div className="user-role">
                            {user?.roles.includes('ROLE_ADMIN') ? 'Admin Master' : 'Leitor'}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="btn btn-ghost btn-sm w-full mt-2 justify-start px-2.5"
                    style={{ color: 'var(--danger)' }}
                >
                    <span className="mr-2">🚪</span>
                    Sair do sistema
                </button>
            </div>
        </aside>
    );
}

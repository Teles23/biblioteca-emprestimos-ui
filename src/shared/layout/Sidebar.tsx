import { NavLink } from 'react-router-dom';

interface NavItem {
    id: string;
    icon: string;
    label: string;
    href: string;
    badge?: string;
    roles?: string[];
}

const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/livros', label: 'Livros', icon: '📚' },
    { path: '/autores', label: 'Autores', icon: '✍️' },
    { path: '/categorias', label: 'Categorias', icon: '🏷️' },
    { path: '/usuarios', label: 'Usuários', icon: '👥', adminOnly: true },
    { path: '/emprestimos', label: 'Empréstimos', icon: '🤝' },
    { path: '/historico', label: 'Histórico', icon: '📜' },
];

export function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="fixed top-0 left-0 bottom-0 w-sidebar bg-sidebar-bg flex flex-col z-[100] border-r border-white/5">
            <div className="h-header flex items-center gap-2.5 px-5 border-b border-white/5 shrink-0">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-base shrink-0">
                    📚
                </div>
                <div className="text-[13px] font-semibold text-white tracking-tight leading-tight">
                    LibraManager
                    <span className="block text-[10px] font-normal text-sidebar-text tracking-widest uppercase">
                        Sistema de Biblioteca
                    </span>
                </div>
            </div>

            <nav className="flex-1 p-3 px-2.5 overflow-y-auto">
                <div className="text-[10px] font-semibold tracking-widest uppercase text-sidebar-text opacity-50 px-2.5 py-3 pt-3 pb-1.5">
                    Menu Principal
                </div>

                {navItems.map((item) => (
                    <NavLink
                        key={item.id}
                        to={item.href}
                        className={({ isActive }) =>
                            `flex items-center gap-2.5 p-2 px-2.5 rounded-sm text-sidebar-text no-underline text-[13.5px] font-medium transition-all mb-0.5 hover:bg-white/5 hover:text-sidebar-active ${isActive ? 'bg-accent/15 !text-accent font-semibold' : ''
                            }`
                        }
                    >
                        <span className="w-[18px] text-[15px] text-center shrink-0 opacity-90">{item.icon}</span>
                        {item.label}
                        {item.badge && (
                            <span className="ml-auto bg-danger text-white text-[10px] font-bold rounded-full px-1.5 min-w-[18px] text-center">

                                return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all text-[13.5px] font-medium ${isActive
                                                ? 'bg-accent text-[#0f1117] shadow-[0_2px_8px_rgba(232,168,56,0.2)]'
                                                : 'text-sidebar-text hover:bg-white/5 hover:text-white'
                                            }`
                                        }
                                    >
                                        <span className="text-[16px]">{item.icon}</span>
                                        {item.label}
                                    </NavLink>
                                </li>
                                );
                    })}
                            </ul>
            </nav>

            {/* USER & LOGOUT */ }
                    < div className = "p-4 border-t border-white/5 bg-black/20" >
                <div className="flex items-center gap-3 mb-4 px-1">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-[12px] font-bold text-[#0f1117]">
                        {user?.name?.substring(0, 2).toUpperCase() || 'AD'}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-bold text-white truncate leading-none mb-1">
                            {user?.name || 'Administrador'}
                        </span>
                        <span className="text-[10px] text-sidebar-text truncate">
                            {user?.roles.includes('ROLE_ADMIN') ? 'Admin Master' : 'Leitor'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-[12.5px] font-medium text-danger hover:bg-danger/10 rounded-sm transition-all group"
                >
                    <span className="text-[15px] group-hover:scale-110 transition-transform">🚪</span>
                    Sair do sistema
                </button>
            </div>
        </aside>
    );
}

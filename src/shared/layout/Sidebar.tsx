import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/livros', label: 'Livros', icon: '📚' },
    { path: '/autores', label: 'Autores', icon: '✍️' },
    { path: '/categorias', label: 'Categorias', icon: '🏷️' },
    { path: '/usuarios', label: 'Usuários', icon: '👥', adminOnly: true },
    { path: '/meus-emprestimos', label: 'Meus Empréstimos', icon: '📖' },
    { path: '/emprestimos', label: 'Empréstimos', icon: '🤝', adminOnly: true },
    { path: '/historico', label: 'Histórico', icon: '📜', adminOnly: true },
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
                <div className="w-8 h-8 bg-accent rounded-sm flex items-center justify-center text-lg">
                    📚
                </div>
                <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-white leading-tight">LibraManager</span>
                    <span className="text-[9px] font-medium text-sidebar-text uppercase tracking-widest opacity-70">Library System</span>
                </div>
            </div>

            {/* MENU PRINCIPAL */}
            <nav className="flex-1 px-3 py-6 overflow-y-auto main-scrollbar">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        // Se o item for apenas para admin e o usuário não for, esconde
                        if (item.adminOnly && !user?.roles.includes('ROLE_ADMIN')) {
                            return null;
                        }

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

            {/* USER & LOGOUT */}
            <div className="p-4 border-t border-white/5 bg-black/20">
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

import { NavLink } from 'react-router-dom';

interface NavItem {
    id: string;
    icon: string;
    label: string;
    href: string;
    badge?: string;
    roles?: string[];
}

const navItems: NavItem[] = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard', href: '/' },
    { id: 'livros', icon: '📚', label: 'Livros', href: '/livros' },
    { id: 'autores', icon: '✍️', label: 'Autores', href: '/autores' },
    { id: 'categorias', icon: '🏷️', label: 'Categorias', href: '/categorias' },
    { id: 'usuarios', icon: '👥', label: 'Usuários', href: '/usuarios' },
    { id: 'emprestimos', icon: '📖', label: 'Empréstimos', href: '/emprestimos', badge: '3' },
    { id: 'historico', icon: '🕐', label: 'Histórico', href: '/historico' },
];

export function Sidebar() {
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
                                {item.badge}
                            </span>
                        )}
                    </NavLink>
                ))}

                <div className="text-[10px] font-semibold tracking-widest uppercase text-sidebar-text opacity-50 px-2.5 py-3 pt-3 pb-1.5 mt-2">
                    Conta
                </div>

                <NavLink
                    to="/login"
                    className="flex items-center gap-2.5 p-2 px-2.5 rounded-sm text-sidebar-text no-underline text-[13.5px] font-medium transition-all mb-0.5 hover:bg-white/5 hover:text-sidebar-active"
                >
                    <span className="w-[18px] text-[15px] text-center shrink-0 opacity-90">🚪</span>
                    Sair
                </NavLink>
            </nav>

            <div className="p-3 px-2.5 border-t border-white/5">
                <div className="flex items-center gap-2.5 p-2.5 rounded-sm cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-[12px] font-bold text-sidebar-bg shrink-0">
                        AD
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[12.5px] font-semibold text-white whitespace-nowrap overflow-hidden text-ellipsis">
                            Admin Sistema
                        </div>
                        <div className="text-[10px] text-sidebar-text">ROLE_ADMIN</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

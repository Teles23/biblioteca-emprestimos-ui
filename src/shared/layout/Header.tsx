import { Link } from 'react-router-dom';

interface HeaderProps {
    title?: string;
    breadcrumb?: string;
}

export function Header({ title, breadcrumb }: HeaderProps) {
    return (
        <header className="header">
            <div className="header-breadcrumb">
                <span>📚 LibraManager</span>
                <span className="mx-2">/</span>
                <strong className="text-text-primary font-bold">
                    {breadcrumb || title || 'Dashboard'}
                </strong>
            </div>

            <div className="header-actions">
                <div className="header-search">
                    <span>🔍</span>
                    <span>Buscar livros, autores...</span>
                </div>

                <Link to="/notificacoes" className="icon-btn notif-dot" title="Notificações">
                    🔔
                </Link>

                <Link to="/configuracoes" className="icon-btn" title="Configurações">
                    ⚙️
                </Link>
            </div>
        </header>
    );
}

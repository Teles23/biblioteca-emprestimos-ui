import { matchPath, useLocation } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  breadcrumb?: string;
}

const routeLabels: Array<{ pattern: string; label: string }> = [
  { pattern: '/', label: 'Dashboard' },
  { pattern: '/livros', label: 'Livros' },
  { pattern: '/livros/novo', label: 'Livros › Cadastrar' },
  { pattern: '/livros/:id/editar', label: 'Livros › Editar' },
  { pattern: '/autores', label: 'Autores' },
  { pattern: '/autores/novo', label: 'Autores › Cadastrar' },
  { pattern: '/autores/:id/editar', label: 'Autores › Editar' },
  { pattern: '/categorias', label: 'Categorias' },
  { pattern: '/categorias/nova', label: 'Categorias › Cadastrar' },
  { pattern: '/categorias/:id/editar', label: 'Categorias › Editar' },
  { pattern: '/usuarios', label: 'Usuários' },
  { pattern: '/usuarios/novo', label: 'Usuários › Cadastrar' },
  { pattern: '/usuarios/leitores/novo', label: 'Usuários › Cadastrar Leitor' },
  { pattern: '/emprestimos', label: 'Empréstimos' },
  { pattern: '/emprestimos/novo', label: 'Empréstimos › Cadastrar' },
  { pattern: '/historico', label: 'Histórico' },
  { pattern: '/meus-emprestimos', label: 'Meus Empréstimos' },
];

function resolveCurrentLabel(pathname: string): string {
  for (const route of routeLabels) {
    if (matchPath({ path: route.pattern, end: true }, pathname)) {
      return route.label;
    }
  }

  return 'Dashboard';
}

export function Header({ title, breadcrumb }: HeaderProps) {
  const location = useLocation();
  const current = breadcrumb || title || resolveCurrentLabel(location.pathname);

  return (
    <header className="header">
      <div className="header-breadcrumb">
        <span>📚 LibraManager</span>
        <span>›</span>
        <strong style={{ color: 'var(--text-primary)' }}>{current}</strong>
      </div>
      <div className="header-actions">
        <div className="header-search">
          <span>🔍</span>
          <span>Buscar...</span>
        </div>
        <a href="#" className="icon-btn notif-dot" title="Notificações">🔔</a>
      </div>
    </header>
  );
}

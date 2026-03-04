// ── SHARED LAYOUT COMPONENTS ──

function getSidebarHTML(activePage) {
  const navItems = [
    { id: 'dashboard', icon: '⊞', label: 'Dashboard', href: 'dashboard.html' },
    { id: 'livros', icon: '📚', label: 'Livros', href: 'livros.html' },
    { id: 'autores', icon: '✍️', label: 'Autores', href: 'autores.html' },
    { id: 'categorias', icon: '🏷️', label: 'Categorias', href: 'categorias.html' },
    { id: 'usuarios', icon: '👥', label: 'Usuários', href: 'usuarios.html' },
    { id: 'emprestimos', icon: '📖', label: 'Empréstimos', href: 'emprestimos.html', badge: '3' },
    { id: 'historico', icon: '🕐', label: 'Histórico', href: 'historico.html' },
  ];

  const items = navItems.map(item => `
    <a href="${item.href}" class="nav-item ${activePage === item.id ? 'active' : ''}">
      <span class="icon">${item.icon}</span>
      ${item.label}
      ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
    </a>
  `).join('');

  return `
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="sidebar-logo-icon">📚</div>
        <div class="sidebar-logo-text">
          LibraManager
          <span>Sistema de Biblioteca</span>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-section-label">Menu Principal</div>
        ${items}
        <div class="nav-section-label" style="margin-top:8px">Conta</div>
        <a href="login.html" class="nav-item">
          <span class="icon">🚪</span>
          Sair
        </a>
      </nav>
      <div class="sidebar-footer">
        <div class="user-card">
          <div class="user-avatar">AD</div>
          <div class="user-info">
            <div class="user-name">Admin Sistema</div>
            <div class="user-role">ROLE_ADMIN</div>
          </div>
        </div>
      </div>
    </aside>
  `;
}

function getHeaderHTML(title, breadcrumb) {
  return `
    <header class="header">
      <div class="header-breadcrumb">
        <span>📚 LibraManager</span>
        <span>›</span>
        <strong style="color:var(--text-primary)">${breadcrumb || title}</strong>
      </div>
      <div class="header-actions">
        <div class="header-search">
          <span>🔍</span>
          <span>Buscar...</span>
        </div>
        <a href="#" class="icon-btn notif-dot" title="Notificações">🔔</a>
      </div>
    </header>
  `;
}

function initLayout(activePage, title, breadcrumb) {
  document.getElementById('sidebar-placeholder').innerHTML = getSidebarHTML(activePage);
  document.getElementById('header-placeholder').innerHTML = getHeaderHTML(title, breadcrumb);
}

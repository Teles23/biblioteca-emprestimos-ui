import { matchPath, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  title?: string;
  breadcrumb?: string;
  onToggleSidebar?: () => void;
}

const routeLabels: Array<{ pattern: string; label: string }> = [
  { pattern: "/", label: "Dashboard" },
  { pattern: "/livros", label: "Livros" },
  { pattern: "/livros/novo", label: "Livros › Cadastrar" },
  { pattern: "/livros/:id/editar", label: "Livros › Editar" },
  { pattern: "/autores", label: "Autores" },
  { pattern: "/autores/novo", label: "Autores › Cadastrar" },
  { pattern: "/autores/:id/editar", label: "Autores › Editar" },
  { pattern: "/categorias", label: "Categorias" },
  { pattern: "/categorias/nova", label: "Categorias › Cadastrar" },
  { pattern: "/categorias/:id/editar", label: "Categorias › Editar" },
  { pattern: "/usuarios", label: "Usuários" },
  { pattern: "/usuarios/novo", label: "Usuários › Cadastrar" },
  { pattern: "/usuarios/leitores/novo", label: "Usuários › Cadastrar Leitor" },
  { pattern: "/emprestimos", label: "Empréstimos" },
  { pattern: "/emprestimos/novo", label: "Empréstimos › Cadastrar" },
  { pattern: "/historico", label: "Histórico" },
  { pattern: "/meus-emprestimos", label: "Meus Empréstimos" },
  { pattern: "/meus-emprestimos/novo", label: "Meus Empréstimos › Novo" },
];

function resolveCurrentLabel(pathname: string): string {
  for (const route of routeLabels) {
    if (matchPath({ path: route.pattern, end: true }, pathname)) {
      return route.label;
    }
  }

  return "Dashboard";
}

interface SearchResult {
  type: "book" | "author" | "user";
  id: string;
  title: string;
  subtitle: string;
  path: string;
}

export function Header({ title, breadcrumb, onToggleSidebar }: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const current = breadcrumb || title || resolveCurrentLabel(location.pathname);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Mock data for search - in real app would call API
  const mockSearch = (query: string): SearchResult[] => {
    if (!query || query.length < 2) return [];

    const lowerQuery = query.toLowerCase();
    const results: SearchResult[] = [];

    // These would come from API in real implementation
    // For now, return sample results
    if (
      "livro".startsWith(lowerQuery) ||
      "1984".toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        type: "book",
        id: "1",
        title: "1984",
        subtitle: "George Orwell",
        path: "/livros",
      });
    }
    if ("orwell".toLowerCase().includes(lowerQuery)) {
      results.push({
        type: "author",
        id: "1",
        title: "George Orwell",
        subtitle: "Autor",
        path: "/autores",
      });
    }

    return results.slice(0, 5);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const results = mockSearch(searchQuery);
    setSearchResults(results);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate(searchResults[0].path);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case "book":
        return "📚";
      case "author":
        return "✍️";
      case "user":
        return "👤";
      default:
        return "📄";
    }
  };

  return (
    <header className="header flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md"
          onClick={onToggleSidebar}
          aria-label="Abrir menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <div className="header-breadcrumb hidden sm:block">
          <span>📚 LibraManager</span>
          <span className="mx-2">›</span>
          <strong style={{ color: "var(--text-primary)" }}>{current}</strong>
        </div>
      </div>
      <div className="header-actions">
        {/* Search */}
        <div className="relative" ref={searchRef}>
          <div
            className="header-search cursor-text"
            onClick={() => setSearchOpen(true)}
          >
            <span>🔍</span>
            <span className="text-text-muted">Buscar...</span>
          </div>

          {searchOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-border overflow-hidden z-50">
              <form onSubmit={handleSearch}>
                <div className="p-3 border-b border-border">
                  <input
                    type="text"
                    placeholder="Buscar livros, autores, usuários..."
                    className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:border-accent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
              </form>

              {searchResults.length > 0 && (
                <div className="max-h-64 overflow-y-auto">
                  {searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      type="button"
                      className="w-full px-4 py-3 text-left hover:bg-surface-2 flex items-center gap-3 transition-colors"
                      onClick={() => {
                        navigate(result.path);
                        setSearchOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <span className="text-lg">
                        {getIconForType(result.type)}
                      </span>
                      <div>
                        <div className="text-sm font-medium text-text-primary">
                          {result.title}
                        </div>
                        <div className="text-xs text-text-muted">
                          {result.subtitle}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery.length >= 2 && searchResults.length === 0 && (
                <div className="p-4 text-center text-text-muted text-sm">
                  Nenhum resultado encontrado
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            className="icon-btn notif-dot"
            onClick={() => setNotifOpen(!notifOpen)}
            aria-label="Notificações"
          >
            🔔
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-border overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-border">
                <h3 className="font-semibold text-sm">Notificações</h3>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <div className="p-4 text-center text-text-muted text-sm">
                  Nenhuma notificação no momento
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

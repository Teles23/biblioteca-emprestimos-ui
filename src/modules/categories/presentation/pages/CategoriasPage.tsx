import { Link } from 'react-router-dom';
import { useMemo, useState, useEffect } from 'react';

import { useCategories } from '../hooks/useCategories';
import { CategoryRepositoryImpl } from '../../infrastructure/CategoryRepositoryImpl';
import { BookRepositoryImpl } from '../../../books/infrastructure/BookRepositoryImpl';
import { getErrorMessage } from '../../../../shared/utils/error';

export function CategoriasPage() {
  const { categories, loading, error, deleteCategory, refresh } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [bookCountByCategory, setBookCountByCategory] = useState<Record<string, number>>({});

  const categoryRepo = useMemo(() => new CategoryRepositoryImpl(), []);
  const bookRepo = useMemo(() => new BookRepositoryImpl(), []);

  useEffect(() => {
    const loadBookCounters = async () => {
      try {
        const books = await bookRepo.list();
        const counts: Record<string, number> = {};
        books.forEach((book) => {
          counts[book.categoryId] = (counts[book.categoryId] || 0) + 1;
        });
        setBookCountByCategory(counts);
      } catch {
        setBookCountByCategory({});
      }
    };

    loadBookCounters();
  }, [bookRepo, categories.length]);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if ((bookCountByCategory[id] || 0) > 0) {
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      await deleteCategory(id);
    }
  };

  const handleQuickCreate = async () => {
    if (!newCategoryName.trim()) {
      setCreateError('Nome da categoria é obrigatório.');
      return;
    }

    try {
      setCreating(true);
      setCreateError(null);
      await categoryRepo.create({ name: newCategoryName.trim() });
      setNewCategoryName('');
      await refresh();
    } catch (err: unknown) {
      setCreateError(getErrorMessage(err, 'Erro ao criar categoria.'));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Categorias</h1>
          <p>Organize o acervo por categorias</p>
        </div>
        <Link to="/categorias/nova" className="btn btn-primary">+ Nova Categoria</Link>
      </div>

      <div className="toolbar" style={{ marginBottom: 16 }}>
        <div className="toolbar-search">
          <span>🔍</span>
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Livros</th>
                <th>Cadastrada em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={4} className="py-8 text-center">
                      <div className="h-4 bg-surface-3 rounded w-3/4 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((cat) => {
                  const booksCount = bookCountByCategory[cat.id] || 0;
                  const hasBooks = booksCount > 0;

                  return (
                    <tr key={cat.id}>
                      <td><strong>{cat.name}</strong></td>
                      <td>
                        <span className={`badge ${hasBooks ? 'badge-info' : 'badge-neutral'}`}>
                          {booksCount} {booksCount === 1 ? 'livro' : 'livros'}
                        </span>
                      </td>
                      <td>{new Date(cat.createdAt).toLocaleDateString('pt-BR')}</td>
                      <td>
                        <div className="actions-cell">
                          <Link to={`/categorias/${cat.id}/editar`} className="btn btn-secondary btn-sm btn-icon">✏️</Link>
                          <button
                            className="btn btn-danger btn-sm btn-icon"
                            onClick={() => handleDelete(cat.id)}
                            disabled={hasBooks}
                            style={hasBooks ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
                            title={hasBooks ? 'Possui livros' : 'Excluir'}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-text-muted">Nenhuma categoria encontrada.</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="pagination">
            <div className="pagination-info">{filteredCategories.length} categorias cadastradas</div>
          </div>
        </div>

        <div className="card" style={{ position: 'sticky', top: 88 }}>
          <div className="card-header">
            <div className="card-title">Adicionar Categoria</div>
          </div>
          <div className="card-body">
            <div className="form-grid" style={{ gap: 16 }}>
              <div className="form-group">
                <label>Nome da Categoria <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="Ex: Biografia"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <div className="form-hint">Nome deve ser único no sistema</div>
              </div>
              <div className="form-actions" style={{ marginTop: 4 }}>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  type="button"
                  onClick={handleQuickCreate}
                  disabled={creating}
                >
                  {creating ? 'Criando...' : '+ Criar'}
                </button>
                <Link to="/categorias/nova" className="btn btn-secondary">Abrir form completo</Link>
              </div>
            </div>

            {(error || createError) && (
              <div className="alert alert-warning" style={{ marginTop: 16 }}>
                ⚠️ {createError || error}
              </div>
            )}

            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <div className="alert alert-warning">
                ⚠️ Não é possível excluir categorias com livros associados. Reclassifique os livros antes.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

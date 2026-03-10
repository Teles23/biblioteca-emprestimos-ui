import { useEffect, useState, useCallback, useMemo } from 'react';
import { LoanRepositoryImpl } from '../../infrastructure/LoanRepositoryImpl';
import { BookRepositoryImpl } from '../../../books/infrastructure/BookRepositoryImpl';
import { UserRepositoryImpl } from '../../../users/infrastructure/UserRepositoryImpl';
import type { Loan, Book, User } from '../../../../shared/types';
import { formatDateBR } from '../../../../shared/utils/date';

export function HistoricoPage() {
  const [history, setHistory] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [filters, setFilters] = useState({
    userId: '',
    bookId: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  const repository = useMemo(() => new LoanRepositoryImpl(), []);
  const bookRepo = useMemo(() => new BookRepositoryImpl(), []);
  const userRepo = useMemo(() => new UserRepositoryImpl(), []);

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const data = await repository.history({
        userId: filters.userId || undefined,
        bookId: filters.bookId || undefined,
        status: filters.status || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      });
      setHistory(data);
    } catch (err: unknown) {
      console.error('Erro ao carregar histórico:', err);
      setError('Erro ao carregar histórico.');
    } finally {
      setLoading(false);
    }
  }, [repository, filters]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [booksData, usersData] = await Promise.all([
          bookRepo.list(),
          userRepo.list()
        ]);
        setBooks(booksData);
        setUsers(usersData);
      } catch (err) {
        console.error('Erro ao carregar dados de filtros:', err);
      }
    };
    loadData();
  }, [bookRepo, userRepo]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleClearFilters = () => {
    setFilters({
      userId: '',
      bookId: '',
      status: '',
      startDate: '',
      endDate: '',
    });
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Histórico de Operações 📜</h1>
          <p>Registro completo de todos os empréstimos e devoluções</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchHistory}>
          🔄 Atualizar
        </button>
      </div>

      {/* FILTERS */}
      <div className="card mb-4">
        <div className="card-body p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 items-end">
            <div className="form-group mb-0">
              <label className="text-[11px] font-bold uppercase text-text-muted mb-1 block">Usuário</label>
              <select 
                className="w-full text-[13px] p-2 rounded-md border border-border bg-surface"
                value={filters.userId}
                onChange={e => setFilters({...filters, userId: e.target.value})}
              >
                <option value="">Todos</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div className="form-group mb-0">
              <label className="text-[11px] font-bold uppercase text-text-muted mb-1 block">Livro</label>
              <select 
                className="w-full text-[13px] p-2 rounded-md border border-border bg-surface"
                value={filters.bookId}
                onChange={e => setFilters({...filters, bookId: e.target.value})}
              >
                <option value="">Todos</option>
                {books.map(b => <option key={b.id} value={b.id}>{b.title}</option>)}
              </select>
            </div>
            <div className="form-group mb-0">
              <label className="text-[11px] font-bold uppercase text-text-muted mb-1 block">Status</label>
              <select 
                className="w-full text-[13px] p-2 rounded-md border border-border bg-surface"
                value={filters.status}
                onChange={e => setFilters({...filters, status: e.target.value})}
              >
                <option value="">Todos</option>
                <option value="RETURNED">Devolvido</option>
                <option value="OVERDUE">Atrasado</option>
                <option value="ACTIVE">Ativo</option>
              </select>
            </div>
            <div className="form-group mb-0">
              <label className="text-[11px] font-bold uppercase text-text-muted mb-1 block">De</label>
              <input 
                type="date" 
                className="w-full text-[13px] p-2 rounded-md border border-border bg-surface"
                value={filters.startDate}
                onChange={e => setFilters({...filters, startDate: e.target.value})}
              />
            </div>
            <div className="form-group mb-0">
              <label className="text-[11px] font-bold uppercase text-text-muted mb-1 block">Até</label>
              <input 
                type="date" 
                className="w-full text-[13px] p-2 rounded-md border border-border bg-surface"
                value={filters.endDate}
                onChange={e => setFilters({...filters, endDate: e.target.value})}
              />
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary btn-sm flex-1" onClick={fetchHistory}>🔍</button>
              <button className="btn btn-secondary btn-sm flex-1" onClick={handleClearFilters}>Limpar</button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-danger-soft border border-danger/20 text-danger p-4 rounded-[10px] mb-6 text-[13.5px]">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Livro</th>
              <th>Usuário</th>
              <th>Empréstimo</th>
              <th>Previsto</th>
              <th>Real</th>
              <th>Atraso</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={8} className="py-8 text-center">
                    <div className="h-4 bg-surface-3 rounded w-3/4 mx-auto" />
                  </td>
                </tr>
              ))
            ) : history.length > 0 ? (
              history.map((loan, index) => (
                <tr key={loan.id}>
                  <td className="font-mono text-[12px] text-text-muted">
                    #{String(history.length - index).padStart(3, '0')}
                  </td>
                  <td>
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-9 rounded-[3px] bg-surface-3 flex items-center justify-center shrink-0 text-[11px] shadow-sm">
                        📖
                      </div>
                      <div>
                        <div className="font-bold text-[13px] text-text-primary line-clamp-1">{loan.book?.title}</div>
                        <div className="text-[10px] text-text-muted line-clamp-1">
                          {loan.book?.authors?.map((a: any) => a.author?.name).filter(Boolean).join(', ') || 'Desconhecido'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="user-cell">
                      <div
                        className="avatar"
                        style={{ width: '22px', height: '22px', fontSize: '8px', background: 'var(--surface-3)' }}
                      >
                        {loan.user?.name?.substring(0, 2).toUpperCase() || '??'}
                      </div>
                      <span className="text-[12.5px]">{loan.user?.name}</span>
                    </div>
                  </td>
                  <td className="text-[12.5px]">{formatDateBR(loan.loanDate)}</td>
                  <td className="text-[12.5px]">{formatDateBR(loan.dueDate)}</td>
                  <td className="text-[12.5px]">{loan.returnDate ? formatDateBR(loan.returnDate) : '-'}</td>
                  <td>
                    {loan.lateDays > 0 ? (
                      <span className="text-[11px] font-bold text-danger bg-danger/10 px-1.5 py-0.5 rounded">+{loan.lateDays} dias</span>
                    ) : (
                      <span className="text-[11px] font-medium text-success">✓ No prazo</span>
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        loan.status === 'RETURNED'
                          ? 'badge-success'
                          : loan.status === 'OVERDUE'
                            ? 'badge-danger'
                            : 'badge-warning'
                      }`}
                    >
                      {loan.status === 'RETURNED'
                        ? 'Devolvido'
                        : loan.status === 'OVERDUE'
                          ? 'Atrasado'
                          : 'Ativo'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center text-text-muted">
                  Nenhum registro encontrado no histórico.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

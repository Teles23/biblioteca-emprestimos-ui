import { useState, useCallback, useEffect, useMemo } from 'react';
import { getErrorMessage } from '../../../../shared/utils/error';
import type { Book } from '../../../../shared/types';
import { BookRepositoryImpl } from '../../infrastructure/BookRepositoryImpl';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new BookRepositoryImpl(), []);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await repository.list();
      setBooks(data);
    } catch {
      setError(getErrorMessage(null, 'Erro ao carregar livros.'));
    } finally {
      setLoading(false);
    }
  }, [repository]);

  const deleteBook = useCallback(
    async (id: string) => {
      try {
        await repository.delete(id);
        setBooks((prev) => prev.filter((book) => book.id !== id));
        return true;
      } catch (err: unknown) {
        const apiMessage = getErrorMessage(err, '');
        const blockedByRestriction = /emprest|vincul|bloquead|restri/i.test(apiMessage);
        const fallback = blockedByRestriction
          ? 'Não foi possível excluir: este livro possui empréstimo ativo ou histórico vinculado.'
          : 'Erro ao excluir livro.';

        setError(getErrorMessage(err, fallback));
        return false;
      }
    },
    [repository],
  );

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    books,
    loading,
    error,
    refresh: fetchBooks,
    deleteBook,
  };
}

import { useState, useCallback, useEffect } from 'react';
import type { Book } from '../../../../shared/types';
import { BookRepositoryImpl } from '../../infrastructure/BookRepositoryImpl';

export function useBooks() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const repository = new BookRepositoryImpl();

    const fetchBooks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await repository.list();
            setBooks(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar livros. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteBook = useCallback(async (id: string) => {
        try {
            await repository.delete(id);
            setBooks((prev) => prev.filter((book) => book.id !== id));
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao excluir livro.');
            return false;
        }
    }, []);

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

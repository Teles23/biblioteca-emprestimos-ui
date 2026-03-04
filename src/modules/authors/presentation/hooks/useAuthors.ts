import { useState, useCallback, useEffect } from 'react';
import type { Author } from '../../../../shared/types';
import { AuthorRepositoryImpl } from '../../infrastructure/AuthorRepositoryImpl';

export function useAuthors() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const repository = new AuthorRepositoryImpl();

    const fetchAuthors = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await repository.list();
            setAuthors(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar autores.');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteAuthor = useCallback(async (id: string) => {
        try {
            await repository.delete(id);
            setAuthors((prev) => prev.filter((a) => a.id !== id));
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao excluir autor.');
            return false;
        }
    }, []);

    useEffect(() => {
        fetchAuthors();
    }, [fetchAuthors]);

    return {
        authors,
        loading,
        error,
        refresh: fetchAuthors,
        deleteAuthor,
    };
}

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getErrorMessage } from '../../../../shared/utils/error';
import type { Author } from '../../../../shared/types';
import { AuthorRepositoryImpl } from '../../infrastructure/AuthorRepositoryImpl';

export function useAuthors() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const repository = useMemo(() => new AuthorRepositoryImpl(), []);

    const fetchAuthors = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await repository.list();
            setAuthors(data);
        } catch {
            setError(getErrorMessage(null, 'Erro ao carregar autores.'));
        } finally {
            setLoading(false);
        }
    }, [repository]);

    const deleteAuthor = useCallback(async (id: string) => {
        try {
            await repository.delete(id);
            setAuthors((prev) => prev.filter((a) => a.id !== id));
            return true;
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Erro ao excluir autor.'));
            return false;
        }
    }, [repository]);

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

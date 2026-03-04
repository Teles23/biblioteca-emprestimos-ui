import { useState, useEffect, useCallback, useMemo } from 'react';
import { getErrorMessage } from '../../../../shared/utils/error';
import type { Category } from '../../../../shared/types';
import { CategoryRepositoryImpl } from '../../infrastructure/CategoryRepositoryImpl';

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const repository = useMemo(() => new CategoryRepositoryImpl(), []);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await repository.list();
            setCategories(data);
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Erro.'));
        } finally {
            setLoading(false);
        }
    }, [repository]);

    const deleteCategory = useCallback(async (id: string) => {
        try {
            await repository.delete(id);
            setCategories((prev) => prev.filter((c) => c.id !== id));
            return true;
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Erro ao excluir categoria.'));
            return false;
        }
    }, [repository]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        categories,
        loading,
        error,
        refresh: fetchCategories,
        deleteCategory,
    };
}

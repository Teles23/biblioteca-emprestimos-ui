import { useState, useCallback, useEffect } from 'react';
import type { Category } from '../../../../shared/types';
import { CategoryRepositoryImpl } from '../../infrastructure/CategoryRepositoryImpl';

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const repository = new CategoryRepositoryImpl();

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await repository.list();
            setCategories(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar categorias.');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCategory = useCallback(async (id: string) => {
        try {
            await repository.delete(id);
            setCategories((prev) => prev.filter((c) => c.id !== id));
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao excluir categoria.');
            return false;
        }
    }, []);

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

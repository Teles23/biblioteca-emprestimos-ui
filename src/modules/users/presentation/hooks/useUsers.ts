import { useState, useCallback, useEffect } from 'react';
import type { User } from '../../../../shared/types';
import { UserRepositoryImpl } from '../../infrastructure/UserRepositoryImpl';

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const repository = new UserRepositoryImpl();

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await repository.list();
            setUsers(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar usuários.');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteUser = useCallback(async (id: string) => {
        try {
            await repository.delete(id);
            setUsers((prev) => prev.filter((u) => u.id !== id));
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao excluir usuário.');
            return false;
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        loading,
        error,
        refresh: fetchUsers,
        deleteUser,
    };
}

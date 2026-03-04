import { useState, useCallback, useEffect, useMemo } from 'react';
import { getErrorMessage } from '../../../../shared/utils/error';
import type { User } from '../../../../shared/types';
import { UserRepositoryImpl } from '../../infrastructure/UserRepositoryImpl';

export function useUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const repository = useMemo(() => new UserRepositoryImpl(), []);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await repository.list();
            setUsers(data);
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Erro ao carregar usuários.'));
        } finally {
            setLoading(false);
        }
    }, [repository]);

    const deleteUser = useCallback(async (id: string) => {
        try {
            await repository.delete(id);
            setUsers((prev) => prev.filter((u) => u.id !== id));
            return true;
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Erro.'));
            return false;
        } finally {
            setLoading(false);
        }
        return true;
    }, [repository]);

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

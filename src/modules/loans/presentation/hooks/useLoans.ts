import { useState, useCallback, useMemo } from 'react';
import { getErrorMessage } from '../../../../shared/utils/error';
import type { Loan } from '../../../../shared/types';
import { LoanRepositoryImpl } from '../../infrastructure/LoanRepositoryImpl';

export function useLoans() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const repository = useMemo(() => new LoanRepositoryImpl(), []);

    const fetchActiveLoans = useCallback(async (userId?: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await repository.listActive(userId);
            setLoans(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar empréstimos ativos.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchOverdueLoans = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await repository.listOverdue();
            setLoans(data);
        } catch {
            setError(getErrorMessage(null, 'Erro.'));
        } finally {
            setLoading(false);
        }
    }, [repository]);

    const returnBook = useCallback(async (id: string) => {
        try {
            await repository.returnBook(id);
            // Remove da lista local se estivermos vendo os ativos
            setLoans((prev) => prev.filter((l) => l.id !== id));
            return true;
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Erro ao devolver livro.'));
            return false;
        }
    }, [repository]);

    return {
        loans,
        loading,
        error,
        fetchActiveLoans,
        fetchOverdueLoans,
        returnBook,
        setLoans
    };
}

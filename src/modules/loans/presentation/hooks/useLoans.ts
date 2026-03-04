import { useState, useCallback } from 'react';
import type { Loan } from '../../../../shared/types';
import { LoanRepositoryImpl } from '../../infrastructure/LoanRepositoryImpl';

export function useLoans() {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const repository = new LoanRepositoryImpl();

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
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao carregar empréstimos atrasados.');
        } finally {
            setLoading(false);
        }
    }, []);

    const returnBook = useCallback(async (loanId: string) => {
        try {
            await repository.returnBook(loanId);
            // Remove da lista local se estivermos vendo os ativos
            setLoans((prev) => prev.filter((l) => l.id !== loanId));
            return true;
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao realizar devolução.');
            return false;
        }
    }, []);

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

import { httpClient } from '../../../shared/infra/httpClient';
import type { Loan } from '../../../shared/types';

export interface CreateLoanDTO {
    bookId: string;
    userId: string;
}

export interface ILoanRepository {
    listActive(userId?: string): Promise<Loan[]>;
    listOverdue(): Promise<Loan[]>;
    history(filters: { userId?: string; bookId?: string }): Promise<Loan[]>;
    create(data: CreateLoanDTO): Promise<Loan>;
    returnBook(loanId: string): Promise<Loan>;
}

export class LoanRepositoryImpl implements ILoanRepository {
    async listActive(userId?: string): Promise<Loan[]> {
        const response = await httpClient.get<Loan[]>('/loans/active', {
            params: { userId }
        });
        return response.data;
    }

    async listOverdue(): Promise<Loan[]> {
        const response = await httpClient.get<Loan[]>('/loans/overdue');
        return response.data;
    }

    async listMyLoans(): Promise<Loan[]> {
        const response = await httpClient.get<Loan[]>('/loans/me');
        return response.data;
    }

    async history(filters: { userId?: string; bookId?: string }): Promise<Loan[]> {
        const response = await httpClient.get<Loan[]>('/loans/history', {
            params: filters
        });
        return response.data;
    }

    async create(data: CreateLoanDTO): Promise<Loan> {
        const response = await httpClient.post<Loan>('/loans', data);
        return response.data;
    }

    async returnBook(loanId: string): Promise<Loan> {
        const response = await httpClient.post<Loan>(`/loans/${loanId}/return`);
        return response.data;
    }
}

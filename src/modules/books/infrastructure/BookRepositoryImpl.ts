import { httpClient } from '../../../shared/infra/httpClient';
import type { Book } from '../../../shared/types';
import type { IBookRepository, CreateBookDTO, UpdateBookDTO } from '../domain/repositories/IBookRepository';

export class BookRepositoryImpl implements IBookRepository {
    async list(): Promise<Book[]> {
        const response = await httpClient.get<Book[]>('/books');
        return response.data;
    }

    async findById(id: string): Promise<Book> {
        const response = await httpClient.get<Book>(`/books/${id}`);
        return response.data;
    }

    async create(data: CreateBookDTO): Promise<Book> {
        const response = await httpClient.post<Book>('/books', data);
        return response.data;
    }

    async update(id: string, data: UpdateBookDTO): Promise<Book> {
        const response = await httpClient.put<Book>(`/books/${id}`, data);
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await httpClient.delete(`/books/${id}`);
    }
}

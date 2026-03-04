import { httpClient } from '../../../shared/infra/httpClient';
import type { Author } from '../../../shared/types';

export interface CreateAuthorDTO {
    name: string;
    biography?: string;
}

export interface IAuthorRepository {
    list(): Promise<Author[]>;
    findById(id: string): Promise<Author>;
    create(data: CreateAuthorDTO): Promise<Author>;
    update(id: string, data: Partial<CreateAuthorDTO>): Promise<Author>;
    delete(id: string): Promise<void>;
}

export class AuthorRepositoryImpl implements IAuthorRepository {
    async list(): Promise<Author[]> {
        const response = await httpClient.get<Author[]>('/authors');
        return response.data;
    }

    async findById(id: string): Promise<Author> {
        const response = await httpClient.get<Author>(`/authors/${id}`);
        return response.data;
    }

    async create(data: CreateAuthorDTO): Promise<Author> {
        const response = await httpClient.post<Author>('/authors', data);
        return response.data;
    }

    async update(id: string, data: Partial<CreateAuthorDTO>): Promise<Author> {
        const response = await httpClient.put<Author>(`/authors/${id}`, data);
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await httpClient.delete(`/authors/${id}`);
    }
}

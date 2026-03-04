import { httpClient } from '../../../shared/infra/httpClient';
import type { Category } from '../../../shared/types';

export interface CreateCategoryDTO {
    name: string;
}

export interface ICategoryRepository {
    list(): Promise<Category[]>;
    findById(id: string): Promise<Category>;
    create(data: CreateCategoryDTO): Promise<Category>;
    update(id: string, data: CreateCategoryDTO): Promise<Category>;
    delete(id: string): Promise<void>;
}

export class CategoryRepositoryImpl implements ICategoryRepository {
    async list(): Promise<Category[]> {
        const response = await httpClient.get<Category[]>('/categories');
        return response.data;
    }

    async findById(id: string): Promise<Category> {
        const response = await httpClient.get<Category>(`/categories/${id}`);
        return response.data;
    }

    async create(data: CreateCategoryDTO): Promise<Category> {
        const response = await httpClient.post<Category>('/categories', data);
        return response.data;
    }

    async update(id: string, data: CreateCategoryDTO): Promise<Category> {
        const response = await httpClient.put<Category>(`/categories/${id}`, data);
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await httpClient.delete(`/categories/${id}`);
    }
}

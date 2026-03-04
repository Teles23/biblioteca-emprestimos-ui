import { httpClient } from '../../../shared/infra/httpClient';
import type { Category } from '../../../shared/types';

export interface ICategoryRepository {
    list(): Promise<Category[]>;
}

export class CategoryRepositoryImpl implements ICategoryRepository {
    async list(): Promise<Category[]> {
        const response = await httpClient.get<Category[]>('/categories');
        return response.data;
    }
}

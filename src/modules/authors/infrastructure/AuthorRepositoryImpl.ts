import { httpClient } from '../../../shared/infra/httpClient';
import type { Author } from '../../../shared/types';

export interface IAuthorRepository {
    list(): Promise<Author[]>;
}

export class AuthorRepositoryImpl implements IAuthorRepository {
    async list(): Promise<Author[]> {
        const response = await httpClient.get<Author[]>('/authors');
        return response.data;
    }
}

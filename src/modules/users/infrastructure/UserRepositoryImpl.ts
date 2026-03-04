import { httpClient } from '../../../shared/infra/httpClient';
import type { User } from '../../../shared/types';

export interface CreateUserDTO {
    name: string;
    email: string;
    phone?: string;
    roles?: string[];
}

export interface IUserRepository {
    list(): Promise<User[]>;
    findById(id: string): Promise<User>;
    create(data: CreateUserDTO): Promise<User>;
    delete(id: string): Promise<void>;
}

export class UserRepositoryImpl implements IUserRepository {
    async list(): Promise<User[]> {
        const response = await httpClient.get<User[]>('/users');
        return response.data;
    }

    async findById(id: string): Promise<User> {
        const response = await httpClient.get<User>(`/users/${id}`);
        return response.data;
    }

    async create(data: CreateUserDTO): Promise<User> {
        const response = await httpClient.post<User>('/users', data);
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await httpClient.delete(`/users/${id}`);
    }
}

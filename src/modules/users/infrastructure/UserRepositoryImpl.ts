import { httpClient } from '../../../shared/infra/httpClient';
import type { User } from '../../../shared/types';

export interface CreateUserDTO {
  name: string;
  email: string;
  phone?: string;
  roles?: string[];
}

export interface CreateUserResponse extends User {
  generatedPassword?: string;
}

export interface IUserRepository {
  list(): Promise<User[]>;
  findById(id: string): Promise<User>;
  create(data: CreateUserDTO): Promise<CreateUserResponse>;
  update(id: string, data: Partial<CreateUserDTO>): Promise<User>;
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

  async create(data: CreateUserDTO): Promise<CreateUserResponse> {
    const response = await httpClient.post<CreateUserResponse>('/users', data);
    return response.data;
  }

  async update(id: string, data: Partial<CreateUserDTO>): Promise<User> {
    const response = await httpClient.put<User>(`/users/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/users/${id}`);
  }
}

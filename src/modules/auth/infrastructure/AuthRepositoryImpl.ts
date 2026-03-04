import { httpClient } from '../../../shared/infra/httpClient';
import type { LoginResponse } from '../../../shared/types';
import type { LoginCredentials, RegisterCredentials } from '../application/dtos/auth.dto';
import type { IAuthRepository } from '../domain/repositories/IAuthRepository';

export class AuthRepositoryImpl implements IAuthRepository {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await httpClient.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    }

    async register(credentials: RegisterCredentials): Promise<{ id: string }> {
        const response = await httpClient.post<{ id: string }>('/auth/register', credentials);
        return response.data;
    }
}

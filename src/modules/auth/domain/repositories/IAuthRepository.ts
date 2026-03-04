import type { LoginResponse } from '../../../../shared/types';
import type { LoginCredentials, RegisterCredentials } from '../../application/dtos/auth.dto';

export interface IAuthRepository {
    login(credentials: LoginCredentials): Promise<LoginResponse>;
    register(credentials: RegisterCredentials): Promise<{ id: string }>;
}

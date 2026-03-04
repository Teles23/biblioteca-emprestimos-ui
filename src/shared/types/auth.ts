import type { LoginCredentials, RegisterCredentials } from '../../modules/auth/application/dtos/auth.dto';

export interface UserInfo {
    id: string;
    email: string;
    roles: string[];
    name?: string;
}

export interface AuthContextData {
    user: UserInfo | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login(credentials: LoginCredentials): Promise<void>;
    register(credentials: RegisterCredentials): Promise<void>;
    logout(): void;
}

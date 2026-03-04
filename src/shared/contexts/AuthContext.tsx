import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { LoginCredentials, RegisterCredentials } from '../../modules/auth/application/dtos/auth.dto';
import { AuthRepositoryImpl } from '../../modules/auth/infrastructure/AuthRepositoryImpl';

interface UserInfo {
    id: string;
    email: string;
    roles: string[];
    name?: string;
}

interface AuthContextData {
    user: UserInfo | null;
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    login(credentials: LoginCredentials): Promise<void>;
    register(credentials: RegisterCredentials): Promise<void>;
    logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserInfo | null>(() => {
        const storagedUser = localStorage.getItem('@LibraManager:user');
        return storagedUser ? JSON.parse(storagedUser) : null;
    });

    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('@LibraManager:token');
    });

    const authRepository = new AuthRepositoryImpl();

    const login = useCallback(async (credentials: LoginCredentials) => {
        const response = await authRepository.login(credentials);

        const userInfo: UserInfo = {
            ...response.user,
            name: response.user.name || credentials.email.split('@')[0], // Fallback name
        };

        setUser(userInfo);
        setToken(response.accessToken);

        localStorage.setItem('@LibraManager:token', response.accessToken);
        localStorage.setItem('@LibraManager:user', JSON.stringify(userInfo));
    }, []);

    const register = useCallback(async (credentials: RegisterCredentials) => {
        await authRepository.register(credentials);
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('@LibraManager:token');
        localStorage.removeItem('@LibraManager:user');
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!token,
                isAdmin: user?.roles.includes('ROLE_ADMIN') || false,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextData {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}

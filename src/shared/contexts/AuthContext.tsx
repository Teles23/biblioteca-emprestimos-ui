import { useState, useCallback, useMemo, type ReactNode } from 'react';
import { AuthRepositoryImpl } from '../../modules/auth/infrastructure/AuthRepositoryImpl';
import { AuthContext } from './AuthContextInstance';
import type { LoginCredentials, RegisterCredentials } from '../../modules/auth/application/dtos/auth.dto';
import type { UserInfo } from '../types/auth';

export function AuthProvider({ children }: { children: ReactNode }) {
    const authRepository = useMemo(() => new AuthRepositoryImpl(), []);

    const [user, setUser] = useState<UserInfo | null>(() => {
        const storagedUser = localStorage.getItem('@LibraManager:user');
        return storagedUser ? JSON.parse(storagedUser) : null;
    });

    const [token, setToken] = useState<string | null>(() => {
        return localStorage.getItem('@LibraManager:token');
    });

    const login = useCallback(async (credentials: LoginCredentials) => {
        const response = await authRepository.login(credentials);

        const userInfo: UserInfo = {
            ...response.user,
            name: response.user.name || credentials.email.split('@')[0],
        };

        setUser(userInfo);
        setToken(response.accessToken);

        localStorage.setItem('@LibraManager:token', response.accessToken);
        localStorage.setItem('@LibraManager:user', JSON.stringify(userInfo));
    }, [authRepository]);

    const register = useCallback(async (credentials: RegisterCredentials) => {
        await authRepository.register(credentials);
    }, [authRepository]);

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

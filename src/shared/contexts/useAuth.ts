import { useContext } from 'react';
import { AuthContext } from './AuthContextInstance';
import type { AuthContextData } from '../types/auth';

export function useAuth(): AuthContextData {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}

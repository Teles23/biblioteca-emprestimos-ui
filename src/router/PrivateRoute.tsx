import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../shared/contexts/AuthContext';

interface PrivateRouteProps {
    requiredRole?: string;
}

export function PrivateRoute({ requiredRole }: PrivateRouteProps) {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && !user?.roles.includes(requiredRole)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

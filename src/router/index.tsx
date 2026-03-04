import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../shared/layout/AppLayout';
import { LoginPage } from '../modules/auth/presentation/pages/LoginPage';
import { RegisterPage } from '../modules/auth/presentation/pages/RegisterPage';
import { LivrosPage } from '../modules/books/presentation/pages/LivrosPage';
import { CadastroLivroPage } from '../modules/books/presentation/pages/CadastroLivroPage';
import { DashboardPage } from '../modules/dashboard/presentation/pages/DashboardPage';
import { PrivateRoute } from './PrivateRoute';

// Temporary Mock Page for testing layout
const MockPage = ({ title }: { title: string }) => (
    <div className="page-header">
        <div className="page-header-left">
            <h1 className="text-[22px] font-bold tracking-tight text-text-primary">{title}</h1>
            <p className="text-[13px] text-text-secondary mt-0.5">Módulo em desenvolvimento</p>
        </div>
    </div>
);

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/register',
        element: <RegisterPage />,
    },
    {
        element: <PrivateRoute />,
        children: [
            {
                path: '/',
                element: <AppLayout />,
                children: [
                    {
                        index: true,
                        element: <DashboardPage />,
                    },
                    {
                        path: 'livros',
                        children: [
                            {
                                index: true,
                                element: <LivrosPage />,
                            },
                            {
                                path: 'novo',
                                element: <CadastroLivroPage />,
                            },
                            {
                                path: ':id/editar',
                                element: <CadastroLivroPage />,
                            },
                        ],
                    },
                    {
                        path: 'autores',
                        element: <MockPage title="Autores" />,
                    },
                    {
                        path: 'categorias',
                        element: <MockPage title="Categorias" />,
                    },
                    {
                        path: 'emprestimos',
                        element: <MockPage title="Emprestimos" />,
                    },
                    {
                        path: 'historico',
                        element: <MockPage title="Histórico" />,
                    },
                ],
            },
        ],
    },
    {
        element: <PrivateRoute requiredRole="ROLE_ADMIN" />,
        children: [
            {
                path: '/',
                element: <AppLayout />,
                children: [
                    {
                        path: 'usuarios',
                        element: <MockPage title="Configurações de Usuários" />,
                    },
                ],
            },
        ],
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);

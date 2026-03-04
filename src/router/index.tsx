import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../shared/layout/AppLayout';

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
        path: '/',
        element: <AppLayout />,
        children: [
            {
                path: '/',
                element: <MockPage title="Dashboard" />,
            },
            {
                path: '/livros',
                element: <MockPage title="Livros" />,
            },
            {
                path: '/autores',
                element: <MockPage title="Autores" />,
            },
            {
                path: '/categorias',
                element: <MockPage title="Categorias" />,
            },
            {
                path: '/usuarios',
                element: <MockPage title="Usuários" />,
            },
            {
                path: '/emprestimos',
                element: <MockPage title="Empréstimos" />,
            },
            {
                path: '/historico',
                element: <MockPage title="Histórico" />,
            },
        ],
    },
    {
        path: '/login',
        element: <div className="p-10 text-center">Página de Login em breve...</div>,
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);

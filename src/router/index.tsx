import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../shared/layout/AppLayout';
import { LoginPage } from '../modules/auth/presentation/pages/LoginPage';
import { RegisterPage } from '../modules/auth/presentation/pages/RegisterPage';
import { LivrosPage } from '../modules/books/presentation/pages/LivrosPage';
import { CadastroLivroPage } from '../modules/books/presentation/pages/CadastroLivroPage';
import { AutoresPage } from '../modules/authors/presentation/pages/AutoresPage';
import { CadastroAutorPage } from '../modules/authors/presentation/pages/CadastroAutorPage';
import { CategoriasPage } from '../modules/categories/presentation/pages/CategoriasPage';
import { CadastroCategoriaPage } from '../modules/categories/presentation/pages/CadastroCategoriaPage';
import { UsuariosPage } from '../modules/users/presentation/pages/UsuariosPage';
import { CadastroUsuarioPage } from '../modules/users/presentation/pages/CadastroUsuarioPage';
import { CadastroLeitorPage } from '../modules/users/presentation/pages/CadastroLeitorPage';
import { DashboardPage } from '../modules/dashboard/presentation/pages/DashboardPage';
import { EmprestimosPage } from '../modules/loans/presentation/pages/EmprestimosPage';
import { HistoricoPage } from '../modules/loans/presentation/pages/HistoricoPage';
import { RegistrarEmprestimoPage } from '../modules/loans/presentation/pages/RegistrarEmprestimoPage';
import { MeusEmprestimosPage } from '../modules/loans/presentation/pages/MeusEmprestimosPage';
import { PrivateRoute } from './PrivateRoute';



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
                        children: [
                            {
                                index: true,
                                element: <AutoresPage />,
                            },
                            {
                                path: 'novo',
                                element: <CadastroAutorPage />,
                            },
                            {
                                path: ':id/editar',
                                element: <CadastroAutorPage />,
                            },
                        ],
                    },
                    {
                        path: 'categorias',
                        children: [
                            {
                                index: true,
                                element: <CategoriasPage />,
                            },
                            {
                                path: 'nova',
                                element: <CadastroCategoriaPage />,
                            },
                            {
                                path: ':id/editar',
                                element: <CadastroCategoriaPage />,
                            },
                        ],
                    },
                    {
                        path: 'meus-emprestimos',
                        element: <MeusEmprestimosPage />,
                    },
                    {
                        path: 'emprestimos',
                        children: [
                            {
                                index: true,
                                element: <EmprestimosPage />,
                            },
                            {
                                path: 'novo',
                                element: <RegistrarEmprestimoPage />,
                            },
                        ],
                    },
                    {
                        path: 'historico',
                        element: <HistoricoPage />,
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
                        children: [
                            {
                                index: true,
                                element: <UsuariosPage />,
                            },
                            {
                                path: 'novo',
                                element: <CadastroUsuarioPage />,
                            },
                            {
                                path: 'leitores/novo',
                                element: <CadastroLeitorPage />,
                            },
                            {
                                path: ':id/editar',
                                element: <CadastroUsuarioPage />,
                            },
                        ],
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

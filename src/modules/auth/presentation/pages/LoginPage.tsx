import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../shared/contexts/AuthContext';
import { useState } from 'react';

const loginSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(1, 'Senha é obrigatória'),
    remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: 'admin@biblioteca.com',
            password: '',
            remember: true,
        }
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setError(null);
            setLoading(true);
            await login({ email: data.email, password: data.password });
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao realizar login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* PAINEL ESQUERDO */}
            <div className="hidden lg:flex bg-sidebar-bg flex-col justify-center items-center p-16 relative overflow-hidden">
                {/* Decorativo */}
                <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(232,168,56,0.12)_0%,transparent_70%)] -top-[100px] -left-[100px]" />

                <div className="relative z-10 max-w-[380px] w-full">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-11 h-11 bg-accent rounded-[10px] flex items-center justify-center text-2xl">
                            📚
                        </div>
                        <div className="text-[18px] font-bold text-white tracking-tight">
                            LibraManager
                            <span className="block text-[11px] font-normal text-sidebar-text tracking-widest uppercase">
                                Sistema de Biblioteca
                            </span>
                        </div>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-[32px] font-extrabold text-white tracking-tighter leading-[1.15] mb-3.5">
                            Gerencie sua biblioteca com precisão
                        </h2>
                        <p className="text-[14px] text-sidebar-text leading-relaxed">
                            Controle completo de acervo, empréstimos, devoluções e histórico de leitores em um só lugar.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        {[
                            'Cadastro e gestão de livros e autores',
                            'Controle de empréstimos e devoluções',
                            'Alertas de atraso automáticos',
                            'Histórico completo por leitor'
                        ].map((feature, i) => (
                            <div key={i} className="flex items-center gap-2.5 text-[13px] text-sidebar-text">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* PAINEL DIREITO */}
            <div className="flex items-center justify-center p-8 lg:p-16 bg-surface-2 font-sans">
                <div className="bg-surface rounded-lg border border-border shadow-lg p-10 w-full max-w-[420px]">
                    <h1 className="text-[22px] font-extrabold tracking-tight mb-1">
                        Bem-vindo de volta 👋
                    </h1>
                    <p className="text-[13px] text-text-secondary mb-[30px]">
                        Faça login para acessar o painel administrativo
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-semibold text-text-primary tracking-wide">
                                E-mail
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] pointer-events-none">
                                    ✉️
                                </span>
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="admin@biblioteca.com"
                                    className={`pl-[34px] p-2.5 border-1.5 border-border rounded-sm text-[13.5px] w-full outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(232,168,56,0.12)] ${errors.email ? 'border-danger' : ''
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <span className="text-[11px] text-danger font-medium">{errors.email.message}</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-semibold text-text-primary tracking-wide">
                                Senha
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] pointer-events-none">
                                    🔒
                                </span>
                                <input
                                    {...register('password')}
                                    type="password"
                                    placeholder="••••••••"
                                    className={`pl-[34px] p-2.5 border-1.5 border-border rounded-sm text-[13.5px] w-full outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(232,168,56,0.12)] ${errors.password ? 'border-danger' : ''
                                        }`}
                                />
                            </div>
                            {errors.password && (
                                <span className="text-[11px] text-danger font-medium">{errors.password.message}</span>
                            )}
                            <div className="text-[11px] text-text-muted mt-0.5">
                                Esqueceu a senha? <a href="#" className="text-accent-dark font-bold hover:underline">Recuperar acesso</a>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                {...register('remember')}
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 rounded border-border text-accent focus:ring-accent"
                            />
                            <label htmlFor="remember" className="text-[13px] text-text-secondary cursor-pointer">
                                Manter conectado
                            </label>
                        </div>

                        {error && (
                            <div className="bg-danger-soft border border-danger/20 text-danger text-[13px] p-3 rounded-sm font-medium">
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-accent text-[#0f1117] font-bold py-3 px-4 rounded-sm shadow-[0_2px_8px_rgba(232,168,56,0.3)] hover:bg-accent-dark hover:-translate-y-px transition-all flex items-center justify-center gap-2 text-[14px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? 'Entrando...' : 'Entrar no sistema →'}
                        </button>

                        <div className="relative flex items-center justify-center py-2">
                            <div className="absolute w-full border-t border-border" />
                            <span className="relative bg-surface px-3 text-[12px] text-text-muted uppercase tracking-widest font-medium">
                                ou
                            </span>
                        </div>

                        <div className="text-center text-[13px] text-text-primary">
                            Não tem conta? <Link to="/register" className="text-accent-dark font-bold hover:underline">Criar conta agora</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../shared/contexts/AuthContext';
import { useState } from 'react';

import { registerSchema, type RegisterFormValues } from '../schemas/auth.schema';

export function RegisterPage() {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            setError(null);
            setLoading(true);
            await registerUser({ name: data.name, email: data.email, password: data.password });
            alert('Conta criada com sucesso! Faça login para continuar.');
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao realizar cadastro. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* PAINEL ESQUERDO */}
            <div className="hidden lg:flex bg-sidebar-bg flex-col justify-center items-center p-16 relative overflow-hidden">
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
                            Junte-se à nossa comunidade
                        </h2>
                        <p className="text-[14px] text-sidebar-text leading-relaxed">
                            Crie sua conta em poucos segundos e comece a gerenciar seu acervo de forma profissional e eficiente.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                            <div className="font-bold text-accent text-[15px] mb-1">Segurança Total</div>
                            <div className="text-[12px] text-sidebar-text">Seus dados e senhas são criptografados com tecnologia de ponta.</div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-lg p-5">
                            <div className="font-bold text-accent text-[15px] mb-1">Acesso Imediato</div>
                            <div className="text-[12px] text-sidebar-text">Após o cadastro, você terá acesso instantâneo às funcionalidades de usuário.</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PAINEL DIREITO */}
            <div className="flex items-center justify-center p-8 lg:p-16 bg-surface-2 font-sans">
                <div className="bg-surface rounded-lg border border-border shadow-lg p-10 w-full max-w-[460px]">
                    <h1 className="text-[22px] font-extrabold tracking-tight mb-1">
                        Criar conta gratuita 👋
                    </h1>
                    <p className="text-[13px] text-text-secondary mb-[30px]">
                        Preencha os campos abaixo para começar
                    </p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-semibold text-text-primary tracking-wide">
                                Nome Completo
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] pointer-events-none">
                                    👤
                                </span>
                                <input
                                    {...register('name')}
                                    type="text"
                                    placeholder="Seu nome"
                                    className={`pl-[34px] p-2.5 border-1.5 border-border rounded-sm text-[13.5px] w-full outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(232,168,56,0.12)] ${errors.name ? 'border-danger' : ''
                                        }`}
                                />
                            </div>
                            {errors.name && (
                                <span className="text-[11px] text-danger font-medium">{errors.name.message}</span>
                            )}
                        </div>

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
                                    placeholder="seu@email.com"
                                    className={`pl-[34px] p-2.5 border-1.5 border-border rounded-sm text-[13.5px] w-full outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(232,168,56,0.12)] ${errors.email ? 'border-danger' : ''
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <span className="text-[11px] text-danger font-medium">{errors.email.message}</span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[12px] font-semibold text-text-primary tracking-wide">
                                    Confirmar
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[14px] pointer-events-none">
                                        🔒
                                    </span>
                                    <input
                                        {...register('confirmPassword')}
                                        type="password"
                                        placeholder="••••••••"
                                        className={`pl-[34px] p-2.5 border-1.5 border-border rounded-sm text-[13.5px] w-full outline-none transition-all focus:border-accent focus:shadow-[0_0_0_3px_rgba(232,168,56,0.12)] ${errors.confirmPassword ? 'border-danger' : ''
                                            }`}
                                    />
                                </div>
                            </div>
                        </div>

                        {(errors.password || errors.confirmPassword) && (
                            <div className="bg-danger-soft border border-danger/10 p-3 rounded-sm space-y-1">
                                {errors.password && <div className="text-[11px] text-danger font-medium">● {errors.password.message}</div>}
                                {errors.confirmPassword && <div className="text-[11px] text-danger font-medium">● {errors.confirmPassword.message}</div>}
                            </div>
                        )}

                        <div className="pt-2">
                            {error && (
                                <div className="bg-danger-soft border border-danger/20 text-danger text-[13px] p-3 rounded-sm font-medium mb-4">
                                    ⚠️ {error}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-accent text-[#0f1117] font-bold py-3 px-4 rounded-sm shadow-[0_2px_8px_rgba(232,168,56,0.3)] hover:bg-accent-dark hover:-translate-y-px transition-all flex items-center justify-center gap-2 text-[14px] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {loading ? 'Cadastrando...' : 'Cadastrar agora →'}
                            </button>
                        </div>

                        <div className="text-center text-[13px] text-text-primary pt-4">
                            Já tem uma conta? <Link to="/login" className="text-accent-dark font-bold hover:underline">Fazer login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

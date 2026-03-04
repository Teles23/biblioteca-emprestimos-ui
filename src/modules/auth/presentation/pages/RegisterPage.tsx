import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../shared/contexts/useAuth';
import { useState } from 'react';
import { getErrorMessage } from '../../../../shared/utils/error';
import { registerSchema, type RegisterFormValues } from '../schemas/auth.schema';

export function RegisterPage() {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            setLoading(true);
            setError(null);
            await registerUser(data);
            navigate('/login');
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Erro ao realizar cadastro.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-left">
                <div className="auth-left-content">
                    <div className="auth-logo">
                        <div className="auth-logo-icon">📚</div>
                        <div className="auth-logo-name">
                            LibraManager
                            <span>Library System</span>
                        </div>
                    </div>

                    <div className="auth-tagline">
                        <h2>Junte-se à nossa comunidade 📖</h2>
                        <p>Crie sua conta agora e tenha acesso total ao sistema de gestão de biblioteca mais moderno do mercado.</p>
                    </div>

                    <div className="auth-features">
                        <div className="auth-feature">
                            <div className="auth-feature-dot"></div>
                            <span>Acesso imediato ao acervo</span>
                        </div>
                        <div className="auth-feature">
                            <div className="auth-feature-dot"></div>
                            <span>Solicite empréstimos online</span>
                        </div>
                        <div className="auth-feature">
                            <div className="auth-feature-dot"></div>
                            <span>Notificações de prazos</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-form-card">
                    <h1 className="auth-form-title">Crie sua conta</h1>
                    <p className="auth-form-subtitle">Preencha os campos abaixo para começar.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="form-group">
                            <label>Nome Completo</label>
                            <input
                                {...register('name')}
                                type="text"
                                placeholder="Ex: Thiago Teles"
                                className={errors.name ? 'border-danger' : ''}
                            />
                            {errors.name && <span className="text-[11px] text-danger">{errors.name.message}</span>}
                        </div>

                        <div className="form-group">
                            <label>E-mail</label>
                            <input
                                {...register('email')}
                                type="email"
                                placeholder="exemplo@email.com"
                                className={errors.email ? 'border-danger' : ''}
                            />
                            {errors.email && <span className="text-[11px] text-danger">{errors.email.message}</span>}
                        </div>

                        <div className="form-group">
                            <label>Senha</label>
                            <input
                                {...register('password')}
                                type="password"
                                placeholder="••••••••"
                                className={errors.password ? 'border-danger' : ''}
                            />
                            {errors.password && <span className="text-[11px] text-danger">{errors.password.message}</span>}
                        </div>

                        {error && (
                            <div className="bg-danger-soft border border-danger/20 text-danger p-3 rounded-sm text-[12px] font-medium">
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-3 justify-center text-[14px] mt-4"
                        >
                            {loading ? 'Cadastrando...' : 'Criar minha conta'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border text-center">
                        <p className="text-[13px] text-text-secondary">
                            Já possui uma conta?{' '}
                            <Link to="/login" className="text-accent font-bold hover:underline">
                                Faça login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../shared/contexts/useAuth';
import { useState } from 'react';
import { getErrorMessage } from '../../../../shared/utils/error';
import { loginSchema, type LoginFormValues } from '../schemas/auth.schema';

export function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            setLoading(true);
            setError(null);
            await login(data);
            navigate('/');
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Erro ao realizar login.'));
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
                        <h2>Gerencie sua biblioteca com elegância 📚</h2>
                        <p>A solução definitiva para controle de acervo, empréstimos e gestão de leitores em um só lugar.</p>
                    </div>

                    <div className="auth-features">
                        <div className="auth-feature">
                            <div className="auth-feature-dot"></div>
                            <span>Controle de empréstimos em tempo real</span>
                        </div>
                        <div className="auth-feature">
                            <div className="auth-feature-dot"></div>
                            <span>Gestão simplificada de acervo</span>
                        </div>
                        <div className="auth-feature">
                            <div className="auth-feature-dot"></div>
                            <span>Relatórios e histórico completo</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-form-card">
                    <h1 className="auth-form-title">Bem-vindo de volta!</h1>
                    <p className="auth-form-subtitle">Por favor, insira suas credenciais para continuar.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="form-group">
                            <label>E-mail</label>
                            <input
                                {...register('email')}
                                type="email"
                                placeholder="exemplo@email.com"
                                className={errors.email ? 'border-danger' : ''}
                            />
                            {errors.email && <span className="text-[11px] text-danger mt-1">{errors.email.message}</span>}
                        </div>

                        <div className="form-group">
                            <label>Senha</label>
                            <input
                                {...register('password')}
                                type="password"
                                placeholder="••••••••"
                                className={errors.password ? 'border-danger' : ''}
                            />
                            {errors.password && <span className="text-[11px] text-danger mt-1">{errors.password.message}</span>}
                        </div>

                        {error && (
                            <div className="bg-danger-soft border border-danger/20 text-danger p-3 rounded-sm text-[12px] font-medium animate-in slide-in-from-top-1 duration-200">
                                ⚠️ {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary w-full py-3.5 justify-center text-[14px] mt-2"
                        >
                            {loading ? 'Entrando...' : 'Entrar no Sistema'}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-border text-center">
                        <p className="text-[13px] text-text-secondary">
                            Ainda não tem uma conta?{' '}
                            <Link to="/register" className="text-accent font-bold hover:underline">
                                Cadastre-se agora
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

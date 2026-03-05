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
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

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
            <div className="auth-logo-icon"><img src="/favicon.svg" alt="LibraManager" className="w-6 h-6" /></div>
            <div className="auth-logo-name">
              LibraManager
              <span>Sistema de Biblioteca</span>
            </div>
          </div>

          <div className="auth-tagline">
            <h2>Gerencie sua biblioteca com precisão</h2>
            <p>Controle completo de acervo, empréstimos, devoluções e histórico de leitores em um só lugar.</p>
          </div>

          <div className="auth-features">
            <div className="auth-feature"><div className="auth-feature-dot"></div> Cadastro e gestão de livros e autores</div>
            <div className="auth-feature"><div className="auth-feature-dot"></div> Controle de empréstimos e devoluções</div>
            <div className="auth-feature"><div className="auth-feature-dot"></div> Alertas de atraso automáticos</div>
            <div className="auth-feature"><div className="auth-feature-dot"></div> Histórico completo por leitor</div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-card">
          <div className="auth-form-title">Bem-vindo de volta</div>
          <div className="auth-form-subtitle">Faça login para acessar o painel administrativo</div>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label>E-mail</label>
              <input {...register('email')} type="email" placeholder="admin@biblioteca.com" className={errors.email ? 'border-danger' : ''} />
              {errors.email && <span className="text-[11px] text-danger mt-1">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input {...register('password')} type="password" placeholder="••••••••" className={errors.password ? 'border-danger' : ''} />
              {errors.password && <span className="text-[11px] text-danger mt-1">{errors.password.message}</span>}
            </div>

            {error && <div className="bg-danger-soft border border-danger/20 text-danger p-3 rounded-sm text-[12px] font-medium">{error}</div>}

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3.5 justify-center text-[14px]">
              {loading ? 'Entrando...' : 'Entrar no sistema'}
            </button>

            <div className="form-divider"><span>ou</span></div>

            <div className="auth-link">
              Não tem conta? <Link to="/register">Criar conta agora</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

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
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

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
            <div className="auth-logo-icon"><img src="/favicon.svg" alt="LibraManager" className="w-6 h-6" /></div>
            <div className="auth-logo-name">
              LibraManager
              <span>Sistema de Biblioteca</span>
            </div>
          </div>

          <div className="auth-tagline">
            <h2>Crie sua conta de acesso</h2>
            <p>Cadastro de usuário para autenticação no sistema de gerenciamento da biblioteca.</p>
          </div>

          <div className="auth-features">
            <div className="auth-feature"><div className="auth-feature-dot"></div> Senha forte obrigatória</div>
            <div className="auth-feature"><div className="auth-feature-dot"></div> Acesso com perfil ROLE_USER</div>
            <div className="auth-feature"><div className="auth-feature-dot"></div> Fluxo integrado com API JWT</div>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-card">
          <h1 className="auth-form-title">Criar conta</h1>
          <p className="auth-form-subtitle">Preencha os dados para concluir o cadastro</p>

          <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
            <div className="form-group">
              <label>Nome completo</label>
              <input {...register('name')} type="text" placeholder="Ex: Ana Paula Lima" className={errors.name ? 'border-danger' : ''} />
              {errors.name && <span className="text-[11px] text-danger">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label>E-mail</label>
              <input {...register('email')} type="email" placeholder="ana@email.com" className={errors.email ? 'border-danger' : ''} />
              {errors.email && <span className="text-[11px] text-danger">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label>Senha</label>
              <input {...register('password')} type="password" placeholder="••••••••" className={errors.password ? 'border-danger' : ''} />
              {errors.password && <span className="text-[11px] text-danger">{errors.password.message}</span>}
            </div>

            {error && <div className="bg-danger-soft border border-danger/20 text-danger p-3 rounded-sm text-[12px] font-medium">{error}</div>}

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 justify-center text-[14px] mt-1">
              {loading ? 'Cadastrando...' : 'Criar conta'}
            </button>

            <div className="auth-link">
              Já possui uma conta? <Link to="/login">Fazer login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

import { getErrorMessage } from '../../../../shared/utils/error';
import { UserRepositoryImpl } from '../../infrastructure/UserRepositoryImpl';
import { useToast } from '../../../../shared/ui/useToast';

type ReaderFormValues = {
  name: string;
  email: string;
  phone?: string;
};

export function CadastroLeitorPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const repository = useMemo(() => new UserRepositoryImpl(), []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ReaderFormValues>();

  const onSubmit = async (values: ReaderFormValues) => {
    try {
      setLoading(true);
      setError(null);
      const created = await repository.create({
        name: values.name,
        email: values.email,
        phone: values.phone,
      });
      setGeneratedPassword(created.generatedPassword || null);
      toast.success('Leitor cadastrado com sucesso.');
    } catch (err: unknown) {
      const message = getErrorMessage(err, 'Erro ao cadastrar leitor.');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Cadastrar Leitor</h1>
          <p>Adicione um novo usuário ao sistema (Perfil Leitor)</p>
        </div>
        <Link to="/usuarios" className="btn btn-secondary">
          ← Voltar
        </Link>
      </div>

      <div style={{ maxWidth: 640 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Dados do Leitor</div>
            <span className="badge badge-neutral">Novo</span>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-grid form-grid-2" style={{ gap: 18 }}>
                <div className="form-group span-2">
                  <label>
                    Nome completo <span className="req">*</span>
                  </label>
                  <input
                    {...register('name', {
                      required: 'Nome é obrigatório',
                      minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                    })}
                    type="text"
                    placeholder="Ex: Ana Paula Lima"
                  />
                  {errors.name && <span className="text-[11px] text-danger">{errors.name.message}</span>}
                </div>

                <div className="form-group span-2">
                  <label>
                    E-mail <span className="req">*</span>
                  </label>
                  <input
                    {...register('email', { required: 'E-mail é obrigatório' })}
                    type="email"
                    placeholder="ana.lima@email.com"
                  />
                  {errors.email && <span className="text-[11px] text-danger">{errors.email.message}</span>}
                  <div className="form-hint">Deve ser único no sistema</div>
                </div>

                <div className="form-group">
                  <label>Telefone</label>
                  <input {...register('phone')} type="tel" placeholder="(11) 99999-9999" />
                </div>

                <div className="form-group">
                  <label>Perfil padrão</label>
                  <select disabled>
                    <option>Leitor</option>
                  </select>
                </div>
              </div>

              <div className="note note-info" style={{ marginTop: 18 }}>
                A senha será <strong>gerada automaticamente</strong> e retornada após o cadastro.
              </div>

              <div
                style={{
                  background: 'var(--surface-2)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '14px 16px',
                  marginTop: 4,
                  border: '1px dashed var(--border)',
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 8,
                    color: 'var(--text-secondary)',
                  }}
                >
                  SENHA GERADA
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 14,
                    color: 'var(--text-primary)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {generatedPassword || 'Será exibida após salvar'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                  Copie a senha e envie ao usuário por canal seguro.
                </div>
              </div>

              {error && <p className="mt-4 text-[12px] text-danger font-medium">⚠️ {error}</p>}

              <div className="form-actions" style={{ marginTop: 24 }}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Cadastrando...' : 'Cadastrar Leitor'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/usuarios')}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { getErrorMessage } from '../../../../shared/utils/error';
import { CategoryRepositoryImpl } from '../../infrastructure/CategoryRepositoryImpl';
import { categorySchema, type CategoryFormValues } from '../schemas/category.schema';

export function CadastroCategoriaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const repository = useMemo(() => new CategoryRepositoryImpl(), []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  useEffect(() => {
    if (!id) return;

    const loadCategory = async () => {
      try {
        const data = await repository.findById(id);
        setValue('name', data.name);
      } catch {
        setError('Erro ao carregar dados da categoria.');
      }
    };

    loadCategory();
  }, [id, repository, setValue]);

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      setLoading(true);
      setError(null);

      const payload = { name: values.name };

      if (id) {
        await repository.update(id, payload);
      } else {
        await repository.create(payload);
      }

      navigate('/categorias');
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Erro ao salvar categoria.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      <div className="page-header">
        <div className="page-header-left">
          <h1>{id ? 'Editar Categoria' : 'Cadastrar Categoria'}</h1>
          <p>{id ? 'Atualize os dados da categoria' : 'Adicione uma nova categoria ao sistema'}</p>
        </div>
        <Link to="/categorias" className="btn btn-secondary">← Voltar</Link>
      </div>

      <div style={{ maxWidth: 520 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Dados da Categoria</div>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-grid" style={{ gap: 18 }}>
                <div className="form-group">
                  <label>Nome da Categoria <span className="req">*</span></label>
                  <input
                    {...register('name')}
                    type="text"
                    placeholder="Ex: Biografia"
                    className={errors.name ? 'border-danger' : ''}
                  />
                  {errors.name && <span className="text-[11px] text-danger mt-1">{errors.name.message}</span>}
                  <div className="form-hint">Deve ser único no sistema</div>
                </div>

                <div className="form-group">
                  <label>
                    Descrição <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(opcional)</span>
                  </label>
                  <textarea
                    {...register('description')}
                    placeholder="Descreva o tipo de livros nesta categoria..."
                  />
                </div>
              </div>

              {error && (
                <div className="alert alert-warning" style={{ marginTop: 16 }}>
                  ⚠️ {error}
                </div>
              )}

              <div className="form-actions" style={{ marginTop: 24 }}>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Salvando...' : '💾 Salvar Categoria'}
                </button>
                <Link to="/categorias" className="btn btn-secondary">Cancelar</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CategoryRepositoryImpl } from '../../infrastructure/CategoryRepositoryImpl';
import { categorySchema, type CategoryFormValues } from '../schemas/category.schema';

export function CadastroCategoriaPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const repository = new CategoryRepositoryImpl();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<CategoryFormValues>({
        resolver: zodResolver(categorySchema),
    });

    useEffect(() => {
        if (id) {
            async function loadCategory() {
                try {
                    const category = await repository.findById(id!);
                    setValue('name', category.name || '');
                } catch (err: any) {
                    setError('Erro ao carregar dados da categoria.');
                }
            }
            loadCategory();
        }
    }, [id]);

    const onSubmit = async (data: CategoryFormValues) => {
        try {
            setLoading(true);
            setError(null);
            if (id) {
                await repository.update(id, data);
            } else {
                await repository.create(data);
            }
            navigate('/categorias');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao salvar categoria.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>{id ? 'Editar Categoria' : 'Nova Categoria'} 📁</h1>
                    <p>{id ? 'Atualize o nome da categoria selecionada' : 'Crie uma nova categoria para organizar seus livros'}</p>
                </div>
                <Link to="/categorias" className="btn btn-secondary">
                    ← Voltar
                </Link>
            </div>

            <div className="card max-w-[600px]">
                <div className="card-header">
                    <div className="card-title">Informações da Categoria</div>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-group">
                            <label>Nome da Categoria <span className="req">*</span></label>
                            <input
                                {...register('name')}
                                type="text"
                                placeholder="Ex: Ficção Científica, Romance, Biografia..."
                                className={errors.name ? 'border-danger' : ''}
                            />
                            {errors.name && <span className="text-[11px] text-danger mt-1">{errors.name.message}</span>}
                        </div>

                        {error && (
                            <div className="alert alert-info mt-6">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="form-actions mt-8">
                            <button type="submit" disabled={loading} className="btn btn-primary">
                                {loading ? 'Salvando...' : '💾 Salvar Categoria'}
                            </button>
                            <Link to="/categorias" className="btn btn-secondary">Cancelar</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

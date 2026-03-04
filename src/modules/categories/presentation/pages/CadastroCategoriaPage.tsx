import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CategoryRepositoryImpl } from '../../infrastructure/CategoryRepositoryImpl';

const categorySchema = z.object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

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
                    const category = await repository.findById(id);
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
        <div className="p-6 max-w-[500px] mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <Link to="/categorias" className="text-[12px] text-accent hover:underline mb-2 inline-block">
                    ← Voltar para listagem
                </Link>
                <h1 className="text-[24px] font-extrabold text-white tracking-tight">
                    {id ? 'Editar Categoria' : 'Nova Categoria'} 🏷️
                </h1>
            </div>

            <div className="bg-surface border border-border rounded-lg p-8 shadow-xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-semibold text-text-primary tracking-wide">Nome da Categoria</label>
                        <input
                            {...register('name')}
                            type="text"
                            placeholder="Ex: Fantasia, Tecnologia, Drama..."
                            className={`p-2.5 bg-surface-2 border border-border rounded-sm text-[13.5px] w-full outline-none focus:border-accent transition-all ${errors.name ? 'border-danger' : ''}`}
                        />
                        {errors.name && <span className="text-[11px] text-danger font-medium">{errors.name.message}</span>}
                    </div>

                    {error && (
                        <div className="bg-danger-soft border border-danger/20 text-danger p-3 rounded-sm text-[13px] font-medium">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
                        <Link to="/categorias" className="text-[13px] font-bold text-text-muted hover:text-white transition-colors">Cancelar</Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-accent text-[#0f1117] px-8 py-2.5 rounded-sm font-bold text-[14px] hover:bg-accent-dark transition-all shadow-[0_4px_12px_rgba(232,168,56,0.3)] disabled:opacity-50"
                        >
                            {loading ? 'Salvando...' : (id ? 'Atualizar' : 'Salvar Categoria')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

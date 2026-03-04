import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AuthorRepositoryImpl } from '../../infrastructure/AuthorRepositoryImpl';

import { authorSchema, type AuthorFormValues } from '../schemas/author.schema';

export function CadastroAutorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const repository = new AuthorRepositoryImpl();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<AuthorFormValues>({
        resolver: zodResolver(authorSchema),
    });

    useEffect(() => {
        if (id) {
            async function loadAuthor() {
                try {
                    const author = await repository.findById(id);
                    setValue('name', author.name || '');
                    setValue('biography', author.biography || '');
                } catch (err: any) {
                    setError('Erro ao carregar dados do autor.');
                }
            }
            loadAuthor();
        }
    }, [id]);

    const onSubmit = async (data: AuthorFormValues) => {
        try {
            setLoading(true);
            setError(null);
            if (id) {
                await repository.update(id, data);
            } else {
                await repository.create(data);
            }
            navigate('/autores');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao salvar autor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="page-header">
                <div className="page-header-left">
                    <h1>{id ? 'Editar Autor' : 'Cadastrar Autor'} ✍️</h1>
                    <p>{id ? 'Atualize os dados e biografia do autor' : 'Adicione um novo autor ao catálogo da biblioteca'}</p>
                </div>
                <Link to="/autores" className="btn btn-secondary">
                    ← Voltar
                </Link>
            </div>

            <div className="card max-w-[800px]">
                <div className="card-header">
                    <div className="card-title">Informações do Autor</div>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="form-grid">
                            <div className="form-group span-2">
                                <label>Nome Completo <span className="req">*</span></label>
                                <input
                                    {...register('name')}
                                    type="text"
                                    placeholder="Ex: Machado de Assis"
                                    className={errors.name ? 'border-danger' : ''}
                                />
                                {errors.name && <span className="text-[11px] text-danger mt-1">{errors.name.message}</span>}
                            </div>

                            <div className="form-group span-2">
                                <label>Biografia (Opcional)</label>
                                <textarea
                                    {...register('biography')}
                                    rows={6}
                                    placeholder="Escreva uma breve biografia ou curiosidades sobre o autor..."
                                    className="resize-none"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="alert alert-info mt-6">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="form-actions mt-8">
                            <button type="submit" disabled={loading} className="btn btn-primary">
                                {loading ? 'Salvando...' : '💾 Salvar Autor'}
                            </button>
                            <Link to="/autores" className="btn btn-secondary">Cancelar</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

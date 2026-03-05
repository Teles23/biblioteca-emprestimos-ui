import { useNavigate, Link } from 'react-router-dom';
import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getErrorMessage } from '../../../../shared/utils/error';
import { UserRepositoryImpl } from '../../infrastructure/UserRepositoryImpl';

import { userSchema, type UserFormValues } from '../schemas/user.schema';

export function CadastroUsuarioPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const repository = useMemo(() => new UserRepositoryImpl(), []);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            isAdmin: false,
        }
    });

    const onSubmit = async (values: UserFormValues) => {
        try {
            setLoading(true);
            setError(null);

            const roles = ['ROLE_USER'];
            if (values.isAdmin) roles.push('ROLE_ADMIN');

            await repository.create({
                name: values.name,
                email: values.email,
                phone: values.phone,
                roles: roles
            });

            navigate('/usuarios');
        } catch (err: unknown) {
            setError(getErrorMessage(err, 'Erro ao salvar usuário.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-[600px] mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8">
                <Link to="/usuarios" className="text-[12px] text-accent hover:underline mb-2 inline-block">
                    ← Voltar para listagem
                </Link>
                <h1 className="text-[24px] font-extrabold text-white tracking-tight">
                    Novo Usuário / Leitor 👤
                </h1>
            </div>

            <div className="bg-surface border border-border rounded-lg p-8 shadow-xl">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-semibold text-text-primary tracking-wide">Nome Completo</label>
                        <input
                            {...register('name')}
                            type="text"
                            placeholder="Ex: João da Silva"
                            className={`p-2.5 bg-surface-2 border border-border rounded-sm text-[13.5px] w-full outline-none focus:border-accent transition-all ${errors.name ? 'border-danger' : ''}`}
                        />
                        {errors.name && <span className="text-[11px] text-danger font-medium">{errors.name.message}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-semibold text-text-primary tracking-wide">E-mail</label>
                        <input
                            {...register('email')}
                            type="email"
                            placeholder="joao@email.com"
                            className={`p-2.5 bg-surface-2 border border-border rounded-sm text-[13.5px] w-full outline-none focus:border-accent transition-all ${errors.email ? 'border-danger' : ''}`}
                        />
                        {errors.email && <span className="text-[11px] text-danger font-medium">{errors.email.message}</span>}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-semibold text-text-primary tracking-wide">Telefone (Opcional)</label>
                        <input
                            {...register('phone')}
                            type="text"
                            placeholder="(11) 99999-9999"
                            className="p-2.5 bg-surface-2 border border-border rounded-sm text-[13.5px] w-full outline-none focus:border-accent transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-surface-2 border border-border rounded-sm">
                        <input
                            {...register('isAdmin')}
                            type="checkbox"
                            id="isAdmin"
                            className="w-4 h-4 accent-accent cursor-pointer"
                        />
                        <label htmlFor="isAdmin" className="text-[13px] text-white cursor-pointer select-none">
                            Conceder permissões de <span className="text-accent font-bold">Administrador</span>
                        </label>
                    </div>

                    {error && (
                        <div className="bg-danger-soft border border-danger/20 text-danger p-3 rounded-sm text-[13px] font-medium">
                            ⚠️ {error}
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
                        <Link to="/usuarios" className="text-[13px] font-bold text-text-muted hover:text-white transition-colors">Cancelar</Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-accent text-[#0f1117] px-8 py-2.5 rounded-sm font-bold text-[14px] hover:bg-accent-dark transition-all shadow-[0_4px_12px_rgba(232,168,56,0.3)] disabled:opacity-50"
                        >
                            {loading ? 'Cadastrando...' : 'Cadastrar Usuário'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

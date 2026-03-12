import { type Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { AuthorRepositoryImpl } from "../../infrastructure/AuthorRepositoryImpl";
import { getErrorMessage } from "../../../../shared/utils/error";
import { useToast } from "../../../../shared/ui/useToast";

import { authorSchema, type AuthorFormValues } from "../schemas/author.schema";

export function CadastroAutorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = useMemo(() => new AuthorRepositoryImpl(), []);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AuthorFormValues>({
    resolver: zodResolver(authorSchema) as Resolver<AuthorFormValues>,
  });

  useEffect(() => {
    if (id) {
      const loadAuthor = async () => {
        try {
          const data = await repository.findById(id);
          setValue("name", data.name);
          setValue("biography", data.biography || "");
          setValue("birthYear", data.birthYear || undefined);
          setValue("deathYear", data.deathYear || undefined);
          setValue("nationality", data.nationality || "");
          setValue("referenceSite", data.referenceSite || "");
        } catch {
          setError("Erro ao carregar dados do autor.");
        }
      };
      loadAuthor();
    }
  }, [id, repository, setValue]);

  const onSubmit = async (data: AuthorFormValues) => {
    try {
      setLoading(true);
      setError(null);
      if (id) {
        await repository.update(id, data);
      } else {
        await repository.create(data);
      }
      toast.success(
        id ? "Autor atualizado com sucesso." : "Autor cadastrado com sucesso.",
      );
      navigate("/autores");
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Erro ao salvar.");
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
          <h1>{id ? "Editar Autor" : "Cadastrar Autor"} ✍️</h1>
          <p>
            {id
              ? "Atualize os dados e biografia do autor"
              : "Adicione um novo autor ao catálogo da biblioteca"}
          </p>
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
                <label>
                  Nome Completo <span className="req">*</span>
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Ex: Machado de Assis"
                  className={errors.name ? "border-danger" : ""}
                />
                {errors.name && (
                  <span className="text-[11px] text-danger mt-1">
                    {errors.name.message}
                  </span>
                )}
              </div>

              <div className="form-grid form-grid-2 span-2">
                <div className="form-group">
                  <label>Ano de Nascimento</label>
                  <input
                    {...register("birthYear", { valueAsNumber: true })}
                    type="number"
                    placeholder="AAAA"
                    className={errors.birthYear ? "border-danger" : ""}
                  />
                  {errors.birthYear && (
                    <span className="text-[11px] text-danger mt-1">
                      {errors.birthYear.message}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label>Ano de Falecimento</label>
                  <input
                    {...register("deathYear", { valueAsNumber: true })}
                    type="number"
                    placeholder="AAAA ou deixe vazio"
                    className={errors.deathYear ? "border-danger" : ""}
                  />
                  {errors.deathYear && (
                    <span className="text-[11px] text-danger mt-1">
                      {errors.deathYear.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group span-2">
                <label>Nacionalidade</label>
                <input
                  {...register("nationality")}
                  type="text"
                  placeholder="Ex: Brasileiro"
                  className={errors.nationality ? "border-danger" : ""}
                />
              </div>

              <div className="form-group span-2">
                <label>Biografia (Opcional)</label>
                <textarea
                  {...register("biography")}
                  rows={6}
                  placeholder="Escreva uma breve biografia ou curiosidades sobre o autor..."
                  className="resize-none"
                />
              </div>

              <div className="form-group span-2">
                <label>Site de Referência</label>
                <input
                  {...register("referenceSite")}
                  type="url"
                  placeholder="https://..."
                  className={errors.referenceSite ? "border-danger" : ""}
                />
                {errors.referenceSite && (
                  <span className="text-[11px] text-danger mt-1">
                    {errors.referenceSite.message}
                  </span>
                )}
              </div>
            </div>

            {error && (
              <p className="mt-4 text-[12px] text-danger font-medium">
                ⚠️ {error}
              </p>
            )}

            <div className="form-actions mt-8">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? "Salvando..." : "💾 Salvar Autor"}
              </button>
              <Link to="/autores" className="btn btn-secondary">
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

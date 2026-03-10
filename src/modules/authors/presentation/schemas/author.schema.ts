import * as z from "zod";

export const authorSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  biography: z.string().optional(),
  birthYear: z
    .union([z.number().int().min(1000).max(2100), z.literal("")])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  deathYear: z
    .union([z.number().int().min(1000).max(2100), z.literal("")])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  nationality: z.string().optional(),
  referenceSite: z
    .union([z.string().url("URL inválida"), z.literal("")])
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
});

export type AuthorFormValues = z.infer<typeof authorSchema>;

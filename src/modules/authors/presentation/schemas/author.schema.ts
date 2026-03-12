import * as z from "zod";

const optionalYear = z.preprocess(
  (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
  z.number().int().min(1000).max(2100).optional(),
) as z.ZodType<number | undefined>;

const optionalUrl = z.preprocess(
  (val) => (val === "" || val === null || val === undefined ? undefined : val),
  z.string().url("URL invÃ¡lida").optional(),
) as z.ZodType<string | undefined>;

export const authorSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mÃ­nimo 3 caracteres"),
  biography: z.string().optional(),
  birthYear: optionalYear,
  deathYear: optionalYear,
  nationality: z.string().optional(),
  referenceSite: optionalUrl,
});

export type AuthorFormValues = z.infer<typeof authorSchema>;

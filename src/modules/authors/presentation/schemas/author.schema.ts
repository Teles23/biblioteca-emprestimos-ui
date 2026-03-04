import * as z from 'zod';

export const authorSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    biography: z.string().optional(),
});

export type AuthorFormValues = z.infer<typeof authorSchema>;

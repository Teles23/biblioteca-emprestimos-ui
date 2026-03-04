import * as z from 'zod';

export const categorySchema = z.object({
    name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

import * as z from 'zod';

export const bookSchema = z.object({
    title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
    publicationYear: z.number()
        .min(1500, 'Ano inválido')
        .max(new Date().getFullYear() + 1, 'Ano futuro não permitido'),
    categoryId: z.string().min(1, 'Selecione uma categoria'),
    authorIds: z.array(z.string()).min(1, 'Selecione pelo menos um autor'),
});

export type BookFormValues = z.infer<typeof bookSchema>;

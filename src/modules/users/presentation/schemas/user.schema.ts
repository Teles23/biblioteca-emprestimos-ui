import * as z from 'zod';

export const userSchema = z.object({
    name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
    email: z.string().email('E-mail inválido'),
    phone: z.string().optional(),
    isAdmin: z.boolean(),
});

export type UserFormValues = z.infer<typeof userSchema>;

import * as z from 'zod';

export const loginCredentialsSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export type LoginCredentials = z.infer<typeof loginCredentialsSchema>;

export const registerCredentialsSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(8),
});

export type RegisterCredentials = z.infer<typeof registerCredentialsSchema>;

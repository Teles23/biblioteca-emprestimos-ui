import * as z from 'zod';

export const loanSchema = z.object({
    bookId: z.string().min(1, 'Selecione um livro'),
    userId: z.string().min(1, 'Selecione um leitor'),
});

export type LoanFormValues = z.infer<typeof loanSchema>;

import type { Book } from '../../../../shared/types';

export interface CreateBookDTO {
    title: string;
    publicationYear: number;
    categoryId: string;
    authorIds: string[];
}

export type UpdateBookDTO = Partial<CreateBookDTO>;

export interface IBookRepository {
    list(): Promise<Book[]>;
    findById(id: string): Promise<Book>;
    create(data: CreateBookDTO): Promise<Book>;
    update(id: string, data: UpdateBookDTO): Promise<Book>;
    delete(id: string): Promise<void>;
}

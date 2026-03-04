export interface User {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    roles: string[];
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt: string;
}

export interface LoginResponse {
    accessToken: string;
    user: {
        id: string;
        email: string;
        roles: string[];
        name?: string;
    };
}

export interface Author {
    id: string;
    name: string;
    biography: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Book {
    id: string;
    title: string;
    publicationYear: number;
    categoryId: string;
    status: 'AVAILABLE' | 'BORROWED';
    authors: Author[];
    category?: Category;
    createdAt: string;
    updatedAt: string;
}

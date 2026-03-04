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

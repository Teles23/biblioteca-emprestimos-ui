export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  roles: string[];
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
  _count?: {
    loans: number;
  };
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
  birthYear: number | null;
  deathYear: number | null;
  nationality: string | null;
  referenceSite: string | null;
  books?: Book[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface Loan {
  id: string;
  bookId: string;
  userId: string;
  loanDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "ACTIVE" | "RETURNED" | "OVERDUE";
  lateDays: number;
  book?: { id: string; title: string; category?: { name: string } };
  user?: { id: string; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface Book {
  id: string;
  title: string;
  synopsis: string | null;
  pages: number | null;
  publisher: string | null;
  coverUrl: string | null;
  publicationYear: number;
  categoryId: string;
  status: "AVAILABLE" | "BORROWED";
  authors: Author[];
  category?: Category;
  createdAt: string;
  updatedAt: string;
}

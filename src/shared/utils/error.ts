interface ApiErrorResponse {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export function getErrorMessage(err: unknown, fallback = 'Erro inesperado'): string {
    if (err instanceof Error) {
        const apiError = err as Error & ApiErrorResponse;
        return apiError.response?.data?.message || err.message;
    }
    if (typeof err === 'string') return err;
    return fallback;
}

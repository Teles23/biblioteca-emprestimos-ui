import { describe, it, expect, vi } from 'vitest';
import { AuthRepositoryImpl } from './AuthRepositoryImpl';
import { httpClient } from '../../../shared/infra/httpClient';

vi.mock('../../../shared/infra/httpClient');

describe('AuthRepositoryImpl', () => {
    const repository = new AuthRepositoryImpl();

    it('should call login endpoint with correct credentials', async () => {
        const credentials = { email: 'test@test.com', password: 'password' };
        const mockResponse = { data: { accessToken: 'token', user: { id: '1', email: 'test@test.com', roles: ['ROLE_USER'] } } };

        vi.mocked(httpClient.post).mockResolvedValueOnce(mockResponse);

        const result = await repository.login(credentials);

        expect(httpClient.post).toHaveBeenCalledWith('/auth/login', credentials);
        expect(result).toEqual(mockResponse.data);
    });

    it('should call register endpoint with correct data', async () => {
        const credentials = { name: 'Test', email: 'test@test.com', password: 'password' };
        const mockResponse = { data: { id: '1' } };

        vi.mocked(httpClient.post).mockResolvedValueOnce(mockResponse);

        const result = await repository.register(credentials);

        expect(httpClient.post).toHaveBeenCalledWith('/auth/register', credentials);
        expect(result).toEqual(mockResponse.data);
    });
});

import { describe, it, expect, vi, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { apiFetch } from '@/shared/api/fetcher';
import { server } from '../../mocks/server';
import { mockHandlers } from '../../mocks/handlers';
import { SignInResponse } from '@/features/auth';

describe('apiFetch', () => {
  afterEach(() => {
    server.resetHandlers();
  });

  describe('Success Cases', () => {
    it('should return data on successful 200 response', async () => {
      const result = await apiFetch<SignInResponse>(
        '/api/users/login',
        {
          method: 'POST',
          body: JSON.stringify({ email: 'test@test.com', password: 'password' }),
        }
      );

      expect(result).toBeDefined();
      expect(result.accessToken).toBe('mock-access-token-123');
    });
  });

  describe('Error Handling - Status Codes', () => {
    it('should throw error on 400 (Bad Request)', async () => {
      server.use(mockHandlers.auth.signInValidationError);

      await expect(
        apiFetch('/api/users/login', { method: 'POST', body: '{}' })
      ).rejects.toThrow();
    });

    it('should throw error on 401 without A003 code', async () => {
      server.use(mockHandlers.auth.signInPasswordMismatch);

      try {
        await apiFetch('/api/users/login', { method: 'POST', body: '{}' });
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.response?.status).toBe(401);
        expect(error.response?.code).toBe('U003');
      }
    });

    it('should handle 401 with A003 code (token expiration)', async () => {
      server.use(mockHandlers.auth.tokenExpired);

      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      try {
        await apiFetch('/api/users/login', { method: 'POST', body: '{}' });
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.response?.code).toBe('A003');
        expect(error.response?.status).toBe(401);
        expect(alertSpy).toHaveBeenCalledWith('인증이 만료되었습니다. 다시 로그인해주세요.');
      }

      alertSpy.mockRestore();
    });

    it('should throw error on 404 (Not Found)', async () => {
      server.use(mockHandlers.auth.signInNotFound);

      try {
        await apiFetch('/api/users/login', { method: 'POST', body: '{}' });
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.response?.status).toBe(404);
      }
    });

    it('should throw error on 500 (Server Error)', async () => {
      server.use(mockHandlers.course.fetchCoursesError);

      try {
        await apiFetch('/api/courses');
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.response?.status).toBe(500);
      }
    });
  });

  describe('Error Response Parsing', () => {
    it('should include error code in thrown error response', async () => {
      server.use(mockHandlers.auth.signInNotFound);

      try {
        await apiFetch('/api/users/login', { method: 'POST', body: '{}' });
      } catch (error: any) {
        expect(error.response?.code).toBe('U002');
        expect(error.response?.message).toBe('사용자를 찾을 수 없습니다');
      }
    });
  });

  describe('Configuration Validation', () => {
    it('should throw error when NEXT_PUBLIC_API_BASE_URL is not set', async () => {
      const originalEnv = process.env.NEXT_PUBLIC_API_BASE_URL;
      delete process.env.NEXT_PUBLIC_API_BASE_URL;

      // Mock fetch to prevent actual network call
      const fetchSpy = vi.spyOn(global, 'fetch' as any).mockRejectedValueOnce(
        new Error('NEXT_PUBLIC_API_BASE_URL is not set')
      );

      try {
        await apiFetch('/api/test');
        expect.fail('Should have thrown error');
      } catch (error: any) {
        expect(error.message).toContain('NEXT_PUBLIC_API_BASE_URL');
      } finally {
        process.env.NEXT_PUBLIC_API_BASE_URL = originalEnv;
        fetchSpy.mockRestore();
      }
    });
  });
});


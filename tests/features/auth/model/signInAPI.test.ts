import { describe, it, expect, beforeEach } from 'vitest';
import { signIn } from '@/features/auth/model/signInAPI';
import { ApiError } from '@/shared/lib';
import { server } from '../../../mocks/server';
import { mockHandlers } from '../../../mocks/handlers';

describe('signInAPI', () => {
  beforeEach(() => {
    server.resetHandlers();
  });

  describe('Success Cases', () => {
    it('should return user data and access token on successful login', async () => {
      server.use(mockHandlers.auth.signInSuccess);

      const result = await signIn({
        email: 'student@example.com',
        password: 'password123',
      });

      expect(result.accessToken).toBe('mock-access-token-123');
      expect(result.user.email).toBe('student@example.com');
      expect(result.user.role).toBe('STUDENT');
    });
  });

  describe('API Error Handling - Field Errors', () => {
    it('should throw ApiError with U002 code when user not found', async () => {
      server.use(mockHandlers.auth.signInNotFound);

      try {
        await signIn({
          email: 'notfound@example.com',
          password: 'password123',
        });
        expect.fail('Should have thrown ApiError');
      } catch (error) {
        expect(error instanceof ApiError).toBe(true);
        if (error instanceof ApiError) {
          expect(error.code).toBe('U002');
          expect(error.message).toBe('사용자를 찾을 수 없습니다');
          expect(error.fieldErrors?.email).toBe('사용자를 찾을 수 없습니다');
        }
      }
    });

    it('should throw ApiError with U003 code when password does not match', async () => {
      server.use(mockHandlers.auth.signInPasswordMismatch);

      try {
        await signIn({
          email: 'student@example.com',
          password: 'wrongpassword',
        });
        expect.fail('Should have thrown ApiError');
      } catch (error) {
        expect(error instanceof ApiError).toBe(true);
        if (error instanceof ApiError) {
          expect(error.code).toBe('U003');
          expect(error.message).toBe('비밀번호가 일치하지 않습니다');
          expect(error.fieldErrors?.password).toBe('비밀번호가 일치하지 않습니다');
        }
      }
    });

    it('should throw ApiError with G001 code for validation errors', async () => {
      server.use(mockHandlers.auth.signInValidationError);

      try {
        await signIn({
          email: 'invalid-email',
          password: 'password',
        });
        expect.fail('Should have thrown ApiError');
      } catch (error) {
        expect(error instanceof ApiError).toBe(true);
        if (error instanceof ApiError) {
          expect(error.code).toBe('G001');
          expect(error.message).toContain('이메일');
        }
      }
    });
  });

  describe('Error Response Structure', () => {
    it('should have correct status code in error', async () => {
      server.use(mockHandlers.auth.signInNotFound);

      try {
        await signIn({
          email: 'notfound@example.com',
          password: 'password123',
        });
      } catch (error) {
        if (error instanceof ApiError) {
          expect(error.status).toBe(404);
        }
      }
    });
  });
});

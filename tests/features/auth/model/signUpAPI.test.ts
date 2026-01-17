import { describe, it, expect } from 'vitest';
import { signUp } from '@/features/auth/model/signUpAPI';
import { ApiError } from '@/shared/lib';
import { server } from '../../../mocks/server';
import { mockHandlers } from '../../../mocks/handlers';

describe('signUpAPI', () => {
  describe('Success Cases', () => {
    it('should return new user data on successful signup', async () => {
      const result = await signUp({
        email: 'newuser@example.com',
        password: 'password123',
        name: '새 사용자',
        phone: '010-1111-1111',
        role: 'STUDENT',
      });

      expect(result.email).toBe('newuser@example.com');
      expect(result.name).toBe('새 사용자');
      expect(result.role).toBe('STUDENT');
    });
  });

  describe('API Error Handling - Email Duplicate', () => {
    it('should throw ApiError with U001 code when email already exists', async () => {
      server.use(mockHandlers.auth.signUpEmailDuplicate);

      try {
        await signUp({
          email: 'existing@example.com',
          password: 'password123',
          name: '사용자',
          phone: '010-0000-0000',
          role: 'STUDENT',
        });
        expect.fail('Should have thrown ApiError');
      } catch (error) {
        expect(error instanceof ApiError).toBe(true);
        if (error instanceof ApiError) {
          expect(error.code).toBe('U001');
          expect(error.message).toBe('이미 사용 중인 이메일입니다');
          expect(error.fieldErrors?.email).toBe('이미 사용 중인 이메일입니다');
        }
      }
    });
  });

  describe('API Error Handling - Validation Errors', () => {
    it('should throw ApiError with G001 code for validation errors', async () => {
      server.use(mockHandlers.auth.signUpValidationError);

      try {
        await signUp({
          email: 'user@example.com',
          password: 'short',
          name: '사용자',
          phone: '010-0000-0000',
          role: 'STUDENT',
        });
        expect.fail('Should have thrown ApiError');
      } catch (error) {
        expect(error instanceof ApiError).toBe(true);
        if (error instanceof ApiError) {
          expect(error.code).toBe('G001');
        }
      }
    });
  });

  describe('Error Response Structure', () => {
    it('should have correct status code in error', async () => {
      server.use(mockHandlers.auth.signUpEmailDuplicate);

      try {
        await signUp({
          email: 'existing@example.com',
          password: 'password123',
          name: '사용자',
          phone: '010-0000-0000',
          role: 'STUDENT',
        });
      } catch (error) {
        if (error instanceof ApiError) {
          expect(error.status).toBe(409);
        }
      }
    });
  });
});

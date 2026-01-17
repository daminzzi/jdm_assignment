import { describe, it, expect } from 'vitest';
import { parseApiError } from '@/shared/lib/errors/errorMessages';
import { extractAuthFieldFromMessage } from '@/features/auth/model/authErrors';

describe('parseApiError', () => {
  describe('Single Error Object', () => {
    it('should extract field from single error object with custom extractor', () => {
      const errorResponse = {
        code: 'U002',
        message: '사용자를 찾을 수 없습니다',
      };

      const fieldErrors = parseApiError(errorResponse, extractAuthFieldFromMessage);

      expect(fieldErrors.email).toBe('사용자를 찾을 수 없습니다');
      expect(Object.keys(fieldErrors).length).toBe(1);
    });

    it('should return empty object when extractor returns null', () => {
      const errorResponse = {
        code: 'UNKNOWN',
        message: '알 수 없는 에러',
      };

      const fieldErrors = parseApiError(errorResponse, extractAuthFieldFromMessage);

      expect(Object.keys(fieldErrors).length).toBe(0);
    });
  });

  describe('Error Array', () => {
    it('should extract fields from array of errors', () => {
      const errorResponse = [
        { code: 'U002', message: '사용자를 찾을 수 없습니다' },
        { code: 'U003', message: '비밀번호가 일치하지 않습니다' },
      ];

      const fieldErrors = parseApiError(errorResponse, extractAuthFieldFromMessage);

      expect(fieldErrors.email).toBe('사용자를 찾을 수 없습니다');
      expect(fieldErrors.password).toBe('비밀번호가 일치하지 않습니다');
    });

    it('should handle multiple errors with same field code', () => {
      const errorResponse = [
        { code: 'U001', message: '이미 사용 중인 이메일입니다' },
      ];

      const fieldErrors = parseApiError(errorResponse, extractAuthFieldFromMessage);

      expect(fieldErrors.email).toBe('이미 사용 중인 이메일입니다');
    });
  });

  describe('Without Custom Extractor', () => {
    it('should return empty object without extractor', () => {
      const errorResponse = {
        code: 'U002',
        message: '사용자를 찾을 수 없습니다',
      };

      const fieldErrors = parseApiError(errorResponse);

      expect(Object.keys(fieldErrors).length).toBe(0);
    });
  });

  describe('Default Values', () => {
    it('should use default message when not provided', () => {
      const errorResponse = {
        code: 'G001',
      };

      const fieldErrors = parseApiError(errorResponse, extractAuthFieldFromMessage);

      expect(Object.keys(fieldErrors).length).toBe(0);
    });

    it('should use default code when not provided', () => {
      const errorResponse = {
        message: '에러 메시지',
      };

      const fieldErrors = parseApiError(errorResponse);

      expect(Object.keys(fieldErrors).length).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle non-object error response', () => {
      const errorResponse = 'string error';

      const fieldErrors = parseApiError(errorResponse);

      expect(Object.keys(fieldErrors).length).toBe(0);
    });

    it('should handle null error response', () => {
      const errorResponse = null;

      const fieldErrors = parseApiError(errorResponse);
      
      expect(Object.keys(fieldErrors).length).toBe(0);
    });
  });
});

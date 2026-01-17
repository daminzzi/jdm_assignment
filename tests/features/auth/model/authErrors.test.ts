import { describe, it, expect } from 'vitest';
import { extractAuthFieldFromMessage } from '@/features/auth/model/authErrors';

describe('extractAuthFieldFromMessage', () => {
  describe('Code: U001 (Email Duplicate)', () => {
    it('should return "email" for U001 code', () => {
      const field = extractAuthFieldFromMessage('이미 사용 중인 이메일입니다', 'U001');
      expect(field).toBe('email');
    });
  });

  describe('Code: U002 (User Not Found)', () => {
    it('should return "email" for U002 code', () => {
      const field = extractAuthFieldFromMessage('사용자를 찾을 수 없습니다', 'U002');
      expect(field).toBe('email');
    });
  });

  describe('Code: U003 (Password Mismatch)', () => {
    it('should return "password" for U003 code', () => {
      const field = extractAuthFieldFromMessage('비밀번호가 일치하지 않습니다', 'U003');
      expect(field).toBe('password');
    });
  });

  describe('Code: G001 (Validation Error)', () => {
    it('should extract "email" field from G001 message containing "이메일"', () => {
      const field = extractAuthFieldFromMessage('이메일 형식이 올바르지 않습니다', 'G001');
      expect(field).toBe('email');
    });

    it('should extract "password" field from G001 message containing "비밀번호"', () => {
      const field = extractAuthFieldFromMessage('비밀번호는 최소 8자 이상이어야 합니다', 'G001');
      expect(field).toBe('password');
    });

    it('should extract "name" field from G001 message containing "이름"', () => {
      const field = extractAuthFieldFromMessage('이름을 입력해주세요', 'G001');
      expect(field).toBe('name');
    });

    it('should extract "phone" field from G001 message containing "휴대폰"', () => {
      const field = extractAuthFieldFromMessage('휴대폰 번호가 올바르지 않습니다', 'G001');
      expect(field).toBe('phone');
    });

    it('should extract "role" field from G001 message containing "회원"', () => {
      const field = extractAuthFieldFromMessage('회원 유형을 선택해주세요', 'G001');
      expect(field).toBe('role');
    });
  });

  describe('Unknown Code', () => {
    it('should return null for unknown code', () => {
      const field = extractAuthFieldFromMessage('어떤 에러 메시지', 'UNKNOWN_CODE');
      expect(field).toBeNull();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty message', () => {
      const field = extractAuthFieldFromMessage('', 'G001');
      expect(field).toBeNull();
    });

    it('should handle case-sensitive matching for G001 keywords', () => {
      const field = extractAuthFieldFromMessage('INVALID EMAIL FORMAT', 'G001');
      expect(field).toBeNull();
    });
  });
});

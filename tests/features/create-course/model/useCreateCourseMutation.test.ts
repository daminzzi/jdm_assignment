import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCreateCourseMutation } from '@/features/create-course/model/useCreateCourseMutation';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { server } from '../../../mocks/server';
import { mockHandlers } from '../../../mocks/handlers';

describe('useCreateCourseMutation', () => {
  let queryClient: QueryClient;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
        queries: { retry: false },
      },
    });
      
    wrapper = ({ children }) => 
    React.createElement(QueryClientProvider, { client: queryClient }, children);
    vi.clearAllMocks();
    server.resetHandlers();

    // Set auth token
    useAuthStore.setState({
      accessToken: 'mock-token-123',
      user: {
        id: 1,
        email: 'instructor@example.com',
        name: '강사',
        phone: '010-0000-0000',
        role: 'INSTRUCTOR',
      },
      isAuthenticated: true,
      role: 'instructor',
    });
  });

  describe('Success Cases', () => {
    it('should successfully create a course', async () => {
      const { result } = renderHook(() => useCreateCourseMutation(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          title: '새 강의',
          instructorName: '강사',
          maxStudents: 50,
          price: 100000,
          description: '강의 설명',
        });
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
        expect(result.current.data?.title).toBe('새 강의');
      });
    });

    it('should invalidate courses cache on success', async () => {
      const { result } = renderHook(() => useCreateCourseMutation(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      await act(async () => {
        await result.current.mutateAsync({
          title: '새 강의',
          instructorName: '강사',
          maxStudents: 50,
          price: 100000,
        });
      });

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['courses'] });
      invalidateSpy.mockRestore();
    });
  });

  describe('Error Handling - Missing Access Token', () => {
    it('should throw error when access token is missing', async () => {
      useAuthStore.setState({ accessToken: null });

      const { result } = renderHook(() => useCreateCourseMutation(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync({
          title: '새 강의',
          instructorName: '강사',
          maxStudents: 50,
          price: 100000,
        }).catch(() => {
          // Error is expected, caught here
        });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
        expect((result.current.error as Error)?.message).toBe('인증이 필요합니다');
      });
    });
  });

  describe('Error Handling - Authorization Error (403)', () => {
    it('should handle 403 C003 error (permission denied)', async () => {
      server.use(mockHandlers.course.createCourseForbidden);

      const { result } = renderHook(() => useCreateCourseMutation(), { wrapper });

      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      await act(async () => {
        await result.current.mutateAsync({
          title: '새 강의',
          instructorName: '강사',
          maxStudents: 50,
          price: 100000,
        }).catch(() => {
          // Error expected
        });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      
      alertSpy.mockRestore();
    });
  });

  describe('Error Handling - Authentication Error (401)', () => {
    it('should handle 401 A003 error (token expired)', async () => {
      server.use(mockHandlers.course.createCourseUnauthorized);

      const { result } = renderHook(() => useCreateCourseMutation(), { wrapper });

      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      await act(async () => {
        await result.current.mutateAsync({
          title: '새 강의',
          instructorName: '강사',
          maxStudents: 50,
          price: 100000,
        }).catch(() => {
          // Error expected
        });
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      
      alertSpy.mockRestore();
    });
  });
});

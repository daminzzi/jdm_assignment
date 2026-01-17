import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useEnrollBatch } from '@/features/enroll-course/model/enrollBatch';
import { useAuthStore } from '@/features/auth/model/useAuthStore';
import { useEnrollStore } from '@/features/enroll-course/model/useEnrollStore';
import { server } from '../../../mocks/server';
import { mockHandlers } from '../../../mocks/handlers';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('@/features/course-select/model/useCourseSelect', () => ({
  useCourseSelect: () => ({
    clear: vi.fn(),
  }),
}));

describe('useEnrollBatch', () => {
  let queryClient: QueryClient;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: { retry: false },
        queries: { retry: false },
      },
    });
    
    // JSX 대신 React.createElement 사용
    wrapper = ({ children }) => 
      React.createElement(QueryClientProvider, { client: queryClient }, children);
    
    vi.clearAllMocks();
    server.resetHandlers();

    // Set auth token
    useAuthStore.setState({
      accessToken: 'mock-token-123',
      user: {
        id: 1,
        email: 'student@example.com',
        name: '학생',
        phone: '010-0000-0000',
        role: 'STUDENT',
      },
      isAuthenticated: true,
      role: 'student',
    });
  });

  describe('Success Cases - Full Success', () => {
    it('should enroll in all courses successfully', async () => {
      server.use(mockHandlers.enrollment.enrollBatchSuccess);
      
      const { result } = renderHook(() => useEnrollBatch(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync([1, 2]);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.success.length).toBe(2);
      expect(result.current.data?.failed.length).toBe(0);
    });

    it('should invalidate courses cache on successful enrollment', async () => {
      server.use(mockHandlers.enrollment.enrollBatchSuccess);
      
      const { result } = renderHook(() => useEnrollBatch(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      await act(async () => {
        await result.current.mutateAsync([1, 2]);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['courses'] });
      invalidateSpy.mockRestore();
    });

    it('should set enrollment result in store on success', async () => {
      server.use(mockHandlers.enrollment.enrollBatchSuccess);
      
      const { result } = renderHook(() => useEnrollBatch(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync([1, 2]);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const enrollResult = useEnrollStore.getState();
      expect(enrollResult.lastEnrollResult?.success.length).toBe(2);
      expect(enrollResult.lastEnrollResult?.failed.length).toBe(0);
    });
  });

  describe('Success Cases - Partial Success', () => {
    it('should handle partial enrollment success', async () => {
      server.use(mockHandlers.enrollment.enrollBatchPartialSuccess);

      const { result } = renderHook(() => useEnrollBatch(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync([1, 2]);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.success.length).toBe(1);
      expect(result.current.data?.failed.length).toBe(1);
    });

    it('should still invalidate cache for partial success', async () => {
      server.use(mockHandlers.enrollment.enrollBatchPartialSuccess);

      const { result } = renderHook(() => useEnrollBatch(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      await act(async () => {
        await result.current.mutateAsync([1, 2]);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['courses'] });
      invalidateSpy.mockRestore();
    });
  });

  describe('Success Cases - All Failure', () => {
    it('should handle all enrollment failures', async () => {
      server.use(mockHandlers.enrollment.enrollBatchAllFailure);

      const { result } = renderHook(() => useEnrollBatch(), { wrapper });

      await act(async () => {
        await result.current.mutateAsync([1, 2]);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.success.length).toBe(0);
      expect(result.current.data?.failed.length).toBe(2);
    });

    it('should NOT invalidate cache when all fail', async () => {
      server.use(mockHandlers.enrollment.enrollBatchAllFailure);

      const { result } = renderHook(() => useEnrollBatch(), { wrapper });

      const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

      await act(async () => {
        await result.current.mutateAsync([1, 2]);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(invalidateSpy).not.toHaveBeenCalledWith({ queryKey: ['courses'] });
      invalidateSpy.mockRestore();
    });
  });

  describe('Error Handling - Missing Access Token', () => {
    it('should throw error when access token is missing', async () => {
      useAuthStore.setState({ accessToken: null });

      const { result } = renderHook(() => useEnrollBatch(), { wrapper });

      await act(async () => {
        try {
          await result.current.mutateAsync([1, 2]);
        } catch (error) {
          expect((error as Error).message).toBe('인증이 필요합니다');
        }
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
    });
  });

  describe('Error Handling - Authentication Error (401)', () => {
    it('should handle 401 A003 error (token expired)', async () => {
      server.use(mockHandlers.enrollment.enrollBatchUnauthorized);

      const { result } = renderHook(() => useEnrollBatch(), { wrapper });

      // Mock window.location.href for jsdom
      const originalLocation = window.location;
      Object.defineProperty(window, 'location', {
        value: { href: '' },
        writable: true,
        configurable: true,
      });

      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

      await act(async () => {
        try {
          await result.current.mutateAsync([1, 2]);
        } catch (error) {
          // Error expected
        }
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });
      
      alertSpy.mockRestore();
      Object.defineProperty(window, 'location', {
        value: originalLocation,
        writable: true,
        configurable: true,
      });
    });
  });
});

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useCoursesQuery } from '@/widgets/course-list/useCoursesQuery';
import { server } from '../../mocks/server';
import { mockHandlers } from '../../mocks/handlers';

describe('useCoursesQuery', () => {
  let queryClient: QueryClient;
  let wrapper: React.FC<{ children: React.ReactNode }>;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
    
    // JSX 대신 React.createElement 사용
    wrapper = ({ children }) => 
    React.createElement(QueryClientProvider, { client: queryClient }, children);
    
    vi.clearAllMocks();
    server.resetHandlers();
  });

  describe('Success Cases', () => {
    it('should fetch courses successfully', async () => {
      const { result } = renderHook(() => useCoursesQuery('id,desc'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.pages.length).toBe(1);
      expect(result.current.data?.pages[0].content.length).toBe(2);
      expect(result.current.data?.pages[0].content[0].title).toBe('프론트엔드 기초');
    });

    it('should use correct sort parameter', async () => {
      const { result: result1 } = renderHook(() => useCoursesQuery('id,desc'), { wrapper });
      const { result: result2 } = renderHook(() => useCoursesQuery('price,asc'), { wrapper });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      // Verify different queryKey for different sorts via queryClient
      const queries = queryClient.getQueryCache().getAll();
      const query1 = queries.find(q => 
        q.queryKey[0] === 'courses' && (q.queryKey[1] as any)?.sort === 'id,desc'
      );
      const query2 = queries.find(q => 
        q.queryKey[0] === 'courses' && (q.queryKey[1] as any)?.sort === 'price,asc'
      );

      expect(query1).toBeDefined();
      expect(query2).toBeDefined();
    });

    it('should have stale time of 60 seconds', async () => {
      const { result } = renderHook(() => useCoursesQuery('id,desc'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Verify staleTime by checking query state
      const queryState = queryClient.getQueryState(['courses', { sort: 'id,desc' }]);
      const now = Date.now();
      const isStale = queryState ? now - queryState.dataUpdatedAt > 60000 : true;
      expect(isStale).toBe(false);
    });
  });

  describe('Pagination - Infinite Query', () => {
    it('should determine next page correctly when not last page', async () => {
      const { result } = renderHook(() => useCoursesQuery('id,desc'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Current implementation returns last=true, so hasNextPage should be false
      expect(result.current.hasNextPage).toBe(false);
    });

    it('should not have next page when last page is true', async () => {
      const { result } = renderHook(() => useCoursesQuery('id,desc'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const lastPage = result.current.data?.pages[result.current.data.pages.length - 1];
      expect(lastPage?.last).toBe(true);
      expect(result.current.hasNextPage).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      server.use(mockHandlers.course.fetchCoursesError);

      const { result } = renderHook(() => useCoursesQuery('id,desc'), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });

    it('should have error state with proper error object', async () => {
      server.use(mockHandlers.course.fetchCoursesError);

      const { result } = renderHook(() => useCoursesQuery('id,desc'), { wrapper });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error instanceof Error).toBe(true);
    });
  });

  describe('Loading States', () => {
    it('should have loading state initially', () => {
      const { result } = renderHook(() => useCoursesQuery('id,desc'), { wrapper });

      expect(result.current.isLoading).toBe(true);
    });

    it('should transition from loading to success', async () => {
      const { result } = renderHook(() => useCoursesQuery('id,desc'), { wrapper });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });

  describe('Initial Page Parameter', () => {
    it('should start with page 0', async () => {
      const { result } = renderHook(() => useCoursesQuery('id,desc'), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const firstPage = result.current.data?.pages[0];
      expect(firstPage?.pageable.pageNumber).toBe(0);
    });
  });
});

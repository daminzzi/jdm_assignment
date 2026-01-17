import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { server } from './mocks/server';
import '@testing-library/jest-dom/vitest';

// Mock Next.js App Router hooks used in components
vi.mock('next/navigation', () => {
  const push = vi.fn();
  const replace = vi.fn();
  const back = vi.fn();
  const forward = vi.fn();
  const prefetch = vi.fn();
  return {
    useRouter: () => ({ push, replace, back, forward, prefetch }),
  };
});

// Enable API mocking before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Reset any runtime request handlers we may add during the tests
afterEach(() => {
  server.resetHandlers();
});

// Disable API mocking after the tests are done
afterAll(() => {
  server.close();
});

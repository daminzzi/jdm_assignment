import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';
import '@testing-library/jest-dom/vitest';

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

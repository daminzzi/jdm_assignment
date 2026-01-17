import { test as base } from '@playwright/test';
import { mockHandlers } from '../mocks/handlers';

export { expect } from '@playwright/test';

type TestFixtures = {
  mockHandlers: typeof mockHandlers;
};

export const test = base.extend<TestFixtures>({
  mockHandlers: async ({}, use) => {
    await use(mockHandlers);
  },
});

import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// `globals: false` (vite.config.ts) means Testing Library's own auto-cleanup
// can't detect a global `afterEach` to hook into — without this, every
// render() across the suite piles up in the same jsdom document.
afterEach(() => {
  cleanup();
});

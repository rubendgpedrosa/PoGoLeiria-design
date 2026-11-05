import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    // The vendor byte-for-byte check shells out to `git archive`; give it room
    // without hiding a real hang.
    testTimeout: 20_000,
  },
})

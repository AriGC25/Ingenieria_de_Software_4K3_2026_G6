import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      exclude: ['src/main.js'],
      thresholds: {
        lines: 70,
        'src/dominio/**': { lines: 90 },
        'src/aplicacion/**': { lines: 90 },
      },
    },
  },
});

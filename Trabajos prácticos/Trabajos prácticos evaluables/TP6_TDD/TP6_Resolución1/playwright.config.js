import { defineConfig, devices } from '@playwright/test';
import { ARCHIVO_BASE, PUERTO_BACKEND, RELOJ_FIJO, URL_APP } from './e2e/entorno.js';

// El backend corre sin backend/.env (que apunta a Turso): base SQLite propia, Mailpit y reloj fijo.
export default defineConfig({
  testDir: './e2e',
  globalSetup: './e2e/preparar.js',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: URL_APP,
    trace: 'retain-on-failure',
    ...devices['Pixel 7'],
    ...(process.env.E2E_CANAL && { channel: process.env.E2E_CANAL }),
  },
  webServer: [
    {
      command: 'node src/main.js',
      cwd: 'backend',
      port: PUERTO_BACKEND,
      reuseExistingServer: false,
      env: {
        PORT: String(PUERTO_BACKEND),
        DATABASE_URL: `file:${ARCHIVO_BASE}`,
        MAIL_PERFIL: 'desarrollo',
        MAIL_FROM: 'EcoHarmony Park <no-responder@ecoharmony.example>',
        APP_URL: URL_APP,
        RELOJ_FIJO,
      },
    },
    {
      command: 'npx vite --port 5174 --strictPort',
      cwd: 'frontend',
      port: 5174,
      reuseExistingServer: false,
      env: { API_DESTINO: `http://localhost:${PUERTO_BACKEND}` },
    },
  ],
});

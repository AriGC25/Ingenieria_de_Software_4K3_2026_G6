import express from 'express';

/**
 * Crea la aplicación Express. No llama a `listen`: así sirve para Supertest y para Vercel.
 * @returns {import('express').Express}
 */
export function crearApp() {
  const app = express();
  app.use(express.json());

  app.get('/api/salud', (_req, res) => {
    res.json({ ok: true });
  });

  return app;
}

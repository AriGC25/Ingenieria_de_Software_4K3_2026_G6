import express from 'express';
import { manejarErrores, rutaInexistente } from './middlewares.js';
import { crearRutas } from './rutas.js';

/**
 * Crea la aplicación Express con los casos de uso ya compuestos. No llama a `listen`: así sirve
 * para Supertest y para Vercel.
 * @param {{ listarActividades?: object, consultarFechas?: object, consultarTurnos?: object,
 *   inscribirseActividad?: object }} [casosDeUso]
 * @returns {import('express').Express}
 */
export function crearApp(casosDeUso = {}) {
  const app = express();
  app.use(express.json());

  app.get('/api/salud', (_req, res) => {
    res.json({ ok: true });
  });
  app.use('/api', crearRutas(casosDeUso));
  app.use('/api', rutaInexistente);
  app.use(manejarErrores);

  return app;
}

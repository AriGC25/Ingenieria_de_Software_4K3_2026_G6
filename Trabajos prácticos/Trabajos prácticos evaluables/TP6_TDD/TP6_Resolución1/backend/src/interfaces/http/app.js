import express from 'express';
import { SolicitudInvalida } from '../../dominio/errores.js';
import { MENSAJES } from '../../dominio/errores.js';
import { esquemaConsultaTurnos } from './esquemas.js';
import { mapearError } from './mapeoErrores.js';

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

  app.get(
    '/api/actividades',
    manejar(async (_req, res) => {
      res.json(await casosDeUso.listarActividades.ejecutar());
    }),
  );

  app.get(
    '/api/fechas',
    manejar(async (_req, res) => {
      res.json(await casosDeUso.consultarFechas.ejecutar());
    }),
  );

  app.get(
    '/api/actividades/:id/turnos',
    manejar(async (req, res) => {
      const consulta = esquemaConsultaTurnos.safeParse(req.query);
      if (!consulta.success) throw new SolicitudInvalida('fecha');
      res.json(
        await casosDeUso.consultarTurnos.ejecutar({
          actividadId: req.params.id,
          fecha: consulta.data.fecha,
        }),
      );
    }),
  );

  app.use('/api', (_req, res) => {
    res.status(404).json({ codigo: 'RUTA_INEXISTENTE', mensaje: MENSAJES.ERROR_GENERICO });
  });

  app.use((error, _req, res, _next) => {
    const { estado, cuerpo } = mapearError(error);
    res.status(estado).json(cuerpo);
  });

  return app;
}

function manejar(controlador) {
  return (req, res, next) => controlador(req, res).catch(next);
}

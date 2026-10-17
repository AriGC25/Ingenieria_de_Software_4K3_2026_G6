import { Router } from 'express';
import { SolicitudInvalida } from '../../dominio/errores.js';
import { esquemaConsultaTurnos } from './esquemas.js';

/**
 * Rutas de la API. Cada controlador valida la forma, invoca su caso de uso y responde.
 * @param {{ listarActividades: object, consultarFechas: object, consultarTurnos: object,
 *   inscribirseActividad: object }} casosDeUso
 * @returns {import('express').Router}
 */
export function crearRutas(casosDeUso) {
  const rutas = Router();

  rutas.get(
    '/actividades',
    manejar(async (_req, res) => {
      res.json(await casosDeUso.listarActividades.ejecutar());
    }),
  );

  rutas.get(
    '/fechas',
    manejar(async (_req, res) => {
      res.json(await casosDeUso.consultarFechas.ejecutar());
    }),
  );

  rutas.get(
    '/actividades/:id/turnos',
    manejar(async (req, res) => {
      const { fecha } = validar(esquemaConsultaTurnos, req.query, 'fecha');
      res.json(await casosDeUso.consultarTurnos.ejecutar({ actividadId: req.params.id, fecha }));
    }),
  );

  return rutas;
}

/** Express 4 no captura los rechazos de los controladores asíncronos. */
function manejar(controlador) {
  return (req, res, next) => controlador(req, res).catch(next);
}

function validar(esquema, datos, campo) {
  const resultado = esquema.safeParse(datos);
  if (!resultado.success) throw new SolicitudInvalida(campo);
  return resultado.data;
}

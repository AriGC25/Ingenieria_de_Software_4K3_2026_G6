import { Router } from 'express';
import { SolicitudInvalida } from '../../dominio/errores.js';
import { esquemaConsultaTurnos, esquemaSolicitudInscripcion } from './esquemas.js';

/**
 * Rutas de la API. Cada controlador valida la forma, invoca su caso de uso y responde.
 * @param {{ listarActividades: object, consultarFechas: object, consultarTurnos: object,
 *   inscribirseActividad: object }} casosDeUso
 * @returns {import('express').Router}
 */
export function crearRutas(casosDeUso) {
  const rutas = Router();
  const controladores = [
    ['get', '/actividades', () => casosDeUso.listarActividades.ejecutar()],
    ['get', '/fechas', () => casosDeUso.consultarFechas.ejecutar()],
    [
      'get',
      '/actividades/:id/turnos',
      (req) => {
        const { fecha } = validar(esquemaConsultaTurnos, req.query);
        return casosDeUso.consultarTurnos.ejecutar({ actividadId: req.params.id, fecha });
      },
    ],
    [
      'post',
      '/inscripciones',
      (req) =>
        casosDeUso.inscribirseActividad.ejecutar(validar(esquemaSolicitudInscripcion, req.body)),
      201,
    ],
  ];

  for (const [metodo, ruta, controlador, estado = 200] of controladores) {
    rutas[metodo](ruta, responder(controlador, estado));
  }
  return rutas;
}

/** Responde en JSON lo que devuelve el controlador; Express 4 no captura los rechazos. */
function responder(controlador, estado) {
  return (req, res, next) =>
    Promise.resolve()
      .then(() => controlador(req))
      .then((cuerpo) => res.status(estado).json(cuerpo))
      .catch(next);
}

/**
 * Valida la forma con Zod. Si no la cumple, informa el primer campo inválido.
 * @throws {SolicitudInvalida}
 */
function validar(esquema, datos) {
  const resultado = esquema.safeParse(datos);
  if (resultado.success) return resultado.data;
  throw new SolicitudInvalida(nombreDeCampo(resultado.error.issues[0].path));
}

/** `['participantes', 0, 'edad']` → `participantes[0].edad`, igual que los campos del dominio. */
function nombreDeCampo(ruta) {
  return ruta.reduce(
    (nombre, parte) =>
      typeof parte === 'number' ? `${nombre}[${parte}]` : nombre ? `${nombre}.${parte}` : parte,
    '',
  );
}

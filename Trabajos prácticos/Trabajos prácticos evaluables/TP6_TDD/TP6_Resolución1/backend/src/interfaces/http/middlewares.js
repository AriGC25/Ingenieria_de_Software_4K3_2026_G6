import { MENSAJES } from '../../dominio/errores.js';
import { mapearError } from './mapeoErrores.js';

/** Responde 404 en JSON a las rutas inexistentes bajo `/api`. */
export function rutaInexistente(_req, res) {
  res.status(404).json({ codigo: 'RUTA_INEXISTENTE', mensaje: MENSAJES.ERROR_GENERICO });
}

/** Traduce cualquier error al formato único de la API. */

export function manejarErrores(error, _req, res, _next) {
  const { estado, cuerpo } = mapearError(error);
  res.status(estado).json(cuerpo);
}

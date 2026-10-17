const MENSAJE_GENERICO = 'Algo salió mal. Intentá de nuevo en unos minutos.';

/** Error informado por la API (o de red), con el formato `{ codigo, mensaje, campo }`. */
export class ErrorApi extends Error {
  constructor({ codigo, mensaje, campo }, estado) {
    super(mensaje);
    this.name = 'ErrorApi';
    this.codigo = codigo;
    this.mensaje = mensaje;
    this.campo = campo;
    this.estado = estado;
  }
}

/** @returns {Promise<object[]>} */
export function listarActividades() {
  return pedir('/api/actividades');
}

/** @returns {Promise<{ fecha: string, abierta: boolean, motivo?: string }[]>} */
export function listarFechas() {
  return pedir('/api/fechas');
}

/**
 * @param {string} actividadId
 * @param {string} fecha `YYYY-MM-DD`
 */
export function listarTurnos(actividadId, fecha) {
  return pedir(`/api/actividades/${encodeURIComponent(actividadId)}/turnos?fecha=${fecha}`);
}

/** @param {object} solicitud */
export function crearInscripcion(solicitud) {
  return pedir('/api/inscripciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(solicitud),
  });
}

async function pedir(ruta, opciones) {
  let respuesta;
  try {
    respuesta = await fetch(new URL(ruta, window.location.origin), opciones);
  } catch {
    throw new ErrorApi({ codigo: 'ERROR_DE_RED', mensaje: MENSAJE_GENERICO });
  }
  const cuerpo = await respuesta.json().catch(() => null);
  if (respuesta.ok && cuerpo !== null) return cuerpo;
  if (cuerpo?.codigo) throw new ErrorApi(cuerpo, respuesta.status);
  throw new ErrorApi(
    { codigo: 'RESPUESTA_INESPERADA', mensaje: MENSAJE_GENERICO },
    respuesta.status,
  );
}

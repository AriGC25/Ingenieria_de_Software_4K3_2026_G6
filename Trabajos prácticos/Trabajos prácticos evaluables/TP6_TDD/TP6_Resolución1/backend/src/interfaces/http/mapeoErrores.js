import { ErrorDominio, MENSAJES } from '../../dominio/errores.js';

const ESTADOS = Object.freeze({
  SOLICITUD_INVALIDA: 400,
  ACTIVIDAD_INEXISTENTE: 404,
  HORARIO_NO_DISPONIBLE: 422,
  DATOS_PARTICIPANTE_INVALIDOS: 422,
  DNI_REPETIDO: 422,
  EDAD_NO_PERMITIDA: 422,
  TALLE_REQUERIDO: 422,
  TERMINOS_NO_ACEPTADOS: 422,
  INSCRIPCION_SUPERPUESTA: 409,
  SIN_CUPO: 409,
  ENVIO_CONFIRMACION_FALLIDO: 503,
});

/**
 * Traduce un error a la respuesta HTTP (formato único `{ codigo, mensaje, campo? }`). Un error
 * inesperado responde 500 sin detalles internos.
 * @param {unknown} error
 * @returns {{ estado: number, cuerpo: { codigo: string, mensaje: string, campo?: string } }}
 */
export function mapearError(error) {
  if (error instanceof ErrorDominio && ESTADOS[error.codigo]) {
    const { codigo, mensaje, campo } = error;
    return {
      estado: ESTADOS[codigo],
      cuerpo: campo ? { codigo, mensaje, campo } : { codigo, mensaje },
    };
  }
  return { estado: 500, cuerpo: { codigo: 'ERROR_INTERNO', mensaje: MENSAJES.SOLICITUD_INVALIDA } };
}

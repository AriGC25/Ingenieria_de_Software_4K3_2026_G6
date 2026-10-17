import {
  EDAD_MAXIMA,
  EDAD_MINIMA_ADMITIDA,
  FORMATO_DNI,
  FORMATO_NOMBRE,
  NOMBRE_MAX_CARACTERES,
  TALLES,
} from './constantes.js';
import { DatosParticipanteInvalidos } from './errores.js';

/**
 * @param {number} indice posición del participante en la solicitud
 * @param {string} dato
 * @returns {string} el campo del dato, por ejemplo `participantes[0].dni`
 */
export function campoDe(indice, dato) {
  return `participantes[${indice}].${dato}`;
}

/**
 * @param {unknown} nombre
 * @param {string} campo
 * @returns {string} el nombre sin espacios en los extremos
 * @throws {DatosParticipanteInvalidos}
 */
export function validarNombre(nombre, campo) {
  const recortado = typeof nombre === 'string' ? nombre.trim() : '';
  const largoValido = recortado.length > 0 && recortado.length <= NOMBRE_MAX_CARACTERES;
  if (!largoValido || !FORMATO_NOMBRE.test(recortado)) throw new DatosParticipanteInvalidos(campo);
  return recortado;
}

/**
 * @param {unknown} dni
 * @param {string} campo
 * @returns {string} el DNI como texto (conserva los ceros iniciales)
 * @throws {DatosParticipanteInvalidos}
 */
export function validarDni(dni, campo) {
  if (typeof dni !== 'string' || !FORMATO_DNI.test(dni))
    throw new DatosParticipanteInvalidos(campo);
  return dni;
}

/**
 * @param {unknown} edad
 * @param {string} campo
 * @returns {number}
 * @throws {DatosParticipanteInvalidos}
 */
export function validarEdad(edad, campo) {
  const enRango = Number.isInteger(edad) && edad >= EDAD_MINIMA_ADMITIDA && edad <= EDAD_MAXIMA;
  if (!enRango) throw new DatosParticipanteInvalidos(campo);
  return edad;
}

/**
 * @param {unknown} talle
 * @param {string} campo
 * @returns {string}
 * @throws {DatosParticipanteInvalidos}
 */
export function validarTalle(talle, campo) {
  if (!TALLES.includes(talle)) throw new DatosParticipanteInvalidos(campo);
  return talle;
}

/**
 * @param {unknown} talle
 * @returns {boolean} si se envió un talle
 */
export function tieneTalle(talle) {
  return talle !== undefined && talle !== null && talle !== '';
}

/**
 * Crea un participante validando sus datos en orden: nombre, DNI, edad y talle (si se envió).
 * @param {{ nombre: unknown, dni: unknown, edad: unknown, talle?: unknown }} datos
 * @param {number} [indice] posición en la solicitud, para indicar el campo del error
 * @returns {{ nombre: string, dni: string, edad: number, talle: string | null }}
 * @throws {DatosParticipanteInvalidos}
 */
export function crearParticipante(datos, indice = 0) {
  return Object.freeze({
    nombre: validarNombre(datos.nombre, campoDe(indice, 'nombre')),
    dni: validarDni(datos.dni, campoDe(indice, 'dni')),
    edad: validarEdad(datos.edad, campoDe(indice, 'edad')),
    talle: tieneTalle(datos.talle) ? validarTalle(datos.talle, campoDe(indice, 'talle')) : null,
  });
}

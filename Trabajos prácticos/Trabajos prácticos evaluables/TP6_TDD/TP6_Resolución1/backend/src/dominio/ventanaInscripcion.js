import { subHours, subMinutes } from 'date-fns';
import { CIERRE_INSCRIPCION_MIN, VENTANA_APERTURA_HORAS } from './constantes.js';

/**
 * Evalúa si se puede inscribir a un turno: `inicio − 24 h ≤ ahora ≤ inicio − 15 min`,
 * con los extremos incluidos (S-07).
 * @param {Date} inicio instante de inicio del turno
 * @param {Date} ahora
 * @returns {{ dentro: true } | { dentro: false, motivo: 'todavia_no_abre' | 'inscripcion_cerrada' | 'ya_empezo' }}
 */
export function evaluarVentana(inicio, ahora) {
  if (ahora >= inicio) return { dentro: false, motivo: 'ya_empezo' };
  if (ahora > subMinutes(inicio, CIERRE_INSCRIPCION_MIN)) {
    return { dentro: false, motivo: 'inscripcion_cerrada' };
  }
  if (ahora < subHours(inicio, VENTANA_APERTURA_HORAS)) {
    return { dentro: false, motivo: 'todavia_no_abre' };
  }
  return { dentro: true };
}

/**
 * @param {Date} inicio
 * @param {Date} ahora
 * @returns {boolean}
 */
export function dentroDeLaVentana(inicio, ahora) {
  return evaluarVentana(inicio, ahora).dentro;
}

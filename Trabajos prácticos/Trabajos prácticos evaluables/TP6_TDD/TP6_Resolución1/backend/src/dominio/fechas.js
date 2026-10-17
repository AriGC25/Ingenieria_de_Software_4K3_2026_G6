import { TZDate } from '@date-fns/tz';
import { addDays, format } from 'date-fns';
import { ZONA_HORARIA } from './constantes.js';

/**
 * Convierte una fecha y una hora argentinas en el instante que representan.
 * @param {string} fecha `YYYY-MM-DD`
 * @param {string} [hora] `HH:mm`
 * @returns {Date}
 */
export function instanteArgentino(fecha, hora = '00:00') {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const [horas, minutos] = hora.split(':').map(Number);
  return new Date(new TZDate(anio, mes - 1, dia, horas, minutos, ZONA_HORARIA).getTime());
}

/**
 * @param {Date | string} fecha un instante o una fecha `YYYY-MM-DD`
 * @returns {{ diaSemana: number, mesDia: string }} el día de la semana (0 = domingo) y `MM-DD`
 */
export function partesDeFecha(fecha) {
  const instante = typeof fecha === 'string' ? instanteArgentino(fecha, '12:00') : fecha;
  const local = new TZDate(instante, ZONA_HORARIA);
  return { diaSemana: local.getDay(), mesDia: format(local, 'MM-dd') };
}

/**
 * @param {Date} instante
 * @returns {string} la fecha en hora argentina, `YYYY-MM-DD`
 */
export function fechaArgentina(instante) {
  return format(new TZDate(instante, ZONA_HORARIA), 'yyyy-MM-dd');
}

/**
 * @param {Date} instante
 * @returns {string} la hora en hora argentina, `HH:mm`
 */
export function horaArgentina(instante) {
  return format(new TZDate(instante, ZONA_HORARIA), 'HH:mm');
}

/**
 * @param {string} fecha `YYYY-MM-DD`
 * @returns {string} el día siguiente, `YYYY-MM-DD`
 */
export function diaSiguiente(fecha) {
  return fechaArgentina(addDays(instanteArgentino(fecha, '12:00'), 1));
}

/**
 * @param {Date} instante
 * @returns {string} la fecha en hora argentina para mostrar, `dd/mm/aaaa` (S-23)
 */
export function fechaLegible(instante) {
  return format(new TZDate(instante, ZONA_HORARIA), 'dd/MM/yyyy');
}

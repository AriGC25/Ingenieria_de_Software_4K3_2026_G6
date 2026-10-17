const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/**
 * @param {string} fecha `YYYY-MM-DD`
 * @returns {string} `dd/mm/aaaa` (S-23)
 */
export function formatearFecha(fecha) {
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}

/**
 * Día de la semana de una fecha de calendario (sin depender de la zona horaria del navegador).
 * @param {string} fecha `YYYY-MM-DD`
 * @returns {string}
 */
export function diaDeLaSemana(fecha) {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  return DIAS[new Date(Date.UTC(anio, mes - 1, dia)).getUTCDay()];
}

/**
 * @param {number} cantidad
 * @returns {string} "1 cupo", "7 cupos"
 */
export function cupos(cantidad) {
  return cantidad === 1 ? '1 cupo' : `${cantidad} cupos`;
}

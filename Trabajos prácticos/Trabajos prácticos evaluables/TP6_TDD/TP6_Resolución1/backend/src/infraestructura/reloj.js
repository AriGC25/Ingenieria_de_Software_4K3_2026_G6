/**
 * Reloj de la aplicación: fijo en la fecha de `RELOJ_FIJO` (demo y pruebas, D-08) o el del sistema.
 * @param {Date | null} relojFijo
 * @returns {import('../aplicacion/puertos.js').Reloj}
 */
export function crearReloj(relojFijo) {
  if (relojFijo) return { ahora: () => new Date(relojFijo) };
  return { ahora: () => new Date() };
}

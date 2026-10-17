const BASE = { nombre: 'Ana Pérez', dni: '40123456', edad: 25, talle: 'M' };

/**
 * Datos de un participante válido para Tirolesa, con lo que cambie cada prueba.
 * @param {object} [cambios]
 */
export function unParticipante(cambios = {}) {
  return { ...BASE, ...cambios };
}

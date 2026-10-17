export const DATOS_ACTIVIDADES = {
  tirolesa: {
    id: 'tirolesa',
    nombre: 'Tirolesa',
    requiereTalle: true,
    edadMinima: 8,
    cupoPorTurno: 10,
  },
  safari: {
    id: 'safari',
    nombre: 'Safari',
    requiereTalle: false,
    edadMinima: null,
    cupoPorTurno: 8,
  },
  palestra: {
    id: 'palestra',
    nombre: 'Palestra',
    requiereTalle: true,
    edadMinima: 12,
    cupoPorTurno: 12,
  },
  jardineria: {
    id: 'jardineria',
    nombre: 'Jardinería',
    requiereTalle: false,
    edadMinima: null,
    cupoPorTurno: 12,
  },
};

/**
 * Datos de una de las cuatro actividades del parque, con sus términos.
 * @param {keyof typeof DATOS_ACTIVIDADES} [id]
 * @param {object} [cambios]
 */
export function datosDeActividad(id = 'tirolesa', cambios = {}) {
  const datos = DATOS_ACTIVIDADES[id];
  return { ...datos, terminos: `Términos de ${datos.nombre}.`, ...cambios };
}

import { CALENDARIO_POR_DEFECTO, DIAS_SEMANA } from './constantes.js';
import { partesDeFecha } from './fechas.js';

/**
 * Crea el calendario del parque (RN-01). Las fechas se evalúan en hora argentina.
 * @param {{ diasCerrados?: number[], feriadosCerrados?: string[], apertura?: string, cierre?: string }} [configuracion]
 */
export function crearCalendarioParque(configuracion = {}) {
  const { diasCerrados, feriadosCerrados, apertura, cierre } = {
    ...CALENDARIO_POR_DEFECTO,
    ...configuracion,
  };

  /**
   * @param {Date | string} fecha un instante o una fecha `YYYY-MM-DD`
   * @returns {'feriado' | string | null} el motivo del cierre, o `null` si está abierto
   */
  function motivoCierre(fecha) {
    const { diaSemana, mesDia } = partesDeFecha(fecha);
    if (feriadosCerrados.includes(mesDia)) return 'feriado';
    if (diasCerrados.includes(diaSemana)) return DIAS_SEMANA[diaSemana];
    return null;
  }

  return Object.freeze({
    apertura,
    cierre,
    motivoCierre,
    /**
     * @param {Date | string} fecha
     * @returns {boolean}
     */
    estaAbierto: (fecha) => motivoCierre(fecha) === null,
  });
}

import { Actividad } from '../../src/dominio/actividad.js';
import { Turno } from '../../src/dominio/turno.js';
import { datosDeActividad } from './actividad.js';

/** Martes 20/10/2026 09:00 ART: el "ahora" de referencia de las pruebas. */
export const AHORA = new Date('2026-10-20T09:00:00-03:00');

/**
 * Builder de turnos. Por defecto: Tirolesa del martes 20/10/2026 a las 10:00, con 10 cupos libres.
 */
export function unTurno() {
  let actividadId = 'tirolesa';
  let fecha = '2026-10-20';
  let hora = '10';
  let ocupados = 0;
  let maximo;

  const builder = {
    de(id) {
      actividadId = id;
      return builder;
    },
    el(nuevaFecha, nuevaHora = hora) {
      fecha = nuevaFecha;
      hora = nuevaHora;
      return builder;
    },
    aLas(nuevaHora) {
      hora = nuevaHora;
      return builder;
    },
    conOcupados(cantidad) {
      ocupados = cantidad;
      return builder;
    },
    conMaximo(cantidad) {
      maximo = cantidad;
      return builder;
    },
    build() {
      const actividad = new Actividad(datosDeActividad(actividadId));
      return new Turno({
        id: `t-${actividadId}-${fecha}-${hora}`,
        actividad,
        inicio: new Date(`${fecha}T${hora}:00:00-03:00`),
        cupoMaximo: maximo ?? actividad.cupoPorTurno,
        cupoOcupado: ocupados,
      });
    },
  };
  return builder;
}

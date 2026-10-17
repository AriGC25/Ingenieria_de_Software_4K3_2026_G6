import { SinCupo } from './errores.js';
import { fechaArgentina, horaArgentina } from './fechas.js';
import { evaluarVentana } from './ventanaInscripcion.js';

/** Una instancia de una actividad en un horario, con su cupo. */
export class Turno {
  /**
   * @param {{ id: string, actividad: import('./actividad.js').Actividad, inicio: Date,
   *   cupoMaximo: number, cupoOcupado?: number }} datos
   */
  constructor({ id, actividad, inicio, cupoMaximo, cupoOcupado = 0 }) {
    this.id = id;
    this.actividad = actividad;
    this.inicio = inicio;
    this.cupoMaximo = cupoMaximo;
    this.cupoOcupado = cupoOcupado;
  }

  /** @returns {string} fecha del turno en hora argentina (`YYYY-MM-DD`) */
  get fecha() {
    return fechaArgentina(this.inicio);
  }

  /** @returns {string} hora del turno en hora argentina (`HH:mm`) */
  get hora() {
    return horaArgentina(this.inicio);
  }

  /** @returns {number} */
  cuposDisponibles() {
    return this.cupoMaximo - this.cupoOcupado;
  }

  /**
   * Estado del turno en este momento. La ventana se evalúa antes que el cupo.
   * @param {Date} ahora
   * @param {{ estaAbierto: (fecha: Date) => boolean }} calendario
   * @returns {{ estado: 'disponible' | 'agotado' } | { estado: 'no_disponible', motivo: string }}
   */
  estado(ahora, calendario) {
    if (!calendario.estaAbierto(this.inicio)) {
      return { estado: 'no_disponible', motivo: 'parque_cerrado' };
    }
    const ventana = evaluarVentana(this.inicio, ahora);
    if (!ventana.dentro) return { estado: 'no_disponible', motivo: ventana.motivo };
    if (this.cuposDisponibles() === 0) return { estado: 'agotado' };
    return { estado: 'disponible' };
  }

  /**
   * @param {number} cantidad personas a reservar
   * @throws {SinCupo} si no alcanzan los cupos; el turno no cambia
   */
  reservar(cantidad) {
    if (cantidad > this.cuposDisponibles()) throw new SinCupo();
    this.cupoOcupado += cantidad;
  }
}

import { addHours } from 'date-fns';
import { fechaArgentina } from '../dominio/fechas.js';

/** Fechas elegibles para inscribirse: hoy y mañana en hora argentina (S-31). */
export class ConsultarFechas {
  /**
   * @param {{ reloj: import('./puertos.js').Reloj, calendario: object }} dependencias
   */
  constructor({ reloj, calendario }) {
    this.reloj = reloj;
    this.calendario = calendario;
  }

  /**
   * @returns {Promise<{ fecha: string, abierta: boolean, motivo?: string }[]>}
   */
  async ejecutar() {
    const ahora = this.reloj.ahora();
    const fechas = [fechaArgentina(ahora), fechaArgentina(addHours(ahora, 24))];
    return fechas.map((fecha) => {
      const motivo = this.calendario.motivoCierre(fecha);
      return motivo ? { fecha, abierta: false, motivo } : { fecha, abierta: true };
    });
  }
}

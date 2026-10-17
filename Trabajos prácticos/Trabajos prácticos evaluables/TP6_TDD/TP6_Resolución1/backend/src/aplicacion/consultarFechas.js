import { diaSiguiente, fechaArgentina } from '../dominio/fechas.js';

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
    const hoy = fechaArgentina(this.reloj.ahora());
    return [hoy, diaSiguiente(hoy)].map((fecha) => this.calendario.estadoDe(fecha));
  }
}

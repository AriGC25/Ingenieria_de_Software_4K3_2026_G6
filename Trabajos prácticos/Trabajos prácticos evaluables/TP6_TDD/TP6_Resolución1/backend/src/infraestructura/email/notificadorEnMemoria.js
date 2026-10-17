import { armarMensajeConfirmacion } from './mensajeConfirmacion.js';

/**
 * Notificador del perfil `pruebas`: arma el mismo mensaje que el SMTP y lo guarda en memoria, para
 * inspeccionarlo sin red. Puede simular fallas del envío.
 */
export class NotificadorEnMemoria {
  #opciones;
  #fallasPendientes = 0;

  /** @param {{ remitente: string, appUrl: string, logo: Buffer }} opciones */
  constructor(opciones) {
    this.#opciones = opciones;
    /** @type {object[]} */
    this.enviados = [];
  }

  /** Hace fallar el próximo envío. */
  fallarProximoEnvio() {
    this.#fallasPendientes += 1;
  }

  /**
   * @param {{ inscripcion: import('../../aplicacion/puertos.js').DetalleInscripcion, qr: Buffer }} datos
   * @returns {Promise<void>}
   */
  async enviarConfirmacion(datos) {
    if (this.#fallasPendientes > 0) {
      this.#fallasPendientes -= 1;
      throw new Error('Falla simulada del envío');
    }
    this.enviados.push(armarMensajeConfirmacion(datos, this.#opciones));
  }
}

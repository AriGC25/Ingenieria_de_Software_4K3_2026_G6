import { armarMensajeConfirmacion } from './mensajeConfirmacion.js';

/** Notificador que envía el mail por SMTP (Mailpit en desarrollo, Gmail en la demo). */
export class NotificadorSmtp {
  #transporte;
  #opciones;

  /**
   * @param {{ transporte: { sendMail: (mensaje: object) => Promise<unknown> }, remitente: string,
   *   appUrl: string, logo: Buffer }} opciones
   */
  constructor({ transporte, ...opciones }) {
    this.#transporte = transporte;
    this.#opciones = opciones;
  }

  /**
   * @param {{ inscripcion: import('../../aplicacion/puertos.js').DetalleInscripcion, qr: Buffer }} datos
   * @returns {Promise<void>}
   */
  async enviarConfirmacion(datos) {
    // Se espera el envío: en Vercel la función termina al responder.
    await this.#transporte.sendMail(armarMensajeConfirmacion(datos, this.#opciones));
  }
}

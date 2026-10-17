import { armarMailConfirmacion } from './mailConfirmacion.js';

/**
 * Notificador que envía el mail por SMTP con Nodemailer (Mailpit en desarrollo, Gmail en la demo).
 * El logo y el QR van embebidos (`cid:`) y el QR se adjunta además como archivo (S-18).
 */
export class NotificadorSmtp {
  /**
   * @param {{ transporte: { sendMail: (mensaje: object) => Promise<unknown> }, remitente: string,
   *   appUrl: string, logo: Buffer }} opciones
   */
  constructor({ transporte, remitente, appUrl, logo }) {
    this.transporte = transporte;
    this.remitente = remitente;
    this.appUrl = appUrl;
    this.logo = logo;
  }

  /**
   * @param {{ inscripcion: import('../../aplicacion/puertos.js').DetalleInscripcion, qr: Buffer }} datos
   * @returns {Promise<void>}
   */
  async enviarConfirmacion({ inscripcion, qr }) {
    const { asunto, html } = armarMailConfirmacion(inscripcion, this.appUrl);
    // Se espera el envío: en Vercel la función termina al responder (hallazgo 5 del despliegue).
    await this.transporte.sendMail({
      from: this.remitente,
      to: inscripcion.email,
      subject: asunto,
      html,
      attachments: [
        { filename: 'logo.png', content: this.logo, cid: 'logo', contentDisposition: 'inline' },
        { filename: 'qr.png', content: qr, cid: 'qr', contentDisposition: 'inline' },
        { filename: 'qr-inscripcion.png', content: qr, contentDisposition: 'attachment' },
      ],
    });
  }
}

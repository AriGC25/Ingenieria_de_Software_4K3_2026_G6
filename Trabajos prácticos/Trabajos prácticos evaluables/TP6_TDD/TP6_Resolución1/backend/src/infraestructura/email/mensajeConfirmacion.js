import { armarMailConfirmacion } from './mailConfirmacion.js';

/**
 * Arma el mensaje de Nodemailer de la confirmación. El logo y el QR van embebidos (`cid:`) y el
 * QR se adjunta además como archivo (S-18).
 * @param {{ inscripcion: import('../../aplicacion/puertos.js').DetalleInscripcion, qr: Buffer }} datos
 * @param {{ remitente: string, appUrl: string, logo: Buffer }} opciones
 * @returns {object}
 */
export function armarMensajeConfirmacion({ inscripcion, qr }, { remitente, appUrl, logo }) {
  const { asunto, html } = armarMailConfirmacion(inscripcion, appUrl);
  return {
    from: remitente,
    to: inscripcion.email,
    subject: asunto,
    html,
    attachments: [
      { filename: 'logo.png', content: logo, cid: 'logo', contentDisposition: 'inline' },
      { filename: 'qr.png', content: qr, cid: 'qr', contentDisposition: 'inline' },
      { filename: 'qr-inscripcion.png', content: qr, contentDisposition: 'attachment' },
    ],
  };
}

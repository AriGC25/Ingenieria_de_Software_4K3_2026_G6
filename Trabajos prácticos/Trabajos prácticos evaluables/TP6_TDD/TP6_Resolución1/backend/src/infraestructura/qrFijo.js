import QRCode from 'qrcode';

/**
 * QR que apunta al enlace fijo de la pantalla de validación simulada (RF-22). Es igual para todas
 * las inscripciones, así que se genera una vez y se reutiliza.
 */
export class QrFijo {
  #url;
  #imagen;

  /** @param {string} appUrl URL pública de la aplicación, sin barra final */
  constructor(appUrl) {
    this.#url = `${appUrl}/validar-inscripcion`;
  }

  /** @returns {Promise<Buffer>} la imagen PNG */
  generar() {
    this.#imagen ??= QRCode.toBuffer(this.#url, { type: 'png', width: 400, margin: 2 });
    return this.#imagen;
  }
}

import { NotificadorSmtp } from './notificadorSmtp.js';

/**
 * Notificador del perfil `pruebas`: arma el mismo mensaje que el SMTP pero lo guarda en memoria,
 * para que las pruebas lo inspeccionen sin red.
 */
export class NotificadorEnMemoria extends NotificadorSmtp {
  /** @param {{ remitente: string, appUrl: string, logo: Buffer }} opciones */
  constructor(opciones) {
    const enviados = [];
    let fallas = 0;
    super({
      ...opciones,
      transporte: {
        sendMail: async (mensaje) => {
          if (fallas > 0) {
            fallas -= 1;
            throw new Error('Falla simulada del envío');
          }
          enviados.push(mensaje);
        },
      },
    });
    this.enviados = enviados;
    this.fallarProximoEnvio = () => {
      fallas += 1;
    };
  }
}

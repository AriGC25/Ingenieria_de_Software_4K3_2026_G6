import { describe, it, expect } from 'vitest';
import nodemailer from 'nodemailer';
import { NotificadorEnMemoria } from '../../../src/infraestructura/email/notificadorEnMemoria.js';
import { NotificadorSmtp } from '../../../src/infraestructura/email/notificadorSmtp.js';
import { unDetalleDeInscripcion } from '../../builders/detalleInscripcion.js';

const QR = Buffer.from('png-del-qr');
const LOGO = Buffer.from('png-del-logo');
const opciones = {
  remitente: 'EcoHarmony Park <parque@mail.com>',
  appUrl: 'https://ecoharmony.vercel.app',
  logo: LOGO,
};

describe('NotificadorEnMemoria', () => {
  it('MAIL-01: guarda los mails enviados', async () => {
    const notificador = new NotificadorEnMemoria(opciones);

    await notificador.enviarConfirmacion({ inscripcion: unDetalleDeInscripcion(), qr: QR });

    expect(notificador.enviados).toHaveLength(1);
    expect(notificador.enviados[0]).toMatchObject({
      to: 'ana@mail.com',
      subject: 'Confirmación de inscripción: Tirolesa, 20/10/2026 10:00',
    });
    expect(notificador.enviados[0].html).toContain('ECOPARK-7K3M9Q');
  });

  it('MAIL-01: puede simular una falla del envío', async () => {
    const notificador = new NotificadorEnMemoria(opciones);
    notificador.fallarProximoEnvio();

    await expect(
      notificador.enviarConfirmacion({ inscripcion: unDetalleDeInscripcion(), qr: QR }),
    ).rejects.toThrow();
    expect(notificador.enviados).toHaveLength(0);
  });
});

describe('NotificadorSmtp', () => {
  it('MAIL-02: arma el mensaje con destinatario, asunto, HTML, logo y QR embebidos y el QR adjunto', async () => {
    const transporte = nodemailer.createTransport({ jsonTransport: true });
    const enviados = [];
    const original = transporte.sendMail.bind(transporte);
    transporte.sendMail = async (mensaje) => {
      const info = await original(mensaje);
      enviados.push(JSON.parse(info.message));
      return info;
    };
    const notificador = new NotificadorSmtp({ ...opciones, transporte });

    await notificador.enviarConfirmacion({ inscripcion: unDetalleDeInscripcion(), qr: QR });

    const [mensaje] = enviados;
    expect(mensaje.from).toEqual({ address: 'parque@mail.com', name: 'EcoHarmony Park' });
    expect(mensaje.to).toEqual([{ address: 'ana@mail.com', name: '' }]);
    expect(mensaje.subject).toBe('Confirmación de inscripción: Tirolesa, 20/10/2026 10:00');
    expect(mensaje.html).toContain('cid:qr');
    const adjuntos = mensaje.attachments.map(({ filename, cid, contentDisposition }) => ({
      filename,
      cid,
      contentDisposition,
    }));
    expect(adjuntos).toEqual([
      { filename: 'logo.png', cid: 'logo', contentDisposition: 'inline' },
      { filename: 'qr.png', cid: 'qr', contentDisposition: 'inline' },
      { filename: 'qr-inscripcion.png', cid: undefined, contentDisposition: 'attachment' },
    ]);
    expect(Buffer.from(mensaje.attachments[2].content, 'base64')).toEqual(QR);
  });

  it('MAIL-03: propaga el error si el transporte falla', async () => {
    const transporte = { sendMail: async () => Promise.reject(new Error('ECONNREFUSED')) };
    const notificador = new NotificadorSmtp({ ...opciones, transporte });

    await expect(
      notificador.enviarConfirmacion({ inscripcion: unDetalleDeInscripcion(), qr: QR }),
    ).rejects.toThrow('ECONNREFUSED');
  });
});

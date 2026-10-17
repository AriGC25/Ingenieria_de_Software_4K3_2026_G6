import { describe, it, expect } from 'vitest';
import { leerConfiguracion } from '../../../src/configuracion.js';

describe('configuracion', () => {
  it('CFG-01: sin variables de entorno usa los valores por defecto del PO', () => {
    const configuracion = leerConfiguracion({});

    expect(configuracion).toEqual({
      baseDatos: { url: 'file:./dev.db' },
      appUrl: 'http://localhost:5173',
      mail: {
        perfil: 'desarrollo',
        remitente: 'EcoHarmony Park <no-responder@ecoharmony.example>',
        smtp: { host: 'localhost', port: 1025, secure: false },
      },
      calendario: {
        apertura: '08:30',
        cierre: '19:00',
        diasCerrados: [1],
        feriadosCerrados: ['12-25', '01-01'],
      },
      seedDiasAdelante: 7,
      relojFijo: null,
    });
  });

  it('CFG-02: lee el horario del parque, los días cerrados y los feriados del entorno', () => {
    const { calendario } = leerConfiguracion({
      PARQUE_APERTURA: '09:00',
      PARQUE_CIERRE: '18:30',
      PARQUE_DIAS_CERRADOS: '0, 1',
      PARQUE_FERIADOS_CERRADOS: '12-25,05-01',
    });

    expect(calendario).toEqual({
      apertura: '09:00',
      cierre: '18:30',
      diasCerrados: [0, 1],
      feriadosCerrados: ['12-25', '05-01'],
    });
  });

  it('CFG-02: lee la base de Turso, la URL pública, los días del seed y el reloj fijo', () => {
    const configuracion = leerConfiguracion({
      TURSO_DATABASE_URL: 'libsql://ecoharmony.turso.io',
      TURSO_AUTH_TOKEN: 'token',
      APP_URL: 'https://ecoharmony.vercel.app/',
      SEED_DIAS_ADELANTE: '3',
      RELOJ_FIJO: '2026-10-20T10:00:00-03:00',
    });

    expect(configuracion.baseDatos).toEqual({
      url: 'libsql://ecoharmony.turso.io',
      authToken: 'token',
    });
    expect(configuracion.appUrl).toBe('https://ecoharmony.vercel.app');
    expect(configuracion.seedDiasAdelante).toBe(3);
    expect(configuracion.relojFijo).toEqual(new Date('2026-10-20T13:00:00Z'));
  });

  it.each([
    ['PARQUE_APERTURA', '25:00'],
    ['PARQUE_CIERRE', '7'],
    ['PARQUE_DIAS_CERRADOS', 'lunes'],
    ['PARQUE_DIAS_CERRADOS', '7'],
    ['PARQUE_FERIADOS_CERRADOS', '25/12'],
    ['SEED_DIAS_ADELANTE', '-1'],
    ['RELOJ_FIJO', 'mañana'],
    ['APP_URL', 'no es una url'],
    ['SMTP_PORT', 'puerto'],
  ])('CFG-03: %s=%s falla con un mensaje claro', (variable, valor) => {
    expect(() => leerConfiguracion({ [variable]: valor })).toThrow(
      new RegExp(`Configuración inválida: ${variable}`),
    );
  });

  it('CFG-04: un MAIL_PERFIL desconocido falla al arrancar', () => {
    expect(() => leerConfiguracion({ MAIL_PERFIL: 'produccion' })).toThrow(
      /Configuración inválida: MAIL_PERFIL/,
    );
  });

  it('CFG-04: el perfil demo sin las credenciales de Gmail falla al arrancar', () => {
    expect(() =>
      leerConfiguracion({ MAIL_PERFIL: 'demo', GMAIL_USER: 'parque@gmail.com' }),
    ).toThrow(/Configuración inválida: GMAIL_APP_PASSWORD/);
  });

  it('el perfil demo usa Gmail SMTP con sus credenciales', () => {
    const { mail } = leerConfiguracion({
      MAIL_PERFIL: 'demo',
      GMAIL_USER: 'parque@gmail.com',
      GMAIL_APP_PASSWORD: 'abcd',
      MAIL_FROM: 'EcoHarmony Park <parque@gmail.com>',
    });

    expect(mail).toEqual({
      perfil: 'demo',
      remitente: 'EcoHarmony Park <parque@gmail.com>',
      smtp: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: { user: 'parque@gmail.com', pass: 'abcd' },
      },
    });
  });

  it('el perfil pruebas no usa SMTP, y SMTP_HOST y SMTP_PORT sobrescriben el del perfil', () => {
    expect(leerConfiguracion({ MAIL_PERFIL: 'pruebas' }).mail.smtp).toBeNull();
    expect(leerConfiguracion({ SMTP_HOST: 'mailpit', SMTP_PORT: '2525' }).mail.smtp).toEqual({
      host: 'mailpit',
      port: 2525,
      secure: false,
    });
  });

  it('las variables vacías cuentan como no definidas', () => {
    expect(leerConfiguracion({ RELOJ_FIJO: '', TURSO_DATABASE_URL: '' })).toMatchObject({
      relojFijo: null,
      baseDatos: { url: 'file:./dev.db' },
    });
  });
});

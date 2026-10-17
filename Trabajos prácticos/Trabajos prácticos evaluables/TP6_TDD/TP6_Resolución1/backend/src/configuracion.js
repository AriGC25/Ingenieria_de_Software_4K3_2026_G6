import { CALENDARIO_POR_DEFECTO } from './dominio/constantes.js';

const HORA = /^([01]\d|2[0-3]):[0-5]\d$/;
const MES_DIA = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const PERFILES_MAIL = ['desarrollo', 'pruebas', 'demo'];

/** Una variable de entorno con un valor mal formado: la aplicación no arranca. */
export class ErrorConfiguracion extends Error {
  constructor(variable, detalle) {
    super(`Configuración inválida: ${variable} ${detalle}`);
    this.name = 'ErrorConfiguracion';
  }
}

/**
 * Lee y valida la configuración desde las variables de entorno. Falla al arrancar si un valor está
 * mal formado, con un mensaje que nombra la variable.
 * @param {Record<string, string | undefined>} [entorno]
 */
export function leerConfiguracion(entorno = process.env) {
  const valor = (nombre) => (entorno[nombre] === '' ? undefined : entorno[nombre]);
  return {
    baseDatos: leerBaseDatos(valor),
    appUrl: leerUrl(valor('APP_URL') ?? 'http://localhost:5173'),
    mail: leerMail(valor),
    calendario: leerCalendario(valor),
    seedDiasAdelante: leerEntero('SEED_DIAS_ADELANTE', valor('SEED_DIAS_ADELANTE') ?? '7'),
    relojFijo: leerRelojFijo(valor('RELOJ_FIJO')),
  };
}

function leerBaseDatos(valor) {
  const turso = valor('TURSO_DATABASE_URL');
  if (turso) return { url: turso, authToken: valor('TURSO_AUTH_TOKEN') };
  return { url: valor('DATABASE_URL') ?? 'file:./dev.db' };
}

function leerUrl(texto) {
  exigir('APP_URL', texto, (t) => URL.canParse(t), 'ser una URL completa');
  return new URL(texto).href.replace(/\/$/, '');
}

function leerMail(valor) {
  const perfil = exigir(
    'MAIL_PERFIL',
    valor('MAIL_PERFIL') ?? 'desarrollo',
    (p) => PERFILES_MAIL.includes(p),
    `ser ${PERFILES_MAIL.join(', ')}`,
  );
  const remitente = valor('MAIL_FROM') ?? 'EcoHarmony Park <no-responder@ecoharmony.example>';
  return { perfil, remitente, smtp: leerSmtp(perfil, valor) };
}

function leerSmtp(perfil, valor) {
  if (perfil === 'pruebas') return null;
  const puerto = valor('SMTP_PORT');
  if (perfil === 'desarrollo') {
    return {
      host: valor('SMTP_HOST') ?? 'localhost',
      port: puerto ? leerEntero('SMTP_PORT', puerto) : 1025,
      secure: false,
    };
  }
  return {
    host: valor('SMTP_HOST') ?? 'smtp.gmail.com',
    port: puerto ? leerEntero('SMTP_PORT', puerto) : 465,
    secure: true,
    auth: { user: requerida(valor, 'GMAIL_USER'), pass: requerida(valor, 'GMAIL_APP_PASSWORD') },
  };
}

function requerida(valor, nombre) {
  const texto = valor(nombre);
  if (!texto) throw new ErrorConfiguracion(nombre, 'es obligatoria con MAIL_PERFIL=demo');
  return texto;
}

function leerCalendario(valor) {
  return {
    apertura: leerHora(
      'PARQUE_APERTURA',
      valor('PARQUE_APERTURA') ?? CALENDARIO_POR_DEFECTO.apertura,
    ),
    cierre: leerHora('PARQUE_CIERRE', valor('PARQUE_CIERRE') ?? CALENDARIO_POR_DEFECTO.cierre),
    diasCerrados: leerDiasCerrados(valor('PARQUE_DIAS_CERRADOS')),
    feriadosCerrados: leerFeriados(valor('PARQUE_FERIADOS_CERRADOS')),
  };
}

/**
 * Valida un valor del entorno con una condición; si no la cumple, la aplicación no arranca.
 * @returns {string} el mismo texto
 */
function exigir(nombre, texto, esValido, descripcion) {
  if (!esValido(texto)) {
    throw new ErrorConfiguracion(nombre, `debe ${descripcion} (recibido "${texto}")`);
  }
  return texto;
}

function leerHora(nombre, texto) {
  return exigir(nombre, texto, (t) => HORA.test(t), 'tener el formato HH:mm');
}

function lista(texto) {
  return texto
    .split(',')
    .map((parte) => parte.trim())
    .filter(Boolean);
}

function leerDiasCerrados(texto) {
  if (texto === undefined) return [...CALENDARIO_POR_DEFECTO.diasCerrados];
  const esDia = (dia) => /^[0-6]$/.test(dia);
  return lista(texto).map((dia) =>
    Number(exigir('PARQUE_DIAS_CERRADOS', dia, esDia, 'listar días de 0 a 6')),
  );
}

function leerFeriados(texto) {
  if (texto === undefined) return [...CALENDARIO_POR_DEFECTO.feriadosCerrados];
  const esMesDia = (feriado) => MES_DIA.test(feriado);
  return lista(texto).map((f) =>
    exigir('PARQUE_FERIADOS_CERRADOS', f, esMesDia, 'listar fechas MM-DD'),
  );
}

function leerEntero(nombre, texto) {
  return Number(exigir(nombre, texto, (t) => /^\d+$/.test(t), 'ser un entero positivo'));
}

function leerRelojFijo(texto) {
  if (texto === undefined) return null;
  const esFecha = (t) => !Number.isNaN(new Date(t).getTime());
  return new Date(exigir('RELOJ_FIJO', texto, esFecha, 'ser una fecha ISO 8601'));
}

import { EDAD_MAXIMA, EDAD_MINIMA_ADMITIDA, NOMBRE_MAX_CARACTERES } from './constantes.js';

/** Catálogo de mensajes al visitante (diseño: contenido y mensajes). */
export const MENSAJES = Object.freeze({
  DATOS_PARTICIPANTE_INVALIDOS: Object.freeze({
    nombre: `Ingresá un nombre válido (hasta ${NOMBRE_MAX_CARACTERES} letras).`,
    dni: 'Ingresá un DNI válido (7 u 8 números, sin puntos).',
    edad: `Ingresá una edad entre ${EDAD_MINIMA_ADMITIDA} y ${EDAD_MAXIMA}.`,
    talle: 'Elegí un talle de la lista.',
    participantes: 'Agregá al menos una persona.',
  }),
  DNI_REPETIDO: 'Este DNI ya está en la inscripción.',
  EDAD_NO_PERMITIDA: (edadMinima) => `Esta actividad es para personas de ${edadMinima} años o más.`,
  TALLE_REQUERIDO: 'Ingresá el talle.',
  SIN_CUPO: 'No quedan cupos suficientes para este horario. Probá con otro.',
});

/** Error de una regla de negocio. Lleva un `codigo` estable y, si es de un dato, su `campo`. */
export class ErrorDominio extends Error {
  /**
   * @param {string} codigo
   * @param {string} mensaje mensaje para el visitante
   * @param {string} [campo] campo al que se refiere, por ejemplo `participantes[1].talle`
   */
  constructor(codigo, mensaje, campo) {
    super(mensaje);
    this.name = 'ErrorDominio';
    this.codigo = codigo;
    this.mensaje = mensaje;
    if (campo) this.campo = campo;
  }
}

/** Nombre, DNI, edad o talle con formato inválido, o una lista de participantes vacía. */
export class DatosParticipanteInvalidos extends ErrorDominio {
  /** @param {string} campo */
  constructor(campo) {
    const dato = campo.split('.').at(-1);
    super('DATOS_PARTICIPANTE_INVALIDOS', MENSAJES.DATOS_PARTICIPANTE_INVALIDOS[dato], campo);
  }
}

/** El mismo DNI aparece dos veces en la inscripción. */
export class DniRepetido extends ErrorDominio {
  /** @param {string} campo */
  constructor(campo) {
    super('DNI_REPETIDO', MENSAJES.DNI_REPETIDO, campo);
  }
}

/** La edad es menor a la mínima de la actividad. */
export class EdadNoPermitida extends ErrorDominio {
  /**
   * @param {string} campo
   * @param {number} edadMinima
   */
  constructor(campo, edadMinima) {
    super('EDAD_NO_PERMITIDA', MENSAJES.EDAD_NO_PERMITIDA(edadMinima), campo);
  }
}

/** Falta el talle en una actividad que lo requiere. */
export class TalleRequerido extends ErrorDominio {
  /** @param {string} campo */
  constructor(campo) {
    super('TALLE_REQUERIDO', MENSAJES.TALLE_REQUERIDO, campo);
  }
}

/** El turno no tiene cupo para todo el grupo. */
export class SinCupo extends ErrorDominio {
  constructor() {
    super('SIN_CUPO', MENSAJES.SIN_CUPO);
  }
}

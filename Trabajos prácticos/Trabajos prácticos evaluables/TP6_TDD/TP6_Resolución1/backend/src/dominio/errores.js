const MENSAJES_DATO_INVALIDO = {
  nombre: 'Ingresá un nombre válido (hasta 100 letras).',
  dni: 'Ingresá un DNI válido (7 u 8 números, sin puntos).',
  edad: 'Ingresá una edad entre 0 y 100.',
  talle: 'Elegí un talle de la lista.',
  participantes: 'Agregá al menos una persona.',
};

/** Error de una regla de negocio. Lleva un `codigo` estable y, si es de un dato, su `campo`. */
export class ErrorDominio extends Error {
  /**
   * @param {string} codigo
   * @param {string} mensaje mensaje para el visitante (catálogo de mensajes)
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
    super('DATOS_PARTICIPANTE_INVALIDOS', MENSAJES_DATO_INVALIDO[dato], campo);
  }
}

/** El mismo DNI aparece dos veces en la inscripción. */
export class DniRepetido extends ErrorDominio {
  /** @param {string} campo */
  constructor(campo) {
    super('DNI_REPETIDO', 'Este DNI ya está en la inscripción.', campo);
  }
}

/** La edad es menor a la mínima de la actividad. */
export class EdadNoPermitida extends ErrorDominio {
  /**
   * @param {string} campo
   * @param {number} edadMinima
   */
  constructor(campo, edadMinima) {
    super(
      'EDAD_NO_PERMITIDA',
      `Esta actividad es para personas de ${edadMinima} años o más.`,
      campo,
    );
  }
}

/** Falta el talle en una actividad que lo requiere. */
export class TalleRequerido extends ErrorDominio {
  /** @param {string} campo */
  constructor(campo) {
    super('TALLE_REQUERIDO', 'Ingresá el talle.', campo);
  }
}

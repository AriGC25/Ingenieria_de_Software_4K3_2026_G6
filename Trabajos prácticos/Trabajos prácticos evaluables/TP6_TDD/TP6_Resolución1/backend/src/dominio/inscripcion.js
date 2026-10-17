import { EMAIL_MAX_CARACTERES, FORMATO_EMAIL } from './constantes.js';
import {
  DatosParticipanteInvalidos,
  HorarioNoDisponible,
  InscripcionSuperpuesta,
  SinCupo,
  SolicitudInvalida,
  TerminosNoAceptados,
} from './errores.js';

/**
 * Aplica la regla completa de inscripción y reserva los cupos del turno. Corta en el primer
 * error, en el orden de validación: turno, cantidad, participantes, términos y superposición.
 * @param {{ turno: import('./turno.js').Turno, email: string, aceptaTerminos: boolean,
 *   participantes: object[], ahora: Date, calendario: object, dnisYaInscriptos?: string[] }} solicitud
 * @returns {{ turno: import('./turno.js').Turno, email: string, participantes: object[],
 *   terminosAceptadosEn: Date }}
 * @throws {import('./errores.js').ErrorDominio}
 */
export function crearInscripcion({
  turno,
  email,
  aceptaTerminos,
  participantes,
  ahora,
  calendario,
  dnisYaInscriptos = [],
}) {
  validarEmail(email);
  validarTurno(turno, ahora, calendario);
  validarCantidad(participantes.length, turno);
  const validados = validarParticipantes(participantes, turno.actividad);
  if (aceptaTerminos !== true) throw new TerminosNoAceptados();
  validarSuperposicion(validados, dnisYaInscriptos);

  turno.reservar(validados.length);
  return Object.freeze({ turno, email, participantes: validados, terminosAceptadosEn: ahora });
}

function validarEmail(email) {
  const valido =
    typeof email === 'string' && email.length <= EMAIL_MAX_CARACTERES && FORMATO_EMAIL.test(email);
  if (!valido) throw new SolicitudInvalida('email');
}

function validarTurno(turno, ahora, calendario) {
  if (turno.estado(ahora, calendario).estado === 'no_disponible') throw new HorarioNoDisponible();
}

function validarCantidad(cantidad, turno) {
  if (cantidad === 0) throw new DatosParticipanteInvalidos('participantes');
  if (cantidad > turno.cuposDisponibles()) throw new SinCupo();
}

function validarParticipantes(participantes, actividad) {
  return participantes.reduce((validados, datos, indice) => {
    const dnisPrevios = validados.map((p) => p.dni);
    return [...validados, actividad.prepararParticipante(datos, { indice, dnisPrevios })];
  }, []);
}

function validarSuperposicion(participantes, dnisYaInscriptos) {
  if (participantes.some((p) => dnisYaInscriptos.includes(p.dni))) {
    throw new InscripcionSuperpuesta();
  }
}

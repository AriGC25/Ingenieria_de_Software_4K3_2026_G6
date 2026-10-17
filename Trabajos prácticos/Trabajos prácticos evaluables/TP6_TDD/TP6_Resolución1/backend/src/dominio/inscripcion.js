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
  if (turno.estado(ahora, calendario).estado === 'no_disponible') throw new HorarioNoDisponible();
  if (participantes.length === 0) throw new DatosParticipanteInvalidos('participantes');
  if (participantes.length > turno.cuposDisponibles()) throw new SinCupo();

  const validados = [];
  participantes.forEach((datos, indice) => {
    const dnisPrevios = validados.map((p) => p.dni);
    validados.push(turno.actividad.prepararParticipante(datos, { indice, dnisPrevios }));
  });

  if (aceptaTerminos !== true) throw new TerminosNoAceptados();
  if (validados.some((p) => dnisYaInscriptos.includes(p.dni))) throw new InscripcionSuperpuesta();

  turno.reservar(validados.length);
  return Object.freeze({ turno, email, participantes: validados, terminosAceptadosEn: ahora });
}

function validarEmail(email) {
  const valido =
    typeof email === 'string' && email.length <= EMAIL_MAX_CARACTERES && FORMATO_EMAIL.test(email);
  if (!valido) throw new SolicitudInvalida('email');
}

/**
 * Contratos (puertos) que la aplicación necesita del exterior. JavaScript no tiene interfaces:
 * cualquier objeto con estos métodos cumple el contrato, sea un adaptador real o un doble de prueba.
 */

/**
 * @typedef {object} RepositorioActividades
 * @property {() => Promise<import('../dominio/actividad.js').Actividad[]>} listar
 * @property {(id: string) => Promise<import('../dominio/actividad.js').Actividad | null>} obtenerPorId
 */

/**
 * @typedef {object} RepositorioTurnos
 * @property {(id: string) => Promise<import('../dominio/turno.js').Turno | null>} obtenerPorId
 *   el turno con su actividad, o `null` si no existe
 * @property {(actividadId: string, fecha: string) => Promise<import('../dominio/turno.js').Turno[]>}
 *   listarPorActividadYFecha los turnos de una fecha argentina (`YYYY-MM-DD`)
 * @property {(desde: Date, hasta: Date) => Promise<import('../dominio/turno.js').Turno[]>}
 *   listarDisponiblesEntre los turnos con cupo libre que empiezan entre los dos instantes
 */

/**
 * @typedef {object} InscripcionARegistrar
 * @property {string} codigo
 * @property {string} turnoId
 * @property {string} email
 * @property {Date} terminosAceptadosEn
 * @property {{ nombre: string, dni: string, edad: number, talle: string | null }[]} participantes
 */

/**
 * @typedef {object} RepositorioInscripciones
 * @property {(inicio: Date, dnis: string[]) => Promise<string[]>} dnisInscriptosEnInicio
 *   los DNI de la lista ya inscriptos en algún turno que empieza en ese instante
 * @property {(inscripcion: InscripcionARegistrar) => Promise<{ id: string }>} registrarConReserva
 *   reserva los cupos y registra la inscripción en una transacción. Lanza `SinCupo` si no hay
 *   cupo y `CodigoDuplicado` si el código ya existe
 * @property {(inscripcionId: string) => Promise<void>} anular
 *   borra la inscripción y devuelve sus cupos al turno
 */

/**
 * @typedef {object} DetalleInscripcion
 * @property {string} codigo
 * @property {string} actividad nombre de la actividad
 * @property {boolean} requiereTalle
 * @property {Date} inicio
 * @property {string} fecha `YYYY-MM-DD`, en hora argentina
 * @property {string} hora `HH:mm`, en hora argentina
 * @property {string} email
 * @property {{ nombre: string, dni: string, edad: number, talle: string | null }[]} participantes
 */

/**
 * @typedef {object} Notificador
 * @property {(datos: { inscripcion: DetalleInscripcion, qr: Buffer }) => Promise<void>}
 *   enviarConfirmacion envía el mail de confirmación; lanza un error si no se pudo enviar
 */

/**
 * @typedef {object} GeneradorQR
 * @property {() => Promise<Buffer>} generar la imagen PNG del QR
 */

/**
 * @typedef {object} GeneradorCodigo
 * @property {() => string} generar un código de inscripción
 */

/**
 * @typedef {object} Reloj
 * @property {() => Date} ahora
 */

/** El código de inscripción ya existe en la base: el caso de uso reintenta con otro. */
export class CodigoDuplicado extends Error {
  constructor() {
    super('El código de inscripción ya existe');
    this.name = 'CodigoDuplicado';
  }
}

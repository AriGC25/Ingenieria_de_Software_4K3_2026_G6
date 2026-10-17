import { HorarioNoDisponible } from '../dominio/errores.js';
import { crearInscripcion } from '../dominio/inscripcion.js';

/** Inscribe a un grupo en un turno y le envía la confirmación por mail. */
export class InscribirseActividad {
  /**
   * @param {{ repositorioTurnos: import('./puertos.js').RepositorioTurnos,
   *   repositorioInscripciones: import('./puertos.js').RepositorioInscripciones,
   *   notificador: import('./puertos.js').Notificador,
   *   generadorQR: import('./puertos.js').GeneradorQR,
   *   generadorCodigo: import('./puertos.js').GeneradorCodigo,
   *   reloj: import('./puertos.js').Reloj, calendario: object }} dependencias
   */
  constructor(dependencias) {
    Object.assign(this, dependencias);
  }

  /**
   * @param {{ turnoId: string, email: string, aceptaTerminos: boolean, participantes: object[] }} solicitud
   * @returns {Promise<object>} la inscripción confirmada
   * @throws {import('../dominio/errores.js').ErrorDominio}
   */
  async ejecutar({ turnoId, email, aceptaTerminos, participantes }) {
    const turno = await this.repositorioTurnos.obtenerPorId(turnoId);
    if (!turno) throw new HorarioNoDisponible();

    const dnis = participantes.map((p) => p.dni);
    const dnisYaInscriptos = await this.repositorioInscripciones.dnisInscriptosEnInicio(
      turno.inicio,
      dnis,
    );
    const inscripcion = crearInscripcion({
      turno,
      email,
      aceptaTerminos,
      participantes,
      ahora: this.reloj.ahora(),
      calendario: this.calendario,
      dnisYaInscriptos,
    });

    const codigo = this.generadorCodigo.generar();
    await this.repositorioInscripciones.registrarConReserva({
      codigo,
      turnoId,
      email,
      terminosAceptadosEn: inscripcion.terminosAceptadosEn,
      participantes: inscripcion.participantes,
    });

    const detalle = {
      codigo,
      actividad: turno.actividad.nombre,
      requiereTalle: turno.actividad.requiereTalle,
      inicio: turno.inicio,
      fecha: turno.fecha,
      hora: turno.hora,
      email,
      participantes: inscripcion.participantes,
    };
    const qr = await this.generadorQR.generar();
    await this.notificador.enviarConfirmacion({ inscripcion: detalle, qr });

    const { codigo: c, actividad, fecha, hora } = detalle;
    return { codigo: c, actividad, fecha, hora, email, participantes: inscripcion.participantes };
  }
}

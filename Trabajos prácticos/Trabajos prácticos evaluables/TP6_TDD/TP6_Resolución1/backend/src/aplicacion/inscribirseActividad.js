import { INTENTOS_CODIGO } from '../dominio/constantes.js';
import { EnvioConfirmacionFallido, HorarioNoDisponible } from '../dominio/errores.js';
import { crearInscripcion } from '../dominio/inscripcion.js';
import { CodigoDuplicado } from './puertos.js';

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
  async ejecutar(solicitud) {
    const turno = await this.repositorioTurnos.obtenerPorId(solicitud.turnoId);
    if (!turno) throw new HorarioNoDisponible();

    const inscripcion = await this.#validar(turno, solicitud);
    const { codigo, id } = await this.#registrar(inscripcion);
    const detalle = detalleDe(codigo, inscripcion);
    await this.#confirmarOAnular(id, detalle);

    return respuestaDe(detalle);
  }

  async #validar(turno, { email, aceptaTerminos, participantes }) {
    const dnisYaInscriptos = await this.repositorioInscripciones.dnisInscriptosEnInicio(
      turno.inicio,
      participantes.map((p) => p.dni),
    );
    return crearInscripcion({
      turno,
      email,
      aceptaTerminos,
      participantes,
      ahora: this.reloj.ahora(),
      calendario: this.calendario,
      dnisYaInscriptos,
    });
  }

  async #registrar(inscripcion) {
    for (let intento = 0; intento < INTENTOS_CODIGO; intento++) {
      const registrada = await this.#intentarRegistro(this.generadorCodigo.generar(), inscripcion);
      if (registrada) return registrada;
    }
    throw new Error('No se pudo generar un código de inscripción único');
  }

  /** @returns {Promise<{ codigo: string, id: string } | null>} `null` si el código ya existe */
  async #intentarRegistro(codigo, { turno, email, terminosAceptadosEn, participantes }) {
    try {
      const { id } = await this.repositorioInscripciones.registrarConReserva({
        codigo,
        turnoId: turno.id,
        email,
        terminosAceptadosEn,
        participantes,
      });
      return { codigo, id };
    } catch (error) {
      if (error instanceof CodigoDuplicado) return null;
      throw error;
    }
  }

  // El mail se envía fuera de la transacción para no bloquear el turno mientras responde el
  // servidor de correo; si falla, se deshace la inscripción (INT-05).
  async #confirmarOAnular(id, detalle) {
    try {
      await this.#notificar(detalle);
    } catch {
      await this.repositorioInscripciones.anular(id);
      throw new EnvioConfirmacionFallido();
    }
  }

  async #notificar(detalle) {
    const qr = await this.generadorQR.generar();
    await this.notificador.enviarConfirmacion({ inscripcion: detalle, qr });
  }
}

/** @returns {import('./puertos.js').DetalleInscripcion} */
function detalleDe(codigo, { turno, email, participantes }) {
  return {
    codigo,
    actividad: turno.actividad.nombre,
    fecha: turno.fecha,
    hora: turno.hora,
    email,
    participantes,
    requiereTalle: turno.actividad.requiereTalle,
    inicio: turno.inicio,
  };
}

function respuestaDe({ codigo, actividad, fecha, hora, email, participantes }) {
  return { codigo, actividad, fecha, hora, email, participantes };
}

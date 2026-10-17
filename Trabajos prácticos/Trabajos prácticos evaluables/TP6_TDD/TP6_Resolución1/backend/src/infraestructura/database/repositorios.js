import { addDays } from 'date-fns';
import { CodigoDuplicado } from '../../aplicacion/puertos.js';
import { Actividad } from '../../dominio/actividad.js';
import { SinCupo } from '../../dominio/errores.js';
import { instanteArgentino } from '../../dominio/fechas.js';
import { Turno } from '../../dominio/turno.js';

const aActividad = (fila) => new Actividad(fila);

const aTurno = ({ actividad, ...fila }) => new Turno({ ...fila, actividad: aActividad(actividad) });

const CON_ACTIVIDAD = Object.freeze({ include: { actividad: true } });

/** Implementa `RepositorioActividades` con Prisma. */
export class RepositorioActividadesPrisma {
  /** @param {import('../../../generated/client.js').PrismaClient} prisma */
  constructor(prisma) {
    this.prisma = prisma;
  }

  async listar() {
    const filas = await this.prisma.actividad.findMany({ orderBy: { nombre: 'asc' } });
    return filas.map(aActividad);
  }

  /** @param {string} id */
  async obtenerPorId(id) {
    const fila = await this.prisma.actividad.findUnique({ where: { id } });
    return fila ? aActividad(fila) : null;
  }
}

/** Implementa `RepositorioTurnos` con Prisma. */
export class RepositorioTurnosPrisma {
  /** @param {import('../../../generated/client.js').PrismaClient} prisma */
  constructor(prisma) {
    this.prisma = prisma;
  }

  /** @param {string} id */
  async obtenerPorId(id) {
    const fila = await this.prisma.turno.findUnique({ where: { id }, ...CON_ACTIVIDAD });
    return fila ? aTurno(fila) : null;
  }

  /**
   * @param {string} actividadId
   * @param {string} fecha `YYYY-MM-DD` en hora argentina
   */
  async listarPorActividadYFecha(actividadId, fecha) {
    const desde = instanteArgentino(fecha);
    const filas = await this.prisma.turno.findMany({
      where: { actividadId, inicio: { gte: desde, lt: addDays(desde, 1) } },
      ...CON_ACTIVIDAD,
      orderBy: { inicio: 'asc' },
    });
    return filas.map(aTurno);
  }

  /**
   * @param {Date} desde
   * @param {Date} hasta
   */
  async listarDisponiblesEntre(desde, hasta) {
    const filas = await this.prisma.turno.findMany({
      where: {
        inicio: { gte: desde, lte: hasta },
        cupoOcupado: { lt: this.prisma.turno.fields.cupoMaximo },
      },
      ...CON_ACTIVIDAD,
    });
    return filas.map(aTurno);
  }
}

/** Implementa `RepositorioInscripciones` con Prisma. */
export class RepositorioInscripcionesPrisma {
  /** @param {import('../../../generated/client.js').PrismaClient} prisma */
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * @param {Date} inicio
   * @param {string[]} dnis
   * @returns {Promise<string[]>}
   */
  async dnisInscriptosEnInicio(inicio, dnis) {
    const filas = await this.prisma.participante.findMany({
      where: { dni: { in: dnis }, inscripcion: { turno: { inicio } } },
      select: { dni: true },
      distinct: ['dni'],
    });
    return filas.map((fila) => fila.dni);
  }

  /**
   * Reserva los cupos con una actualización condicional y registra la inscripción, en una sola
   * transacción: si dos visitantes piden el último lugar a la vez, solo uno lo obtiene (D-02).
   * @param {import('../../aplicacion/puertos.js').InscripcionARegistrar} inscripcion
   * @returns {Promise<{ id: string }>}
   * @throws {SinCupo | CodigoDuplicado}
   */
  async registrarConReserva({ codigo, turnoId, email, terminosAceptadosEn, participantes }) {
    const cantidad = participantes.length;
    try {
      return await this.prisma.$transaction(async (tx) => {
        const reservadas = await tx.$executeRaw`
          UPDATE Turno SET cupoOcupado = cupoOcupado + ${cantidad}
          WHERE id = ${turnoId} AND cupoOcupado + ${cantidad} <= cupoMaximo`;
        if (reservadas === 0) throw new SinCupo();
        return tx.inscripcion.create({
          data: {
            codigo,
            turnoId,
            email,
            terminosAceptadosEn,
            participantes: { create: participantes },
          },
          select: { id: true },
        });
      });
    } catch (error) {
      if (error?.code === 'P2002') throw new CodigoDuplicado();
      throw error;
    }
  }

  /**
   * Borra la inscripción con sus participantes y devuelve sus cupos al turno.
   * @param {string} inscripcionId
   */
  async anular(inscripcionId) {
    await this.prisma.$transaction(async (tx) => {
      const inscripcion = await tx.inscripcion.findUnique({
        where: { id: inscripcionId },
        include: { _count: { select: { participantes: true } } },
      });
      await tx.inscripcion.delete({ where: { id: inscripcionId } });
      await tx.turno.update({
        where: { id: inscripcion.turnoId },
        data: { cupoOcupado: { decrement: inscripcion._count.participantes } },
      });
    });
  }
}

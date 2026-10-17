import { addDays } from 'date-fns';
import { Actividad } from '../../dominio/actividad.js';
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

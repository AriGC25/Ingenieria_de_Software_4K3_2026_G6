import { aActividad } from './mapeos.js';

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

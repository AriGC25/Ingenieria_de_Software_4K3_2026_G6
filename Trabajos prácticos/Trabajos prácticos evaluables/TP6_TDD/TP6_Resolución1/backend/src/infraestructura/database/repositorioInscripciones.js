import { CodigoDuplicado } from '../../aplicacion/puertos.js';
import { SinCupo } from '../../dominio/errores.js';

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
        await reservarCupos(tx, turnoId, cantidad);
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

/** Suma los cupos solo si alcanzan; si no actualiza ninguna fila, no había cupo. */
async function reservarCupos(tx, turnoId, cantidad) {
  const reservadas = await tx.$executeRaw`
    UPDATE Turno SET cupoOcupado = cupoOcupado + ${cantidad}
    WHERE id = ${turnoId} AND cupoOcupado + ${cantidad} <= cupoMaximo`;
  if (reservadas === 0) throw new SinCupo();
}

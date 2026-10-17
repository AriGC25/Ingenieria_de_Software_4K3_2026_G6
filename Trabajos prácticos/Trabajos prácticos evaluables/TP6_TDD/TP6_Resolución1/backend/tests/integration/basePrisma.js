import { crearClientePrisma } from '../../src/infraestructura/database/clientePrisma.js';
import { aplicarMigraciones } from '../../src/infraestructura/database/migraciones.js';
import { DATOS_ACTIVIDADES, datosDeActividad } from '../builders/actividad.js';
import { baseTemporal } from './baseTemporal.js';

/**
 * Base SQLite temporal con el esquema aplicado, un cliente Prisma y ayudas para cargar datos.
 */
export async function basePrismaDePrueba() {
  const base = baseTemporal();
  await aplicarMigraciones(base.cliente);
  const prisma = crearClientePrisma({ url: base.url });

  return {
    prisma,
    async cargarActividades() {
      await prisma.actividad.createMany({
        data: Object.keys(DATOS_ACTIVIDADES).map((id) => datosDeActividad(id)),
      });
    },
    /** @param {{ actividadId?: string, fecha?: string, hora?: string, ocupados?: number }} [turno] */
    async cargarTurno({
      actividadId = 'tirolesa',
      fecha = '2026-10-20',
      hora = '10',
      ocupados = 0,
    } = {}) {
      const { cupoPorTurno } = DATOS_ACTIVIDADES[actividadId];
      return prisma.turno.create({
        data: {
          id: `t-${actividadId}-${fecha}-${hora}`,
          actividadId,
          inicio: new Date(`${fecha}T${hora}:00:00-03:00`),
          cupoMaximo: cupoPorTurno,
          cupoOcupado: ocupados,
        },
      });
    },
    async cerrar() {
      await prisma.$disconnect();
      base.borrar();
    },
  };
}

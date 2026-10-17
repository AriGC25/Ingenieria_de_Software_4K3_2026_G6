import { componerAplicacion } from '../../../src/composicion.js';
import { leerConfiguracion } from '../../../src/configuracion.js';
import { crearCalendarioParque } from '../../../src/dominio/calendarioParque.js';
import { aplicarMigraciones } from '../../../src/infraestructura/database/migraciones.js';
import { sembrarDatos } from '../../../src/infraestructura/database/sembrarDatos.js';
import { AHORA } from '../../builders/turno.js';
import { baseTemporal } from '../baseTemporal.js';

/**
 * Levanta la aplicación compuesta como en `main.js`, sobre una base SQLite temporal con el seed,
 * el perfil de mail `pruebas` (notificador en memoria) y el reloj fijo en el martes 20/10 09:00.
 * @param {{ ahora?: Date }} [opciones]
 */
export async function contextoHttp({ ahora = AHORA } = {}) {
  const base = baseTemporal();
  await aplicarMigraciones(base.cliente);
  const configuracion = leerConfiguracion({
    DATABASE_URL: base.url,
    MAIL_PERFIL: 'pruebas',
    APP_URL: 'https://ecoharmony.example',
    RELOJ_FIJO: ahora.toISOString(),
  });
  const { app, prisma, notificador } = componerAplicacion(configuracion);
  await sembrarDatos(prisma, {
    ahora,
    calendario: crearCalendarioParque(configuracion.calendario),
    diasAdelante: 7,
  });

  return {
    app,
    prisma,
    notificador,
    cupoOcupado: async (id) => (await prisma.turno.findUnique({ where: { id } })).cupoOcupado,
    async cerrar() {
      await prisma.$disconnect();
      base.borrar();
    },
  };
}

import { leerConfiguracion } from '../src/configuracion.js';
import { crearCalendarioParque } from '../src/dominio/calendarioParque.js';
import { crearClientePrisma } from '../src/infraestructura/database/clientePrisma.js';
import { sembrarDatos } from '../src/infraestructura/database/sembrarDatos.js';
import { crearReloj } from '../src/infraestructura/reloj.js';

const configuracion = leerConfiguracion();
const prisma = crearClientePrisma(configuracion.baseDatos);

try {
  const { turnosCreados } = await sembrarDatos(prisma, {
    ahora: crearReloj(configuracion.relojFijo).ahora(),
    calendario: crearCalendarioParque(configuracion.calendario),
    diasAdelante: configuracion.seedDiasAdelante,
  });
  console.log(`Seed aplicado en ${configuracion.baseDatos.url}: ${turnosCreados} turnos nuevos.`);
} finally {
  await prisma.$disconnect();
}

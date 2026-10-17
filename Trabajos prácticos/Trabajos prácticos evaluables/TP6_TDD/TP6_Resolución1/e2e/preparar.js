import { rmSync } from 'node:fs';
import { createClient } from '@libsql/client';
import { crearCalendarioParque } from '../backend/src/dominio/calendarioParque.js';
import { crearClientePrisma } from '../backend/src/infraestructura/database/clientePrisma.js';
import { aplicarMigraciones } from '../backend/src/infraestructura/database/migraciones.js';
import { sembrarDatos } from '../backend/src/infraestructura/database/sembrarDatos.js';
import { ARCHIVO_BASE, MAILPIT, RELOJ_FIJO } from './entorno.js';

/** Base nueva con el seed y la bandeja de Mailpit vacía, antes de correr las pruebas E2E. */
export default async function preparar() {
  rmSync(ARCHIVO_BASE, { force: true });
  const url = `file:${ARCHIVO_BASE}`;
  const cliente = createClient({ url });
  await aplicarMigraciones(cliente);
  cliente.close();

  const prisma = crearClientePrisma({ url });
  await sembrarDatos(prisma, {
    ahora: new Date(RELOJ_FIJO),
    calendario: crearCalendarioParque(),
    diasAdelante: 7,
  });
  await prisma.$disconnect();

  const mailpit = await fetch(`${MAILPIT}/api/v1/messages`, { method: 'DELETE' }).catch(() => null);
  if (!mailpit?.ok) {
    throw new Error(
      `Mailpit no responde en ${MAILPIT}. Levantalo con: docker run -d --name mailpit -p 1025:1025 -p 8025:8025 axllent/mailpit`,
    );
  }
}

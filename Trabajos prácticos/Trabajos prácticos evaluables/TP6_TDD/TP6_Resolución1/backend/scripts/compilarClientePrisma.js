import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';

// Prisma 7 genera el cliente en TypeScript. Se transpila a JavaScript en el lugar para que Node
// lo cargue sin compilador, igual en local, en las pruebas y en Vercel.
const carpeta = fileURLToPath(new URL('../generated', import.meta.url));

function archivosTs(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entrada) => {
    const ruta = join(dir, entrada.name);
    if (entrada.isDirectory()) return archivosTs(ruta);
    return entrada.name.endsWith('.ts') && !entrada.name.endsWith('.d.ts') ? [ruta] : [];
  });
}

buildSync({
  entryPoints: archivosTs(carpeta),
  outdir: carpeta,
  outbase: carpeta,
  format: 'esm',
  platform: 'node',
  target: 'node22',
  logLevel: 'warning',
});

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createClient } from '@libsql/client';

/**
 * Crea una base SQLite en un archivo temporal, propia de cada archivo de prueba.
 * @returns {{ url: string, cliente: import('@libsql/client').Client, borrar: () => void }}
 */
export function baseTemporal() {
  const carpeta = mkdtempSync(join(tmpdir(), 'ecoharmony-'));
  const url = `file:${join(carpeta, 'prueba.db')}`;
  const cliente = createClient({ url });
  return {
    url,
    cliente,
    borrar() {
      cliente.close();
      rmSync(carpeta, { recursive: true, force: true });
    },
  };
}

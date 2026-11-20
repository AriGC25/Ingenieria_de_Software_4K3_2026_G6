import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';

// El proyecto vive en una subcarpeta del repositorio, así que Husky se instala desde la raíz de Git.
// En Vercel o en CI no hay hooks que instalar.
if (!process.env.CI && !process.env.VERCEL && existsSync(new URL('../.husky', import.meta.url))) {
  try {
    const opciones = { encoding: 'utf8' };
    const raiz = execSync('git rev-parse --show-toplevel', opciones).trim();
    const prefijo = execSync('git rev-parse --show-prefix', opciones).trim();
    execSync(`npx husky "${prefijo}.husky"`, { cwd: raiz, stdio: 'ignore' });
  } catch {
    // Sin Git no hay hooks que instalar.
  }
}

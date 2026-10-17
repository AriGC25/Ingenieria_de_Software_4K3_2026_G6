import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

// Genera el logo PNG del mail (los clientes de correo no muestran SVG). Uso:
//   node scripts/generarLogoPng.js <carpeta con Lato-Regular.ttf y Lato-Bold.ttf>
const carpetaFuentes = process.argv[2];
if (!carpetaFuentes) {
  console.error('Indicá la carpeta con las fuentes Lato (.ttf).');
  process.exit(1);
}

const raiz = fileURLToPath(new URL('..', import.meta.url));
const svg = readFileSync(join(raiz, 'frontend/src/assets/logo-claro.svg'), 'utf8');
const fuentes = readdirSync(carpetaFuentes)
  .filter((archivo) => archivo.endsWith('.ttf'))
  .map((archivo) => join(carpetaFuentes, archivo));

const png = new Resvg(svg, {
  fitTo: { mode: 'width', value: 440 },
  font: { fontFiles: fuentes, loadSystemFonts: false, defaultFontFamily: 'Lato' },
})
  .render()
  .asPng();

const destino = join(raiz, 'backend/src/infraestructura/email/templates/logo.png');
writeFileSync(destino, png);
console.log(`Logo generado: ${destino} (${png.length} bytes)`);

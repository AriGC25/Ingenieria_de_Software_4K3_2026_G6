import { crearApp } from './interfaces/http/app.js';

const PUERTO = Number(process.env.PORT ?? 3000);

export const app = crearApp();

// En Vercel la función exporta la app; solo se escucha en un puerto fuera de Vercel.
if (!process.env.VERCEL) {
  app.listen(PUERTO, () => {
    console.log(`Backend escuchando en http://localhost:${PUERTO}`);
  });
}

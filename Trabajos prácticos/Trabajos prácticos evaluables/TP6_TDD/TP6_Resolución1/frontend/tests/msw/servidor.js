import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { ACTIVIDADES, FECHAS, TURNOS } from './datos.js';

/** Respuestas por defecto de la API; cada prueba puede reemplazarlas con `servidor.use`. */
export const manejadores = [
  http.get('*/api/actividades', () => HttpResponse.json(ACTIVIDADES)),
  http.get('*/api/fechas', () => HttpResponse.json(FECHAS)),
  http.get('*/api/actividades/:id/turnos', ({ params, request }) => {
    const fecha = new URL(request.url).searchParams.get('fecha');
    const turnos = TURNOS.turnos.map((t) => ({ ...t, id: t.id.replace('-x-', `-${params.id}-`) }));
    return HttpResponse.json({ ...TURNOS, fecha, turnos });
  }),
  http.post('*/api/inscripciones', async ({ request }) => {
    const solicitud = await request.json();
    return HttpResponse.json(
      {
        codigo: 'ECOPARK-7K3M9Q',
        actividad: 'Tirolesa',
        fecha: '2026-10-20',
        hora: '10:00',
        email: solicitud.email,
        participantes: solicitud.participantes,
      },
      { status: 201 },
    );
  }),
];

export const servidor = setupServer(...manejadores);

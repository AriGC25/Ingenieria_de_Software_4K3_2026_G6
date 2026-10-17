import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import {
  ErrorApi,
  crearInscripcion,
  listarActividades,
  listarFechas,
  listarTurnos,
} from '../../src/api/cliente.js';
import { ACTIVIDADES, FECHAS } from '../msw/datos.js';
import { servidor } from '../msw/servidor.js';

describe('cliente HTTP', () => {
  it('listarActividades devuelve las actividades de GET /api/actividades', async () => {
    expect(await listarActividades()).toEqual(ACTIVIDADES);
  });

  it('listarFechas devuelve las fechas de GET /api/fechas', async () => {
    expect(await listarFechas()).toEqual(FECHAS);
  });

  it('listarTurnos pide los turnos de la actividad en la fecha', async () => {
    const respuesta = await listarTurnos('safari', '2026-10-21');

    expect(respuesta.fecha).toBe('2026-10-21');
    expect(respuesta.turnos[1].id).toBe('t-safari-2026-10-20-10');
  });

  it('crearInscripcion envía la solicitud por POST y devuelve la inscripción', async () => {
    const solicitud = {
      turnoId: 't-tirolesa-2026-10-20-10',
      email: 'ana@mail.com',
      aceptaTerminos: true,
      participantes: [{ nombre: 'Ana', dni: '40123456', edad: 25, talle: 'M' }],
    };

    const inscripcion = await crearInscripcion(solicitud);

    expect(inscripcion).toMatchObject({ codigo: 'ECOPARK-7K3M9Q', email: 'ana@mail.com' });
  });

  it('un error de la API se lanza con su codigo, mensaje y campo', async () => {
    servidor.use(
      http.post('*/api/inscripciones', () =>
        HttpResponse.json(
          {
            codigo: 'TALLE_REQUERIDO',
            mensaje: 'Ingresá el talle.',
            campo: 'participantes[0].talle',
          },
          { status: 422 },
        ),
      ),
    );

    const error = await crearInscripcion({}).catch((e) => e);

    expect(error).toBeInstanceOf(ErrorApi);
    expect(error).toMatchObject({
      codigo: 'TALLE_REQUERIDO',
      mensaje: 'Ingresá el talle.',
      campo: 'participantes[0].talle',
      estado: 422,
    });
  });

  it('INS-UI-16: un error de red se lanza con el mensaje genérico', async () => {
    servidor.use(http.get('*/api/fechas', () => HttpResponse.error()));

    const error = await listarFechas().catch((e) => e);

    expect(error).toBeInstanceOf(ErrorApi);
    expect(error.codigo).toBe('ERROR_DE_RED');
    expect(error.mensaje).toBe('Algo salió mal. Intentá de nuevo en unos minutos.');
  });

  it('una respuesta inesperada (sin JSON) se lanza con el mensaje genérico', async () => {
    servidor.use(
      http.get('*/api/fechas', () => new HttpResponse('<html>502</html>', { status: 502 })),
    );

    const error = await listarFechas().catch((e) => e);

    expect(error.mensaje).toBe('Algo salió mal. Intentá de nuevo en unos minutos.');
    expect(error.estado).toBe(502);
  });
});

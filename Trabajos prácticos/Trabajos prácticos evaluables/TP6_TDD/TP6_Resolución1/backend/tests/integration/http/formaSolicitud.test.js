import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { crearApp } from '../../../src/interfaces/http/app.js';
import { unaInscripcion } from '../../builders/inscripcion.js';
import { contextoHttp } from './contextoHttp.js';

const ERROR_GENERICO = 'Algo salió mal. Intentá de nuevo en unos minutos.';

describe('forma de la solicitud y errores generales', () => {
  let ctx;
  const valida = () => unaInscripcion().build();
  const inscribir = (cuerpo) => request(ctx.app).post('/api/inscripciones').send(cuerpo);

  beforeAll(async () => {
    ctx = await contextoHttp();
  });

  afterAll(() => ctx.cerrar());

  it.each([
    ['ausente', undefined],
    ['como texto', 'true'],
    ['como número', 1],
  ])('HTTP-40: aceptaTerminos %s responde 400 SOLICITUD_INVALIDA', async (_caso, valor) => {
    const respuesta = await inscribir({ ...valida(), aceptaTerminos: valor });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toEqual({
      codigo: 'SOLICITUD_INVALIDA',
      mensaje: ERROR_GENERICO,
      campo: 'aceptaTerminos',
    });
  });

  it.each([
    ['sin participantes', { participantes: undefined }, 'participantes'],
    ['participantes que no son una lista', { participantes: 'Ana' }, 'participantes'],
    [
      'edad como texto',
      { participantes: [{ nombre: 'Ana', dni: '40123456', edad: '25' }] },
      'participantes[0].edad',
    ],
    [
      'DNI como número',
      { participantes: [{ nombre: 'Ana', dni: 40123456, edad: 25 }] },
      'participantes[0].dni',
    ],
    ['email inválido', { email: 'ana-mail.com' }, 'email'],
    ['sin turno', { turnoId: '' }, 'turnoId'],
  ])('HTTP-41: %s responde 400 SOLICITUD_INVALIDA', async (_caso, cambio, campo) => {
    const respuesta = await inscribir({ ...valida(), ...cambio });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toMatchObject({ codigo: 'SOLICITUD_INVALIDA', campo });
  });

  it('HTTP-41: un JSON roto responde 400 SOLICITUD_INVALIDA', async () => {
    const respuesta = await request(ctx.app)
      .post('/api/inscripciones')
      .set('Content-Type', 'application/json')
      .send('{"turnoId": ');

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toEqual({ codigo: 'SOLICITUD_INVALIDA', mensaje: ERROR_GENERICO });
  });

  it('HTTP-42: 51 participantes responden 400 SOLICITUD_INVALIDA', async () => {
    const respuesta = await inscribir(unaInscripcion().conParticipantes(51).build());

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toMatchObject({ codigo: 'SOLICITUD_INVALIDA', campo: 'participantes' });
  });

  it('HTTP-43: un email de 255 caracteres responde 400 SOLICITUD_INVALIDA', async () => {
    const email = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(58)}.com`;

    const respuesta = await inscribir({ ...valida(), email });

    expect(respuesta.status).toBe(400);
    expect(respuesta.body).toMatchObject({ codigo: 'SOLICITUD_INVALIDA', campo: 'email' });
  });

  it('HTTP-44: un error inesperado responde 500 sin detalles internos', async () => {
    const app = crearApp({
      listarActividades: {
        ejecutar: async () => {
          throw new Error('SQLITE_BUSY: database is locked en /var/task/backend');
        },
      },
    });

    const respuesta = await request(app).get('/api/actividades');

    expect(respuesta.status).toBe(500);
    expect(respuesta.body).toEqual({ codigo: 'ERROR_INTERNO', mensaje: ERROR_GENERICO });
    expect(JSON.stringify(respuesta.body)).not.toMatch(/SQLITE|var\/task/);
  });
});

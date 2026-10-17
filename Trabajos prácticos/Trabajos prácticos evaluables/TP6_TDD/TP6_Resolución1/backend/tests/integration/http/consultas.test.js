import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { contextoHttp } from './contextoHttp.js';

describe('API de consultas', () => {
  let ctx;

  beforeAll(async () => {
    ctx = await contextoHttp();
  });

  afterAll(() => ctx.cerrar());

  it('HTTP-01: GET /api/actividades responde las 4 actividades con disponible', async () => {
    const respuesta = await request(ctx.app).get('/api/actividades');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toHaveLength(4);
    const tirolesa = respuesta.body.find((a) => a.id === 'tirolesa');
    expect(tirolesa).toMatchObject({
      nombre: 'Tirolesa',
      requiereTalle: true,
      edadMinima: 8,
      cupoPorTurno: 10,
      disponible: true,
    });
    expect(tirolesa.terminos).toMatch(/Términos y condiciones de la Tirolesa/);
  });

  it('HTTP-02: una actividad sin turnos disponibles ahora responde disponible: false', async () => {
    await ctx.prisma.turno.updateMany({
      where: { actividadId: 'safari' },
      data: { cupoOcupado: 8 },
    });

    const respuesta = await request(ctx.app).get('/api/actividades');

    expect(respuesta.body.find((a) => a.id === 'safari').disponible).toBe(false);
    await ctx.prisma.turno.updateMany({
      where: { actividadId: 'safari' },
      data: { cupoOcupado: 0 },
    });
  });

  it('HTTP-03: GET /api/fechas responde hoy y mañana según el reloj fijo', async () => {
    const respuesta = await request(ctx.app).get('/api/fechas');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual([
      { fecha: '2026-10-20', abierta: true },
      { fecha: '2026-10-21', abierta: true },
    ]);
  });

  it('HTTP-04: GET /api/fechas marca el lunes cerrado con su motivo', async () => {
    const domingo = await contextoHttp({ ahora: new Date('2026-10-25T10:00:00-03:00') });

    const respuesta = await request(domingo.app).get('/api/fechas');

    expect(respuesta.body[1]).toEqual({ fecha: '2026-10-26', abierta: false, motivo: 'lunes' });
    await domingo.cerrar();
  });

  it('HTTP-05: GET /api/actividades/:id/turnos responde los turnos con cupos y estado, por hora', async () => {
    await ctx.prisma.turno.update({
      where: { id: 't-tirolesa-2026-10-20-11' },
      data: { cupoOcupado: 10 },
    });

    const respuesta = await request(ctx.app).get(
      '/api/actividades/tirolesa/turnos?fecha=2026-10-20',
    );

    expect(respuesta.status).toBe(200);
    expect(respuesta.body.fecha).toBe('2026-10-20');
    expect(respuesta.body.abierta).toBe(true);
    expect(respuesta.body.turnos.map((t) => t.hora)).toEqual([
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ]);
    expect(respuesta.body.turnos.slice(0, 3)).toEqual([
      {
        id: 't-tirolesa-2026-10-20-09',
        hora: '09:00',
        cuposDisponibles: 10,
        estado: 'no_disponible',
        motivo: 'ya_empezo',
      },
      { id: 't-tirolesa-2026-10-20-10', hora: '10:00', cuposDisponibles: 10, estado: 'disponible' },
      { id: 't-tirolesa-2026-10-20-11', hora: '11:00', cuposDisponibles: 0, estado: 'agotado' },
    ]);
  });

  it('HTTP-06: un día cerrado responde abierta: false, el motivo y turnos vacíos', async () => {
    const respuesta = await request(ctx.app).get('/api/actividades/safari/turnos?fecha=2026-10-26');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({
      fecha: '2026-10-26',
      abierta: false,
      motivo: 'lunes',
      turnos: [],
    });
  });

  it('HTTP-07: una actividad inexistente responde 404 ACTIVIDAD_INEXISTENTE', async () => {
    const respuesta = await request(ctx.app).get('/api/actividades/buceo/turnos?fecha=2026-10-20');

    expect(respuesta.status).toBe(404);
    expect(respuesta.body.codigo).toBe('ACTIVIDAD_INEXISTENTE');
  });

  it.each([['?fecha=20/10/2026'], ['?fecha=2026-02-30'], [''], ['?fecha=']])(
    'HTTP-08: la fecha "%s" responde 400 SOLICITUD_INVALIDA',
    async (consulta) => {
      const respuesta = await request(ctx.app).get(`/api/actividades/tirolesa/turnos${consulta}`);

      expect(respuesta.status).toBe(400);
      expect(respuesta.body).toEqual({
        codigo: 'SOLICITUD_INVALIDA',
        mensaje: 'Algo salió mal. Intentá de nuevo en unos minutos.',
        campo: 'fecha',
      });
    },
  );

  it('HTTP-45: una ruta inexistente bajo /api responde 404 en JSON', async () => {
    const respuesta = await request(ctx.app).get('/api/no-existe');

    expect(respuesta.status).toBe(404);
    expect(respuesta.body).toEqual({
      codigo: 'RUTA_INEXISTENTE',
      mensaje: 'Algo salió mal. Intentá de nuevo en unos minutos.',
    });
  });
});

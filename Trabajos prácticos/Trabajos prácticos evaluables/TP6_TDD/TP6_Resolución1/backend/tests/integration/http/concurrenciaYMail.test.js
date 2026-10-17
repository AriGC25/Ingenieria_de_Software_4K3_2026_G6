import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { unaInscripcion } from '../../builders/inscripcion.js';
import { unParticipante } from '../../builders/participante.js';
import { contextoHttp } from './contextoHttp.js';

const TURNO = 't-tirolesa-2026-10-20-10';

describe('concurrencia y envío del mail', () => {
  let ctx;
  const inscribir = (cuerpo) => request(ctx.app).post('/api/inscripciones').send(cuerpo);

  beforeEach(async () => {
    ctx = await contextoHttp();
  });

  afterEach(() => ctx.cerrar());

  it('HTTP-50: dos inscripciones simultáneas por el último cupo: una 201 y otra 409 SIN_CUPO', async () => {
    await ctx.prisma.turno.update({ where: { id: TURNO }, data: { cupoOcupado: 9 } });

    const respuestas = await Promise.all([
      inscribir(
        unaInscripcion()
          .con(unParticipante({ dni: '30000001' }))
          .build(),
      ),
      inscribir(
        unaInscripcion()
          .con(unParticipante({ dni: '30000002' }))
          .build(),
      ),
    ]);

    expect(respuestas.map((r) => r.status).sort()).toEqual([201, 409]);
    expect(respuestas.find((r) => r.status === 409).body.codigo).toBe('SIN_CUPO');
    expect(await ctx.cupoOcupado(TURNO)).toBe(10);
  });

  it('HTTP-51: si el envío falla responde 503 y no deja la inscripción ni los cupos', async () => {
    await ctx.prisma.turno.update({ where: { id: TURNO }, data: { cupoOcupado: 4 } });
    ctx.notificador.fallarProximoEnvio();

    const respuesta = await inscribir(unaInscripcion().conParticipantes(2).build());

    expect(respuesta.status).toBe(503);
    expect(respuesta.body).toEqual({
      codigo: 'ENVIO_CONFIRMACION_FALLIDO',
      mensaje:
        'No pudimos enviarte la confirmación y tu inscripción no se registró. Intentá de nuevo.',
    });
    expect(await ctx.prisma.inscripcion.count()).toBe(0);
    expect(await ctx.prisma.participante.count()).toBe(0);
    expect(await ctx.cupoOcupado(TURNO)).toBe(4);
  });

  it('HTTP-52: tras la falla del envío, repetir la solicitud responde 201 y deja una sola inscripción', async () => {
    ctx.notificador.fallarProximoEnvio();
    const solicitud = unaInscripcion().conParticipantes(2).build();
    await inscribir(solicitud);

    const respuesta = await inscribir(solicitud);

    expect(respuesta.status).toBe(201);
    expect(await ctx.prisma.inscripcion.count()).toBe(1);
    expect(await ctx.cupoOcupado(TURNO)).toBe(2);
    expect(ctx.notificador.enviados).toHaveLength(1);
  });
});

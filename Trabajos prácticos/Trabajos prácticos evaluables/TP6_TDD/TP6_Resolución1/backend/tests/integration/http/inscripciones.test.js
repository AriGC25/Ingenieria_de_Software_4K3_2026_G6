import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { unaInscripcion } from '../../builders/inscripcion.js';
import { unParticipante } from '../../builders/participante.js';
import { contextoHttp } from './contextoHttp.js';

const TIROLESA = 't-tirolesa-2026-10-20-10';

describe('POST /api/inscripciones', () => {
  let ctx;
  const inscribir = (cuerpo) => request(ctx.app).post('/api/inscripciones').send(cuerpo);

  beforeEach(async () => {
    ctx = await contextoHttp();
  });

  afterEach(() => ctx.cerrar());

  describe('inscripción exitosa', () => {
    it('HTTP-10: responde 201 con el código y el detalle, y envía el mail al email de la solicitud', async () => {
      const respuesta = await inscribir(
        unaInscripcion()
          .con(
            unParticipante(),
            unParticipante({ nombre: 'Juan Pérez', dni: '42123456', talle: 'L' }),
          )
          .build(),
      );

      expect(respuesta.status).toBe(201);
      expect(respuesta.body).toEqual({
        codigo: expect.stringMatching(/^ECOPARK-[A-HJ-NP-Z2-9]{6}$/),
        actividad: 'Tirolesa',
        fecha: '2026-10-20',
        hora: '10:00',
        email: 'ana@mail.com',
        participantes: [
          { nombre: 'Ana Pérez', dni: '40123456', edad: 25, talle: 'M' },
          { nombre: 'Juan Pérez', dni: '42123456', edad: 25, talle: 'L' },
        ],
      });
      expect(ctx.notificador.enviados).toHaveLength(1);
      expect(ctx.notificador.enviados[0].to).toBe('ana@mail.com');
      expect(ctx.notificador.enviados[0].html).toContain(respuesta.body.codigo);
      expect(await ctx.cupoOcupado(TIROLESA)).toBe(2);
    });

    it('HTTP-11: una inscripción a Safari sin talle responde 201', async () => {
      const respuesta = await inscribir(
        unaInscripcion()
          .alTurno('t-safari-2026-10-20-10')
          .con(unParticipante({ talle: undefined, edad: 0 }))
          .build(),
      );

      expect(respuesta.status).toBe(201);
    });

    it('HTTP-12: un talle enviado a Safari responde 201 y el participante se guarda sin talle', async () => {
      const respuesta = await inscribir(unaInscripcion().alTurno('t-safari-2026-10-20-10').build());

      expect(respuesta.status).toBe(201);
      expect(respuesta.body.participantes[0].talle).toBeNull();
      expect((await ctx.prisma.participante.findFirst()).talle).toBeNull();
    });

    it('HTTP-13: un grupo que ocupa exactamente los cupos restantes deja el turno agotado', async () => {
      await ctx.prisma.turno.update({ where: { id: TIROLESA }, data: { cupoOcupado: 7 } });

      const respuesta = await inscribir(unaInscripcion().conParticipantes(3).build());

      expect(respuesta.status).toBe(201);
      const turnos = await request(ctx.app).get(
        '/api/actividades/tirolesa/turnos?fecha=2026-10-20',
      );
      expect(turnos.body.turnos.find((t) => t.id === TIROLESA).estado).toBe('agotado');
    });

    it.each([
      ['t-tirolesa-2026-10-20-10', 8],
      ['t-palestra-2026-10-20-10', 12],
      ['t-safari-2026-10-20-10', 100],
    ])('HTTP-14: en %s, la edad límite %i responde 201', async (turnoId, edad) => {
      const respuesta = await inscribir(
        unaInscripcion().alTurno(turnoId).con(unParticipante({ edad })).build(),
      );

      expect(respuesta.status).toBe(201);
    });

    it.each([['4012345'], ['40123456'], ['0123456']])(
      'HTTP-15: el DNI %s responde 201',
      async (dni) => {
        const respuesta = await inscribir(unaInscripcion().con(unParticipante({ dni })).build());

        expect(respuesta.status).toBe(201);
        expect(respuesta.body.participantes[0].dni).toBe(dni);
      },
    );

    it('HTTP-16: 50 participantes pasan la forma y responden SIN_CUPO si no alcanza el cupo', async () => {
      const respuesta = await inscribir(unaInscripcion().conParticipantes(50).build());

      expect(respuesta.status).toBe(409);
      expect(respuesta.body.codigo).toBe('SIN_CUPO');
    });

    it('HTTP-17: un email de 254 caracteres es aceptado', async () => {
      const email = `${'a'.repeat(64)}@${'b'.repeat(63)}.${'c'.repeat(63)}.${'d'.repeat(57)}.com`;
      expect(email).toHaveLength(254);

      const respuesta = await inscribir(unaInscripcion().conEmail(email).build());

      expect(respuesta.status).toBe(201);
    });
  });

  describe('errores de negocio', () => {
    it('HTTP-20: sin cupo responde 409 SIN_CUPO', async () => {
      const respuesta = await inscribir(unaInscripcion().conParticipantes(11).build());

      expect(respuesta.status).toBe(409);
      expect(respuesta.body).toEqual({
        codigo: 'SIN_CUPO',
        mensaje: 'No quedan cupos suficientes para este horario. Probá con otro.',
      });
    });

    it.each([
      ['inexistente', 't-tirolesa-2026-10-20-23'],
      ['en día cerrado', 't-tirolesa-2026-10-26-10'],
      ['fuera de la grilla', 't-tirolesa-2026-10-20-18'],
      ['que ya empezó', 't-tirolesa-2026-10-20-09'],
      ['que todavía no abre', 't-tirolesa-2026-10-21-10'],
    ])('HTTP-21: un turno %s responde 422 HORARIO_NO_DISPONIBLE', async (_caso, turnoId) => {
      const respuesta = await inscribir(unaInscripcion().alTurno(turnoId).build());

      expect(respuesta.status).toBe(422);
      expect(respuesta.body.codigo).toBe('HORARIO_NO_DISPONIBLE');
    });

    it('HTTP-22 y HTTP-30: aceptaTerminos en false responde 422 TERMINOS_NO_ACEPTADOS', async () => {
      const respuesta = await inscribir(unaInscripcion().sinTerminos().build());

      expect(respuesta.status).toBe(422);
      expect(respuesta.body).toEqual({
        codigo: 'TERMINOS_NO_ACEPTADOS',
        mensaje: 'Para continuar, aceptá los términos y condiciones.',
        campo: 'aceptaTerminos',
      });
      expect(ctx.notificador.enviados).toHaveLength(0);
    });

    it('HTTP-23: Tirolesa sin talle responde 422 TALLE_REQUERIDO', async () => {
      const respuesta = await inscribir(
        unaInscripcion()
          .con(unParticipante({ talle: undefined }))
          .build(),
      );

      expect(respuesta.status).toBe(422);
      expect(respuesta.body).toMatchObject({
        codigo: 'TALLE_REQUERIDO',
        campo: 'participantes[0].talle',
      });
    });

    it('HTTP-24: menor a la edad mínima responde 422 EDAD_NO_PERMITIDA', async () => {
      const respuesta = await inscribir(
        unaInscripcion()
          .con(unParticipante({ edad: 7 }))
          .build(),
      );

      expect(respuesta.status).toBe(422);
      expect(respuesta.body).toEqual({
        codigo: 'EDAD_NO_PERMITIDA',
        mensaje: 'Esta actividad es para personas de 8 años o más.',
        campo: 'participantes[0].edad',
      });
    });

    it('HTTP-25: edad 101 responde 422 DATOS_PARTICIPANTE_INVALIDOS', async () => {
      const respuesta = await inscribir(
        unaInscripcion()
          .con(unParticipante({ edad: 101 }))
          .build(),
      );

      expect(respuesta.status).toBe(422);
      expect(respuesta.body).toMatchObject({
        codigo: 'DATOS_PARTICIPANTE_INVALIDOS',
        campo: 'participantes[0].edad',
      });
    });

    it('HTTP-26: un DNI superpuesto con otra inscripción responde 409 INSCRIPCION_SUPERPUESTA', async () => {
      await inscribir(unaInscripcion().alTurno('t-safari-2026-10-20-10').build());

      const respuesta = await inscribir(unaInscripcion().conEmail('otro@mail.com').build());

      expect(respuesta.status).toBe(409);
      expect(respuesta.body.codigo).toBe('INSCRIPCION_SUPERPUESTA');
    });

    it('HTTP-27: un DNI repetido en la solicitud responde 422 DNI_REPETIDO', async () => {
      const respuesta = await inscribir(
        unaInscripcion().con(unParticipante(), unParticipante()).build(),
      );

      expect(respuesta.status).toBe(422);
      expect(respuesta.body).toMatchObject({
        codigo: 'DNI_REPETIDO',
        campo: 'participantes[1].dni',
      });
    });

    it.each([
      [{ nombre: '' }, 'participantes[0].nombre'],
      [{ dni: '401234' }, 'participantes[0].dni'],
      [{ dni: '401234567' }, 'participantes[0].dni'],
      [{ talle: 'XXXL' }, 'participantes[0].talle'],
    ])('HTTP-28: %o responde 422 DATOS_PARTICIPANTE_INVALIDOS en %s', async (cambio, campo) => {
      const respuesta = await inscribir(unaInscripcion().con(unParticipante(cambio)).build());

      expect(respuesta.status).toBe(422);
      expect(respuesta.body).toMatchObject({ codigo: 'DATOS_PARTICIPANTE_INVALIDOS', campo });
    });

    it('HTTP-29: una lista de participantes vacía responde 422 en el campo participantes', async () => {
      const respuesta = await inscribir(unaInscripcion().con().build());

      expect(respuesta.status).toBe(422);
      expect(respuesta.body).toEqual({
        codigo: 'DATOS_PARTICIPANTE_INVALIDOS',
        mensaje: 'Agregá al menos una persona.',
        campo: 'participantes',
      });
    });

    it('HTTP-31: con varios errores responde solo el primero según el orden de validación', async () => {
      const respuesta = await inscribir(
        unaInscripcion()
          .con(unParticipante(), unParticipante({ dni: '42123456', edad: 5, talle: undefined }))
          .sinTerminos()
          .build(),
      );

      expect(respuesta.status).toBe(422);
      expect(respuesta.body).toMatchObject({
        codigo: 'EDAD_NO_PERMITIDA',
        campo: 'participantes[1].edad',
      });
    });
  });
});

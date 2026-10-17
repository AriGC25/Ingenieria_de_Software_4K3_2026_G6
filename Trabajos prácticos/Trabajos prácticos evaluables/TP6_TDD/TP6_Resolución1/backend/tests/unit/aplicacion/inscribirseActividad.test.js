import { describe, it, expect } from 'vitest';
import { unaInscripcion } from '../../builders/inscripcion.js';
import { unParticipante } from '../../builders/participante.js';
import { unTurno } from '../../builders/turno.js';
import { QR_FALSO } from '../../dobles/generadores.js';
import { relojFijo } from '../../dobles/reloj.js';
import { contextoDeInscripcion } from './contexto.js';

const TURNO = 't-tirolesa-2026-10-20-10';

describe('InscribirseActividad', () => {
  it('APP-01: registra la inscripción con su reserva y devuelve el detalle', async () => {
    const ctx = contextoDeInscripcion();

    const resultado = await ctx.casoDeUso.ejecutar(unaInscripcion().conParticipantes(2).build());

    expect(resultado).toEqual({
      codigo: 'ECOPARK-7K3M9Q',
      actividad: 'Tirolesa',
      fecha: '2026-10-20',
      hora: '10:00',
      email: 'ana@mail.com',
      participantes: [
        { nombre: 'Ana Pérez', dni: '40000000', edad: 25, talle: 'M' },
        { nombre: 'Ana Pérez', dni: '40000001', edad: 25, talle: 'M' },
      ],
    });
    expect(ctx.repositorioInscripciones.inscripciones.size).toBe(1);
    expect(ctx.repositorioTurnos.cupoOcupado(TURNO)).toBe(2);
  });

  it('APP-02: usa el código del generador', async () => {
    const ctx = contextoDeInscripcion();

    await ctx.casoDeUso.ejecutar(unaInscripcion().build());

    const [registrada] = ctx.repositorioInscripciones.inscripciones.values();
    expect(registrada.codigo).toBe('ECOPARK-7K3M9Q');
  });

  it('APP-03: genera el QR y lo pasa al notificador', async () => {
    const ctx = contextoDeInscripcion();

    await ctx.casoDeUso.ejecutar(unaInscripcion().build());

    expect(ctx.notificador.enviados[0].qr).toBe(QR_FALSO);
  });

  it('APP-04: notifica al email de la solicitud con actividad, fecha, hora, participantes y código', async () => {
    const ctx = contextoDeInscripcion();

    await ctx.casoDeUso.ejecutar(unaInscripcion().conEmail('juan@mail.com').build());

    expect(ctx.notificador.enviados).toHaveLength(1);
    expect(ctx.notificador.enviados[0].inscripcion).toMatchObject({
      codigo: 'ECOPARK-7K3M9Q',
      actividad: 'Tirolesa',
      requiereTalle: true,
      fecha: '2026-10-20',
      hora: '10:00',
      email: 'juan@mail.com',
      participantes: [{ nombre: 'Ana Pérez', dni: '40123456', edad: 25, talle: 'M' }],
    });
  });

  it('APP-05: envía el mail después de registrar la inscripción', async () => {
    const registradasAlEnviar = [];
    const ctx = contextoDeInscripcion({
      notificador: {
        enviarConfirmacion: async () => {
          registradasAlEnviar.push(ctx.repositorioInscripciones.inscripciones.size);
        },
      },
    });

    await ctx.casoDeUso.ejecutar(unaInscripcion().build());

    expect(registradasAlEnviar).toEqual([1]);
  });

  it('APP-07: si una regla de dominio falla, no guarda ni notifica', async () => {
    const ctx = contextoDeInscripcion();

    await expect(
      ctx.casoDeUso.ejecutar(unaInscripcion().sinTerminos().build()),
    ).rejects.toMatchObject({ codigo: 'TERMINOS_NO_ACEPTADOS' });

    expect(ctx.repositorioInscripciones.inscripciones.size).toBe(0);
    expect(ctx.repositorioTurnos.cupoOcupado(TURNO)).toBe(0);
    expect(ctx.notificador.enviados).toHaveLength(0);
  });

  it('APP-09: un turno inexistente lanza HORARIO_NO_DISPONIBLE', async () => {
    const ctx = contextoDeInscripcion();

    await expect(
      ctx.casoDeUso.ejecutar(unaInscripcion().alTurno('t-tirolesa-2026-10-20-18').build()),
    ).rejects.toMatchObject({ codigo: 'HORARIO_NO_DISPONIBLE' });
  });

  it('APP-10: rechaza si un DNI ya está inscripto en otro turno con el mismo inicio', async () => {
    const ctx = contextoDeInscripcion();
    ctx.repositorioTurnos.agregar(unTurno().de('safari').build());
    await ctx.casoDeUso.ejecutar(
      unaInscripcion().alTurno('t-safari-2026-10-20-10').con(unParticipante()).build(),
    );

    await expect(ctx.casoDeUso.ejecutar(unaInscripcion().build())).rejects.toMatchObject({
      codigo: 'INSCRIPCION_SUPERPUESTA',
    });
  });

  it('APP-12: usa la hora del reloj inyectado para la ventana', async () => {
    const ctx = contextoDeInscripcion({ reloj: relojFijo(new Date('2026-10-20T09:46:00-03:00')) });

    await expect(ctx.casoDeUso.ejecutar(unaInscripcion().build())).rejects.toMatchObject({
      codigo: 'HORARIO_NO_DISPONIBLE',
    });
  });
});

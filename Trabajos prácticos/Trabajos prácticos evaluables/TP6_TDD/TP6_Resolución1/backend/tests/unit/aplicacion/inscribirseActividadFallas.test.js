import { describe, it, expect } from 'vitest';
import { SinCupo } from '../../../src/dominio/errores.js';
import { unaInscripcion } from '../../builders/inscripcion.js';
import { generadorCodigoFijo, generadorQRFijo } from '../../dobles/generadores.js';
import { contextoDeInscripcion } from './contexto.js';

const TURNO = 't-tirolesa-2026-10-20-10';

describe('InscribirseActividad: fallas', () => {
  it('APP-06: si el notificador falla, deshace la inscripción y lanza ENVIO_CONFIRMACION_FALLIDO', async () => {
    const ctx = contextoDeInscripcion();
    ctx.notificador.fallarEnvios = 1;

    await expect(
      ctx.casoDeUso.ejecutar(unaInscripcion().conParticipantes(3).build()),
    ).rejects.toMatchObject({
      codigo: 'ENVIO_CONFIRMACION_FALLIDO',
      mensaje:
        'No pudimos enviarte la confirmación y tu inscripción no se registró. Intentá de nuevo.',
    });

    expect(ctx.repositorioInscripciones.inscripciones.size).toBe(0);
    expect(ctx.repositorioTurnos.cupoOcupado(TURNO)).toBe(0);
  });

  it('APP-08: si al reservar otra inscripción tomó los cupos, lanza SIN_CUPO y no notifica', async () => {
    const ctx = contextoDeInscripcion();
    ctx.repositorioInscripciones.registrarConReserva = async () => {
      throw new SinCupo();
    };

    await expect(ctx.casoDeUso.ejecutar(unaInscripcion().build())).rejects.toMatchObject({
      codigo: 'SIN_CUPO',
    });

    expect(ctx.notificador.enviados).toHaveLength(0);
  });

  it('APP-11: si el código ya existe, reintenta con otro', async () => {
    const ctx = contextoDeInscripcion({
      generadorCodigo: generadorCodigoFijo('ECOPARK-AAAAAA', 'ECOPARK-BBBBBB'),
    });
    ctx.repositorioInscripciones.codigosExistentes.add('ECOPARK-AAAAAA');

    const resultado = await ctx.casoDeUso.ejecutar(unaInscripcion().build());

    expect(resultado.codigo).toBe('ECOPARK-BBBBBB');
  });

  it('APP-11: tras 3 colisiones lanza un error técnico y no registra nada', async () => {
    const ctx = contextoDeInscripcion({ generadorCodigo: generadorCodigoFijo('ECOPARK-AAAAAA') });
    ctx.repositorioInscripciones.codigosExistentes.add('ECOPARK-AAAAAA');

    await expect(ctx.casoDeUso.ejecutar(unaInscripcion().build())).rejects.toThrow(
      'No se pudo generar un código de inscripción único',
    );

    expect(ctx.repositorioInscripciones.llamadas).toEqual([
      'registrarConReserva',
      'registrarConReserva',
      'registrarConReserva',
    ]);
    expect(ctx.notificador.enviados).toHaveLength(0);
  });

  it('APP-13: si falla la generación del QR, deshace la inscripción y no envía nada', async () => {
    const ctx = contextoDeInscripcion({ generadorQR: generadorQRFijo({ falla: true }) });

    await expect(ctx.casoDeUso.ejecutar(unaInscripcion().build())).rejects.toMatchObject({
      codigo: 'ENVIO_CONFIRMACION_FALLIDO',
    });

    expect(ctx.repositorioInscripciones.inscripciones.size).toBe(0);
    expect(ctx.repositorioTurnos.cupoOcupado(TURNO)).toBe(0);
    expect(ctx.notificador.enviados).toHaveLength(0);
  });

  it('APP-14: tras una falla del envío, una nueva solicitud correcta queda registrada una sola vez', async () => {
    const ctx = contextoDeInscripcion();
    ctx.notificador.fallarEnvios = 1;
    const solicitud = unaInscripcion().conParticipantes(2).build();
    await ctx.casoDeUso.ejecutar(solicitud).catch(() => {});

    await ctx.casoDeUso.ejecutar(solicitud);

    expect(ctx.repositorioInscripciones.inscripciones.size).toBe(1);
    expect(ctx.repositorioTurnos.cupoOcupado(TURNO)).toBe(2);
    expect(ctx.notificador.enviados).toHaveLength(1);
  });
});

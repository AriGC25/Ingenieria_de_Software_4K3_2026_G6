import { describe, it, expect } from 'vitest';
import * as errores from '../../../src/dominio/errores.js';
import { mapearError } from '../../../src/interfaces/http/mapeoErrores.js';

describe('mapeo de errores a HTTP', () => {
  it.each([
    [new errores.SolicitudInvalida('email'), 400],
    [new errores.ActividadInexistente(), 404],
    [new errores.HorarioNoDisponible(), 422],
    [new errores.DatosParticipanteInvalidos('participantes[0].dni'), 422],
    [new errores.DniRepetido('participantes[1].dni'), 422],
    [new errores.EdadNoPermitida('participantes[0].edad', 8), 422],
    [new errores.TalleRequerido('participantes[0].talle'), 422],
    [new errores.TerminosNoAceptados(), 422],
    [new errores.InscripcionSuperpuesta(), 409],
    [new errores.SinCupo(), 409],
    [new errores.EnvioConfirmacionFallido(), 503],
  ])('%s responde %i', (error, estado) => {
    expect(mapearError(error).estado).toBe(estado);
  });

  it('el cuerpo tiene codigo, mensaje y campo si el error es de un dato', () => {
    expect(mapearError(new errores.TalleRequerido('participantes[0].talle')).cuerpo).toEqual({
      codigo: 'TALLE_REQUERIDO',
      mensaje: 'Ingresá el talle.',
      campo: 'participantes[0].talle',
    });
  });

  it('el cuerpo no tiene campo si el error no es de un dato', () => {
    expect(mapearError(new errores.SinCupo()).cuerpo).toEqual({
      codigo: 'SIN_CUPO',
      mensaje: 'No quedan cupos suficientes para este horario. Probá con otro.',
    });
  });

  it('un error inesperado responde 500 sin detalles internos', () => {
    const { estado, cuerpo } = mapearError(new Error('SQLITE_BUSY: database is locked'));

    expect(estado).toBe(500);
    expect(cuerpo).toEqual({
      codigo: 'ERROR_INTERNO',
      mensaje: 'Algo salió mal. Intentá de nuevo en unos minutos.',
    });
  });
});

import { describe, it, expect } from 'vitest';
import { generadorCodigo } from '../../../src/infraestructura/generadorCodigo.js';

describe('generadorCodigo', () => {
  it('COD-01: el código es ECOPARK- seguido de 6 caracteres', () => {
    expect(generadorCodigo.generar()).toMatch(/^ECOPARK-.{6}$/);
  });

  it('COD-02: solo usa mayúsculas y dígitos sin los ambiguos (0, O, 1, I)', () => {
    const sufijos = Array.from({ length: 500 }, () => generadorCodigo.generar().slice(8)).join('');

    expect(sufijos).toMatch(/^[A-Z2-9]+$/);
    expect(sufijos).not.toMatch(/[0O1I]/);
  });

  it('COD-03: muchas generaciones producen códigos distintos', () => {
    const codigos = new Set(Array.from({ length: 1000 }, () => generadorCodigo.generar()));

    expect(codigos.size).toBe(1000);
  });
});

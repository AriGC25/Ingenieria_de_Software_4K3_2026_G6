import { AHORA } from '../builders/turno.js';

/** Stub del reloj: siempre devuelve el mismo instante. */
export function relojFijo(instante = AHORA) {
  return { ahora: () => new Date(instante) };
}

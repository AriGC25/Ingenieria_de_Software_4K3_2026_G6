import { randomInt } from 'node:crypto';
import { ALFABETO_CODIGO, LARGO_CODIGO, PREFIJO_CODIGO } from '../dominio/constantes.js';

/** Genera códigos `ECOPARK-XXXXXX` sin caracteres que se confunden (S-36). */
export const generadorCodigo = Object.freeze({
  /** @returns {string} */
  generar() {
    const sufijo = Array.from(
      { length: LARGO_CODIGO },
      () => ALFABETO_CODIGO[randomInt(ALFABETO_CODIGO.length)],
    );
    return PREFIJO_CODIGO + sufijo.join('');
  },
});

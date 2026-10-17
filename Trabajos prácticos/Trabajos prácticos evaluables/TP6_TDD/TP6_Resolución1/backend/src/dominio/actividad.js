import { DniRepetido, EdadNoPermitida, TalleRequerido } from './errores.js';
import {
  campoDe,
  tieneTalle,
  validarDni,
  validarEdad,
  validarNombre,
  validarTalle,
} from './participante.js';

/** Una de las actividades del parque, con sus requisitos de participación. */
export class Actividad {
  /**
   * @param {{ id: string, nombre: string, requiereTalle: boolean, edadMinima: number | null,
   *   cupoPorTurno: number, terminos: string }} datos
   */
  constructor({ id, nombre, requiereTalle, edadMinima, cupoPorTurno, terminos }) {
    this.id = id;
    this.nombre = nombre;
    this.requiereTalle = requiereTalle;
    this.edadMinima = edadMinima ?? null;
    this.cupoPorTurno = cupoPorTurno;
    this.terminos = terminos;
    Object.freeze(this);
  }

  /**
   * Valida un participante para esta actividad, en el orden nombre, DNI, DNI repetido, edad,
   * edad mínima y talle. Si la actividad no requiere talle, lo descarta (INT-06).
   * @param {{ nombre: unknown, dni: unknown, edad: unknown, talle?: unknown }} datos
   * @param {{ indice?: number, dnisPrevios?: string[] }} [opciones]
   * @returns {{ nombre: string, dni: string, edad: number, talle: string | null }}
   * @throws {import('./errores.js').ErrorDominio}
   */
  prepararParticipante(datos, { indice = 0, dnisPrevios = [] } = {}) {
    const campo = (dato) => campoDe(indice, dato);
    const nombre = validarNombre(datos.nombre, campo('nombre'));
    const dni = validarDni(datos.dni, campo('dni'));
    if (dnisPrevios.includes(dni)) throw new DniRepetido(campo('dni'));
    const edad = validarEdad(datos.edad, campo('edad'));
    if (this.edadMinima !== null && edad < this.edadMinima) {
      throw new EdadNoPermitida(campo('edad'), this.edadMinima);
    }
    return Object.freeze({ nombre, dni, edad, talle: this.#talleDe(datos.talle, campo('talle')) });
  }

  #talleDe(talle, campo) {
    if (!this.requiereTalle) return null;
    if (!tieneTalle(talle)) throw new TalleRequerido(campo);
    return validarTalle(talle, campo);
  }
}

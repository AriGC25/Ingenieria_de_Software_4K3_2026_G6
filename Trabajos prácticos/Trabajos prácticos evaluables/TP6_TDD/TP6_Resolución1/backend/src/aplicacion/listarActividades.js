import { addHours } from 'date-fns';
import { VENTANA_APERTURA_HORAS } from '../dominio/constantes.js';

/** Las actividades del parque, indicando si tienen algún turno disponible ahora (S-08). */
export class ListarActividades {
  /**
   * @param {{ repositorioActividades: import('./puertos.js').RepositorioActividades,
   *   repositorioTurnos: import('./puertos.js').RepositorioTurnos,
   *   reloj: import('./puertos.js').Reloj, calendario: object }} dependencias
   */
  constructor({ repositorioActividades, repositorioTurnos, reloj, calendario }) {
    this.repositorioActividades = repositorioActividades;
    this.repositorioTurnos = repositorioTurnos;
    this.reloj = reloj;
    this.calendario = calendario;
  }

  /**
   * @returns {Promise<object[]>} cada actividad con `disponible`
   */
  async ejecutar() {
    const ahora = this.reloj.ahora();
    const [actividades, candidatos] = await Promise.all([
      this.repositorioActividades.listar(),
      this.repositorioTurnos.listarDisponiblesEntre(ahora, addHours(ahora, VENTANA_APERTURA_HORAS)),
    ]);
    const conTurno = new Set(
      candidatos
        .filter((turno) => turno.estado(ahora, this.calendario).estado === 'disponible')
        .map((turno) => turno.actividad.id),
    );
    return actividades.map((a) => ({
      id: a.id,
      nombre: a.nombre,
      requiereTalle: a.requiereTalle,
      edadMinima: a.edadMinima,
      cupoPorTurno: a.cupoPorTurno,
      terminos: a.terminos,
      disponible: conTurno.has(a.id),
    }));
  }
}

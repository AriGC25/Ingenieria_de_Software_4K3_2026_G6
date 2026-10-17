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
    const [actividades, disponibles] = await Promise.all([
      this.repositorioActividades.listar(),
      this.#actividadesConTurnoDisponible(ahora),
    ]);
    return actividades.map(({ id, nombre, requiereTalle, edadMinima, cupoPorTurno, terminos }) => ({
      id,
      nombre,
      requiereTalle,
      edadMinima,
      cupoPorTurno,
      terminos,
      disponible: disponibles.has(id),
    }));
  }

  async #actividadesConTurnoDisponible(ahora) {
    const hasta = addHours(ahora, VENTANA_APERTURA_HORAS);
    const candidatos = await this.repositorioTurnos.listarDisponiblesEntre(ahora, hasta);
    const disponibles = candidatos.filter(
      (turno) => turno.estado(ahora, this.calendario).estado === 'disponible',
    );
    return new Set(disponibles.map((turno) => turno.actividad.id));
  }
}

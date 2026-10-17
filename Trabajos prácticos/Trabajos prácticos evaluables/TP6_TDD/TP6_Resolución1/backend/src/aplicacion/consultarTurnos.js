import { ActividadInexistente } from '../dominio/errores.js';

/** Turnos de una actividad en una fecha, con sus cupos y su estado actual. */
export class ConsultarTurnos {
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
   * @param {{ actividadId: string, fecha: string }} consulta
   * @returns {Promise<{ fecha: string, abierta: boolean, motivo?: string, turnos: object[] }>}
   * @throws {ActividadInexistente}
   */
  async ejecutar({ actividadId, fecha }) {
    const actividad = await this.repositorioActividades.obtenerPorId(actividadId);
    if (!actividad) throw new ActividadInexistente();

    const estadoFecha = this.calendario.estadoDe(fecha);
    if (!estadoFecha.abierta) return { ...estadoFecha, turnos: [] };

    const ahora = this.reloj.ahora();
    const turnos = await this.repositorioTurnos.listarPorActividadYFecha(actividadId, fecha);
    return {
      ...estadoFecha,
      turnos: turnos
        .sort((a, b) => a.inicio - b.inicio)
        .map((turno) => ({
          id: turno.id,
          hora: turno.hora,
          cuposDisponibles: turno.cuposDisponibles(),
          ...turno.estado(ahora, this.calendario),
        })),
    };
  }
}

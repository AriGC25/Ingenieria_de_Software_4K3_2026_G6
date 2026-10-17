import { Actividad } from '../../src/dominio/actividad.js';
import { SinCupo } from '../../src/dominio/errores.js';
import { fechaArgentina } from '../../src/dominio/fechas.js';
import { Turno } from '../../src/dominio/turno.js';
import { CodigoDuplicado } from '../../src/aplicacion/puertos.js';
import { DATOS_ACTIVIDADES, datosDeActividad } from '../builders/actividad.js';

/**
 * Fakes en memoria de los tres repositorios, sobre un mismo almacén, para que la reserva de
 * cupos se vea al volver a leer el turno (como en la base).
 */
export function repositoriosEnMemoria() {
  const actividades = new Map(
    Object.keys(DATOS_ACTIVIDADES).map((id) => [id, new Actividad(datosDeActividad(id))]),
  );
  const turnos = new Map();
  const inscripciones = new Map();
  let ultimoId = 0;

  const aTurno = (fila) => new Turno({ ...fila, actividad: actividades.get(fila.actividadId) });

  const repositorioActividades = {
    listar: async () => [...actividades.values()],
    obtenerPorId: async (id) => actividades.get(id) ?? null,
  };

  const repositorioTurnos = {
    agregar(turno) {
      turnos.set(turno.id, {
        id: turno.id,
        actividadId: turno.actividad.id,
        inicio: turno.inicio,
        cupoMaximo: turno.cupoMaximo,
        cupoOcupado: turno.cupoOcupado,
      });
      return repositorioTurnos;
    },
    cupoOcupado: (id) => turnos.get(id).cupoOcupado,
    obtenerPorId: async (id) => (turnos.has(id) ? aTurno(turnos.get(id)) : null),
    listarPorActividadYFecha: async (actividadId, fecha) =>
      [...turnos.values()]
        .filter((t) => t.actividadId === actividadId && fechaArgentina(t.inicio) === fecha)
        .map(aTurno),
    listarDisponiblesEntre: async (desde, hasta) =>
      [...turnos.values()]
        .filter((t) => t.inicio >= desde && t.inicio <= hasta && t.cupoOcupado < t.cupoMaximo)
        .map(aTurno),
  };

  const repositorioInscripciones = {
    inscripciones,
    codigosExistentes: new Set(),
    llamadas: [],
    async dnisInscriptosEnInicio(inicio, dnis) {
      return [...inscripciones.values()]
        .filter((i) => turnos.get(i.turnoId).inicio.getTime() === inicio.getTime())
        .flatMap((i) => i.participantes.map((p) => p.dni))
        .filter((dni) => dnis.includes(dni));
    },
    async registrarConReserva(inscripcion) {
      repositorioInscripciones.llamadas.push('registrarConReserva');
      const turno = turnos.get(inscripcion.turnoId);
      const cantidad = inscripcion.participantes.length;
      if (turno.cupoOcupado + cantidad > turno.cupoMaximo) throw new SinCupo();
      if (repositorioInscripciones.codigosExistentes.has(inscripcion.codigo)) {
        throw new CodigoDuplicado();
      }
      turno.cupoOcupado += cantidad;
      const id = `inscripcion-${++ultimoId}`;
      inscripciones.set(id, { id, ...inscripcion });
      repositorioInscripciones.codigosExistentes.add(inscripcion.codigo);
      return { id };
    },
    async anular(id) {
      repositorioInscripciones.llamadas.push('anular');
      const inscripcion = inscripciones.get(id);
      turnos.get(inscripcion.turnoId).cupoOcupado -= inscripcion.participantes.length;
      repositorioInscripciones.codigosExistentes.delete(inscripcion.codigo);
      inscripciones.delete(id);
    },
  };

  return { repositorioActividades, repositorioTurnos, repositorioInscripciones };
}

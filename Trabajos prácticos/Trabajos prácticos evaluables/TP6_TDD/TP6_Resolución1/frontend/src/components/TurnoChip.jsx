import { cupos } from '../utils/formato.js';
import { clases } from './clases.js';
import styles from './TurnoChip.module.css';

const MOTIVOS = {
  todavia_no_abre: 'Todavía no abre. La inscripción se habilita 24 horas antes.',
  inscripcion_cerrada: 'La inscripción cerró. Cierra 15 minutos antes del turno.',
  ya_empezo: 'Ya empezó',
  parque_cerrado: 'El parque está cerrado ese día',
};

/**
 * Botón de un turno con su hora y sus cupos. Si no está disponible, dice por qué.
 * @param {{ turno: { id: string, hora: string, cuposDisponibles: number, estado: string,
 *   motivo?: string }, seleccionado?: boolean, onSeleccionar: (turno: object) => void }} props
 */
export function TurnoChip({ turno, seleccionado = false, onSeleccionar }) {
  const disponible = turno.estado === 'disponible';
  const detalle = disponible
    ? cupos(turno.cuposDisponibles)
    : turno.estado === 'agotado'
      ? 'Sin cupos'
      : MOTIVOS[turno.motivo];
  return (
    <button
      type="button"
      className={clases(styles.chip, seleccionado && styles.seleccionado)}
      aria-pressed={seleccionado}
      disabled={!disponible}
      onClick={() => onSeleccionar(turno)}
    >
      <span className={styles.hora}>{turno.hora}</span>
      <span className={styles.detalle}>{detalle}</span>
    </button>
  );
}

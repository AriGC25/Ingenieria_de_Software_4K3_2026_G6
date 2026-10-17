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
  return (
    <button
      type="button"
      className={clases(styles.chip, seleccionado && styles.seleccionado)}
      aria-pressed={seleccionado}
      disabled={!disponible}
      onClick={() => onSeleccionar(turno)}
    >
      <span className={styles.hora}>{turno.hora}</span>
      <span className={styles.detalle}>{detalleDe(turno)}</span>
    </button>
  );
}

/** Los cupos restantes si se puede elegir; si no, por qué no. */
function detalleDe({ estado, cuposDisponibles, motivo }) {
  if (estado === 'disponible') return cupos(cuposDisponibles);
  if (estado === 'agotado') return 'Sin cupos';
  return MOTIVOS[motivo];
}

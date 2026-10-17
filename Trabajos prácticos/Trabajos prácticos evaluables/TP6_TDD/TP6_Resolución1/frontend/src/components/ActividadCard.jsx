import styles from './ActividadCard.module.css';
import { clases } from './clases.js';

/**
 * Tarjeta seleccionable de una actividad. Sin turnos disponibles queda deshabilitada (S-08).
 * @param {{ actividad: { id: string, nombre: string, edadMinima: number | null,
 *   requiereTalle: boolean, disponible: boolean }, seleccionada?: boolean,
 *   onSeleccionar: (actividad: object) => void }} props
 */
export function ActividadCard({ actividad, seleccionada = false, onSeleccionar }) {
  const { id, nombre, edadMinima, requiereTalle, disponible } = actividad;
  return (
    <button
      type="button"
      className={clases(styles.tarjeta, seleccionada && styles.seleccionada)}
      style={{ '--color-actividad': `var(--color-${id})` }}
      aria-pressed={seleccionada}
      disabled={!disponible}
      onClick={() => onSeleccionar(actividad)}
    >
      <span className={styles.franja} aria-hidden="true" />
      {seleccionada && (
        <span className={styles.marca} aria-hidden="true">
          ✓
        </span>
      )}
      <span className={styles.nombre}>{nombre}</span>
      <span className={styles.detalle}>
        {edadMinima === null ? 'Todas las edades' : `Desde ${edadMinima} años`}
      </span>
      {requiereTalle && <span className={styles.detalle}>Requiere talle</span>}
      {!disponible && <span className={styles.sinCupos}>Sin cupos</span>}
    </button>
  );
}

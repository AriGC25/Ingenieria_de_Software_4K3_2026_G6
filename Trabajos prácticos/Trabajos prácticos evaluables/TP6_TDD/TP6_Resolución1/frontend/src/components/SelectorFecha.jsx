import { diaDeLaSemana, formatearFecha } from '../utils/formato.js';
import { clases } from './clases.js';
import styles from './SelectorFecha.module.css';

const ETIQUETAS = ['Hoy', 'Mañana'];

/**
 * Elección de la fecha entre las que ofrece el backend (hoy y mañana, S-31). Las fechas cerradas
 * quedan deshabilitadas con su motivo.
 * @param {{ fechas: { fecha: string, abierta: boolean, motivo?: string }[],
 *   seleccionada?: string, onSeleccionar: (fecha: string) => void }} props
 */
export function SelectorFecha({ fechas, seleccionada, onSeleccionar }) {
  return (
    <div className={styles.fechas} role="group" aria-label="Fecha">
      {fechas.map(({ fecha, abierta, motivo }, i) => (
        <button
          key={fecha}
          type="button"
          className={clases(styles.fecha, fecha === seleccionada && styles.seleccionada)}
          aria-pressed={fecha === seleccionada}
          disabled={!abierta}
          onClick={() => onSeleccionar(fecha)}
        >
          <span className={styles.etiqueta}>{ETIQUETAS[i]}</span>
          <span>
            {diaDeLaSemana(fecha)} {formatearFecha(fecha)}
          </span>
          {!abierta && (
            <span className={styles.motivo}>El parque está cerrado ese día ({motivo})</span>
          )}
        </button>
      ))}
    </div>
  );
}

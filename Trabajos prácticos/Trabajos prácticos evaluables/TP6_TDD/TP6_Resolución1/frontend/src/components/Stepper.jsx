import { clases } from './clases.js';
import styles from './Stepper.module.css';

const PASOS = ['Actividad', 'Horario', 'Participantes', 'Confirmación'];

/**
 * Indicador de los pasos de la inscripción.
 * @param {{ pasoActual: 1 | 2 | 3 | 4 }} props
 */
export function Stepper({ pasoActual }) {
  return (
    <ol className={styles.pasos} aria-label="Pasos de la inscripción">
      {PASOS.map((nombre, i) => {
        const numero = i + 1;
        const completado = numero < pasoActual;
        return (
          <li
            key={nombre}
            className={clases(
              styles.paso,
              completado && styles.completado,
              numero === pasoActual && styles.actual,
            )}
            aria-current={numero === pasoActual ? 'step' : undefined}
          >
            <span className={styles.numero} aria-hidden={completado || undefined}>
              {numero}
            </span>
            <span className={styles.nombre}>
              {nombre}
              {completado && <span className="visualmente-oculto"> (completado)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

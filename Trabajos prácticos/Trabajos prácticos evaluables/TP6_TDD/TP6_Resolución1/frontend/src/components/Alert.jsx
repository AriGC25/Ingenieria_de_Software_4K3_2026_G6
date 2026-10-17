import { forwardRef } from 'react';
import styles from './Alert.module.css';
import { clases } from './clases.js';

const ICONOS = { exito: '✓', error: '!', advertencia: '!', info: 'i' };

/**
 * Mensaje en la página, con ícono. Los errores y las advertencias son `role="alert"`; el resto,
 * `role="status"`. Se puede enfocar para llevar el foco al mensaje.
 * @type {import('react').ForwardRefExoticComponent<any>}
 */
export const Alert = forwardRef(function Alert({ tipo = 'info', titulo, children }, ref) {
  const urgente = tipo === 'error' || tipo === 'advertencia';
  return (
    <div
      ref={ref}
      role={urgente ? 'alert' : 'status'}
      tabIndex={-1}
      className={clases(styles.alerta, styles[tipo])}
    >
      <span className={styles.icono} aria-hidden="true">
        {ICONOS[tipo]}
      </span>
      <div className={styles.contenido}>
        {titulo && <p className={styles.titulo}>{titulo}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
});

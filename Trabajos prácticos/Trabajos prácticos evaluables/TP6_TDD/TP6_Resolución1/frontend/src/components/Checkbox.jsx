import { forwardRef } from 'react';
import { IconoError, descripcionDe } from './Campo.jsx';
import campo from './Campo.module.css';
import styles from './Checkbox.module.css';

/**
 * Casilla con su label al lado y el error debajo.
 * @type {import('react').ForwardRefExoticComponent<any>}
 */
export const Checkbox = forwardRef(function Checkbox({ id, label, error, ...props }, ref) {
  return (
    <div className={styles.contenedor}>
      <div className={styles.fila}>
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={styles.casilla}
          aria-invalid={error ? true : undefined}
          aria-describedby={descripcionDe(id, { error })}
          {...props}
        />
        <label htmlFor={id}>{label}</label>
      </div>
      {error && (
        <p id={`${id}-error`} className={campo.error}>
          <IconoError />
          {error}
        </p>
      )}
    </div>
  );
});

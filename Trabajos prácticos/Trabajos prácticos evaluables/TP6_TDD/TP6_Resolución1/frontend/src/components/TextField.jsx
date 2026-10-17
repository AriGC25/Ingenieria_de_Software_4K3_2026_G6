import { forwardRef } from 'react';
import { Campo, descripcionDe } from './Campo.jsx';
import styles from './Campo.module.css';

/**
 * Input con label, ayuda y error (asociados con `aria-describedby` y `aria-invalid`).
 * @type {import('react').ForwardRefExoticComponent<any>}
 */
export const TextField = forwardRef(function TextField(
  { id, label, ayuda, error, requerido = false, type = 'text', ...props },
  ref,
) {
  return (
    <Campo id={id} label={label} requerido={requerido} ayuda={ayuda} error={error}>
      <input
        ref={ref}
        id={id}
        type={type}
        className={styles.control}
        required={requerido}
        aria-invalid={error ? true : undefined}
        aria-describedby={descripcionDe(id, { ayuda, error })}
        {...props}
      />
    </Campo>
  );
});

import { forwardRef } from 'react';
import { Campo, descripcionDe } from './Campo.jsx';
import styles from './Campo.module.css';

/**
 * Lista desplegable con label, ayuda y error. La primera opción ("Elegí") está vacía.
 * @type {import('react').ForwardRefExoticComponent<any>}
 */
export const Select = forwardRef(function Select(
  { id, label, opciones, ayuda, error, requerido = false, ...props },
  ref,
) {
  return (
    <Campo id={id} label={label} requerido={requerido} ayuda={ayuda} error={error}>
      <select
        ref={ref}
        id={id}
        className={styles.control}
        required={requerido}
        aria-invalid={error ? true : undefined}
        aria-describedby={descripcionDe(id, { ayuda, error })}
        defaultValue=""
        {...props}
      >
        <option value="">Elegí</option>
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
    </Campo>
  );
});

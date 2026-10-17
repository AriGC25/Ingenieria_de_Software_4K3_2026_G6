import styles from './Campo.module.css';

/** Ícono de error: decorativo, el texto del error ya dice lo que pasa. */
export function IconoError() {
  return (
    <svg className={styles.icono} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <path d="M8 4v5M8 11.5v.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Ids de la ayuda y el error de un campo, para `aria-describedby`.
 * @param {string} id
 * @param {{ ayuda?: string, error?: string }} textos
 */
export function descripcionDe(id, { ayuda, error }) {
  const ids = [ayuda && `${id}-ayuda`, error && `${id}-error`].filter(Boolean);
  return ids.length > 0 ? ids.join(' ') : undefined;
}

/**
 * Estructura común de un campo: label arriba, el control, la ayuda y el error debajo.
 * @param {{ id: string, label: import('react').ReactNode, requerido?: boolean, ayuda?: string,
 *   error?: string, children: import('react').ReactNode }} props
 */
export function Campo({ id, label, requerido, ayuda, error, children }) {
  return (
    <div className={styles.campo}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {requerido && (
          <span className={styles.requerido} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>
      {children}
      {ayuda && (
        <p id={`${id}-ayuda`} className={styles.ayuda}>
          {ayuda}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className={styles.error}>
          <IconoError />
          {error}
        </p>
      )}
    </div>
  );
}

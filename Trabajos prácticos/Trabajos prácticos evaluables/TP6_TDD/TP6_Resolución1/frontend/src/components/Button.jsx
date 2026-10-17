import styles from './Button.module.css';
import { clases } from './clases.js';

/**
 * Botón del design system. En estado `cargando` queda deshabilitado y dice "Enviando...".
 * @param {{ variante?: 'primario' | 'secundario' | 'texto', cargando?: boolean,
 *   anchoCompleto?: boolean } & import('react').ButtonHTMLAttributes<HTMLButtonElement>} props
 */
export function Button({
  variante = 'primario',
  cargando = false,
  anchoCompleto = false,
  disabled,
  type = 'button',
  children,
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={clases(
        styles.boton,
        styles[variante],
        anchoCompleto && styles.anchoCompleto,
        className,
      )}
      disabled={disabled || cargando}
      aria-busy={cargando || undefined}
      {...props}
    >
      {cargando && <span className={styles.spinner} aria-hidden="true" />}
      {cargando ? 'Enviando...' : children}
    </button>
  );
}

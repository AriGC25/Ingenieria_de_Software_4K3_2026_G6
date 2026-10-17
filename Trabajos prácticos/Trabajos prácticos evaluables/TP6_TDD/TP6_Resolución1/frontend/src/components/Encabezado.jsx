import logo from '../assets/logo.svg';
import { Button } from './Button.jsx';
import styles from './Encabezado.module.css';

/**
 * Encabezado con el logo y, si hay sesión, el email y "Cerrar sesión".
 * @param {{ email?: string, onCerrarSesion?: () => void }} props
 */
export function Encabezado({ email, onCerrarSesion }) {
  return (
    <header className={styles.encabezado}>
      <div className={styles.contenido}>
        <img src={logo} alt="EcoHarmony Park" className={styles.logo} />
        {email && (
          <div className={styles.sesion}>
            <span className={styles.email}>{email}</span>
            <Button variante="texto" onClick={onCerrarSesion}>
              Cerrar sesión
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

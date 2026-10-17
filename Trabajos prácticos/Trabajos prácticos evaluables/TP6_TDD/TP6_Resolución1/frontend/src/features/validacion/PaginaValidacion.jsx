import { Alert } from '../../components/Alert.jsx';
import styles from '../../components/Pagina.module.css';

/** PT-08: pantalla simulada a la que apunta el QR del mail (S-40). No valida nada. */
export function PaginaValidacion() {
  return (
    <div className={styles.pagina}>
      <h1>Pantalla de validación de inscripciones: demostración</h1>
      <Alert tipo="info">
        Esta pantalla es una simulación. La validación de las inscripciones en el parque queda fuera
        del alcance de esta versión.
      </Alert>
    </div>
  );
}

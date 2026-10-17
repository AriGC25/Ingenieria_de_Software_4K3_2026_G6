import { Button } from '../../components/Button.jsx';
import styles from './Pasos.module.css';

/**
 * Botones al pie de un paso: "Volver" (si hay paso anterior) y la acción principal.
 * @param {{ onVolver?: () => void, onContinuar: () => void, textoContinuar?: string,
 *   cargando?: boolean, deshabilitado?: boolean }} props
 */
export function AccionesDelPaso({
  onVolver,
  onContinuar,
  textoContinuar = 'Continuar',
  cargando = false,
  deshabilitado = false,
}) {
  return (
    <div className={styles.acciones}>
      {onVolver ? (
        <Button variante="secundario" onClick={onVolver}>
          Volver
        </Button>
      ) : (
        <span />
      )}
      <Button onClick={onContinuar} cargando={cargando} disabled={deshabilitado}>
        {textoContinuar}
      </Button>
    </div>
  );
}

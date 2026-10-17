import { useId } from 'react';
import { Button } from '../../components/Button.jsx';
import styles from './Pasos.module.css';

/**
 * Botones al pie de un paso: "Volver" (si hay paso anterior) y la acción principal, al final. Si
 * la acción está deshabilitada, se explica por qué.
 * @param {{ onVolver?: () => void, onContinuar: () => void, textoContinuar?: string,
 *   cargando?: boolean, motivoDeshabilitado?: string | null }} props
 */
export function AccionesDelPaso({
  onVolver,
  onContinuar,
  textoContinuar = 'Continuar',
  cargando = false,
  motivoDeshabilitado = null,
}) {
  const idMotivo = useId();
  return (
    <div className={styles.acciones}>
      {motivoDeshabilitado && (
        <p id={idMotivo} className={styles.nota}>
          {motivoDeshabilitado}
        </p>
      )}
      {onVolver && (
        <Button variante="secundario" onClick={onVolver}>
          Volver
        </Button>
      )}
      <Button
        onClick={onContinuar}
        cargando={cargando}
        disabled={Boolean(motivoDeshabilitado)}
        aria-describedby={motivoDeshabilitado ? idMotivo : undefined}
      >
        {textoContinuar}
      </Button>
    </div>
  );
}

import { useId } from 'react';
import { useFocoAtrapado } from '../hooks/useFocoAtrapado.js';
import { Button } from './Button.jsx';
import styles from './Modal.module.css';

/**
 * Diálogo modal: atrapa el foco, se cierra con `Esc` o con "Cerrar" y devuelve el foco al
 * elemento que lo abrió.
 * @param {{ abierto: boolean, titulo: string, onCerrar: () => void,
 *   children: import('react').ReactNode }} props
 */
export function Modal({ abierto, titulo, onCerrar, children }) {
  const idTitulo = useId();
  const { contenedor, alPresionarTab } = useFocoAtrapado(abierto);

  if (!abierto) return null;

  function alPresionarTecla(evento) {
    if (evento.key === 'Escape') {
      evento.stopPropagation();
      onCerrar();
    }
    if (evento.key === 'Tab') alPresionarTab(evento);
  }

  return (
    <div className={styles.fondo} onClick={onCerrar}>
      <div
        ref={contenedor}
        role="dialog"
        aria-modal="true"
        aria-labelledby={idTitulo}
        className={styles.dialogo}
        onKeyDown={alPresionarTecla}
        onClick={(evento) => evento.stopPropagation()}
      >
        <h2 id={idTitulo} className={styles.titulo}>
          {titulo}
        </h2>
        <div className={styles.cuerpo}>{children}</div>
        <div className={styles.acciones}>
          <Button variante="secundario" onClick={onCerrar}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useId, useRef } from 'react';
import { Button } from './Button.jsx';
import styles from './Modal.module.css';

const ENFOCABLES =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Diálogo modal: atrapa el foco, se cierra con `Esc` o con "Cerrar" y devuelve el foco al
 * elemento que lo abrió.
 * @param {{ abierto: boolean, titulo: string, onCerrar: () => void,
 *   children: import('react').ReactNode }} props
 */
export function Modal({ abierto, titulo, onCerrar, children }) {
  const idTitulo = useId();
  const dialogo = useRef(null);

  useEffect(() => {
    if (!abierto) return undefined;
    const quienLoAbrio = document.activeElement;
    dialogo.current.querySelector(ENFOCABLES)?.focus();
    return () => quienLoAbrio?.focus();
  }, [abierto]);

  if (!abierto) return null;

  function alPresionarTecla(evento) {
    if (evento.key === 'Escape') {
      evento.stopPropagation();
      onCerrar();
    }
    if (evento.key === 'Tab') atraparFoco(evento, dialogo.current);
  }

  return (
    <div className={styles.fondo} onClick={onCerrar}>
      <div
        ref={dialogo}
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

function atraparFoco(evento, contenedor) {
  const enfocables = [...contenedor.querySelectorAll(ENFOCABLES)];
  const primero = enfocables[0];
  const ultimo = enfocables.at(-1);
  if (evento.shiftKey && document.activeElement === primero) {
    evento.preventDefault();
    ultimo.focus();
  } else if (!evento.shiftKey && document.activeElement === ultimo) {
    evento.preventDefault();
    primero.focus();
  }
}

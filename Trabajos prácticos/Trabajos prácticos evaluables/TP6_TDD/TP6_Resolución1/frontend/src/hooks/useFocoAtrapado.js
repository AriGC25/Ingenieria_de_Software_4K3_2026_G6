import { useEffect, useRef } from 'react';

const ENFOCABLES =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Mantiene el foco dentro de un contenedor mientras está activo: lo lleva adentro al activarse,
 * lo hace circular con Tab y lo devuelve al elemento que tenía el foco al desactivarse.
 * @param {boolean} activo
 * @returns {{ contenedor: import('react').RefObject<HTMLElement>,
 *   alPresionarTab: (evento: KeyboardEvent) => void }}
 */
export function useFocoAtrapado(activo) {
  const contenedor = useRef(null);

  useEffect(() => {
    if (!activo) return undefined;
    const quienTeniaElFoco = document.activeElement;
    contenedor.current?.querySelector(ENFOCABLES)?.focus();
    return () => quienTeniaElFoco?.focus();
  }, [activo]);

  function alPresionarTab(evento) {
    const enfocables = [...contenedor.current.querySelectorAll(ENFOCABLES)];
    const [primero, ultimo] = [enfocables[0], enfocables.at(-1)];
    const desde = evento.shiftKey ? primero : ultimo;
    if (document.activeElement === desde) {
      evento.preventDefault();
      (evento.shiftKey ? ultimo : primero).focus();
    }
  }

  return { contenedor, alPresionarTab };
}

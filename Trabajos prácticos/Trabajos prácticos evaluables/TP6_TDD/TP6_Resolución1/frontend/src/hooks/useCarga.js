import { useEffect, useState } from 'react';

/**
 * Pide datos al cargar (o al cambiar las dependencias) y expone el estado de la carga.
 * @template T
 * @param {(() => Promise<T>) | null} pedir `null` para no pedir nada todavía
 * @param {unknown[]} dependencias
 * @returns {{ datos: T | null, cargando: boolean, error: { mensaje: string } | null }}
 */
export function useCarga(pedir, dependencias) {
  const [estado, setEstado] = useState({ datos: null, cargando: Boolean(pedir), error: null });

  useEffect(() => {
    if (!pedir) return undefined;
    let vigente = true;
    setEstado({ datos: null, cargando: true, error: null });
    pedir().then(
      (datos) => vigente && setEstado({ datos, cargando: false, error: null }),
      (error) => vigente && setEstado({ datos: null, cargando: false, error }),
    );
    return () => {
      vigente = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- las dependencias las define quien llama
  }, dependencias);

  return estado;
}

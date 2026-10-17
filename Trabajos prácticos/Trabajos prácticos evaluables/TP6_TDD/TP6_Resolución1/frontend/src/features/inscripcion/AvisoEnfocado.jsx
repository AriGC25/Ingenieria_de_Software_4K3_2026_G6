import { useEffect, useRef } from 'react';
import { Alert } from '../../components/Alert.jsx';

/**
 * `Alert` que recibe el foco al aparecer o al cambiar su contenido, para que se lea enseguida.
 * @param {{ tipo?: string, children: import('react').ReactNode, clave?: unknown }} props
 */
export function AvisoEnfocado({ tipo = 'error', children, clave }) {
  const aviso = useRef(null);
  useEffect(() => {
    aviso.current?.focus();
  }, [clave]);
  return (
    <Alert ref={aviso} tipo={tipo}>
      {children}
    </Alert>
  );
}

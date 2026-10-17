import { useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { crearInscripcion } from '../../api/cliente.js';
import { useSesion } from '../sesion/SesionContexto.jsx';
import { useInscripcion } from './InscripcionContexto.jsx';
import { armarSolicitud, ubicarCampo } from './solicitud.js';

/**
 * Envía la inscripción una sola vez aunque se haga doble clic, y reparte los errores de la API:
 * los de un dato vuelven a su paso, el del mail va al resultado y el resto se muestra acá.
 * @returns {{ confirmar: () => Promise<void>, enviando: boolean, errorGeneral: object | null }}
 */
export function useEnvioInscripcion() {
  const { email } = useSesion();
  const { actividad, turno, setResultado, enfocarAlVolver } = useInscripcion();
  const { getValues, setError } = useFormContext();
  const [enviando, setEnviando] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState(null);
  const enCurso = useRef(false);
  const navegar = useNavigate();

  async function confirmar() {
    if (enCurso.current) return;
    enCurso.current = true;
    setEnviando(true);
    setErrorGeneral(null);
    try {
      const solicitud = armarSolicitud(getValues(), { turno, actividad, email });
      setResultado({ tipo: 'exito', inscripcion: await crearInscripcion(solicitud) });
      navegar('/inscripcion/resultado');
    } catch (error) {
      repartirError(error);
    } finally {
      enCurso.current = false;
      setEnviando(false);
    }
  }

  function repartirError(error) {
    if (error.codigo === 'ENVIO_CONFIRMACION_FALLIDO') {
      setResultado({ tipo: 'envio_fallido', mensaje: error.mensaje });
      navegar('/inscripcion/resultado');
      return;
    }
    const ubicacion = error.campo && ubicarCampo(error.campo);
    if (!ubicacion) {
      setErrorGeneral(error);
      return;
    }
    setError(ubicacion.campo, { type: 'api', message: error.mensaje });
    enfocarAlVolver(ubicacion.campo);
    navegar(ubicacion.ruta);
  }

  return { confirmar, enviando, errorGeneral };
}

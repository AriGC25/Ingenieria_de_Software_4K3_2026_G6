import { Navigate, useNavigate } from 'react-router';
import { AccionesDelPaso } from './AccionesDelPaso.jsx';
import { AvisoEnfocado } from './AvisoEnfocado.jsx';
import { ResumenInscripcion } from '../../components/ResumenInscripcion.jsx';
import { useInscripcion } from './InscripcionContexto.jsx';
import styles from './Pasos.module.css';

/** PT-06: resultado de la inscripción, con el detalle y el código, o el error y "Reintentar". */
export function PaginaResultado() {
  const { resultado, actividad, reiniciar } = useInscripcion();
  const navegar = useNavigate();

  if (!resultado) return <Navigate to="/inscripcion/actividad" replace />;

  if (resultado.tipo === 'envio_fallido') {
    return (
      <div className={styles.paso}>
        <h1>No pudimos confirmar la inscripción</h1>
        <AvisoEnfocado>{resultado.mensaje}</AvisoEnfocado>
        <AccionesDelPaso
          onContinuar={() => navegar('/inscripcion/confirmacion')}
          textoContinuar="Reintentar"
        />
      </div>
    );
  }

  const { inscripcion } = resultado;
  function otraInscripcion() {
    reiniciar();
    navegar('/inscripcion/actividad');
  }

  return (
    <div className={styles.paso}>
      <h1>Inscripción confirmada</h1>
      <AvisoEnfocado tipo="exito">
        ¡Inscripción confirmada! Te enviamos el detalle y el código QR a {inscripcion.email}.
      </AvisoEnfocado>
      <section className={styles.seccion} aria-label="Código de inscripción">
        <p className={styles.nota}>Código de inscripción</p>
        <p className={styles.codigo}>{inscripcion.codigo}</p>
      </section>
      <ResumenInscripcion
        titulo="Detalle de la inscripción"
        actividad={inscripcion.actividad}
        fecha={inscripcion.fecha}
        hora={inscripcion.hora}
        email={inscripcion.email}
        requiereTalle={actividad?.requiereTalle}
        participantes={inscripcion.participantes}
      />
      <AccionesDelPaso onContinuar={otraInscripcion} textoContinuar="Hacer otra inscripción" />
    </div>
  );
}

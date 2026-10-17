import { Navigate, Outlet, Route, Routes } from 'react-router';
import { Layout } from './components/Layout.jsx';
import { InscripcionProvider } from './features/inscripcion/InscripcionContexto.jsx';
import { PaginaActividad } from './features/inscripcion/PaginaActividad.jsx';
import { PaginaHorario } from './features/inscripcion/PaginaHorario.jsx';
import { PasoPendiente } from './features/inscripcion/PasoPendiente.jsx';
import { PaginaIngreso } from './features/sesion/PaginaIngreso.jsx';
import { RutaProtegida } from './features/sesion/RutaProtegida.jsx';
import { SesionProvider } from './features/sesion/SesionContexto.jsx';
import { PaginaValidacion } from './features/validacion/PaginaValidacion.jsx';

const PASOS = [
  { ruta: 'actividad', paso: 1, Pagina: PaginaActividad },
  { ruta: 'horario', paso: 2, Pagina: PaginaHorario },
];

/** La aplicación con sus proveedores y rutas. El router lo pone quien la monta. */
export function Aplicacion() {
  return (
    <SesionProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/ingreso" element={<PaginaIngreso />} />
          <Route path="/validar-inscripcion" element={<PaginaValidacion />} />
          <Route element={<RutaProtegida />}>
            <Route path="/inscripcion" element={<FlujoDeInscripcion />}>
              {PASOS.map(({ ruta, paso, Pagina }) => (
                <Route
                  key={ruta}
                  path={ruta}
                  element={
                    <PasoPendiente paso={paso}>
                      <Pagina />
                    </PasoPendiente>
                  }
                />
              ))}
              <Route path="*" element={<Navigate to="/inscripcion/actividad" replace />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/inscripcion/actividad" replace />} />
        </Route>
      </Routes>
    </SesionProvider>
  );
}

function FlujoDeInscripcion() {
  return (
    <InscripcionProvider>
      <Outlet />
    </InscripcionProvider>
  );
}

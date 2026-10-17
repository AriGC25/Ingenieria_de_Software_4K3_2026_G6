import { InscribirseActividad } from '../../../src/aplicacion/inscribirseActividad.js';
import { crearCalendarioParque } from '../../../src/dominio/calendarioParque.js';
import { unTurno } from '../../builders/turno.js';
import { generadorCodigoFijo, generadorQRFijo } from '../../dobles/generadores.js';
import { notificadorEspia } from '../../dobles/notificador.js';
import { relojFijo } from '../../dobles/reloj.js';
import { repositoriosEnMemoria } from '../../dobles/repositorios.js';

/**
 * Arma `InscribirseActividad` con dobles, y el turno de Tirolesa del martes a las 10:00 cargado.
 * @param {object} [cambios] dependencias a reemplazar
 */
export function contextoDeInscripcion(cambios = {}) {
  const repos = repositoriosEnMemoria();
  repos.repositorioTurnos.agregar(unTurno().build());
  const dependencias = {
    repositorioTurnos: repos.repositorioTurnos,
    repositorioInscripciones: repos.repositorioInscripciones,
    notificador: notificadorEspia(),
    generadorQR: generadorQRFijo(),
    generadorCodigo: generadorCodigoFijo(),
    reloj: relojFijo(),
    calendario: crearCalendarioParque(),
    ...cambios,
  };
  return { ...dependencias, casoDeUso: new InscribirseActividad(dependencias) };
}

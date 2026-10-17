import { readFileSync } from 'node:fs';
import nodemailer from 'nodemailer';
import { ConsultarFechas } from './aplicacion/consultarFechas.js';
import { ConsultarTurnos } from './aplicacion/consultarTurnos.js';
import { InscribirseActividad } from './aplicacion/inscribirseActividad.js';
import { ListarActividades } from './aplicacion/listarActividades.js';
import { crearCalendarioParque } from './dominio/calendarioParque.js';
import { crearClientePrisma } from './infraestructura/database/clientePrisma.js';
import { RepositorioActividadesPrisma } from './infraestructura/database/repositorioActividades.js';
import { RepositorioInscripcionesPrisma } from './infraestructura/database/repositorioInscripciones.js';
import { RepositorioTurnosPrisma } from './infraestructura/database/repositorioTurnos.js';
import { NotificadorEnMemoria } from './infraestructura/email/notificadorEnMemoria.js';
import { NotificadorSmtp } from './infraestructura/email/notificadorSmtp.js';
import { generadorCodigo } from './infraestructura/generadorCodigo.js';
import { QrFijo } from './infraestructura/qrFijo.js';
import { crearReloj } from './infraestructura/reloj.js';
import { crearApp } from './interfaces/http/app.js';

const LOGO = readFileSync(new URL('./infraestructura/email/templates/logo.png', import.meta.url));

/**
 * Crea los adaptadores según la configuración y los inyecta en los casos de uso (composición).
 * @param {ReturnType<typeof import('./configuracion.js').leerConfiguracion>} configuracion
 */
export function componerAplicacion(configuracion) {
  const prisma = crearClientePrisma(configuracion.baseDatos);
  const reloj = crearReloj(configuracion.relojFijo);
  const calendario = crearCalendarioParque(configuracion.calendario);
  const notificador = crearNotificador(configuracion);
  const repositorioActividades = new RepositorioActividadesPrisma(prisma);
  const repositorioTurnos = new RepositorioTurnosPrisma(prisma);
  const repositorioInscripciones = new RepositorioInscripcionesPrisma(prisma);

  const app = crearApp({
    listarActividades: new ListarActividades({
      repositorioActividades,
      repositorioTurnos,
      reloj,
      calendario,
    }),
    consultarFechas: new ConsultarFechas({ reloj, calendario }),
    consultarTurnos: new ConsultarTurnos({
      repositorioActividades,
      repositorioTurnos,
      reloj,
      calendario,
    }),
    inscribirseActividad: new InscribirseActividad({
      repositorioTurnos,
      repositorioInscripciones,
      notificador,
      generadorQR: new QrFijo(configuracion.appUrl),
      generadorCodigo,
      reloj,
      calendario,
    }),
  });
  return { app, prisma, notificador };
}

function crearNotificador({ mail, appUrl }) {
  const opciones = { remitente: mail.remitente, appUrl, logo: LOGO };
  if (mail.perfil === 'pruebas') return new NotificadorEnMemoria(opciones);
  return new NotificadorSmtp({ ...opciones, transporte: nodemailer.createTransport(mail.smtp) });
}

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderizarEn } from '../../renderizar.jsx';

export const EMAIL = 'ana@mail.com';

/** Abre la aplicación con sesión en la elección de actividad. */
export function empezar() {
  return renderizarEn('/inscripcion/actividad', { email: EMAIL });
}

export async function elegirActividad(nombre = 'Tirolesa') {
  await userEvent.click(await screen.findByRole('button', { name: new RegExp(nombre) }));
  await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));
}

export async function elegirHorario(hora = '10:00') {
  await userEvent.click(await screen.findByRole('button', { name: /^Hoy/ }));
  await userEvent.click(await screen.findByRole('button', { name: new RegExp(hora) }));
  await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));
}

/** Completa los datos de una persona (por índice, desde 0). */
export async function completarPersona(indice, { nombre, dni, edad, talle } = {}) {
  const persona = screen.getByRole('group', { name: `Persona ${indice + 1}` });
  const dentro = (rol, nombreCampo) =>
    [...persona.querySelectorAll('input, select')].find(
      (e) => e.labels?.[0]?.textContent.startsWith(nombreCampo) && e.matches(rol),
    );
  if (nombre !== undefined) await userEvent.type(dentro('input', 'Nombre'), nombre);
  if (dni !== undefined) await userEvent.type(dentro('input', 'DNI'), dni);
  if (edad !== undefined) await userEvent.type(dentro('input', 'Edad'), String(edad));
  if (talle !== undefined) await userEvent.selectOptions(dentro('select', 'Talle'), talle);
}

export async function indicarCantidad(cantidad) {
  const campo = await screen.findByRole('spinbutton', { name: /Cantidad de personas/ });
  await userEvent.clear(campo);
  await userEvent.type(campo, String(cantidad));
}

export const ANA = { nombre: 'Ana Pérez', dni: '40123456', edad: 25, talle: 'M' };
export const JUAN = { nombre: 'Juan Pérez', dni: '42123456', edad: 22, talle: 'L' };

/** Recorre el flujo hasta la confirmación con Tirolesa, hoy 10:00 y las personas indicadas. */
export async function llegarAConfirmacion(personas = [ANA]) {
  empezar();
  await elegirActividad('Tirolesa');
  await elegirHorario('10:00');
  await indicarCantidad(personas.length);
  for (const [i, persona] of personas.entries()) await completarPersona(i, persona);
  await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));
  await screen.findByRole('heading', { name: 'Confirmá la inscripción' });
}

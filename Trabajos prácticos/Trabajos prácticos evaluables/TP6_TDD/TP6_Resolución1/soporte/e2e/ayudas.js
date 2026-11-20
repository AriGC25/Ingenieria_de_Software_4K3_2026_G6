import { expect } from '@playwright/test';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';
import { MAILPIT } from './entorno.js';

export async function ingresar(page, email) {
  await page.goto('/ingreso');
  await page.getByRole('textbox', { name: /Email/ }).fill(email);
  await page.getByLabel(/Contraseña/).fill('cualquiera');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page.getByRole('heading', { name: 'Elegí la actividad' })).toBeVisible();
}

export async function elegirActividadYTurno(page, actividad, hora) {
  await page.getByRole('button', { name: new RegExp(actividad) }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('button', { name: /^Hoy/ }).click();
  await page
    .getByRole('group', { name: 'Turnos' })
    .getByRole('button', { name: new RegExp(hora) })
    .click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await expect(page.getByRole('heading', { name: 'Indicá quiénes participan' })).toBeVisible();
}

export async function completarParticipantes(page, personas) {
  await page
    .getByRole('spinbutton', { name: /Cantidad de personas/ })
    .fill(String(personas.length));
  for (const [i, { nombre, dni, edad, talle }] of personas.entries()) {
    const persona = page.getByRole('group', { name: `Persona ${i + 1}` });
    await persona.getByRole('textbox', { name: /Nombre/ }).fill(nombre);
    await persona.getByRole('textbox', { name: /DNI/ }).fill(dni);
    await persona.getByRole('spinbutton', { name: /Edad/ }).fill(String(edad));
    if (talle) await persona.getByRole('combobox', { name: /Talle/ }).selectOption(talle);
  }
  await page.getByRole('button', { name: 'Continuar' }).click();
}

export async function aceptarYConfirmar(page) {
  await page.getByRole('checkbox', { name: /Acepto los términos/ }).check();
  await page.getByRole('button', { name: 'Confirmar inscripción' }).click();
}

/** Espera el mail enviado a esa dirección y lo devuelve con su detalle de Mailpit. */
export async function mailPara(email) {
  for (let intento = 0; intento < 20; intento++) {
    const busqueda = await (
      await fetch(`${MAILPIT}/api/v1/search?query=${encodeURIComponent(`to:"${email}"`)}`)
    ).json();
    if (busqueda.messages?.length > 0) {
      return (await fetch(`${MAILPIT}/api/v1/message/${busqueda.messages[0].ID}`)).json();
    }
    await new Promise((resolver) => setTimeout(resolver, 250));
  }
  throw new Error(`No llegó ningún mail a ${email}`);
}

/** Decodifica el QR de una parte (imagen PNG) del mail. */
export async function leerQr(mensaje, parte) {
  const png = await fetch(`${MAILPIT}/api/v1/message/${mensaje.ID}/part/${parte.PartID}`);
  const imagen = PNG.sync.read(Buffer.from(await png.arrayBuffer()));
  return jsQR(new Uint8ClampedArray(imagen.data), imagen.width, imagen.height)?.data;
}

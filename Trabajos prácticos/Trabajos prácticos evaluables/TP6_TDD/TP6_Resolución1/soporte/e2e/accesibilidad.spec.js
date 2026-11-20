import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { completarParticipantes, elegirActividadYTurno, ingresar } from './ayudas.js';

const analizar = async (page) =>
  (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations;

test('las pantallas del flujo cumplen WCAG 2.1 AA según axe', async ({ page }) => {
  await page.goto('/ingreso');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  expect(await analizar(page), 'ingreso con errores').toEqual([]);

  await ingresar(page, 'axe.e2e@mail.com');
  expect(await analizar(page), 'actividad').toEqual([]);

  await elegirActividadYTurno(page, 'Tirolesa', '16:00');
  await page.getByRole('button', { name: 'Continuar' }).click();
  expect(await analizar(page), 'participantes con errores').toEqual([]);

  await completarParticipantes(page, [
    { nombre: 'Axe Prueba', dni: '39123456', edad: 30, talle: 'S' },
  ]);
  expect(await analizar(page), 'confirmación').toEqual([]);

  await page.getByRole('button', { name: 'términos y condiciones' }).click();
  expect(await analizar(page), 'modal de términos').toEqual([]);
  await page.keyboard.press('Escape');

  await page.goto('/validar-inscripcion');
  expect(await analizar(page), 'validación').toEqual([]);
});

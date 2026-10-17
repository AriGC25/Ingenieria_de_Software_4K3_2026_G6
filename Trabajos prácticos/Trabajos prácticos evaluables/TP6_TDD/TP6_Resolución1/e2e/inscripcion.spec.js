import { expect, test } from '@playwright/test';
import { createClient } from '@libsql/client';
import {
  aceptarYConfirmar,
  completarParticipantes,
  elegirActividadYTurno,
  ingresar,
  leerQr,
  mailPara,
} from './ayudas.js';
import { ARCHIVO_BASE, URL_APP } from './entorno.js';

const base = createClient({ url: `file:${ARCHIVO_BASE}` });
const ocupar = (turnoId, cupoOcupado) =>
  base.execute({
    sql: 'UPDATE Turno SET cupoOcupado = ? WHERE id = ?',
    args: [cupoOcupado, turnoId],
  });

let qrDelMail;

test('E2E-01 (PA-01, PA-15, PA-29): inscripción exitosa y mail con el detalle, el código y el QR', async ({
  page,
}) => {
  await ingresar(page, 'ana.e2e@mail.com');
  await elegirActividadYTurno(page, 'Tirolesa', '10:00');
  await completarParticipantes(page, [
    { nombre: 'Ana Pérez', dni: '40123456', edad: 25, talle: 'M' },
    { nombre: 'Juan Pérez', dni: '42123456', edad: 22, talle: 'L' },
  ]);
  await aceptarYConfirmar(page);

  await expect(page.getByRole('heading', { name: 'Inscripción confirmada' })).toBeVisible();
  await expect(page.getByRole('status')).toContainText('ana.e2e@mail.com');
  const codigo = await page.getByText(/^ECOPARK-[A-Z2-9]{6}$/).textContent();

  const mail = await mailPara('ana.e2e@mail.com');
  expect(mail.Subject).toBe('Confirmación de inscripción: Tirolesa, 20/10/2026 10:00');
  expect(mail.From.Name).toBe('EcoHarmony Park');
  expect(mail.HTML).toContain(codigo);
  expect(mail.HTML).toContain('Juan Pérez');
  expect(mail.HTML).toContain('Talle L');
  expect(mail.Attachments.map((a) => a.FileName)).toContain('qr-inscripcion.png');
  expect(mail.Inline.map((a) => a.ContentID).sort()).toEqual(['logo', 'qr']);
  qrDelMail = await leerQr(
    mail,
    mail.Attachments.find((a) => a.FileName === 'qr-inscripcion.png'),
  );
  expect(qrDelMail).toBe(`${URL_APP}/validar-inscripcion`);
});

test('E2E-02 (PA-02, PA-30): un turno sin cupo no se elige y el último cupo tomado en paralelo se informa', async ({
  page,
}) => {
  await ocupar('t-safari-2026-10-20-11', 8);
  await ocupar('t-safari-2026-10-20-12', 7);
  await ingresar(page, 'sofia.e2e@mail.com');
  await page.getByRole('button', { name: /Safari/ }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('button', { name: /^Hoy/ }).click();

  const sinCupo = page
    .getByRole('group', { name: 'Turnos' })
    .getByRole('button', { name: /11:00/ });
  await expect(sinCupo).toBeDisabled();
  await expect(sinCupo).toContainText('Sin cupos');

  await page.getByRole('group', { name: 'Turnos' }).getByRole('button', { name: /12:00/ }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await completarParticipantes(page, [{ nombre: 'Sofía Gómez', dni: '45123456', edad: 30 }]);
  const otroVisitante = await page.request.post('/api/inscripciones', {
    data: {
      turnoId: 't-safari-2026-10-20-12',
      email: 'otro.e2e@mail.com',
      aceptaTerminos: true,
      participantes: [{ nombre: 'Otro Visitante', dni: '46123456', edad: 40 }],
    },
  });
  expect(otroVisitante.status()).toBe(201);

  await aceptarYConfirmar(page);

  await expect(page.getByRole('alert')).toContainText(
    'No quedan cupos suficientes para este horario',
  );
  await expect(page.getByRole('button', { name: 'Elegir otro horario' })).toBeVisible();
});

test('E2E-03 (PA-03): Safari sin talle se confirma', async ({ page }) => {
  await ingresar(page, 'lucas.e2e@mail.com');
  await elegirActividadYTurno(page, 'Safari', '13:00');

  await expect(page.getByRole('combobox', { name: /Talle/ })).toHaveCount(0);
  await completarParticipantes(page, [{ nombre: 'Lucas Díaz', dni: '50123456', edad: 4 }]);
  await aceptarYConfirmar(page);

  await expect(page.getByRole('heading', { name: 'Inscripción confirmada' })).toBeVisible();
  const mail = await mailPara('lucas.e2e@mail.com');
  expect(mail.HTML).not.toContain('Talle');
});

test('E2E-04 (PA-04, PA-14): un día cerrado y un turno fuera de la ventana no se pueden elegir', async ({
  page,
}) => {
  const lunes = await page.request.get('/api/actividades/tirolesa/turnos?fecha=2026-10-26');
  expect(await lunes.json()).toEqual({
    fecha: '2026-10-26',
    abierta: false,
    motivo: 'lunes',
    turnos: [],
  });

  await ingresar(page, 'marta.e2e@mail.com');
  await page.getByRole('button', { name: /Jardinería/ }).click();
  await page.getByRole('button', { name: 'Continuar' }).click();
  await page.getByRole('button', { name: /^Hoy/ }).click();
  const turnos = page.getByRole('group', { name: 'Turnos' });
  await expect(turnos.getByRole('button', { name: /09:00/ })).toBeDisabled();
  await expect(turnos.getByRole('button', { name: /09:00/ })).toContainText('Ya empezó');

  await page.getByRole('button', { name: /^Mañana/ }).click();
  await expect(turnos.getByRole('button', { name: /09:00/ })).toBeEnabled();
  await expect(turnos.getByRole('button', { name: /10:00/ })).toBeDisabled();
  await expect(turnos.getByRole('button', { name: /10:00/ })).toContainText('Todavía no abre');
});

test('E2E-05 (PA-05): sin aceptar los términos no se puede confirmar', async ({ page }) => {
  await ingresar(page, 'pedro.e2e@mail.com');
  await elegirActividadYTurno(page, 'Jardinería', '14:00');
  await completarParticipantes(page, [{ nombre: 'Pedro Ruiz', dni: '33123456', edad: 60 }]);

  await expect(page.getByRole('button', { name: 'Confirmar inscripción' })).toBeDisabled();
  await page.getByRole('button', { name: 'términos y condiciones' }).click();
  await expect(page.getByRole('dialog')).toContainText('Términos y condiciones de Jardinería');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('checkbox', { name: /Acepto los términos/ })).not.toBeChecked();
  await expect(page.getByRole('button', { name: 'Confirmar inscripción' })).toBeDisabled();
});

test('E2E-06 (PA-06): Palestra sin talle no avanza', async ({ page }) => {
  await ingresar(page, 'julia.e2e@mail.com');
  await elegirActividadYTurno(page, 'Palestra', '15:00');

  await completarParticipantes(page, [{ nombre: 'Julia Sosa', dni: '41123456', edad: 20 }]);

  await expect(page.getByRole('combobox', { name: /Talle/ })).toHaveAccessibleDescription(
    'Ingresá el talle.',
  );
  await expect(page.getByRole('heading', { name: 'Indicá quiénes participan' })).toBeVisible();
});

test('E2E-07 (PA-28): el QR del mail abre la pantalla de validación simulada', async ({ page }) => {
  expect(qrDelMail).toBeTruthy();

  await page.goto(qrDelMail);

  await expect(
    page.getByRole('heading', { name: 'Pantalla de validación de inscripciones: demostración' }),
  ).toBeVisible();
});

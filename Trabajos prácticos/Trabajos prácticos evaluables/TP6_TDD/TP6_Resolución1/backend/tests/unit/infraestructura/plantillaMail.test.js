import { describe, it, expect } from 'vitest';
import { renderizar } from '../../../src/infraestructura/email/renderizador.js';
import {
  armarMailConfirmacion,
  filasParticipantes,
} from '../../../src/infraestructura/email/mailConfirmacion.js';
import { unDetalleDeInscripcion } from '../../builders/detalleInscripcion.js';

const APP_URL = 'https://ecoharmony.vercel.app';

describe('renderizador de plantillas', () => {
  it('TPL-01: reemplaza todas las variables, aunque se repitan', () => {
    const html = renderizar('<p>{{a}} y {{b}}, otra vez {{a}}</p>', { a: 'uno', b: 2 });

    expect(html).toBe('<p>uno y 2, otra vez uno</p>');
  });

  it('TPL-02: escapa el HTML de los valores', () => {
    const html = renderizar('<p>{{nombre}}</p>', { nombre: '<script>alert("x")</script> & \'y\'' });

    expect(html).toBe('<p>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;y&#39;</p>');
  });

  it('TPL-02: no escapa los valores marcados como HTML ya armado', () => {
    expect(renderizar('{{filas}}', { filas: '<tr></tr>' }, { html: ['filas'] })).toBe('<tr></tr>');
  });

  it.each([
    ['falta la variable', {}],
    ['la variable es nula', { a: null }],
    ['la variable no está definida', { a: undefined }],
  ])('TPL-03: falla si %s', (_caso, variables) => {
    expect(() => renderizar('<p>{{a}}</p>', variables)).toThrow(/Variable sin valor: a/);
  });
});

describe('mail de confirmación', () => {
  it('TPL-04: las filas de participantes muestran el talle solo si la actividad lo requiere', () => {
    const conTalle = filasParticipantes(unDetalleDeInscripcion().participantes, true);
    const sinTalle = filasParticipantes(
      [{ nombre: 'Ana Pérez', dni: '40123456', edad: 25, talle: null }],
      false,
    );

    expect(conTalle).toContain('Talle M');
    expect(conTalle).toContain('Juan Pérez');
    expect(sinTalle).not.toContain('Talle');
    expect(sinTalle).toContain('DNI 40123456');
  });

  it('TPL-04: escapa el nombre de cada participante', () => {
    const filas = filasParticipantes(
      [{ nombre: '<b>Ana</b>', dni: '1', edad: 1, talle: null }],
      false,
    );

    expect(filas).toContain('&lt;b&gt;Ana&lt;/b&gt;');
  });

  it('TPL-05: la plantilla real referencia cid:logo y cid:qr', () => {
    const { html } = armarMailConfirmacion(unDetalleDeInscripcion(), APP_URL);

    expect(html).toContain('src="cid:logo"');
    expect(html).toContain('src="cid:qr"');
  });

  it('TPL-05: la plantilla real lleva el detalle, el código, el email y el enlace de validación', () => {
    const { html } = armarMailConfirmacion(unDetalleDeInscripcion(), APP_URL);

    expect(html).toContain('Tirolesa');
    expect(html).toContain('20/10/2026');
    expect(html).toContain('10:00');
    expect(html).toContain('ECOPARK-7K3M9Q');
    expect(html).toContain('ana@mail.com');
    expect(html).toContain(`${APP_URL}/validar-inscripcion`);
    expect(html).toContain('Presentá este código al llegar a la actividad');
    expect(html).not.toMatch(/\{\{/);
  });

  it('TPL-06: el asunto lleva la actividad, la fecha y la hora en hora argentina', () => {
    const detalle = unDetalleDeInscripcion({
      actividad: 'Safari',
      inicio: new Date('2026-10-20T20:00:00Z'),
    });

    expect(armarMailConfirmacion(detalle, APP_URL).asunto).toBe(
      'Confirmación de inscripción: Safari, 20/10/2026 17:00',
    );
  });

  it('TPL-07: el mail no incluye montos ni un enlace a los términos', () => {
    const { html } = armarMailConfirmacion(unDetalleDeInscripcion(), APP_URL);

    expect(html).not.toMatch(/\$|ARS|precio|monto/i);
    expect(html).not.toMatch(/t[ée]rminos/i);
  });
});

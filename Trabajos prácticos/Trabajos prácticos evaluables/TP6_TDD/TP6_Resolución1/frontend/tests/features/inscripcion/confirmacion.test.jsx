import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse, delay } from 'msw';
import { describe, expect, it } from 'vitest';
import { servidor } from '../../msw/servidor.js';
import {
  ANA,
  JUAN,
  completarPersona,
  elegirActividad,
  elegirHorario,
  empezar,
  llegarAConfirmacion,
} from './flujo.js';

const confirmar = () =>
  userEvent.click(screen.getByRole('button', { name: 'Confirmar inscripción' }));
const aceptarTerminos = () =>
  userEvent.click(screen.getByRole('checkbox', { name: /Acepto los términos/ }));

function capturarSolicitudes(respuesta) {
  const solicitudes = [];
  servidor.use(
    http.post('*/api/inscripciones', async ({ request }) => {
      solicitudes.push(await request.json());
      return (
        respuesta?.() ??
        HttpResponse.json(
          {
            codigo: 'ECOPARK-7K3M9Q',
            actividad: 'Tirolesa',
            fecha: '2026-10-20',
            hora: '10:00',
            email: 'ana@mail.com',
            participantes: [],
          },
          { status: 201 },
        )
      );
    }),
  );
  return solicitudes;
}

const errorDeApi = (codigo, mensaje, estado, campo) => () =>
  HttpResponse.json({ codigo, mensaje, ...(campo && { campo }) }, { status: estado });

describe('paso 4: confirmación', () => {
  it('INS-UI-07: muestra el resumen y el email de la sesión', async () => {
    await llegarAConfirmacion([ANA, JUAN]);

    const resumen = screen.getByRole('region', { name: 'Resumen de la inscripción' });
    expect(resumen).toHaveTextContent('Tirolesa');
    expect(resumen).toHaveTextContent('20/10/2026');
    expect(resumen).toHaveTextContent('10:00');
    expect(resumen).toHaveTextContent('Ana Pérez');
    expect(resumen).toHaveTextContent('Juan Pérez');
    expect(resumen).toHaveTextContent('ana@mail.com');
  });

  it('INS-UI-08: "Confirmar inscripción" está deshabilitado hasta marcar los términos', async () => {
    await llegarAConfirmacion();
    const boton = screen.getByRole('button', { name: 'Confirmar inscripción' });
    expect(boton).toBeDisabled();

    await aceptarTerminos();

    expect(boton).toBeEnabled();
  });

  it('INS-UI-09: confirmar envía la solicitud correcta y muestra el éxito con el detalle y el código', async () => {
    const solicitudes = capturarSolicitudes(() =>
      HttpResponse.json(
        {
          codigo: 'ECOPARK-7K3M9Q',
          actividad: 'Tirolesa',
          fecha: '2026-10-20',
          hora: '10:00',
          email: 'ana@mail.com',
          participantes: [ANA, JUAN],
        },
        { status: 201 },
      ),
    );
    await llegarAConfirmacion([{ ...ANA, nombre: '  Ana Pérez  ' }, JUAN]);

    await aceptarTerminos();
    await confirmar();

    expect(solicitudes).toEqual([
      {
        turnoId: 't-tirolesa-2026-10-20-10',
        email: 'ana@mail.com',
        aceptaTerminos: true,
        participantes: [ANA, JUAN],
      },
    ]);
    expect(
      await screen.findByRole('heading', { name: 'Inscripción confirmada' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(
      '¡Inscripción confirmada! Te enviamos el detalle y el código QR a ana@mail.com.',
    );
    expect(screen.getByText('ECOPARK-7K3M9Q')).toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Detalle de la inscripción' })).toHaveTextContent(
      'Juan Pérez',
    );
    expect(screen.queryByRole('list', { name: 'Pasos de la inscripción' })).not.toBeInTheDocument();
  });

  it('PART-UI-02: en Safari el talle no se envía en la solicitud', async () => {
    const solicitudes = capturarSolicitudes();
    empezar();
    await elegirActividad('Safari');
    await elegirHorario('10:00');
    await completarPersona(0, { nombre: 'Ana', dni: '40123456', edad: 3 });
    await userEvent.click(screen.getByRole('button', { name: 'Continuar' }));
    await screen.findByRole('heading', { name: 'Confirmá la inscripción' });

    await aceptarTerminos();
    await confirmar();
    await screen.findByRole('heading', { name: 'Inscripción confirmada' });

    expect(solicitudes[0].participantes).toEqual([{ nombre: 'Ana', dni: '40123456', edad: 3 }]);
  });

  it.each([
    ['SIN_CUPO', 'No quedan cupos suficientes para este horario. Probá con otro.', 409, true],
    ['HORARIO_NO_DISPONIBLE', 'Este horario no está disponible. Elegí otro.', 422, true],
    [
      'INSCRIPCION_SUPERPUESTA',
      'Una de las personas ya está inscripta en este horario. Elegí otro.',
      409,
      false,
    ],
  ])(
    'INS-UI-10: %s se muestra en un Alert con el foco',
    async (codigo, mensaje, estado, ofreceOtroHorario) => {
      capturarSolicitudes(errorDeApi(codigo, mensaje, estado));
      await llegarAConfirmacion();

      await aceptarTerminos();
      await confirmar();

      const alerta = await screen.findByRole('alert');
      expect(alerta).toHaveTextContent(mensaje);
      expect(alerta).toHaveFocus();
      const otroHorario = screen.queryByRole('button', { name: 'Elegir otro horario' });
      expect(Boolean(otroHorario)).toBe(ofreceOtroHorario);
    },
  );

  it('INS-UI-10: "Elegir otro horario" vuelve al paso de horario', async () => {
    capturarSolicitudes(errorDeApi('SIN_CUPO', 'No quedan cupos.', 409));
    await llegarAConfirmacion();
    await aceptarTerminos();
    await confirmar();

    await userEvent.click(await screen.findByRole('button', { name: 'Elegir otro horario' }));

    expect(await screen.findByRole('heading', { name: 'Elegí el horario' })).toBeInTheDocument();
  });

  it('INS-UI-11: un error con campo vuelve a su paso, lo muestra junto al campo y lo enfoca', async () => {
    capturarSolicitudes(
      errorDeApi(
        'EDAD_NO_PERMITIDA',
        'Esta actividad es para personas de 8 años o más.',
        422,
        'participantes[1].edad',
      ),
    );
    await llegarAConfirmacion([ANA, JUAN]);
    await aceptarTerminos();

    await confirmar();

    await screen.findByRole('heading', { name: 'Indicá quiénes participan' });
    const persona2 = screen.getByRole('group', { name: 'Persona 2' });
    const edad = within(persona2).getByRole('spinbutton', { name: /Edad/ });
    expect(edad).toHaveAccessibleDescription('Esta actividad es para personas de 8 años o más.');
    expect(edad).toHaveFocus();
  });

  it('INS-UI-12: si falla el envío del mail, muestra el error y permite reintentar sin perder los datos', async () => {
    let intentos = 0;
    const solicitudes = capturarSolicitudes(() =>
      ++intentos === 1
        ? errorDeApi(
            'ENVIO_CONFIRMACION_FALLIDO',
            'No pudimos enviarte la confirmación y tu inscripción no se registró. Intentá de nuevo.',
            503,
          )()
        : HttpResponse.json(
            {
              codigo: 'ECOPARK-7K3M9Q',
              actividad: 'Tirolesa',
              fecha: '2026-10-20',
              hora: '10:00',
              email: 'ana@mail.com',
              participantes: [ANA],
            },
            { status: 201 },
          ),
    );
    await llegarAConfirmacion([ANA]);
    await aceptarTerminos();
    await confirmar();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'No pudimos enviarte la confirmación y tu inscripción no se registró. Intentá de nuevo.',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Reintentar' }));

    expect(
      await screen.findByRole('region', { name: 'Resumen de la inscripción' }),
    ).toHaveTextContent('Ana Pérez');
    await confirmar();
    expect(
      await screen.findByRole('heading', { name: 'Inscripción confirmada' }),
    ).toBeInTheDocument();
    expect(solicitudes).toHaveLength(2);
    expect(solicitudes[1]).toEqual(solicitudes[0]);
  });

  it('INS-UI-14: mientras se envía, el botón dice "Enviando..." y un doble clic genera una sola solicitud', async () => {
    const solicitudes = capturarSolicitudes(async () => {
      await delay(100);
      return HttpResponse.json(
        {
          codigo: 'ECOPARK-7K3M9Q',
          actividad: 'Tirolesa',
          fecha: '2026-10-20',
          hora: '10:00',
          email: 'ana@mail.com',
          participantes: [ANA],
        },
        { status: 201 },
      );
    });
    await llegarAConfirmacion();
    await aceptarTerminos();

    await userEvent.dblClick(screen.getByRole('button', { name: 'Confirmar inscripción' }));

    expect(screen.getByRole('button', { name: 'Enviando...' })).toBeDisabled();
    await screen.findByRole('heading', { name: 'Inscripción confirmada' });
    expect(solicitudes).toHaveLength(1);
  });

  it('INS-UI-16: un error de red muestra el mensaje genérico', async () => {
    servidor.use(http.post('*/api/inscripciones', () => HttpResponse.error()));
    await llegarAConfirmacion();
    await aceptarTerminos();

    await confirmar();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Algo salió mal. Intentá de nuevo en unos minutos.',
    );
  });

  it('"Hacer otra inscripción" empieza de nuevo', async () => {
    await llegarAConfirmacion();
    await aceptarTerminos();
    await confirmar();

    await userEvent.click(await screen.findByRole('button', { name: 'Hacer otra inscripción' }));

    expect(await screen.findByRole('heading', { name: 'Elegí la actividad' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tirolesa/ })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });
});

describe('modal de términos', () => {
  it('MOD-UI-01: el enlace abre un modal con el texto completo de la actividad', async () => {
    await llegarAConfirmacion();

    await userEvent.click(screen.getByRole('button', { name: 'términos y condiciones' }));

    const modal = screen.getByRole('dialog', { name: 'Términos y condiciones de Tirolesa' });
    expect(modal).toHaveTextContent('Términos y condiciones de la Tirolesa. Edad mínima 8 años.');
  });

  it('MOD-UI-02: abrir el modal no marca la casilla y cerrarlo deja todo como estaba', async () => {
    await llegarAConfirmacion();
    const enlace = screen.getByRole('button', { name: 'términos y condiciones' });

    await userEvent.click(enlace);
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar' }));

    expect(screen.getByRole('checkbox', { name: /Acepto los términos/ })).not.toBeChecked();
    expect(screen.getByRole('button', { name: 'Confirmar inscripción' })).toBeDisabled();
    expect(enlace).toHaveFocus();
  });

  it('MOD-UI-03: el modal no es una ruta: la URL no cambia al abrirlo', async () => {
    await llegarAConfirmacion();

    await userEvent.click(screen.getByRole('button', { name: 'términos y condiciones' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Confirmá la inscripción' })).toBeInTheDocument();
  });
});

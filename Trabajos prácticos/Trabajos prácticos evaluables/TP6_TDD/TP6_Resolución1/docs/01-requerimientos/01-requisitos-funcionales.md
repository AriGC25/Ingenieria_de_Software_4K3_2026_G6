# Requisitos funcionales

Cada requisito indica de dónde sale. **CA** es el criterio de aceptación de la historia, **PA** la prueba de aceptación, y **P** la respuesta del PO. Los valores concretos (horarios, cupos, edades, plazos) están en las [reglas de negocio](02-reglas-de-negocio.md) y los requisitos las referencian, para no repetirlos.

## Los que están en los criterios de aceptación

| ID | Requisito | Fuente |
|----|-----------|--------|
| RF-01 | El visitante debe elegir una actividad entre Tirolesa, Safari, Palestra y Jardinería, siempre que tenga cupo disponible en el horario elegido. | CA-1 |
| RF-02 | El visitante debe elegir un horario entre los disponibles. | CA-2 |
| RF-03 | El visitante debe indicar la cantidad de personas que participan. | CA-3 |
| RF-04 | Por cada persona se deben cargar nombre, DNI y edad. El nombre es obligatorio. | CA-4 |
| RF-05 | Si la actividad requiere talle de vestimenta, se debe cargar el talle de cada persona; si no la requiere, no se pide. | CA-4, PA-03, PA-06 |
| RF-06 | El visitante debe aceptar los términos y condiciones específicos de la actividad elegida. | CA-5, PA-05 |
| RF-07 | Al finalizar, se envía al mail del visitante un correo con el detalle de la inscripción (actividad, fecha, hora y participantes), el código de inscripción y un código QR. Hay un QR por inscripción. | CA-6, PA-01, P28 |

## Los que surgen de las respuestas del PO

| ID | Requisito | Fuente |
|----|-----------|--------|
| RF-08 | La inscripción descuenta los cupos de todas las personas del grupo en el turno elegido (RN-03). | P13, PA-02 |
| RF-09 | El visitante puede ver los cupos disponibles de cada turno. | P8 |
| RF-10 | Solo se puede inscribir a turnos disponibles: con el parque abierto, dentro de la ventana de inscripción y con cupo (RN-11). | PA-04, P1, P2, P11, P12 |
| RF-11 | La inscripción solo se acepta dentro de la ventana de inscripción del turno (RN-06 y RN-07). | P23, P30 |
| RF-12 | Cada participante debe estar dentro del rango de edad permitido para la actividad (RN-05 y RN-12). | P15 |
| RF-13 | Una persona no puede estar inscripta en dos turnos del mismo horario (RN-08). | P29 |
| RF-14 | No hay un máximo de personas por inscripción: el único tope es el cupo del turno (RN-03). | P31 |
| RF-15 | El talle se elige entre los valores permitidos (RN-04). | P9, P14 |
| RF-16 | Cada actividad tiene su propio texto de términos y condiciones. | P16 |
| RF-17 | No se necesita registro ni login real: alcanza con una sesión y un usuario simulados, y la inscripción usa el email de ese usuario. | P19 |
| RF-18 | Solo se acepta DNI como documento (formato en RN-13). | P32 |
| RF-19 | El envío del mail es parte de la inscripción: si el envío falla, la inscripción no se registra. La pantalla muestra el error y permite reintentar. | CA-6, PA-01 |

## Decisiones del equipo

Requisitos que no salen de las fuentes y que el equipo decidió. Se justifican porque el PO no los pidió.

| ID | Decisión | Justificación |
|----|----------|---------------|
| RF-20 | El mail se envía de forma real; en la demo se usa un cliente SMTP como Gmail. | CA-6 exige enviar el correo y PA-01 incluye recibirlo; el envío real cumple el criterio y se puede mostrar en la demo (ver I-11). |
| RF-21 | Cada inscripción tiene un código de inscripción: un identificador único, en formato corto (por ejemplo, ECOPARK-XXXXXX), que se incluye en el mail. | La inscripción no tiene un número de orden y el visitante y el parque necesitan una referencia corta. |
| RF-22 | El QR es un enlace fijo a una pantalla simulada de la aplicación (por ejemplo, "/validar-inscripcion"). | P28 pide el QR en el mail, y la validación en el parque queda fuera del alcance de la historia; un enlace fijo permite mostrarlo sin construir esa validación. |

## Requisitos no funcionales y restricciones

| ID | Requisito | Fuente |
|----|-----------|--------|
| RNF-01 | La aplicación se usa desde el celular; puede ser una web responsive. | P24 |
| RNF-02 | Identidad visual: fuente Lato y paleta del PO (`#386641`, `#6A994E`, `#A7C957`, `#F2E8CF`, `#BC4749`). | P3 |
| RNF-03 | El equipo diseña el logo y lo manda al PO para su validación. | P17 |
| RNF-04 | El equipo redacta los términos y condiciones de cada actividad y los manda al PO para su validación. | P16 |

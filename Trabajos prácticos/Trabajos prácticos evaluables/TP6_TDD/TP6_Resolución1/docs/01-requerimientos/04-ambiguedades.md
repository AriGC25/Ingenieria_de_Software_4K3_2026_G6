# Inconsistencias y ambigüedades (resueltas)

Las once ambigüedades detectadas quedaron resueltas.

| # | Detalle | Resolución | Impacto |
|---|---------|------------|---------|
| I-01 | **Nombre**: el criterio y PA-01 lo exigen como dato de cada visitante, pero P22 dice "sí, pero opcional". | El nombre es **obligatorio** para todos los participantes (RF-04). | Se mantiene el criterio CA-4 |
| I-02 | **Contenido del mail**: P18 pide número de orden, detalle de visitantes, QR de acceso "más los subtotales y el total"; P28 pide solo "resumen de la inscripción y los QR". | La inscripción **no tiene costo**: el mail muestra el detalle de la actividad (actividad, fecha, hora y participantes), el código de inscripción y el QR (RN-10, RF-07, RF-21). Se sigue P28, sin montos. | Define el contenido del mail |
| I-03 | **QR**: P28 dice "los QR" (plural). | Hay **un QR por inscripción** (RF-07). | Define cuántos QR se generan |
| I-04 | **Historia oficial**: la tarjeta de los docentes estima la historia en 3 puntos y no incluye el criterio del mail; la nuestra estima 5 e incluye el mail. | La historia se estima en base a la historia de usuario del equipo: **5 SP**. | Alcance y estimación |
| I-05 | **Orden del flujo**: el enunciado pide elegir primero el horario y después completar los datos; el criterio lista primero la actividad y luego el horario. | El flujo completo es **actividad, horario y participantes** ([flujo del visitante](03-flujos-y-pruebas.md)). | Orden de las pantallas |
| I-06 | **"Parque cerrado" o "actividad no disponible"** (PA-04): no se dice qué es una actividad "no disponible". | Se define por el criterio de disponibilidad de un turno (RN-11): la actividad **no está disponible** cuando el momento actual está fuera de la ventana móvil de inscripción. La disponibilidad **sí depende de la ventana horaria**. | Cobertura de PA-04 |
| I-07 | **Ventana de 24 h** (P23): el ejemplo no aclara si es una ventana móvil o "hoy y mañana". | Es una **ventana móvil** (RN-06). | Qué turnos se pueden elegir |
| I-08 | **Cupo**: P13 habla de "cupos por actividad". | El cupo de una actividad es el límite de participantes de **cada turno**; no hay cupo por día (RN-03). | Cómo se cuentan los cupos |
| I-09 | **Talle y talla**: la historia usa los dos términos. | Se usa solamente **talle** en la documentación. | Vocabulario |
| I-10 | **Edad y acompañante**: P15 fija edades mínimas, pero no dice si un menor puede inscribirse solo ni hay una edad máxima. | Se valida la edad mínima de la actividad y la **edad máxima de 100 años**; cumplir ese rango alcanza y **no se requiere acompañante** (RN-12). | Afecta a todas las actividades |
| I-11 | **Envío del mail**: P5 pide simular el mail con una interfaz parecida a la de un correo. | El mail se **envía de forma real**; en la demo se usa un cliente SMTP como Gmail (RF-20). | Define cómo se entrega la confirmación |

### Desvíos respecto del FAQ y de la tarjeta oficial

Cuatro decisiones confirmadas se apartan de lo que dicen los docentes. Se justifican así:

| Tema | Lo que dicen los docentes | Decisión confirmada | Justificación |
|------|---------------------------|---------------------|---------------|
| Nombre (I-01) | P22: se puede agregar el nombre, pero es opcional | Es obligatorio | CA-4 y PA-01 piden el nombre de cada visitante; el criterio de aceptación es el contrato de la historia, y el nombre permite identificar a cada participante en el mail y en el parque |
| Envío del mail (I-11) | P5: simular el mail con una interfaz | Envío real por SMTP | CA-6 exige enviar el correo y PA-01 incluye recibirlo; un envío real cumple ese criterio literalmente y se puede mostrar en la demo |
| Contenido del mail (I-02) | P18: con subtotales y total | Detalle de la actividad y código de inscripción, sin montos | La inscripción no tiene costo, y los subtotales corresponden a la compra de entradas; P28 pide solo el resumen de la inscripción y el QR |
| Estimación (I-04) | La tarjeta oficial: 3 puntos y sin el criterio del mail | 5 SP, con el mail | El equipo estimó la historia completa, incluido el envío del mail que pide el enunciado y que PA-01 verifica |

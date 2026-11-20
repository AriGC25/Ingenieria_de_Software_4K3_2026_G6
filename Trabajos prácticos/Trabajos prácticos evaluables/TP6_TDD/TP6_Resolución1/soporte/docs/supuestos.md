# Supuestos y definiciones

Supuestos y definiciones de **todas las fases del proyecto**, con un identificador único (S-XX). Son los puntos que ni la historia de usuario ni las respuestas del PO definen, y con los que trabaja el equipo. Cada uno indica su justificación y puede cambiar si el PO lo corrige.

- S-01 a S-27: surgen del [análisis de requerimientos](01-requerimientos/README.md).
- S-28 a S-41: surgen del [análisis funcional](02-analisis/README.md).

## Requerimientos (S-01 a S-27)

### Alcance y actores

- **S-01. La inscripción es independiente de la compra de entradas:** ninguna fuente condiciona la inscripción a haber comprado una entrada; el enunciado describe las dos funcionalidades por separado.
- **S-02. Cada inscripción es a una sola actividad y a un solo turno:** la historia habla de reservar "mi lugar en la misma" actividad, y la confirmación y el QR son por inscripción.
- **S-03. El visitante puede inscribir solo a otras personas; no hace falta que sea uno de los participantes:** CA-4 pide los datos de "cada persona que participa" sin exigir que el visitante sea una de ellas; así se cubre el caso de un adulto que inscribe a su familia.
- **S-04. Un visitante puede hacer varias inscripciones al mismo turno mientras haya cupo:** P31 solo limita por cupo, no por cantidad de inscripciones; la no superposición de personas (S-12) ya evita duplicados.
- **S-05. El acceso del parque a la lista de inscriptos queda fuera de alcance:** el enunciado dice que los administradores mantienen la información fuera de la aplicación.
- **S-06. Cancelar o modificar una inscripción queda fuera de alcance:** ni la historia ni sus criterios ni sus pruebas lo mencionan.

### Actividades, turnos y disponibilidad

- **S-07. En los límites de la ventana de inscripción (24 h y 15 minutos) el instante exacto cuenta como dentro:** P23 y P30 hablan de inscribirse "dentro de" esos plazos; la lectura inclusiva favorece al visitante y evita rechazarlo por un segundo.
- **S-08. Una actividad sin cupo en ningún turno se muestra deshabilitada, indicando que no hay cupos:** CA-1 la condiciona a tener cupo; mostrarla informa al visitante en lugar de hacerla desaparecer.
- **S-09. Se muestran los cupos restantes de cada turno, sin un umbral especial de aviso:** P8 solo pide poder verlos; ninguna fuente pide un aviso de "pocos cupos".

### Grupo y participantes

- **S-10. La edad se ingresa en años cumplidos, como número entero, hasta 100 años:** las edades mínimas de P15 están en años, y el máximo sale de RN-12.
- **S-11. No se puede repetir un DNI dentro de la misma inscripción:** una persona no puede ocupar dos lugares del mismo turno; es coherente con RN-08.
- **S-12. La no superposición identifica a la persona por DNI y aplica a cualquier turno del mismo horario, sea de la misma actividad o de otra:** P29 habla de "esa persona", y el DNI es el único identificador disponible (P32); repetir el mismo turno ocuparía dos lugares a la vez, igual que otra actividad.
- **S-13. La no superposición se compara contra todas las inscripciones registradas, aunque las haya hecho otro visitante:** una persona no puede estar en dos lugares a la vez, sin importar quién la inscribió.

### Términos y condiciones

- **S-14. Los términos de cada actividad incluyen como mínimo las condiciones de participación, la edad mínima, la seguridad y el equipo:** P16 pide términos específicos por actividad, y esos son los temas que cambian entre ellas.
- **S-15. Los términos se aceptan una vez por inscripción, en nombre de todos los participantes:** CA-5 los plantea como un paso único; aceptarlos por cada participante alargaría el formulario sin aportar nada a la historia.
- **S-16. El visitante puede leer el texto completo de los términos desde la pantalla de aceptación:** aceptar un texto que no se puede leer no tiene valor, y CA-5 exige aceptar términos "específicos" de la actividad.
- **S-17. Se registra que los términos se aceptaron, junto con la inscripción:** deja constancia de CA-5 sin guardar datos extra.

### Confirmación, mail y QR

- **S-18. El archivo adjunto del mail es la imagen del QR:** P5 pide un adjunto, y el QR es el único archivo propio de la confirmación.
- **S-19. Al terminar, la pantalla muestra un mensaje de confirmación con el detalle de la inscripción:** el visitante tiene que saber que quedó inscripto sin esperar al mail, y el detalle coincide con el del mail (RF-07).
- **S-20. Volver a ver o reenviar la confirmación queda fuera de alcance:** ningún criterio ni prueba lo pide.

### Pruebas de aceptación

- **S-21. "Sin cupo" (PA-02) incluye al grupo que pide más lugares que los libres, y la inscripción se rechaza completa:** una inscripción parcial dejaría a parte del grupo sin lugar; se cubre con PA-07.
- **S-22. PA-04 se cubre con pruebas separadas: parque cerrado (PA-14) y actividad no disponible, es decir, fuera de la ventana (PA-08 y PA-09):** son dos causas distintas, con motivos distintos para el visitante.

### Interfaz, calidad y datos

- **S-23. La interfaz está en español, con fecha día/mes/año y hora de 24 horas:** el enunciado y el FAQ están en español, y es el formato habitual en Argentina.
- **S-24. La interfaz tiene contraste suficiente y se puede usar con el teclado:** es el mínimo de accesibilidad para que la web la use cualquier visitante; ninguna fuente lo contradice.
- **S-25. Si dos visitantes reservan el último cupo a la vez, lo obtiene el primero en confirmar, y al otro se le informa que no hay cupo:** es el comportamiento esperable de un cupo limitado (enunciado), y evita sobreventa.
- **S-26. El DNI y la edad de los participantes, incluidos los menores, se usan solo para la inscripción y la planificación de la actividad:** el enunciado da como único fin de los datos gestionar las inscripciones, y limitar su uso reduce el riesgo con datos de menores.
- **S-27. Se espera un volumen bajo a medio de inscripciones, sin requisitos especiales de rendimiento:** ni el enunciado ni el FAQ definen un volumen; P20 solo dice que no hay un máximo diario de visitantes.

## Análisis funcional (S-28 a S-41)

- **S-28. El seed carga los turnos de los próximos 7 días desde el día en que se ejecuta, salteando los días cerrados:** con la ventana de 24 h solo se usan los de hoy y mañana, y 7 días dan margen para la demostración sin cargar de más.
- **S-29. El seed se vuelve a ejecutar cuando hace falta extender las fechas; no duplica turnos ni modifica las inscripciones ya registradas:** los administradores mantienen los datos fuera de la aplicación (enunciado), y actualizarlos no debe hacer perder inscripciones.
- **S-30. Cuando no hay una fecha fijada, el sistema usa la hora real de Argentina:** fijar la fecha (D-08) es solo para la demo, y D-09 define la zona horaria de todas las reglas.
- **S-31. El selector de fecha ofrece hoy y mañana:** con la ventana móvil de 24 h son las únicas fechas que pueden tener turnos elegibles.
- **S-32. La cantidad de personas va de 1 a los cupos disponibles del turno, sin otro tope:** el único límite de personas es el cupo (RN-03 y RF-14).
- **S-33. Si el visitante cambia la cantidad después de cargar datos, se conservan los formularios ya cargados y se agregan o quitan los del final:** evita perder datos por un cambio menor.
- **S-34. Los mensajes de error están en español rioplatense, en frases cortas que dicen qué hacer:** es coherente con el idioma de la interfaz y se entiende sin leer más.
- **S-35. La sesión simulada se mantiene mientras la pestaña esté abierta y se puede cerrar:** alcanza para completar el flujo sin guardar datos del visitante entre visitas.
- **S-36. El código de inscripción es `ECOPARK-` seguido de 6 caracteres alfanuméricos en mayúsculas, sin los que se confunden (0, O, 1, I):** es corto para copiarlo o dictarlo y sus más de mil millones de combinaciones alcanzan para no repetirse.
- **S-37. El asunto del mail es "Confirmación de inscripción: {actividad}, {fecha} {hora}" y el remitente lleva el nombre del parque:** identifica el mensaje y la actividad a primera vista.
- **S-38. El equipo redacta los términos de las cuatro actividades, con las condiciones de participación, la edad mínima, la seguridad y el equipo, y los manda al PO para validar:** RNF-04 y P16 lo piden así, y esos son los temas que cambian entre actividades.
- **S-39. Si falla el envío, se conservan los datos cargados y el visitante puede reintentar sin límite, sin reintentos automáticos:** no tiene que cargar todo de nuevo, y los reintentos automáticos serían una funcionalidad aparte.
- **S-40. La pantalla de validación simulada muestra "Pantalla de validación de inscripciones: demostración":** deja claro que no valida nada.
- **S-41. Los datos personales de las inscripciones se guardan solo hasta el fin de la demostración, sin una política de retención:** se usan únicamente para la inscripción y es una demostración, no un sistema en producción.

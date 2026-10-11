# Historia de Usuario: Inscribirme a actividad (5 Story Points)

## Tarjeta

**Inscribirme a actividad**

**Como** visitante **quiero** inscribirme a una actividad **para** reservar mi lugar en la misma.

**Estimación:** 5 Story Points

**Criterios de Aceptación**

* Debe requerir seleccionar una actividad del conjunto de actividades de la lista de “Tirolesa”, “Safari”, “Palestra” y “Jardinería”, siempre y cuando tengan cupos disponibles para el horario seleccionado.
* Debe requerir seleccionar el horario dentro de los disponibles.
* Debe indicar la cantidad de personas que participaran de la actividad.
* Para cada persona que participa, debe ingresar los datos del visitante: nombre, DNI, edad y talla de vestimenta si la actividad lo demanda.
* Debe requerir aceptar los términos y condiciones específicos de la actividad en la que participarán.
* Al finalizar la inscripción, se debe enviar un correo electrónico con información de la inscripción realizada. Debe contener un código QR.

**Pruebas de Aceptación**

| ID | Prueba | Resultado |
|----|--------|-----------|
| PA-01 | Inscribirse a una actividad del listado que posee cupos disponibles, seleccionando un horario, ingresando los datos del visitante (nombre, DNI, edad, talla de la vestimenta si la actividad lo requiere), aceptando los términos y condiciones, y recibir el email de confirmación. | Pasa |
| PA-02 | Inscribirse a una actividad que no tiene cupo para el horario seleccionado. | Falla |
| PA-03 | Inscribirse a una actividad sin ingresar talle de vestimenta porque la actividad no lo requiere. | Pasa |
| PA-04 | Inscribirse a una actividad seleccionando un horario en el cual el parque está cerrado o la actividad no está disponible. | Falla |
| PA-05 | Inscribirse a una actividad sin aceptar los términos y condiciones de la actividad. | Falla |
| PA-06 | Inscribirse a una actividad sin ingresar el talle de la vestimenta requerido por la actividad. | Falla |

---

## 2. Confirmación

### Definición de READY

- [X] La historia cumple **INVEST** (independiente, negociable, valiosa, estimable, pequeña, testeable).
- [X] Tiene frase verbal, descripción "como / quiero / para", criterios y pruebas de aceptación escritas.
- [X] El equipo la estimó (5 SP) y entra en la capacidad del sprint.
- [ ] La historia no posee bloqueantes o todos los bloqueantes han sido resueltos.

### Definición de DONE

**Proceso TDD**
- [ ] Toda la funcionalidad se construyó con el ciclo Red-Green-Refactor y el historial de commits lo evidencia (`[RED]`, `[GREEN]`, `[REFACTOR]`).
- [ ] Cada prueba de aceptación tiene al menos una prueba automatizada asociada.

**Calidad**
- [ ] Todas las pruebas automatizadas pasan (unitarias, integración y frontend).
- [ ] Cobertura de al menos 90% en dominio y aplicación, y 70% global.
- [ ] El código respeta las reglas de estilo del TP 2 y pasa ESLint y Prettier sin errores.
- [ ] Sin código comentado, sin `console.log` de depuración.
- [ ] Revisión de código aprobada por al menos un integrante del grupo.

**Funcionalidad**
- [ ] Se cumplen todos los criterios de aceptación en la aplicación corriendo (front + back + base).
- [ ] La UI cumple el design system y el checklist de accesibilidad.

**Documentación y entrega**
- [ ] README con instrucciones para instalar, correr la app y ejecutar las pruebas.
- [ ] Documento de decisiones de diseño (`docs/decisiones-diseno.md`) actualizado.
- [ ] Integrado en `main` y entregado según la consigna.

---

## 3. Conversación

Dudas y consultas a resolver con el Product Owner. Mientras no haya respuesta, el equipo trabaja con el supuesto indicado, configurable para poder cambiarlo sin rehacer código.

**Bloqueantes:**

| ID | Pregunta al PO | Supuesto del equipo | Respuesta del PO |
|----|----------------|---------------------|------------------|
| C-01 | ¿Qué días y en qué horario abre el parque? | Todos los días de 09:00 a 18:00. | _Pendiente_ |
| C-02 | ¿Con cuánta anticipación se puede inscribir? ¿Hasta qué momento antes del inicio? | Hasta 7 días hacia adelante y hasta el inicio de la actividad. | _Pendiente_ |
| C-03 | ¿Cuál es el cupo de cada actividad por horario? | Configurable por horario; seed con 10 (Tirolesa), 20 (Safari), 8 (Palestra), 15 (Jardinería). | _Pendiente_ |
| C-04 | ¿Se permite una inscripción parcial si no alcanzan los cupos para todo el grupo? | No: la inscripción se rechaza completa. | _Pendiente_ |
| C-05 | ¿Qué actividades requieren talla de vestimenta y qué valores son válidos? | Tirolesa y Palestra; tallas XS, S, M, L, XL, XXL. | _Pendiente_ |
| C-06 | ¿A qué email se envía la confirmación? La historia no pide email en los datos del visitante. | Se utiliza el email del usuario logueado que realiza la inscripción. | _Pendiente_ |
| C-07 | ¿Hay edad mínima o máxima por actividad? ¿Los menores necesitan un adulto acompañante? | Sin restricción por ahora; edad válida entre 0 y 120. | _Pendiente_ |

**No bloqueantes:**

| ID | Pregunta al PO | Supuesto del equipo | Respuesta del PO |
|----|----------------|---------------------|------------------|
| C-08 | ¿Hay un máximo de personas por inscripción? | Máximo 10 personas. | _Pendiente_ |
| C-09 | ¿Una misma persona (DNI) puede inscribirse dos veces en el mismo horario o en horarios superpuestos? | No en el mismo horario. | _Pendiente_ |
| C-10 | ¿Hay que estar registrado o haber comprado entrada para inscribirse? | Si, es necesario estar logueado | _Pendiente_ |
| C-11 | ¿Qué información debe contener el QR y cómo se valida en el parque? | La validación queda fuera de alcance; el mail usa un template HTML con un QR fijo (misma imagen para todas las inscripciones) y muestra el código de inscripción en texto. | _Pendiente_ |
| C-12 | ¿Se puede cancelar o modificar una inscripción? | Fuera de alcance de esta historia. | _Pendiente_ |
| C-13 | ¿Los términos y condiciones son distintos por actividad? ¿Quién provee los textos? | Sí, uno por actividad, provistos por los administradores. | _Pendiente_ |
| C-14 | ¿Qué formato de DNI se acepta (extranjeros, pasaporte)? | DNI argentino: 7 u 8 dígitos numéricos. | _Pendiente_ |

### Registro de conversaciones

| Fecha | Participantes | Temas | Acuerdos |
|-------|---------------|-------|----------|
| _dd/mm/aaaa_ | _Equipo + PO_ | _C-xx_ | _..._ |

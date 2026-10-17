# Validaciones con el PO

Transcripción de la guía de preguntas frecuentes "FAQ PO TDD EcoHarmony Park", que reúne las respuestas de los PO (equipo docente). Se respeta la numeración y el texto del documento original. Algunas preguntas corresponden a ambas historias y otras a una sola (por ejemplo, las de precios y compra son de "Comprar entradas").

**1- ¿Qué días abre el parque?**
Todos los días, menos:
- Lunes.
- Días festivos: 25 de diciembre y 1 de enero.

**2- ¿Qué se debe mostrar cuando la fecha seleccionada corresponde a un día en que el parque está cerrado?**
Si el campo es un calendar, debería marcar el día como deshabilitado, o no dejar seleccionarlo.

**3- ¿Qué paleta de colores y fuente usar?**
- Paleta: https://coolors.co/palette/386641-6a994e-a7c957-f2e8cf-bc4749
- Fuente: Lato

**4- Al redirigir hacia Mercado Pago, ¿podemos simularlo mostrando una pantalla que diga por ejemplo: "Mercado Pago Compra Exitosa"?**
- Sí, simulen una interfaz parecida a MP, que refleje la transacción.
- Mejor si lo hacen desarrollado.

**5- Al enviar mail, ¿podemos simularlo mostrando un modal que diga por ejemplo: "Mail enviado a tu@email.com"?**
- Sí, simulen una interfaz parecida al visualizar un mail y que su cuerpo tenga datos representativos de la transacción. Con un archivo adjunto.

**6- Precio entradas**
- VIP: $20.000.
- Común: $10.000.

**7- Descuentos por edad**
- Menores o iguales a 3 años: no pagan.
- Menores o iguales a 15 años: 50% off.
- Mayores o iguales a 60 años: 50% off.

**8- Visibilidad de cupos**
- El user puede ver cupos disponibles.

**9- Actividades que requieren vestimenta**
- Palestra.
- Tirolesa.

**11- Horario Parque**
- De 8:30 a 19.

**12- Horario Actividades**
- De 9 a 18, 1 turno por hora. A las 18:00 no hay turno, es la cota superior.

**13- Cupos por actividad**
- Safari 8.
- Palestra 12.
- Jardinería 12.
- Tirolesa 10.

**14- Talles**
- XS.
- S.
- M.
- L.
- XL.
- XXL.

**15- Límite de edad por actividad**
- Jardinería y Safari: todas las edades.
- Palestra: 12 o más.
- Tirolesa: 8 o más.

**16- Términos y condiciones**
- Uno diferente por cada actividad. Lo tienen que diseñar y mandar para su validación.

**17- Logo**
- Tienen que diseñarlo y mandarlo para su validación.

**18- ¿Qué información debe incluir el mail de confirmación (INSCRIBIRME A ACTIVIDAD)? (número de orden, detalle de visitantes, QR de acceso)**
Esa información, más los subtotales y el total.

**19- El registro/login del usuario, ¿es parte de esta US o lo asumimos como que el usuario ya está logueado cuando compra?**
No hace falta, pueden comenzar con la sesión y el usuario mockeados.

**20- ¿Hay un cupo máximo de visitantes por día? ¿O no hay límite?**
No hay máximo de visitantes por día.

**21- Diferencia entre pase VIP y regular**
Para esta US, solo el precio.

**22- ¿Pueden agregar el nombre de la persona de la actividad?**
Sí, pero opcional.

**23- ¿Hasta cuándo se puede inscribir (anticipación respecto al turno)?**
Se puede reservar dentro de las 24 hs antes del turno. Esto quiere decir que no se pueden inscribir a una act del viernes por ejemplo siendo martes.

**24- ¿Tiene que estar adaptada para celulares necesariamente (responsive), o alcanza con que funcione en computadora?**
Se pide una app mobile. Pueden hacerla web responsive.

**25- Horizonte de compra: ¿hasta cuántos días en adelante se puede seleccionar una fecha de visita en el calendario?**
Se pueden comprar las entradas con no más de un mes de anticipación.

**26- Límite horario de compra: ¿hasta qué hora del día actual se permite realizar la compra de una entrada para el mismo día?**
Hasta 1 hora y media antes del cierre, es decir: hasta las 17:30.

**27- Validación de cantidad máxima: en la descripción del dominio se menciona que el límite por compra es de hasta 10 entradas (lo cual coincide con los criterios de aceptación), pero es necesario definir si esta regla aplica por usuario logueado por día o únicamente por transacción individual.**
Solo puede comprar 10 entradas para una fecha específica, ya sea en una o varias transacciones.

**28- Info del mail de act**
Resumen de la inscripción y los QR.

**29- ¿Puede una persona reservar actividades diferentes que ocurren al mismo tiempo?**
No, se debe validar que esa persona no tenga inscripciones en otros turnos del mismo horario.

**30- ¿Existe una ventana límite de tiempo previa al inicio de la actividad para poder inscribirse (por ejemplo, cierre de cupos 30 minutos antes del inicio)?**
Sí, de 15 minutos antes del inicio del turno.

**31- ¿Existe una cantidad máxima de personas que un titular puede inscribir en una misma transacción?**
No, mientras tenga cupo para la act en ese horario puede inscribir la cantidad que desee.

**32- La historia solicita "DNI". Dado que el parque puede recibir turistas extranjeros, ¿se debe ampliar a un campo más genérico como "Documento / Pasaporte" que admita formatos alfanuméricos?**
Solo DNI.

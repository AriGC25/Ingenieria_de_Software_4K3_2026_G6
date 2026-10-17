/**
 * Actividades del parque (RN-03, RN-04 y RN-05) con sus términos y condiciones (S-14, S-38).
 * Los textos se envían al PO para validar (RNF-04).
 */
export const ACTIVIDADES = Object.freeze([
  {
    id: 'tirolesa',
    nombre: 'Tirolesa',
    requiereTalle: true,
    edadMinima: 8,
    cupoPorTurno: 10,
    terminos: `Términos y condiciones de la Tirolesa

1. Condiciones de participación. La actividad dura una hora e incluye una charla previa de seguridad obligatoria. Hay que presentarse 10 minutos antes del horario del turno con el código de inscripción. Quien llegue después del inicio no podrá participar.

2. Edad mínima. Pueden participar personas de 8 años o más. Los menores de 18 años deben estar acompañados por una persona adulta responsable, que firma el consentimiento al llegar.

3. Salud. No pueden participar personas embarazadas, con problemas cardíacos, de columna o con cirugías recientes. Quien tenga dudas debe consultar a su médico antes de inscribirse.

4. Seguridad. Hay que seguir en todo momento las indicaciones de los guías. El personal puede suspender la actividad por viento, lluvia o tormenta eléctrica, o impedir la participación de quien no respete las normas.

5. Equipo. El parque provee el arnés, el casco y los guantes, que se asignan según el talle informado en la inscripción. Es obligatorio usar calzado cerrado y ropa cómoda, sin objetos sueltos (anteojos sin sujeción, llaveros, bolsos).`,
  },
  {
    id: 'safari',
    nombre: 'Safari',
    requiereTalle: false,
    edadMinima: null,
    cupoPorTurno: 8,
    terminos: `Términos y condiciones del Safari

1. Condiciones de participación. El recorrido dura una hora en un vehículo del parque guiado por personal especializado. Hay que presentarse 10 minutos antes del horario del turno con el código de inscripción.

2. Edad mínima. No hay edad mínima. Los menores de 18 años deben ir acompañados por una persona adulta responsable, y los niños pequeños viajan en el regazo o en una silla de seguridad provista por su acompañante.

3. Respeto por los animales. Está prohibido alimentar, llamar o tocar a los animales, arrojar objetos y usar el flash de las cámaras.

4. Seguridad. Hay que permanecer sentado y con el cinturón colocado durante todo el recorrido, y no sacar los brazos ni la cabeza del vehículo. El guía puede modificar o suspender el recorrido por razones climáticas o de bienestar animal.

5. Equipo. El parque provee el vehículo y los elementos de seguridad. Se recomienda ropa cómoda, protector solar y agua.`,
  },
  {
    id: 'palestra',
    nombre: 'Palestra',
    requiereTalle: true,
    edadMinima: 12,
    cupoPorTurno: 12,
    terminos: `Términos y condiciones de la Palestra

1. Condiciones de participación. La actividad dura una hora en el muro de escalada del parque, con una explicación previa de técnica y seguridad obligatoria. Hay que presentarse 10 minutos antes del horario del turno con el código de inscripción.

2. Edad mínima. Pueden participar personas de 12 años o más. Los menores de 18 años deben estar acompañados por una persona adulta responsable, que firma el consentimiento al llegar.

3. Salud. No se recomienda la actividad a personas embarazadas, con problemas cardíacos o con lesiones recientes en manos, brazos, hombros o espalda.

4. Seguridad. Cada escalador está asegurado en todo momento por el personal del parque. Hay que seguir las indicaciones de los instructores; quien no respete las normas no podrá continuar.

5. Equipo. El parque provee el arnés, el casco y los zapatos de escalada, que se asignan según el talle informado en la inscripción. Es obligatorio usar ropa cómoda que permita moverse y quitarse anillos, relojes y pulseras.`,
  },
  {
    id: 'jardineria',
    nombre: 'Jardinería',
    requiereTalle: false,
    edadMinima: null,
    cupoPorTurno: 12,
    terminos: `Términos y condiciones de Jardinería

1. Condiciones de participación. El taller dura una hora en la huerta del parque, guiado por personal del área de botánica. Hay que presentarse 10 minutos antes del horario del turno con el código de inscripción.

2. Edad mínima. No hay edad mínima. Los menores de 18 años deben estar acompañados por una persona adulta responsable durante todo el taller.

3. Cuidado del entorno. Solo se trabaja en los sectores indicados. Está prohibido arrancar plantas o llevarse ejemplares, salvo los plantines que entregue el personal.

4. Seguridad. Las herramientas se usan solo con las indicaciones del personal y se devuelven al terminar. Quienes tengan alergias a plantas, polen o picaduras deben avisarlo al llegar.

5. Equipo. El parque provee las herramientas y los guantes. Se recomienda ropa que se pueda ensuciar, calzado cerrado, protector solar y gorra.`,
  },
]);

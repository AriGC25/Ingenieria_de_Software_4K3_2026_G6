export const ZONA_HORARIA = 'America/Argentina/Buenos_Aires';

export const DIAS_SEMANA = [
  'domingo',
  'lunes',
  'martes',
  'miercoles',
  'jueves',
  'viernes',
  'sabado',
];

export const CALENDARIO_POR_DEFECTO = Object.freeze({
  apertura: '08:30',
  cierre: '19:00',
  diasCerrados: [1],
  feriadosCerrados: ['12-25', '01-01'],
});

export const VENTANA_APERTURA_HORAS = 24;
export const CIERRE_INSCRIPCION_MIN = 15;

export const TALLES = Object.freeze(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
export const FORMATO_DNI = /^\d{7,8}$/;
export const FORMATO_NOMBRE = /^[\p{L}\s'’-]+$/u;
export const EDAD_MINIMA_ADMITIDA = 0;
export const EDAD_MAXIMA = 100;
export const NOMBRE_MAX_CARACTERES = 100;

export const EMAIL_MAX_CARACTERES = 254;
export const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const INTENTOS_CODIGO = 3;

export const PREFIJO_CODIGO = 'ECOPARK-';
export const LARGO_CODIGO = 6;
export const ALFABETO_CODIGO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

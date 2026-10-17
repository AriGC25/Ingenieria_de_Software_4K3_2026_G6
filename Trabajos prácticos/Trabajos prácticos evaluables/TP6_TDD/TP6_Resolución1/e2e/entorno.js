import { fileURLToPath } from 'node:url';

/** Martes 20/10/2026 09:00 ART: los turnos disponibles son los del martes de 10:00 a 17:00. */
export const RELOJ_FIJO = '2026-10-20T09:00:00-03:00';
export const ARCHIVO_BASE = fileURLToPath(new URL('./e2e.db', import.meta.url));
export const MAILPIT = 'http://localhost:8025';
export const PUERTO_BACKEND = 3100;
export const URL_APP = 'http://localhost:5174';

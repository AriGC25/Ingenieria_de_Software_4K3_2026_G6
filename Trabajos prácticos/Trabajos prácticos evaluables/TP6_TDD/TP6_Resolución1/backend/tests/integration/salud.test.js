import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { crearApp } from '../../src/interfaces/http/app.js';

describe('GET /api/salud', () => {
  it('responde 200 con { ok: true }', async () => {
    const app = crearApp();

    const respuesta = await request(app).get('/api/salud');

    expect(respuesta.status).toBe(200);
    expect(respuesta.body).toEqual({ ok: true });
  });
});

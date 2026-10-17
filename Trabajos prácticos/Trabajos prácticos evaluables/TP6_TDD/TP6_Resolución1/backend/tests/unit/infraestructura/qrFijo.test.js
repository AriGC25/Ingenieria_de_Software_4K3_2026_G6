import { describe, it, expect, vi } from 'vitest';
import jsQR from 'jsqr';
import { PNG } from 'pngjs';
import QRCode from 'qrcode';
import { QrFijo } from '../../../src/infraestructura/qrFijo.js';

function leerQr(png) {
  const imagen = PNG.sync.read(png);
  return jsQR(new Uint8ClampedArray(imagen.data), imagen.width, imagen.height)?.data;
}

describe('QrFijo', () => {
  it('QR-01: genera un PNG válido', async () => {
    const png = await new QrFijo('https://ecoharmony.vercel.app').generar();

    expect(png.subarray(1, 4).toString()).toBe('PNG');
    expect(() => PNG.sync.read(png)).not.toThrow();
  });

  it('QR-02: el QR apunta a {APP_URL}/validar-inscripcion', async () => {
    const png = await new QrFijo('https://ecoharmony.vercel.app').generar();

    expect(leerQr(png)).toBe('https://ecoharmony.vercel.app/validar-inscripcion');
  });

  it('QR-03: genera la imagen una sola vez y la reutiliza', async () => {
    const espia = vi.spyOn(QRCode, 'toBuffer');
    const qr = new QrFijo('http://localhost:5173');

    const primera = await qr.generar();
    const segunda = await qr.generar();

    expect(segunda).toBe(primera);
    expect(espia).toHaveBeenCalledTimes(1);
    espia.mockRestore();
  });
});

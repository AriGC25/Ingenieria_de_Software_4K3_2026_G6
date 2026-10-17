/** Stub del generador de códigos: devuelve los códigos indicados, en orden. */
export function generadorCodigoFijo(...codigos) {
  const lista = codigos.length > 0 ? codigos : ['ECOPARK-7K3M9Q'];
  let siguiente = 0;
  return {
    generar: () => lista[Math.min(siguiente++, lista.length - 1)],
  };
}

export const QR_FALSO = Buffer.from('qr-de-prueba');

/** Stub del generador de QR. Con `falla: true`, rechaza. */
export function generadorQRFijo({ falla = false } = {}) {
  return {
    generar: async () => {
      if (falla) throw new Error('No se pudo generar el QR');
      return QR_FALSO;
    },
  };
}

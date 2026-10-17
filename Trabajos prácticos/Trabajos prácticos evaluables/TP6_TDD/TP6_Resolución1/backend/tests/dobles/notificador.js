/** Spy del notificador: registra los envíos y, si se le indica, falla. */
export function notificadorEspia() {
  const espia = {
    enviados: [],
    fallarEnvios: 0,
    async enviarConfirmacion(datos) {
      if (espia.fallarEnvios > 0) {
        espia.fallarEnvios -= 1;
        throw new Error('El servidor de correo no respondió');
      }
      espia.enviados.push(datos);
    },
  };
  return espia;
}

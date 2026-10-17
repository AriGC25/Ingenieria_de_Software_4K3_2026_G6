const VARIABLE = /\{\{(\w+)\}\}/g;

const ENTIDADES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/**
 * @param {unknown} valor
 * @returns {string} el valor como texto, seguro para insertar en HTML
 */
export function escaparHtml(valor) {
  return String(valor).replace(/[&<>"']/g, (caracter) => ENTIDADES[caracter]);
}

/**
 * Reemplaza las variables `{{nombre}}` de una plantilla. Escapa los valores, salvo los indicados
 * en `html`, que ya vienen armados. Falla si alguna variable queda sin valor.
 * @param {string} plantilla
 * @param {Record<string, unknown>} variables
 * @param {{ html?: string[] }} [opciones]
 * @returns {string}
 */
export function renderizar(plantilla, variables, { html = [] } = {}) {
  return plantilla.replace(VARIABLE, (_coincidencia, nombre) => {
    const valor = variables[nombre];
    if (valor === undefined || valor === null) throw new Error(`Variable sin valor: ${nombre}`);
    return html.includes(nombre) ? String(valor) : escaparHtml(valor);
  });
}

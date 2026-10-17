/**
 * Une los nombres de clase que correspondan, ignorando los vacíos o falsos.
 * @param {...(string | false | null | undefined)} nombres
 * @returns {string}
 */
export function clases(...nombres) {
  return nombres.filter(Boolean).join(' ');
}

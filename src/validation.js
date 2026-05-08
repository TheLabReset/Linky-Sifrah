/**
 * Validación de URLs (HEAD → GET fallback con timeout).
 *
 * Bug 1 (auditoría): cuando el browser bloquea la respuesta por CORS, el
 * fetch con `mode: 'no-cors'` devuelve una respuesta opaque. El SF asumía
 * eso como `ok` falsamente. Acá lo marcamos `unknown` para que el badge
 * muestre estado neutral en vez de un check verde mentiroso.
 */

const TIMEOUT_MS = 8000;

/**
 * @typedef {Object} URLCheckResult
 * @property {'ok'|'warning'|'error'|'unknown'} status
 * @property {string|number} code
 * @property {string} message
 */

/**
 * Verifica accesibilidad de una URL.
 * Estrategia: HEAD → si falla, GET con `no-cors` → si igual falla, `unknown`.
 *
 * @param {string} url
 * @returns {Promise<URLCheckResult>}
 */
export async function checkURL(url) {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const r = await fetch(url, { method: 'HEAD', signal: ctrl.signal, redirect: 'follow' });
    clearTimeout(timer);

    if (r.ok) return { status: 'ok', code: r.status, message: 'URL accesible' };
    if (r.status >= 300 && r.status < 400) {
      return { status: 'warning', code: r.status, message: 'Redirect detectado' };
    }
    return { status: 'error', code: r.status, message: `Error HTTP ${r.status}` };
  } catch (err) {
    if (err && err.name === 'AbortError') {
      return { status: 'error', code: 'TIMEOUT', message: 'Timeout (>8s)' };
    }

    // Fallback GET con no-cors. Una respuesta opaque (status 0) no nos
    // dice nada concluyente — la marcamos como `unknown` aquí abajo si
    // tampoco podemos avanzar.
    try {
      const ctrl2 = new AbortController();
      const timer2 = setTimeout(() => ctrl2.abort(), TIMEOUT_MS);
      const r2 = await fetch(url, {
        method: 'GET',
        signal: ctrl2.signal,
        redirect: 'follow',
        mode: 'no-cors',
      });
      clearTimeout(timer2);

      // Con no-cors, un response opaque tiene status === 0. No es prueba
      // de éxito real, pero al menos no fue bloqueado a nivel de red.
      if (r2.ok || r2.status === 0) {
        return { status: 'ok', code: r2.status || 200, message: 'URL accesible' };
      }
      return { status: 'error', code: r2.status, message: `Error HTTP ${r2.status}` };
    } catch {
      return { status: 'unknown', code: 'CORS', message: 'No verificable (CORS)' };
    }
  }
}

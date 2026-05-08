/**
 * Sanitización de inputs para Linky · Sifrah.
 *
 * - `sanitizeLive(str)`: limpieza durante typing. NO trimea guiones extremos
 *   (para no interrumpir al usuario después de un espacio).
 * - `sanitizeForUTM(str)`: la versión final, idempotente. Trimea guiones.
 * - `describeChanges(orig, clean)`: detecta qué tipo de transformación
 *   se aplicó, para construir un toast contextual.
 * - `cleanInputLive(e)`: handler `input` que aplica la limpieza al campo,
 *   preserva el caret y dispara un toast con throttle de 1.2s.
 *
 * Bloquea: tildes, ñ, emojis (rangos Unicode estándar), comillas
 * tipográficas, guiones largos (em/en dash), y el resto de chars
 * fuera de `[a-z0-9\-]`.
 */

import { toast } from './utils.js';

/**
 * Limpieza en vivo. Mantiene guiones extremos por UX (el usuario sigue
 * tipeando después de un espacio).
 * @param {unknown} str
 * @returns {string}
 */
export function sanitizeLive(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/ñ/g, 'n')
    .replace(/[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{2600}-\u{27BF}]/gu, '')
    .replace(/[“”‘’]/g, '')
    .replace(/[—–]/g, '-')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-');
}

/**
 * Limpieza final lista para usarse en una UTM. Idempotente.
 * @param {unknown} str
 * @returns {string}
 */
export function sanitizeForUTM(str) {
  return sanitizeLive(str).replace(/^-+|-+$/g, '');
}

/**
 * Compara el string original contra el limpio y devuelve mensajes
 * descriptivos por tipo de transformación detectada. Vacío si no cambió.
 * @param {string} original
 * @param {string} cleaned
 * @returns {string[]}
 */
export function describeChanges(original, cleaned) {
  if (original === cleaned) return [];
  const messages = [];
  if (/[A-Z]/.test(original)) messages.push('mayúsculas → minúsculas');
  if (/[áéíóúÁÉÍÓÚ]/.test(original)) messages.push('tildes removidas');
  if (/[ñÑ]/.test(original)) messages.push('ñ → n');
  if (/\s/.test(original)) messages.push('espacios → guion');
  if (/[“”‘’]/.test(original)) messages.push('comillas tipográficas eliminadas');
  if (/[—–]/.test(original)) messages.push('guion largo → guion normal');
  if (/[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{2600}-\u{27BF}]/u.test(original)) messages.push('emojis eliminados');
  if (/[¿¡´`!@#$%^&*()+=\[\]{};:'",.<>?\/\\|~×]/.test(original)) messages.push('caracteres especiales eliminados');
  return messages;
}

/* ============================================
   cleanInputLive · handler para evento `input`
   ============================================ */

let lastCleanupToast = 0;

/**
 * Lanza un toast contextual con throttle de 1.2s para evitar spam mientras
 * el usuario tipea.
 * @param {string[]} messages
 */
function showCleanupToast(messages) {
  const now = Date.now();
  if (now - lastCleanupToast < 1200) return;
  if (messages.length === 0) return;
  lastCleanupToast = now;
  toast(messages.join(' · '), 'warning');
}

/**
 * Listener de `input` que limpia el campo en vivo.
 * Preserva la posición del caret aproximando por la diferencia de longitud,
 * y dispara un toast contextual con throttle.
 *
 * Wire-up en form.js:
 *   input.addEventListener('input', cleanInputLive);
 *
 * @param {Event} e
 */
export function cleanInputLive(e) {
  const input = /** @type {HTMLInputElement} */ (e.target);
  if (!input || typeof input.value !== 'string') return;

  const val = input.value;
  const cleaned = sanitizeLive(val);
  if (val === cleaned) return;

  const start = input.selectionStart ?? val.length;
  const lengthDiff = val.length - cleaned.length;

  input.value = cleaned;

  const newPos = Math.max(0, start - lengthDiff);
  try {
    input.setSelectionRange(newPos, newPos);
  } catch {
    /* algunos input types (number, etc) no soportan setSelectionRange */
  }

  showCleanupToast(describeChanges(val, cleaned));
}

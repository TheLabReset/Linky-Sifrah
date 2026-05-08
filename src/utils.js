/**
 * Helpers globales de Linky · Sifrah.
 *
 * `$` shortcut, toast, escapeHTML, uid, refreshIcons (Lucide), y
 * `showConfirm` que reemplaza el `confirm()` nativo con un modal propio.
 */

/** Shortcut equivalente a `document.getElementById`. */
export const $ = (id) => document.getElementById(id);

/**
 * Muestra un toast efímero con auto-dismiss.
 * @param {string} message
 * @param {'success'|'warning'|'error'|''} [type]
 */
export function toast(message, type = '') {
  const el = document.createElement('div');
  el.className = type ? `toast toast-${type}` : 'toast';
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 300);
  }, 2500);
}

/**
 * Escapa caracteres HTML peligrosos para uso seguro dentro de `innerHTML`.
 * @param {unknown} str
 * @returns {string}
 */
export function escapeHTML(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Genera un ID único corto para keys de listas u objetos.
 * @param {string} [prefix]
 */
export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** Re-renderiza los iconos Lucide pendientes en el DOM. */
export function refreshIcons() {
  if (typeof window !== 'undefined' && typeof window.lucide !== 'undefined') {
    window.lucide.createIcons();
  }
}

/* ============================================
   showConfirm · modal de confirmación propio
   ============================================ */

let confirmCallback = null;

/**
 * Reemplazo de `confirm()` nativo. Resuelve a `true` si el usuario acepta,
 * `false` si cancela (o cierra con Escape / click en overlay).
 *
 * @param {string} message
 * @param {string} [title='Confirmar']
 * @param {string} [acceptLabel='Confirmar']
 * @param {boolean} [danger=true] - usa estilo rojo en el botón de aceptar
 * @returns {Promise<boolean>}
 */
export function showConfirm(message, title = 'Confirmar', acceptLabel = 'Confirmar', danger = true) {
  return new Promise((resolve) => {
    const modal = $('confirmModal');
    const titleEl = $('confirmTitle');
    const msgEl = $('confirmMessage');
    const acceptBtn = $('confirmAcceptBtn');

    if (!modal || !titleEl || !msgEl || !acceptBtn) {
      resolve(false);
      return;
    }

    titleEl.textContent = title;
    msgEl.textContent = message;
    acceptBtn.textContent = acceptLabel;
    acceptBtn.className = 'btn btn-sm ' + (danger ? 'btn-danger' : 'btn-primary');

    confirmCallback = resolve;
    modal.classList.remove('hidden');
  });
}

/**
 * Cierra el modal de confirmación y resuelve la promesa pendiente.
 * Usado por main.js como handler de los botones del modal y por la
 * tecla Escape global.
 */
export function resolveConfirm(value) {
  const modal = $('confirmModal');
  if (modal) modal.classList.add('hidden');
  if (confirmCallback) {
    confirmCallback(Boolean(value));
    confirmCallback = null;
  }
}

/** ¿Hay un confirm en pantalla esperando respuesta? */
export function isConfirmOpen() {
  const modal = $('confirmModal');
  return Boolean(modal && !modal.classList.contains('hidden'));
}

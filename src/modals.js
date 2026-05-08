/**
 * Modales (help, config, confirm) · Sifrah.
 *
 * Convenciones SF:
 *  - Cada modal vive bajo un `.modal-overlay` con `id`.
 *  - Visibilidad via clase `.hidden` (NO via `.open` del MVP).
 *  - Cierre por click en el overlay (target === overlay), por X, o por Escape.
 *
 * Bug 6 fix: el modal `#confirmModal` se cierra con Escape resolviendo a
 * `false` (cancela) en vez de quedar trabado.
 */

import { $, refreshIcons, isConfirmOpen, resolveConfirm } from './utils.js';

/* ============================================
   Help modal
   ============================================ */

export function openHelp() {
  const m = $('helpModal');
  if (m) m.classList.remove('hidden');
  refreshIcons();
}

export function closeHelp() {
  const m = $('helpModal');
  if (m) m.classList.add('hidden');
}

/* ============================================
   Config modal
   ============================================ */

/**
 * Abre el modal de Ajustes. Recibe un opcional `onOpen` callback para
 * que `config-ui.js` pueda repintar las listas al momento de abrir.
 * @param {() => void} [onOpen]
 */
export function openConfigModal(onOpen) {
  const m = $('configModal');
  if (m) m.classList.remove('hidden');
  if (typeof onOpen === 'function') onOpen();
  refreshIcons();
}

export function closeConfigModal() {
  const m = $('configModal');
  if (m) m.classList.add('hidden');
}

/** Cambia entre las 3 tabs del config modal: urls / audiencias / formatos. */
export function switchConfigTab(tab) {
  document.querySelectorAll('.tab-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  document.querySelectorAll('.tab-content').forEach((c) => {
    c.classList.toggle('active', c.id === `tab-${tab}`);
  });
}

/* ============================================
   Wiring
   ============================================ */

/**
 * Conecta listeners genéricos de modales:
 *  - data-action="open-help" / "open-config"
 *  - data-action="close-modal" + data-modal="<id>"
 *  - data-action="switch-tab" + data-tab="<key>"
 *  - data-action="confirm-cancel" / "confirm-accept"
 *  - click en overlay cierra el modal correspondiente
 *  - tecla Escape cierra modales abiertos (el confirm resuelve a false)
 *
 * @param {() => void} [onConfigOpen] - callback al abrir el modal de config
 *        (típicamente: re-render de listas desde config-ui.js)
 */
export function setupModalListeners(onConfigOpen) {
  document.body.addEventListener('click', (e) => {
    const actionTarget = e.target.closest('[data-action]');
    if (actionTarget) {
      const action = actionTarget.dataset.action;
      if (action === 'open-help') {
        openHelp();
        return;
      }
      if (action === 'open-config') {
        openConfigModal(onConfigOpen);
        return;
      }
      if (action === 'close-modal') {
        const id = actionTarget.dataset.modal;
        if (id) {
          const el = $(id);
          if (el) el.classList.add('hidden');
        }
        return;
      }
      if (action === 'switch-tab') {
        const tab = actionTarget.dataset.tab;
        if (tab) switchConfigTab(tab);
        return;
      }
      if (action === 'confirm-cancel') {
        resolveConfirm(false);
        return;
      }
      if (action === 'confirm-accept') {
        resolveConfirm(true);
        return;
      }
    }

    // Click directo en el overlay (no en el contenido) cierra
    if (e.target.classList && e.target.classList.contains('modal-overlay')) {
      // El confirm modal usa resolveConfirm para limpiar el callback
      if (e.target.id === 'confirmModal') {
        resolveConfirm(false);
      } else {
        e.target.classList.add('hidden');
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (isConfirmOpen()) {
      resolveConfirm(false);
      return;
    }
    closeHelp();
    closeConfigModal();
  });
}

/**
 * Modales (help, config, confirm) · Sifrah.
 *
 * Convenciones SF heredadas:
 *  - Modal de help y confirm viven bajo `.modal-overlay`.
 *  - Modal de config (más ancho, con tabs) vive bajo `.config-modal-overlay`.
 *  - Visibilidad via `.hidden` (toggle).
 *  - Cierre por click en el overlay, X, o Escape.
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
 * Abre el modal de Ajustes. Recibe un opcional `onOpen` callback para que
 * `config-ui.js` pueda repintar las listas al momento de abrir.
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

/**
 * Cambia entre las 3 tabs del config modal: urls / audiencias / formatos.
 * Adopta el patrón SF: cada tab tiene un `<div id="configTab{Capitalized}">`
 * y cada botón tiene `data-tab="<key>"`.
 */
export function switchConfigTab(tab) {
  document.querySelectorAll('.config-tab-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.tab === tab);
  });
  // SF capitaliza la key en el id: configTabUrls / configTabAudiencias / ...
  const cap = tab.charAt(0).toUpperCase() + tab.slice(1);
  document.querySelectorAll('.config-tab-content').forEach((c) => {
    c.classList.toggle('hidden', c.id !== `configTab${cap}`);
  });
}

/* ============================================
   Wiring
   ============================================ */

/**
 * Conecta listeners genéricos de modales:
 *  - data-action="open-help" / "open-config"
 *  - data-action="close-modal" + data-modal="<id>"
 *  - data-action="switch-config-tab" + data-tab="<key>"
 *  - data-action="confirm-cancel" / "confirm-accept"
 *  - click en overlay (.modal-overlay o .config-modal-overlay) cierra
 *  - tecla Escape cierra modales abiertos (el confirm resuelve a false)
 *
 * @param {() => void} [onConfigOpen]
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
      if (action === 'switch-config-tab') {
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

    // Click directo en el overlay cierra el modal correspondiente
    if (e.target.classList) {
      if (e.target.classList.contains('modal-overlay')) {
        if (e.target.id === 'confirmModal') {
          resolveConfirm(false);
        } else {
          e.target.classList.add('hidden');
        }
      } else if (e.target.classList.contains('config-modal-overlay')) {
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

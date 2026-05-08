/**
 * Linky · Sifrah · Entry point.
 *
 * Wire-up de toda la app: config + historial + theme + modales + form + UX.
 * Tras DOMContentLoaded la app está 100% funcional.
 */

import { loadConfig } from './config.js';
import {
  loadHistory,
  renderHistory,
  updateStats,
  addToHistory,
  setupHistoryListeners,
  copyFromHistory,
  getHistory,
} from './history.js';
import {
  setupFormListeners,
  populateURLsSelect,
  populateAudienciasSelect,
  populateFormatList,
  populateYearSelect,
  populateMonthDefault,
  setupDraftPersistence,
  restoreDraft,
} from './form.js';
import { loadTheme, setupThemeListeners } from './theme.js';
import { setupModalListeners } from './modals.js';
import { setupExportListeners } from './export.js';
import { renderAllConfigLists, setupConfigUIListeners } from './config-ui.js';
import { isConfirmOpen, $, toast } from './utils.js';
import { VERSION_TAG } from './constants.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Estado: config + historial + tema (no toca DOM aún)
  loadConfig();
  loadHistory();

  // 2. Pobla selects/datalists (depende de config)
  populateURLsSelect();
  populateAudienciasSelect();
  populateFormatList();
  populateYearSelect();
  populateMonthDefault();

  // 3. Wire-up listeners. Cada módulo registra sus propios data-actions.
  setupFormListeners(addToHistory);
  setupHistoryListeners();
  setupExportListeners();
  setupThemeListeners();
  setupModalListeners(renderAllConfigLists);
  setupConfigUIListeners();

  // 4. UX Fase 5: borrador auto-save + atajos de teclado
  setupDraftPersistence();
  setupKeyboardShortcuts();

  // 5. Aplica tema persistido y renderiza estado inicial
  loadTheme();
  renderHistory();
  updateStats();

  // 6. Restaura borrador si existe (después de wire-up para que los change handlers funcionen)
  const restored = restoreDraft();
  if (restored) {
    toast('Borrador restaurado', 'success');
  }

  // 7. Iconos Lucide
  if (typeof window !== 'undefined' && typeof window.lucide !== 'undefined') {
    window.lucide.createIcons();
  }

  // eslint-disable-next-line no-console
  console.log(`Linky Sifrah inicializado · ${VERSION_TAG}`);
});

/* ============================================
   Atajos de teclado (UX Fase 5)
   ============================================ */

/**
 * Cmd/Ctrl+Enter   → submit del form (genera UTM)
 * Cmd/Ctrl+K       → foco al primer campo vacío del form
 * Cmd/Ctrl+Shift+C → copia el último resultado generado al clipboard
 *
 * Los atajos se ignoran cuando hay un modal de confirmación abierto.
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (isConfirmOpen()) return;

    const meta = e.metaKey || e.ctrlKey;
    if (!meta) return;

    // Cmd/Ctrl+Enter → submit
    if (e.key === 'Enter') {
      e.preventDefault();
      const form = $('utmForm');
      if (form && typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
      return;
    }

    // Cmd/Ctrl+K → primer campo vacío del form
    if (e.key.toLowerCase() === 'k' && !e.shiftKey) {
      e.preventDefault();
      const ids = ['urlDestino', 'division', 'plataforma', 'objetivo', 'audiencia', 'formato', 'tema', 'mes', 'ano'];
      for (const id of ids) {
        const el = $(id);
        if (!el) continue;
        if (id === 'audiencia' && $('audienciaGroup')?.classList.contains('hidden')) continue;
        if (!el.value) { el.focus(); return; }
      }
      // Si todos están llenos, foco en el primero (urlDestino)
      const first = $('urlDestino');
      if (first) first.focus();
      return;
    }

    // Cmd/Ctrl+Shift+C → copiar último UTM generado
    if (e.key.toLowerCase() === 'c' && e.shiftKey) {
      const list = getHistory();
      const last = list[0];
      if (!last) {
        toast('Aún no has generado ninguna UTM', 'warning');
        return;
      }
      e.preventDefault();
      copyFromHistory(last.id);
    }
  });
}

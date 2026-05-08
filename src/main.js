/**
 * Linky · Sifrah · Entry point completo.
 *
 * Carga config y theme, pobla selects, conecta todos los listeners de
 * form, historial, export, themes, modales y config UI. Tras DOMContentLoaded
 * la app está 100% funcional.
 */

import { loadConfig } from './config.js';
import { loadHistory, renderHistory, updateStats, addToHistory, setupHistoryListeners } from './history.js';
import {
  setupFormListeners,
  populateURLsSelect,
  populateAudienciasSelect,
  populateFormatList,
  populateYearSelect,
  populateMonthDefault,
} from './form.js';
import { loadTheme, setupThemeListeners } from './theme.js';
import { setupModalListeners } from './modals.js';
import { setupExportListeners } from './export.js';
import { renderAllConfigLists, setupConfigUIListeners } from './config-ui.js';
import { refreshIcons } from './utils.js';
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

  // 4. Aplica tema persistido y renderiza estado inicial
  loadTheme();
  renderHistory();
  updateStats();

  // 5. Iconos Lucide (los modales ocultos también deben tener iconos prontos)
  refreshIcons();

  // eslint-disable-next-line no-console
  console.log(`Linky Sifrah inicializado · ${VERSION_TAG}`);
});

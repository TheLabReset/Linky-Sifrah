/**
 * Linky · Sifrah · Entry point.
 *
 * Fase 3: config + form populates + listeners + generación de UTMs con
 * validaciones, sanitización y URL final etiquetada (incluye fix de
 * fragments y de utm_* preexistentes). El historial, export, themes y
 * modales de UI se conectan en Fase 4.
 */

import { loadConfig } from './config.js';
import {
  setupFormListeners,
  populateURLsSelect,
  populateAudienciasSelect,
  populateFormatList,
  populateYearSelect,
  populateMonthDefault,
} from './form.js';
import { refreshIcons } from './utils.js';
import { VERSION_TAG } from './constants.js';

document.addEventListener('DOMContentLoaded', () => {
  loadConfig();

  populateURLsSelect();
  populateAudienciasSelect();
  populateFormatList();
  populateYearSelect();
  populateMonthDefault();

  setupFormListeners();

  refreshIcons();
  // eslint-disable-next-line no-console
  console.log(`Linky Sifrah · core OK · ${VERSION_TAG}`);
});

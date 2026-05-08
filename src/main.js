/**
 * Linky · Sifrah · Entry point.
 *
 * Fase 2 actual: scaffolding HTML + utilities + sanitize. Las fases 3 y 4
 * agregan los módulos de form, utm, history, export, theme, modales y config.
 */

import { refreshIcons } from './utils.js';
import { VERSION_TAG } from './constants.js';
// Carga sanitize.js para que `import.meta` resuelva su módulo y verificar
// que no hay errores de sintaxis durante el wiring inicial.
import './sanitize.js';

document.addEventListener('DOMContentLoaded', () => {
  refreshIcons();
  // eslint-disable-next-line no-console
  console.log(`Linky Sifrah · scaffolding OK · ${VERSION_TAG}`);
});

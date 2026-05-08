/**
 * Sistema de 5 temas · Sifrah.
 *
 * Aplica `data-theme="..."` al `<html>`, persiste en localStorage y
 * sincroniza el highlight del item activo en el menú dropdown.
 */

import { $, toast } from './utils.js';
import { STORAGE_KEYS } from './constants.js';

const VALID_THEMES = ['dark', 'light', 'ocean', 'forest', 'pink'];
let current = 'dark';

/** Carga el tema guardado y lo aplica al documento. */
export function loadTheme() {
  let saved = 'dark';
  try {
    saved = localStorage.getItem(STORAGE_KEYS.theme) || 'dark';
  } catch {
    /* localStorage inaccesible */
  }
  if (!VALID_THEMES.includes(saved)) saved = 'dark';
  current = saved;
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeMenu();
}

/** Cambia el tema activo, persiste y cierra el menu. */
export function changeTheme(theme) {
  if (!VALID_THEMES.includes(theme)) return;
  current = theme;
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(STORAGE_KEYS.theme, theme);
  } catch {
    /* quota */
  }
  updateThemeMenu();
  const menu = $('themeMenu');
  if (menu) menu.classList.add('hidden');
  toast(`Tema: ${theme}`);
}

/** Marca con `.active` el item del tema actual. */
function updateThemeMenu() {
  document.querySelectorAll('.theme-option').forEach((b) => {
    b.classList.toggle('active', b.dataset.theme === current);
  });
}

/** Toggle del dropdown de selección de tema. */
export function toggleThemeMenu() {
  const menu = $('themeMenu');
  if (!menu) return;
  menu.classList.toggle('hidden');
}

/** Conecta los listeners: toggle del menu, cambio de tema, click fuera para cerrar. */
export function setupThemeListeners() {
  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (target && target.dataset.action === 'toggle-theme-menu') {
      toggleThemeMenu();
      return;
    }
    if (target && target.dataset.action === 'set-theme' && target.dataset.theme) {
      changeTheme(target.dataset.theme);
      return;
    }
    // Click fuera del toggle/menu → cerrar el dropdown
    const menu = $('themeMenu');
    if (menu && !menu.classList.contains('hidden')) {
      if (!e.target.closest('.theme-toggle')) {
        menu.classList.add('hidden');
      }
    }
  });
}

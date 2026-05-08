/**
 * UI del modal de Ajustes · Sifrah.
 *
 * Render + acciones de los 3 catálogos editables: URLs, audiencias y formatos.
 * Convive con `src/config.js` (estado puro + persistencia) y refresca los
 * selects del form al guardar/eliminar.
 *
 * Bug 5 fix: TODA interpolación de `${u.label}`, `${u.url}`, `${u.value}`
 * y `${formato}` pasa por `escapeHTML`.
 *
 * Bug 6 fix: `deleteURL`, `deleteAudience`, `deleteFormato` y `resetConfig`
 * usan `showConfirm` en vez de `confirm()` nativo.
 */

import { $, toast, escapeHTML, refreshIcons, uid, showConfirm } from './utils.js';
import { sanitizeForUTM, cleanInputLive } from './sanitize.js';
import { getConfig, saveConfig, getDefaultConfig, setConfig } from './config.js';
import {
  populateURLsSelect,
  populateAudienciasSelect,
  populateFormatList,
} from './form.js';

/* ============================================
   URLs
   ============================================ */

export function renderURLsList() {
  const c = $('urlsList');
  if (!c) return;
  const cfg = getConfig();

  c.innerHTML = cfg.urls.map((u) => `
    <div class="config-item">
      <div class="config-item-info">
        <strong>${escapeHTML(u.label)}${u.isCore ? ' <span class="is-core-badge">CORE</span>' : ''}</strong>
        <small>${escapeHTML(u.url)}</small>
      </div>
      <button class="utm-action-btn delete" data-action="delete-url" data-id="${escapeHTML(u.id)}" title="Eliminar">
        <i data-lucide="trash-2" class="icon"></i>
      </button>
    </div>`).join('');
  refreshIcons();
}

function addURL() {
  const labelEl = $('newUrlLabel');
  const urlEl = $('newUrlValue');
  const label = labelEl ? labelEl.value.trim() : '';
  const url = urlEl ? urlEl.value.trim() : '';

  if (!label || !url) { toast('Completa etiqueta y URL', 'error'); return; }
  if (!/^https?:\/\//i.test(url)) { toast('La URL debe empezar con http:// o https://', 'error'); return; }

  const cfg = getConfig();
  cfg.urls.push({ id: uid('url'), label, url, isCore: false });
  saveConfig();

  renderURLsList();
  populateURLsSelect();

  if (labelEl) labelEl.value = '';
  if (urlEl) urlEl.value = '';
  toast('URL agregada', 'success');
}

async function deleteURL(id) {
  const cfg = getConfig();
  const item = cfg.urls.find((u) => u.id === id);
  if (!item) return;
  const ok = await showConfirm(`¿Eliminar la URL "${item.label}"?`, 'Eliminar URL', 'Eliminar');
  if (!ok) return;
  cfg.urls = cfg.urls.filter((u) => u.id !== id);
  saveConfig();
  renderURLsList();
  populateURLsSelect();
  toast('URL eliminada');
}

/* ============================================
   Audiencias
   ============================================ */

export function renderAudienciasList() {
  const c = $('audienciasList');
  if (!c) return;
  const cfg = getConfig();

  c.innerHTML = cfg.audiencias.map((a) => `
    <div class="config-item">
      <div class="config-item-info">
        <strong>${escapeHTML(a.label)}${a.isCore ? ' <span class="is-core-badge">CORE</span>' : ''}</strong>
        <small>UTM: <code>${escapeHTML(a.value)}</code></small>
      </div>
      <button class="utm-action-btn delete" data-action="delete-audience" data-id="${escapeHTML(a.id)}" title="Eliminar">
        <i data-lucide="trash-2" class="icon"></i>
      </button>
    </div>`).join('');
  refreshIcons();
}

function addAudience() {
  const labelEl = $('newAudLabel');
  const valueEl = $('newAudValue');
  const label = labelEl ? labelEl.value.trim() : '';
  const value = valueEl ? sanitizeForUTM(valueEl.value.trim()) : '';

  if (!label || !value) { toast('Completa etiqueta y valor', 'error'); return; }

  const cfg = getConfig();
  cfg.audiencias.push({ id: uid('aud'), label, value, isCore: false });
  saveConfig();

  renderAudienciasList();
  populateAudienciasSelect();

  if (labelEl) labelEl.value = '';
  if (valueEl) valueEl.value = '';
  toast('Audiencia agregada', 'success');
}

async function deleteAudience(id) {
  const cfg = getConfig();
  const item = cfg.audiencias.find((a) => a.id === id);
  if (!item) return;
  const ok = await showConfirm(`¿Eliminar la audiencia "${item.label}"?`, 'Eliminar audiencia', 'Eliminar');
  if (!ok) return;
  cfg.audiencias = cfg.audiencias.filter((a) => a.id !== id);
  saveConfig();
  renderAudienciasList();
  populateAudienciasSelect();
  toast('Audiencia eliminada');
}

/* ============================================
   Formatos
   ============================================ */

export function renderFormatosList() {
  const c = $('formatosList');
  if (!c) return;
  const cfg = getConfig();

  c.innerHTML = cfg.formatos.map((f) => `
    <div class="config-item">
      <div class="config-item-info">
        <strong>${escapeHTML(f)}</strong>
      </div>
      <button class="utm-action-btn delete" data-action="delete-formato" data-formato="${escapeHTML(f)}" title="Eliminar">
        <i data-lucide="trash-2" class="icon"></i>
      </button>
    </div>`).join('');
  refreshIcons();
}

function addFormato() {
  const el = $('newFormato');
  const v = el ? sanitizeForUTM(el.value.trim()) : '';
  if (!v) { toast('Ingresa un formato', 'error'); return; }

  const cfg = getConfig();
  if (cfg.formatos.includes(v)) { toast('Ya existe ese formato', 'warning'); return; }
  cfg.formatos.push(v);
  saveConfig();

  renderFormatosList();
  populateFormatList();

  if (el) el.value = '';
  toast('Formato agregado', 'success');
}

async function deleteFormato(f) {
  const ok = await showConfirm(`¿Eliminar el formato "${f}"?`, 'Eliminar formato', 'Eliminar');
  if (!ok) return;
  const cfg = getConfig();
  cfg.formatos = cfg.formatos.filter((x) => x !== f);
  saveConfig();
  renderFormatosList();
  populateFormatList();
  toast('Formato eliminado');
}

/* ============================================
   Reset config (vuelta a defaults)
   ============================================ */

async function resetConfig() {
  const ok = await showConfirm(
    '¿Restaurar todos los valores por defecto? Se perderán los cambios personalizados de URLs, audiencias y formatos.',
    'Restaurar defaults',
    'Restaurar',
    false,
  );
  if (!ok) return;

  setConfig(getDefaultConfig());

  renderURLsList();
  renderAudienciasList();
  renderFormatosList();
  populateURLsSelect();
  populateAudienciasSelect();
  populateFormatList();
  toast('Configuración restaurada');
}

/* ============================================
   Wiring
   ============================================ */

/** Re-renderiza las 3 listas. Lo llama `openConfigModal` al abrir. */
export function renderAllConfigLists() {
  renderURLsList();
  renderAudienciasList();
  renderFormatosList();
}

/** Conecta los listeners del modal de config (add/delete + sanitizado en vivo). */
export function setupConfigUIListeners() {
  // Limpieza en vivo en los inputs cuyo valor termina en una UTM.
  // (NO en labels legibles para humanos ni en URL value.)
  ['newAudValue', 'newFormato'].forEach((id) => {
    const el = $(id);
    if (el) el.addEventListener('input', cleanInputLive);
  });

  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;

    if (action === 'add-url') addURL();
    else if (action === 'delete-url') deleteURL(target.dataset.id);
    else if (action === 'add-audience') addAudience();
    else if (action === 'delete-audience') deleteAudience(target.dataset.id);
    else if (action === 'add-formato') addFormato();
    else if (action === 'delete-formato') deleteFormato(target.dataset.formato);
    else if (action === 'reset-config') resetConfig();
  });
}

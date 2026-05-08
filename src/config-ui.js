/**
 * UI del modal de Ajustes · Sifrah.
 *
 * Sigue el patrón SF:
 *  - Lista de items en `.config-item-card` con badges `.config-badge.core`
 *    (seed inmutable, no eliminable) o `.config-badge.custom` (agregado por
 *    el usuario, eliminable).
 *  - Botón "Agregar Nueva..." que despliega un `.config-form` in-place
 *    (no modal anidado) con campos + Guardar / Cancelar.
 *  - `.config-preview-box` con preview en vivo del valor sanitizado dentro
 *    del slot del UTM.
 *  - Botón Restaurar defaults en el header del modal (con `showConfirm`).
 *
 * Bug 5 fix: TODA interpolación pasa por `escapeHTML`.
 * Bug 6 fix: deletes y restoreDefaults usan `showConfirm` (no `confirm()`).
 */

import { $, toast, escapeHTML, refreshIcons, uid, showConfirm } from './utils.js';
import { sanitizeForUTM, sanitizeLive, cleanInputLive } from './sanitize.js';
import { getConfig, saveConfig, getDefaultConfig, setConfig } from './config.js';
import {
  populateURLsSelect,
  populateAudienciasSelect,
  populateFormatList,
} from './form.js';

/* ============================================
   URLs · render + add + delete
   ============================================ */

export function renderURLsList() {
  const c = $('urlsList');
  if (!c) return;
  const cfg = getConfig();

  c.innerHTML = cfg.urls.map((u) => {
    const badge = u.isCore
      ? '<span class="config-badge core"><i data-lucide="lock" class="icon"></i> Core</span>'
      : '<span class="config-badge custom">Custom</span>';
    const action = u.isCore
      ? '<button class="config-action-btn locked" disabled><i data-lucide="lock" class="icon"></i> Protegido</button>'
      : `<button class="config-action-btn delete" data-action="delete-url" data-id="${escapeHTML(u.id)}">
           <i data-lucide="trash-2" class="icon"></i> Eliminar
         </button>`;

    return `
      <div class="config-item-card">
        <div class="config-item-info">
          <div class="config-item-name">${escapeHTML(u.label)}</div>
          <div class="config-item-desc">${escapeHTML(u.url)}</div>
          <div class="config-item-meta">${badge}</div>
        </div>
        <div class="config-item-actions">${action}</div>
      </div>`;
  }).join('');
  refreshIcons();
}

function showAddUrlForm() {
  const f = $('addUrlForm');
  if (f) f.classList.remove('hidden');
  const labelEl = $('newUrlLabel');
  if (labelEl) labelEl.focus();
  refreshIcons();
}

function cancelAddUrl() {
  const f = $('addUrlForm');
  if (f) f.classList.add('hidden');
  ['newUrlLabel', 'newUrlValue'].forEach((id) => {
    const el = $(id);
    if (el) el.value = '';
  });
}

function saveNewUrl() {
  const labelEl = $('newUrlLabel');
  const urlEl = $('newUrlValue');
  const label = labelEl ? labelEl.value.trim() : '';
  const url = urlEl ? urlEl.value.trim() : '';

  if (!label || !url) { toast('Completa etiqueta y URL', 'error'); return; }
  if (!/^https?:\/\//i.test(url)) { toast('La URL debe empezar con http:// o https://', 'error'); return; }

  const cfg = getConfig();
  if (cfg.urls.some((u) => u.url === url)) {
    toast('Ya existe una URL con esa dirección', 'warning');
    return;
  }

  cfg.urls.push({ id: uid('url'), label, url, isCore: false });
  saveConfig();
  cancelAddUrl();
  renderURLsList();
  populateURLsSelect();
  toast('URL agregada', 'success');
}

async function deleteURL(id) {
  const cfg = getConfig();
  const item = cfg.urls.find((u) => u.id === id);
  if (!item || item.isCore) return;
  const ok = await showConfirm(`¿Eliminar la URL "${item.label}"?`, 'Eliminar URL', 'Eliminar');
  if (!ok) return;
  cfg.urls = cfg.urls.filter((u) => u.id !== id);
  saveConfig();
  renderURLsList();
  populateURLsSelect();
  toast('URL eliminada');
}

/* ============================================
   Audiencias · render + add + delete + preview
   ============================================ */

export function renderAudienciasList() {
  const c = $('audienciasList');
  if (!c) return;
  const cfg = getConfig();

  c.innerHTML = cfg.audiencias.map((a) => {
    const badge = a.isCore
      ? '<span class="config-badge core"><i data-lucide="lock" class="icon"></i> Core</span>'
      : '<span class="config-badge custom">Custom</span>';
    const action = a.isCore
      ? '<button class="config-action-btn locked" disabled><i data-lucide="lock" class="icon"></i> Protegido</button>'
      : `<button class="config-action-btn delete" data-action="delete-audience" data-id="${escapeHTML(a.id)}">
           <i data-lucide="trash-2" class="icon"></i> Eliminar
         </button>`;

    return `
      <div class="config-item-card">
        <div class="config-item-info">
          <div class="config-item-name">${escapeHTML(a.label)}</div>
          <div class="config-item-desc">UTM: <code>${escapeHTML(a.value)}</code></div>
          <div class="config-item-meta">${badge}</div>
        </div>
        <div class="config-item-actions">${action}</div>
      </div>`;
  }).join('');
  refreshIcons();
  updateAudPreview();
}

function showAddAudienceForm() {
  const f = $('addAudienceForm');
  if (f) f.classList.remove('hidden');
  const labelEl = $('newAudLabel');
  if (labelEl) labelEl.focus();
  refreshIcons();
}

function cancelAddAudience() {
  const f = $('addAudienceForm');
  if (f) f.classList.add('hidden');
  ['newAudLabel', 'newAudValue'].forEach((id) => {
    const el = $(id);
    if (el) el.value = '';
  });
  updateAudPreview();
}

function saveNewAudience() {
  const labelEl = $('newAudLabel');
  const valueEl = $('newAudValue');
  const label = labelEl ? labelEl.value.trim() : '';
  const value = valueEl ? sanitizeForUTM(valueEl.value.trim()) : '';

  if (!label || !value) { toast('Completa etiqueta y valor', 'error'); return; }

  const cfg = getConfig();
  if (cfg.audiencias.some((a) => a.value === value)) {
    toast('Ya existe una audiencia con ese valor', 'warning');
    return;
  }

  cfg.audiencias.push({ id: uid('aud'), label, value, isCore: false });
  saveConfig();
  cancelAddAudience();
  renderAudienciasList();
  populateAudienciasSelect();
  toast('Audiencia agregada', 'success');
}

async function deleteAudience(id) {
  const cfg = getConfig();
  const item = cfg.audiencias.find((a) => a.id === id);
  if (!item || item.isCore) return;
  const ok = await showConfirm(`¿Eliminar la audiencia "${item.label}"?`, 'Eliminar audiencia', 'Eliminar');
  if (!ok) return;
  cfg.audiencias = cfg.audiencias.filter((a) => a.id !== id);
  saveConfig();
  renderAudienciasList();
  populateAudienciasSelect();
  toast('Audiencia eliminada');
}

/** Actualiza el preview del slot de audiencia mientras el usuario escribe. */
function updateAudPreview() {
  const previewEl = $('previewAudiencia');
  const valueEl = $('newAudValue');
  if (!previewEl) return;
  const raw = valueEl ? valueEl.value : '';
  const value = sanitizeLive(raw);
  const slot = value
    ? `<span class="preview-slot">${escapeHTML(value)}</span>`
    : '<span class="preview-slot">[Tu valor]</span>';
  previewEl.innerHTML = `sifrah-may-26-ecom-conv-${slot}-formato-tema`;
}

/* ============================================
   Formatos · render + add + delete + preview
   ============================================ */

export function renderFormatosList() {
  const c = $('formatosList');
  if (!c) return;
  const cfg = getConfig();

  c.innerHTML = cfg.formatos.map((f) => `
    <div class="config-item-card">
      <div class="config-item-info">
        <div class="config-item-name">${escapeHTML(f)}</div>
        <div class="config-item-desc">Aparece como sugerencia al escribir formato</div>
      </div>
      <div class="config-item-actions">
        <button class="config-action-btn delete" data-action="delete-formato" data-formato="${escapeHTML(f)}">
          <i data-lucide="trash-2" class="icon"></i> Eliminar
        </button>
      </div>
    </div>`).join('');
  refreshIcons();
  updateFormatoPreview();
}

function showAddFormatoForm() {
  const f = $('addFormatoForm');
  if (f) f.classList.remove('hidden');
  const el = $('newFormato');
  if (el) el.focus();
  refreshIcons();
}

function cancelAddFormato() {
  const f = $('addFormatoForm');
  if (f) f.classList.add('hidden');
  const el = $('newFormato');
  if (el) el.value = '';
  updateFormatoPreview();
}

function saveNewFormato() {
  const el = $('newFormato');
  const v = el ? sanitizeForUTM(el.value.trim()) : '';
  if (!v) { toast('Ingresa un formato', 'error'); return; }

  const cfg = getConfig();
  if (cfg.formatos.includes(v)) { toast('Ya existe ese formato', 'warning'); return; }
  cfg.formatos.push(v);
  saveConfig();
  cancelAddFormato();
  renderFormatosList();
  populateFormatList();
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

function updateFormatoPreview() {
  const previewEl = $('previewFormato');
  const inputEl = $('newFormato');
  if (!previewEl) return;
  const raw = inputEl ? inputEl.value : '';
  const value = sanitizeLive(raw);
  const slot = value
    ? `<span class="preview-slot">${escapeHTML(value)}</span>`
    : '<span class="preview-slot">[Tu formato]</span>';
  previewEl.innerHTML = `sifrah-may-26-branding-alc-${slot}-tema`;
}

/* ============================================
   Restore defaults
   ============================================ */

async function restoreDefaults() {
  const ok = await showConfirm(
    '¿Restaurar todos los valores por defecto? Se perderán los cambios personalizados de URLs, audiencias y formatos.',
    'Restaurar defaults',
    'Restaurar',
    false,
  );
  if (!ok) return;

  setConfig(getDefaultConfig());
  renderAllConfigLists();
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

/** Conecta los listeners del modal de config (add/cancel/save/delete + preview live). */
export function setupConfigUIListeners() {
  // Limpieza en vivo en los inputs cuyo valor termina en una UTM.
  // (NO en labels legibles para humanos ni en URL value.)
  ['newAudValue', 'newFormato'].forEach((id) => {
    const el = $(id);
    if (el) el.addEventListener('input', cleanInputLive);
  });

  // Preview en vivo (despues del cleanInputLive, así muestra el valor ya sanitizado)
  const audInput = $('newAudValue');
  if (audInput) audInput.addEventListener('input', updateAudPreview);
  const formInput = $('newFormato');
  if (formInput) formInput.addEventListener('input', updateFormatoPreview);

  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;

    switch (action) {
      case 'show-add-url-form':       showAddUrlForm(); break;
      case 'cancel-add-url':          cancelAddUrl(); break;
      case 'save-new-url':            saveNewUrl(); break;
      case 'delete-url':              deleteURL(target.dataset.id); break;

      case 'show-add-audience-form':  showAddAudienceForm(); break;
      case 'cancel-add-audience':     cancelAddAudience(); break;
      case 'save-new-audience':       saveNewAudience(); break;
      case 'delete-audience':         deleteAudience(target.dataset.id); break;

      case 'show-add-formato-form':   showAddFormatoForm(); break;
      case 'cancel-add-formato':      cancelAddFormato(); break;
      case 'save-new-formato':        saveNewFormato(); break;
      case 'delete-formato':          deleteFormato(target.dataset.formato); break;

      case 'restore-defaults':        restoreDefaults(); break;
      default:
    }
  });
}

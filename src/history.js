/**
 * Historial de UTMs generadas · Sifrah.
 *
 * Estado en memoria + persistencia en `localStorage.linky_sifrah_history`.
 *
 * Bug fixes aplicados:
 *  - Bug 4: empty state real con icono `inbox` + título y subtítulo (no
 *    un div vacío).
 *  - Bug 5: TODA interpolación de strings de usuario va a través de
 *    `escapeHTML` para prevenir XSS.
 *  - Bug 6: `clearHistory` y `deleteFromHistory` usan `showConfirm` en
 *    vez del `confirm()` nativo.
 */

import { $, toast, escapeHTML, refreshIcons, showConfirm } from './utils.js';
import { STORAGE_KEYS } from './constants.js';
import { checkURL } from './validation.js';

/** @type {object[]} */
let history = [];

/** Estado del filtro/búsqueda del historial (Fase 5 UX). */
const historyFilter = {
  q: '',
  division: 'all',
};

/** Carga desde localStorage. Idempotente, soporta reinicio. */
export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.history);
    history = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(history)) history = [];
  } catch {
    history = [];
  }
  return history;
}

/** Persiste el estado actual. */
export function saveHistory() {
  try {
    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history));
  } catch {
    /* quota — silencioso, sigue en memoria */
  }
}

/** Devuelve la referencia viva al historial. */
export function getHistory() {
  return history;
}

/**
 * Agrega un entry al inicio (LIFO), persiste, dispara checkURL en background
 * y actualiza el render cuando llega el resultado.
 * @param {object} entry - debe traer urlCompleta y urlStatus inicial 'checking'
 */
export function addToHistory(entry) {
  history.unshift(entry);
  saveHistory();
  renderHistory();
  updateStats();

  checkURL(entry.urlCompleta).then((result) => {
    // Si el usuario eliminó este entry mientras el fetch estaba en vuelo,
    // descartamos sin tocar el render ni mostrar un toast confuso sobre
    // una UTM que ya no existe.
    if (!history.includes(entry)) return;

    entry.urlStatus = result;
    saveHistory();
    renderHistory();
    if (result.status === 'ok') toast('URL verificada correctamente', 'success');
    else if (result.status === 'unknown') toast('URL no verificable (CORS)', 'warning');
    else if (result.status === 'warning') toast('URL con redirect', 'warning');
    else toast('URL no accesible o con error', 'error');
  });
}

/* ============================================
   Render
   ============================================ */

function buildBadgeHTML(entry) {
  if (!entry.urlStatus) return '';
  const st = entry.urlStatus.status;
  if (st === 'checking') return '<span class="url-status-badge checking">Verificando...</span>';
  if (st === 'ok')       return `<span class="url-status-badge ok">OK ${escapeHTML(entry.urlStatus.code)}</span>`;
  if (st === 'warning')  return '<span class="url-status-badge warning">Redirect</span>';
  if (st === 'error')    return '<span class="url-status-badge error">Error</span>';
  if (st === 'unknown')  return '<span class="url-status-badge unknown">CORS</span>';
  return '';
}

/** Aplica filtro+búsqueda al array history. Devuelve subset (no muta). */
function applyFilter(list) {
  const q = historyFilter.q.trim().toLowerCase();
  const div = historyFilter.division;

  return list.filter((u) => {
    if (div !== 'all' && u.division !== div) return false;
    if (!q) return true;
    const haystack = [
      u.utm_campaign, u.utm_content, u.tema, u.urlCompleta,
      u.formato, u.audiencia, u.objetivo,
    ].map((v) => String(v ?? '').toLowerCase()).join(' ');
    return haystack.includes(q);
  });
}

/** Pinta el listado completo. Bug 4 (empty state) + Bug 5 (escapeHTML). */
export function renderHistory() {
  const container = $('utmList');
  if (!container) return;

  // Empty state cuando no hay nada en absoluto
  if (history.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i data-lucide="inbox" class="icon-lg" style="width:48px;height:48px;"></i>
        <h3>Sin UTMs aún</h3>
        <p>Crea tu primera UTM con el formulario de arriba.</p>
      </div>`;
    refreshIcons();
    return;
  }

  // Aplicar filtro/búsqueda
  const filtered = applyFilter(history);

  // Empty state filtrado: hay UTMs pero ninguna calza con el filtro
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i data-lucide="search-x" class="icon-lg" style="width:48px;height:48px;"></i>
        <h3>Sin coincidencias</h3>
        <p>Ningún UTM calza con el filtro o la búsqueda actual.</p>
      </div>`;
    refreshIcons();
    return;
  }

  // Construyo HTML como string. Cualquier valor de usuario pasa por
  // escapeHTML antes de interpolarse. Uso `data-id` (no `data-idx`) para
  // que clicks tardíos sigan funcionando aunque el array se haya reordenado.
  const html = filtered.map((u) => {
    const badge = buildBadgeHTML(u);
    const status = u.urlStatus && u.urlStatus.status ? `url-${u.urlStatus.status}` : '';
    const date = new Date(u.createdAt).toLocaleString('es-PE');

    return `
      <div class="utm-item ${status}">
        <div class="utm-header">
          <div class="utm-campaign">${escapeHTML(u.utm_campaign)} ${badge}</div>
          <div class="utm-actions">
            <button class="utm-action-btn" data-action="copy-history" data-id="${escapeHTML(u.id)}" title="Copiar UTM">
              <i data-lucide="clipboard-copy" class="icon"></i>
            </button>
            <button class="utm-action-btn delete" data-action="delete-history" data-id="${escapeHTML(u.id)}" title="Eliminar">
              <i data-lucide="trash-2" class="icon"></i>
            </button>
          </div>
        </div>
        <div class="utm-date">${escapeHTML(date)}</div>
        <div class="utm-url">${escapeHTML(u.urlCompleta)}</div>
      </div>`;
  }).join('');

  container.innerHTML = html;
  refreshIcons();
}

/** Actualiza los 4 contadores de stats (total + 3 divisiones). */
export function updateStats() {
  const total = $('totalCount');
  const branding = $('brandingCount');
  const retail = $('retailCount');
  const ecom = $('ecomCount');

  if (total) total.textContent = String(history.length);
  if (branding) branding.textContent = String(history.filter((x) => x.division === 'branding').length);
  if (retail) retail.textContent = String(history.filter((x) => x.division === 'retail').length);
  if (ecom) ecom.textContent = String(history.filter((x) => x.division === 'ecom').length);
}

/* ============================================
   Acciones (copy / delete / clear)
   ============================================ */

export function copyFromHistory(id) {
  const entry = history.find((u) => u.id === id);
  if (!entry) return;
  navigator.clipboard.writeText(entry.urlCompleta).then(
    () => toast('URL copiada', 'success'),
    () => toast('Error al copiar', 'error'),
  );
}

export async function deleteFromHistory(id) {
  const entry = history.find((u) => u.id === id);
  if (!entry) return;
  const ok = await showConfirm(
    '¿Eliminar esta UTM del historial? Esta acción no se puede deshacer.',
    'Eliminar UTM',
    'Eliminar',
  );
  if (!ok) return;
  history = history.filter((u) => u.id !== id);
  saveHistory();
  renderHistory();
  updateStats();
  toast('UTM eliminada');
}

export async function clearHistory() {
  if (history.length === 0) {
    toast('El historial ya está vacío');
    return;
  }
  const ok = await showConfirm(
    `¿Borrar todas las UTMs del historial (${history.length})? Considera exportar a CSV antes.`,
    'Limpiar historial',
    'Borrar todo',
  );
  if (!ok) return;
  history = [];
  saveHistory();
  renderHistory();
  updateStats();
  toast('Historial borrado');
}

/* ============================================
   Wiring
   ============================================ */

/* ============================================
   Filter + search (UX Fase 5)
   ============================================ */

const SEARCH_DEBOUNCE_MS = 150;
let searchTimer = null;

/** Setea el chip de división activo y re-renderiza. */
function setFilterDivision(div) {
  historyFilter.division = div;
  document.querySelectorAll('#historyFilters .filter-chip').forEach((b) => {
    b.classList.toggle('active', b.dataset.filter === div);
  });
  renderHistory();
}

/** Setea la query de búsqueda con debounce y re-renderiza. */
function setFilterQuery(q) {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    historyFilter.q = q;
    renderHistory();
  }, SEARCH_DEBOUNCE_MS);
}

/** Conecta el delegado de clicks para los botones del historial y "Limpiar". */
export function setupHistoryListeners() {
  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;

    if (action === 'copy-history') {
      if (target.dataset.id) copyFromHistory(target.dataset.id);
    } else if (action === 'delete-history') {
      if (target.dataset.id) deleteFromHistory(target.dataset.id);
    } else if (action === 'clear-history') {
      clearHistory();
    } else if (action === 'set-filter') {
      const div = target.dataset.filter || 'all';
      setFilterDivision(div);
    }
  });

  // Search input (debounced)
  const searchEl = $('historySearch');
  if (searchEl) {
    searchEl.addEventListener('input', (e) => setFilterQuery(e.target.value));
  }
}

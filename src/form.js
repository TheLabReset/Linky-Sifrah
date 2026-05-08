/**
 * Formulario de generación de UTMs · Sifrah.
 *
 * Responsabilidades:
 *  - Poblar selects (URLs, audiencias, formatos sugeridos, año, mes default).
 *  - Wiring de listeners: toggles de custom inputs, audiencia condicional,
 *    auto-fill de medium, sanitización en vivo, submit del form, reset y copy.
 *
 * Todo el wire-up es `addEventListener`. Cero `onclick` inline / cero
 * `window.X = ...`.
 *
 * En Fase 3 el submit handler solo muestra el result box. En Fase 4 también
 * agrega al historial y dispara `checkURL` en background — esa lógica
 * quedará centralizada en `history.js` consumiendo el entry que devuelve
 * `generateUTM`.
 */

import { $, toast } from './utils.js';
import { cleanInputLive } from './sanitize.js';
import { DIVISION_MEDIUM_MAP, STORAGE_KEYS } from './constants.js';
import { getConfig } from './config.js';
import { generateUTM, copyResult, resetForm } from './utm.js';

/* ============================================
   Populates
   ============================================ */

/** Pobla el select de URL de destino con catálogo + opción "+ Personalizada". */
export function populateURLsSelect() {
  const sel = $('urlDestino');
  if (!sel) return;
  const previous = sel.value;
  const cfg = getConfig();

  sel.innerHTML = '<option value="">Seleccionar URL...</option>';
  cfg.urls.forEach((u) => {
    const opt = document.createElement('option');
    opt.value = u.url;
    opt.textContent = u.label;
    sel.appendChild(opt);
  });
  const customOpt = document.createElement('option');
  customOpt.value = 'custom';
  customOpt.textContent = '+ URL personalizada';
  sel.appendChild(customOpt);

  if (previous) sel.value = previous;
}

/** Pobla el select de audiencia con catálogo + opción "+ Personalizada". */
export function populateAudienciasSelect() {
  const sel = $('audiencia');
  if (!sel) return;
  const cfg = getConfig();

  sel.innerHTML = '<option value="">Seleccionar...</option>';
  cfg.audiencias.forEach((a) => {
    const opt = document.createElement('option');
    opt.value = a.value;
    opt.textContent = a.label;
    sel.appendChild(opt);
  });
  const customOpt = document.createElement('option');
  customOpt.value = 'custom';
  customOpt.textContent = '+ Personalizada';
  sel.appendChild(customOpt);
}

/** Pobla el datalist de sugerencias del campo formato. */
export function populateFormatList() {
  const list = $('formatList');
  if (!list) return;
  const cfg = getConfig();

  list.innerHTML = '';
  cfg.formatos.forEach((f) => {
    const opt = document.createElement('option');
    opt.value = f;
    list.appendChild(opt);
  });
}

/** Pobla el select de año dinámicamente: currentYear-1 a currentYear+2. */
export function populateYearSelect() {
  const sel = $('ano');
  if (!sel) return;
  const cur = new Date().getFullYear();

  sel.innerHTML = '';
  [-1, 0, 1, 2].forEach((off) => {
    const y = cur + off;
    const opt = document.createElement('option');
    opt.value = String(y);
    opt.textContent = String(y);
    if (off === 0) opt.selected = true;
    sel.appendChild(opt);
  });
}

/** Selecciona por default el mes actual en el dropdown. */
export function populateMonthDefault() {
  const sel = $('mes');
  if (!sel) return;
  const codes = ['ene','feb','mar','abr','may','jun','jul','ago','set','oct','nov','dic'];
  sel.value = codes[new Date().getMonth()];
}

/* ============================================
   Lectura del form
   ============================================ */

/**
 * Devuelve el valor del campo. Si está en modo "custom", lee del input
 * libre asociado. Útil para plataforma y audiencia.
 */
function getValue(selectId, customId) {
  const sel = $(selectId);
  if (!sel) return '';
  if (sel.value === 'custom') {
    const custom = $(customId);
    return custom ? custom.value.trim() : '';
  }
  return sel.value;
}

/** Lee todos los campos del form y devuelve un objeto plano. */
export function readForm() {
  const urlSelEl = $('urlDestino');
  const urlSel = urlSelEl ? urlSelEl.value : '';
  const urlCustomEl = $('urlCustom');
  const url = urlSel === 'custom' ? (urlCustomEl ? urlCustomEl.value.trim() : '') : urlSel;

  return {
    url,
    division:   $('division')   ? $('division').value   : '',
    plataforma: getValue('plataforma', 'plataformaCustom'),
    objetivo:   $('objetivo')   ? $('objetivo').value   : '',
    audiencia:  getValue('audiencia', 'audienciaCustom'),
    formato:    $('formato')    ? $('formato').value    : '',
    tema:       $('tema')       ? $('tema').value       : '',
    mes:        $('mes')        ? $('mes').value        : '',
    ano:        $('ano')        ? $('ano').value        : '',
    version:    $('version')    ? $('version').value    : '',
  };
}

/* ============================================
   Listeners
   ============================================ */

/**
 * Conecta todos los listeners del formulario, result box, y los inputs de
 * limpieza en vivo. Idempotente solo si se llama una vez en init.
 *
 * @param {(entry:object, fullUrl:string) => void} [onGenerate]
 *        Callback opcional para que Fase 4 pueda agregar al historial,
 *        renderizar y disparar checkURL. En Fase 3 puede omitirse.
 */
export function setupFormListeners(onGenerate) {
  // URL: toggle custom input
  const urlDestino = $('urlDestino');
  if (urlDestino) {
    urlDestino.addEventListener('change', (e) => {
      const isCustom = e.target.value === 'custom';
      const urlCustom = $('urlCustom');
      if (urlCustom) {
        urlCustom.classList.toggle('hidden', !isCustom);
        if (!isCustom) urlCustom.value = '';
      }
    });
  }

  // División: auto-fill medium + toggle audiencia (con required dinámico)
  const division = $('division');
  if (division) {
    division.addEventListener('change', (e) => {
      const div = e.target.value;
      const medium = $('medium');
      if (medium) medium.value = DIVISION_MEDIUM_MAP[div] || '';

      const isEcom = div === 'ecom';
      const audGroup = $('audienciaGroup');
      const audSelect = $('audiencia');
      const audCustom = $('audienciaCustom');

      if (audGroup) audGroup.classList.toggle('hidden', !isEcom);

      if (audSelect) {
        if (isEcom) {
          audSelect.setAttribute('required', '');
        } else {
          audSelect.removeAttribute('required');
          audSelect.value = '';
        }
      }
      if (!isEcom && audCustom) {
        audCustom.value = '';
        audCustom.classList.add('hidden');
      }
    });
  }

  // Plataforma: toggle custom input
  const plataforma = $('plataforma');
  if (plataforma) {
    plataforma.addEventListener('change', (e) => {
      const isCustom = e.target.value === 'custom';
      const custom = $('plataformaCustom');
      if (custom) {
        custom.classList.toggle('hidden', !isCustom);
        if (!isCustom) custom.value = '';
      }
    });
  }

  // Audiencia: toggle custom input
  const audiencia = $('audiencia');
  if (audiencia) {
    audiencia.addEventListener('change', (e) => {
      const isCustom = e.target.value === 'custom';
      const custom = $('audienciaCustom');
      if (custom) {
        custom.classList.toggle('hidden', !isCustom);
        if (!isCustom) custom.value = '';
      }
    });
  }

  // Limpieza en vivo de inputs cuyo valor va directo a la UTM
  ['tema', 'formato', 'plataformaCustom', 'audienciaCustom'].forEach((id) => {
    const el = $(id);
    if (el) el.addEventListener('input', cleanInputLive);
  });

  // Submit del form
  const form = $('utmForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = readForm();
      const result = generateUTM(data);

      if (result.error) {
        toast(result.message, 'error');
        return;
      }

      const { entry, fullUrl } = result;

      const resultText = $('resultText');
      const resultContainer = $('resultContainer');
      if (resultText) resultText.textContent = fullUrl;
      if (resultContainer) {
        resultContainer.classList.remove('hidden');
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      toast('UTM generada', 'success');

      // Borrar el draft: el usuario terminó este flujo y empieza fresco
      clearDraft();

      if (typeof onGenerate === 'function') {
        onGenerate(entry, fullUrl);
      }
    });
  }

  // Botones del form area: reset y copy (data-action delegation)
  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'reset-form') resetForm();
    else if (action === 'copy-result') copyResult();
  });
}

/* ============================================
   Draft auto-save (UX Fase 5)
   ============================================ */

const DRAFT_DEBOUNCE_MS = 400;
let draftTimer = null;

/** Guarda el borrador del form en localStorage con debounce. */
function persistDraft() {
  if (draftTimer) clearTimeout(draftTimer);
  draftTimer = setTimeout(() => {
    try {
      const data = readForm();
      // Solo persistimos si hay al menos UN campo significativo lleno;
      // un draft vacío no aporta y pisaría un draft anterior si el usuario
      // borra todo en bloque (mejor que se conserve hasta que reset/submit).
      const hasContent = Object.values(data).some((v) => String(v ?? '').trim() !== '');
      if (!hasContent) return;
      localStorage.setItem(STORAGE_KEYS.draft, JSON.stringify(data));
    } catch {
      /* quota o storage inaccesible — silencioso */
    }
  }, DRAFT_DEBOUNCE_MS);
}

/** Borra el borrador (al submit exitoso o reset explícito). */
export function clearDraft() {
  if (draftTimer) {
    clearTimeout(draftTimer);
    draftTimer = null;
  }
  try {
    localStorage.removeItem(STORAGE_KEYS.draft);
  } catch {
    /* silencioso */
  }
}

/**
 * Restaura un borrador guardado al cargar la app. Pobla los campos y dispara
 * los `change` necesarios para reconstruir custom inputs y audiencia condicional.
 * @returns {boolean} true si se restauró algo
 */
export function restoreDraft() {
  let data = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.draft);
    if (!raw) return false;
    data = JSON.parse(raw);
  } catch {
    return false;
  }
  if (!data || typeof data !== 'object') return false;

  // Setear los selects/inputs en orden lógico
  const setVal = (id, v) => {
    const el = $(id);
    if (el && v != null && v !== '') el.value = v;
  };

  // URL: si era custom, el value se serializó como la URL real (no 'custom').
  // Comparamos contra las options actuales del select para detectar si la
  // value persistida ya no existe en el catálogo (entonces caemos en custom).
  const urlSel = $('urlDestino');
  if (urlSel && data.url) {
    const optionExists = Array.from(urlSel.options).some((o) => o.value === data.url);
    if (optionExists) {
      urlSel.value = data.url;
    } else {
      urlSel.value = 'custom';
      const customEl = $('urlCustom');
      if (customEl) {
        customEl.value = data.url;
        customEl.classList.remove('hidden');
      }
    }
    urlSel.dispatchEvent(new Event('change', { bubbles: true }));
  }

  setVal('division', data.division);
  if (data.division) {
    const divEl = $('division');
    if (divEl) divEl.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // Plataforma: detectar si es custom
  const plataformaSel = $('plataforma');
  if (plataformaSel && data.plataforma) {
    const optExists = Array.from(plataformaSel.options).some((o) => o.value === data.plataforma);
    if (optExists) {
      plataformaSel.value = data.plataforma;
    } else {
      plataformaSel.value = 'custom';
      const customEl = $('plataformaCustom');
      if (customEl) {
        customEl.value = data.plataforma;
        customEl.classList.remove('hidden');
      }
    }
    plataformaSel.dispatchEvent(new Event('change', { bubbles: true }));
  }

  setVal('objetivo', data.objetivo);

  // Audiencia (solo si la división es ecom y el group quedó visible)
  if (data.division === 'ecom' && data.audiencia) {
    const audSel = $('audiencia');
    if (audSel) {
      const optExists = Array.from(audSel.options).some((o) => o.value === data.audiencia);
      if (optExists) {
        audSel.value = data.audiencia;
      } else {
        audSel.value = 'custom';
        const customEl = $('audienciaCustom');
        if (customEl) {
          customEl.value = data.audiencia;
          customEl.classList.remove('hidden');
        }
      }
      audSel.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  setVal('formato', data.formato);
  setVal('tema', data.tema);
  setVal('mes', data.mes);
  setVal('ano', data.ano);
  setVal('version', data.version);

  return true;
}

/** Conecta el auto-save: input/change en cualquier campo del form lo persiste. */
export function setupDraftPersistence() {
  const form = $('utmForm');
  if (!form) return;

  // Wire-up cuando hay cambios reales en el form.
  form.addEventListener('input', persistDraft);
  form.addEventListener('change', persistDraft);
}

/**
 * Construcción de UTMs y URL final etiquetada para Sifrah.
 *
 * Reglas:
 *   utm_campaign  =  sifrah-{mes3}-{division}
 *   utm_medium    =  social-media (Branding/Retail) | social-ads (Ecom)
 *   utm_source    =  {plataforma}
 *   utm_content   =  sifrah-{mes3}-{año2}-{division}-{obj}-[aud]-{formato}-{tema}-[v]
 *
 * Bug fixes aplicados:
 *  - Bug 2: URLs con #fragment usan `new URL` + `searchParams.set` para que
 *    los UTMs queden ANTES del fragment (no después).
 *  - Bug 3: utm_* preexistentes en la URL de destino se eliminan vía
 *    `searchParams.delete` antes de pegar los nuevos.
 */

import { sanitizeForUTM } from './sanitize.js';
import { BRAND_PREFIX, DIVISION_MEDIUM_MAP, STORAGE_KEYS } from './constants.js';
import { $, toast, refreshIcons, uid } from './utils.js';

const UTM_KEYS_TO_STRIP = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

/**
 * Parsea una URL, elimina utm_* preexistentes y devuelve sus partes.
 * @param {string} rawUrl
 * @returns {{ ok: true, origin: string, pathname: string, search: string, hash: string, href: string } | { ok: false, error: string }}
 */
export function parseAndCleanURL(rawUrl) {
  try {
    const u = new URL(rawUrl);
    UTM_KEYS_TO_STRIP.forEach((k) => u.searchParams.delete(k));
    return {
      ok: true,
      origin: u.origin,
      pathname: u.pathname,
      search: u.search,
      hash: u.hash,
      href: u.toString(),
    };
  } catch {
    return { ok: false, error: 'URL inválida' };
  }
}

/**
 * Construye la URL final etiquetada. Preserva fragment (`#…`) y query
 * existente. Devuelve `null` si la URL base es inválida.
 * @param {string} rawUrl
 * @param {Record<string, string>} params
 * @returns {string | null}
 */
export function buildFinalURL(rawUrl, params) {
  const parsed = parseAndCleanURL(rawUrl);
  if (!parsed.ok) return null;

  const u = new URL(parsed.href);
  Object.entries(params).forEach(([k, v]) => {
    if (v) u.searchParams.set(k, v);
  });
  return u.toString();
}

/**
 * `sifrah-{mes}-{division}` (sin sanitización: ambos vienen de selects cerrados).
 * @param {string} mes
 * @param {string} division
 */
export function buildCampaign(mes, division) {
  if (!mes || !division) return '';
  return `${BRAND_PREFIX}-${mes}-${division}`;
}

/**
 * `sifrah-{mes}-{año2}-{division}-{obj}-[aud]-{formato}-{tema}-[v]`.
 * Audiencia solo se incluye si la división es `ecom`. Versión es opcional.
 * @param {{ mes:string, ano:string|number, division:string, objetivo?:string, audiencia?:string, formato?:string, tema?:string, version?:string|number }} fields
 */
export function buildContent({ mes, ano, division, objetivo, audiencia, formato, tema, version }) {
  if (!mes || !division || !ano) return '';
  const ano2 = String(ano).slice(-2);
  const parts = [`${BRAND_PREFIX}-${mes}-${ano2}-${division}`];
  if (objetivo) parts.push(objetivo);
  if (division === 'ecom' && audiencia) parts.push(sanitizeForUTM(audiencia));
  if (formato) parts.push(sanitizeForUTM(formato));
  if (tema) parts.push(sanitizeForUTM(tema));
  if (version) parts.push(String(version));
  return parts.join('-');
}

/**
 * @typedef {Object} FormData
 * @property {string} url
 * @property {string} division
 * @property {string} plataforma
 * @property {string} objetivo
 * @property {string} audiencia
 * @property {string} formato
 * @property {string} tema
 * @property {string} mes
 * @property {string} ano
 * @property {string} version
 */

/**
 * @typedef {Object} GenerateError
 * @property {true} error
 * @property {string} message
 */

/**
 * @typedef {Object} GenerateOk
 * @property {false} [error]
 * @property {object} entry
 * @property {string} fullUrl
 */

/**
 * Orquesta la generación: valida campos, sanitiza, construye UTMs y URL final,
 * y devuelve el entry listo para historial. NO escribe en historial ni dispara
 * `checkURL` — eso lo decide el caller (form submit handler en form.js).
 *
 * @param {FormData} f
 * @returns {GenerateOk | GenerateError}
 */
export function generateUTM(f) {
  if (!f.url) return { error: true, message: 'Selecciona una URL de destino' };
  if (!/^https?:\/\//i.test(f.url)) return { error: true, message: 'La URL debe empezar con http:// o https://' };

  const parsed = parseAndCleanURL(f.url);
  if (!parsed.ok) return { error: true, message: 'URL inválida' };

  if (!f.division)   return { error: true, message: 'Selecciona una división' };
  if (!f.plataforma) return { error: true, message: 'Selecciona una plataforma' };
  if (!f.objetivo)   return { error: true, message: 'Selecciona un objetivo' };
  if (!f.formato)    return { error: true, message: 'Ingresa un formato' };
  if (!f.tema)       return { error: true, message: 'Ingresa un tema' };
  if (!f.mes)        return { error: true, message: 'Selecciona un mes' };
  if (!f.ano)        return { error: true, message: 'Selecciona un año' };
  if (f.division === 'ecom' && !f.audiencia) {
    return { error: true, message: 'Audiencia es obligatoria para Ecom' };
  }

  const medium = DIVISION_MEDIUM_MAP[f.division] || '';
  const source = sanitizeForUTM(f.plataforma);
  const campaign = buildCampaign(f.mes, f.division);
  const content = buildContent(f);

  const fullUrl = buildFinalURL(f.url, {
    utm_source: source,
    utm_medium: medium,
    utm_campaign: campaign,
    utm_content: content,
  });

  if (!fullUrl) return { error: true, message: 'URL inválida' };

  const entry = {
    id: uid('utm'),
    division: f.division,
    plataforma: f.plataforma,
    medium,
    objetivo: f.objetivo,
    audiencia: f.audiencia,
    formato: f.formato,
    tema: f.tema,
    mes: f.mes,
    ano: f.ano,
    version: f.version,
    urlDestino: f.url,
    utm_source: source,
    utm_medium: medium,
    utm_campaign: campaign,
    utm_content: content,
    urlCompleta: fullUrl,
    createdAt: new Date().toISOString(),
    urlStatus: { status: 'checking', message: 'Verificando...' },
  };

  return { entry, fullUrl };
}

/**
 * Copia el texto del result box al portapapeles y da feedback visual sobre
 * el botón. Si `text` viene vacío, lee directamente del DOM.
 * @param {string} [text]
 */
export function copyResult(text) {
  const value = text ?? ($('resultText') && $('resultText').textContent) ?? '';
  if (!value) return;

  navigator.clipboard.writeText(value).then(() => {
    const btn = $('copyBtn');
    if (btn) {
      btn.classList.add('copied');
      btn.innerHTML = '<i data-lucide="check" class="icon"></i> Copiado';
      refreshIcons();
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.innerHTML = '<i data-lucide="clipboard-copy" class="icon"></i> Copiar';
        refreshIcons();
      }, 2000);
    }
    toast('URL copiada al portapapeles', 'success');
  }).catch(() => toast('Error al copiar', 'error'));
}

/**
 * Limpia el formulario, oculta los campos condicionales y el result box.
 * Re-establece el mes default sin depender de form.js (evita ciclo de imports).
 */
export function resetForm() {
  const form = $('utmForm');
  if (form) form.reset();

  ['urlCustom', 'plataformaCustom', 'audienciaCustom', 'audienciaGroup', 'resultContainer']
    .forEach((id) => {
      const el = $(id);
      if (el) el.classList.add('hidden');
    });

  const medium = $('medium');
  if (medium) medium.value = '';

  // Restaura el mes default (los selects ya retienen su <option selected>)
  const mes = $('mes');
  if (mes) {
    const codes = ['ene','feb','mar','abr','may','jun','jul','ago','set','oct','nov','dic'];
    mes.value = codes[new Date().getMonth()] || '';
  }

  // Limpia el borrador persistido también (el usuario eligió empezar de cero)
  try { localStorage.removeItem(STORAGE_KEYS.draft); } catch {}

  toast('Formulario limpio');
}

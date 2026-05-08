/**
 * Catálogos editables de Linky · Sifrah (URLs, audiencias, formatos).
 *
 * El estado se mantiene como singleton de módulo (`config`) y se persiste
 * en localStorage bajo la key `linky_sifrah_config`. Las claves nuevas que
 * aparezcan en defaults futuros se mergean al cargar para no perder datos
 * del usuario en upgrades.
 *
 * La UI de edición (renderURLsList, addURL, etc) vive en `config-ui.js`
 * (Fase 4) — este módulo es solo estado + load/save.
 */

import { STORAGE_KEYS } from './constants.js';

/** @typedef {{ id: string, label: string, url: string, isCore?: boolean }} UrlItem */
/** @typedef {{ id: string, label: string, value: string, isCore?: boolean }} AudienciaItem */
/** @typedef {{ urls: UrlItem[], audiencias: AudienciaItem[], formatos: string[] }} ConfigShape */

/** @type {ConfigShape | null} */
let config = null;

/** Catálogos seed de Sifrah. */
export function getDefaultConfig() {
  return {
    urls: [
      { id: 'url_1', label: 'Home',                  url: 'https://sifrah.com/',                                              isCore: true },
      { id: 'url_2', label: 'Nuestras tiendas',      url: 'https://sifrah.com/pages/nuestras-tiendas',                        isCore: true },
      { id: 'url_3', label: 'Nueva colección',       url: 'https://sifrah.com/collections/nueva-coleccion',                   isCore: true },
      { id: 'url_4', label: 'Bisutería',             url: 'https://sifrah.com/collections/bisuteria',                         isCore: true },
      { id: 'url_5', label: 'Bolsos y carteras',     url: 'https://sifrah.com/collections/bolsos-y-carteras-para-mujer',      isCore: true },
      { id: 'url_6', label: 'Accesorios de cabello', url: 'https://sifrah.com/collections/accesorios-de-cabello',             isCore: true },
      { id: 'url_7', label: 'Ofertas Sifrah',        url: 'https://sifrah.com/collections/ofertas-sifrah',                    isCore: true },
    ],
    audiencias: [
      { id: 'aud_1', label: 'Lookalike (LAL)',      value: 'lal',       isCore: true },
      { id: 'aud_2', label: 'Base de datos (BBDD)', value: 'bbdd',      isCore: true },
      { id: 'aud_3', label: 'Advantage+',           value: 'advantage', isCore: true },
      { id: 'aud_4', label: 'Intereses',            value: 'intereses', isCore: true },
      { id: 'aud_5', label: 'Remarketing (RMKT)',   value: 'rmkt',      isCore: true },
    ],
    formatos: ['carrusel', 'video', 'reel', 'estatico', 'collection', 'ppl', 'link', 'story', 'imagen'],
  };
}

/**
 * Carga config desde localStorage. Si no existe, usa defaults.
 * Mergea claves de top-level que falten para soportar upgrades sin
 * romper estado del usuario.
 */
export function loadConfig() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.config);
    if (raw) {
      const parsed = JSON.parse(raw);
      const def = getDefaultConfig();
      Object.keys(def).forEach((k) => {
        if (parsed[k] === undefined) parsed[k] = def[k];
      });
      config = parsed;
    } else {
      config = getDefaultConfig();
      saveConfig();
    }
  } catch {
    config = getDefaultConfig();
  }
  return config;
}

/** Persiste el config actual a localStorage. */
export function saveConfig() {
  if (!config) return;
  try {
    localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config));
  } catch {
    /* quota o storage inaccesible — silencioso, el usuario verá que no
       persiste pero la app sigue funcionando en memoria */
  }
}

/**
 * Devuelve la referencia viva al config. Nunca devuelve null: si no se
 * llamó `loadConfig` aún, lo hace ahora.
 * @returns {ConfigShape}
 */
export function getConfig() {
  if (!config) loadConfig();
  return /** @type {ConfigShape} */ (config);
}

/** Reemplaza por completo el config actual y persiste. */
export function setConfig(next) {
  config = next;
  saveConfig();
}

/**
 * Constantes y maps de Linky · Sifrah.
 *
 * Plataformas, objetivos, división → medium auto-fill, meses cerrados
 * y la versión visible en la app. Sin estado mutable: todo lo que cambia
 * vive en config.js / history.js.
 */

/** Plataformas cerradas (key = utm_source). */
export const PLATFORM_MAP = {
  facebook: 'facebook',
  google: 'google',
  tiktok: 'tiktok',
  youtube: 'youtube',
};

/** Objetivos cerrados (key UI → abreviado para utm_content). */
export const OBJ_MAP = {
  alc: 'alc',
  rpr: 'rpr',
  traf: 'traf',
  conv: 'conv',
};

/** Etiquetas humanas de los objetivos (para validación contextual y export). */
export const OBJ_LABEL = {
  alc: 'Alcance',
  rpr: 'Reproducciones',
  traf: 'Tráfico',
  conv: 'Conversiones',
};

/** Auto-fill de utm_medium según división. */
export const DIVISION_MEDIUM_MAP = {
  branding: 'social-media',
  retail: 'social-media',
  ecom: 'social-ads',
};

/** Etiquetas humanas de las divisiones (para stats y export). */
export const DIVISION_LABEL = {
  branding: 'Branding',
  retail: 'Retail',
  ecom: 'Ecommerce',
};

/** Meses cerrados (3 letras minúsculas para utm_*). */
export const MONTHS = [
  { value: 'ene', label: 'Enero' },
  { value: 'feb', label: 'Febrero' },
  { value: 'mar', label: 'Marzo' },
  { value: 'abr', label: 'Abril' },
  { value: 'may', label: 'Mayo' },
  { value: 'jun', label: 'Junio' },
  { value: 'jul', label: 'Julio' },
  { value: 'ago', label: 'Agosto' },
  { value: 'set', label: 'Setiembre' },
  { value: 'oct', label: 'Octubre' },
  { value: 'nov', label: 'Noviembre' },
  { value: 'dic', label: 'Diciembre' },
];

/** Tag de versión (visible en consola al iniciar). */
export const VERSION_TAG = 'v0.1.0-beta';

/** Prefijo común de utm_campaign / utm_content para Sifrah. */
export const BRAND_PREFIX = 'sifrah';

/** Keys de localStorage. */
export const STORAGE_KEYS = {
  config: 'linky_sifrah_config',
  history: 'linky_sifrah_history',
  theme: 'linky_sifrah_theme',
  draft: 'linky_sifrah_draft',
};

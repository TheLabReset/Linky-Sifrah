/* ============================================
   Linky - Constantes y Estado Global
   ES Module Version
   ============================================ */

/* --- Mapeos de Plataformas --- */
export const PLATFORM_MAP = {
  facebook: { c: 'fb', n: 'facebook' },
  google: { c: 'gg', n: 'google' },
  tiktok: { c: 'tk', n: 'tiktok' },
  linkedin: { c: 'li', n: 'linkedin' },
  twitter: { c: 'tw', n: 'twitter' },
  programatica: { c: 'prog', n: 'programatica' }
};

/* --- Mapeos de Objetivos --- */
export const OBJ_MAP = {
  trafico: 'trf',
  conversiones: 'conv',
  interacciones: 'int',
  reproducciones: 'rpr',
  alcance: 'alc',
  registros: 'registros'
};

/* --- Estado Global del Historial --- */
export let utmHistory = JSON.parse(localStorage.getItem('utmHistory') || '[]');

/* --- Función para actualizar el historial (necesaria para módulos) --- */
export function setUtmHistory(newHistory) {
  utmHistory = newHistory;
}

export function getUtmHistory() {
  return utmHistory;
}

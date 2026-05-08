/**
 * Exportación del historial · Sifrah.
 *
 * - CSV: nativo, BOM UTF-8, headers en inglés (compatible con import GA4 / sheets).
 * - Excel: SheetJS via dynamic import (CDN). Headers en español, una sola hoja.
 */

import { toast } from './utils.js';
import { getHistory } from './history.js';

const CSV_HEADERS = [
  'createdAt', 'division', 'plataforma', 'medium', 'objetivo', 'audiencia',
  'formato', 'tema', 'mes', 'ano', 'version',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content',
  'urlDestino', 'urlCompleta', 'urlStatus',
];

const EXCEL_HEADERS = [
  'Fecha', 'División', 'Plataforma', 'Medium', 'Objetivo', 'Audiencia',
  'Formato', 'Tema', 'Mes', 'Año', 'Versión',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_content',
  'URL destino', 'URL etiquetada', 'Status',
];

function downloadFilename(ext) {
  return `utm_sifrah_${new Date().toISOString().split('T')[0]}.${ext}`;
}

/** Exporta historial completo a CSV con BOM UTF-8 (compatible con Excel). */
export function exportCSV() {
  const history = getHistory();
  if (!history.length) {
    toast('Sin UTMs para exportar', 'warning');
    return;
  }

  const rows = history.map((u) => CSV_HEADERS.map((k) => {
    let v = u[k];
    if (k === 'urlStatus') v = u.urlStatus ? u.urlStatus.status : '';
    return `"${String(v ?? '').replace(/"/g, '""')}"`;
  }).join(','));

  const csv = [CSV_HEADERS.join(','), ...rows].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = downloadFilename('csv');
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  toast('CSV descargado', 'success');
}

/** Exporta historial completo a Excel via SheetJS (dynamic import desde CDN). */
export async function exportExcel() {
  const history = getHistory();
  if (!history.length) {
    toast('Sin UTMs para exportar', 'warning');
    return;
  }

  try {
    toast('Cargando Excel...');
    const XLSX = await import(/* @vite-ignore */ 'https://cdn.sheetjs.com/xlsx-0.20.0/package/xlsx.mjs');

    const rows = history.map((u) => [
      new Date(u.createdAt).toLocaleString('es-PE'),
      u.division, u.plataforma, u.medium, u.objetivo, u.audiencia || '',
      u.formato, u.tema, u.mes, u.ano, u.version || '',
      u.utm_source, u.utm_medium, u.utm_campaign, u.utm_content,
      u.urlDestino, u.urlCompleta, u.urlStatus ? u.urlStatus.status : '',
    ]);

    const ws = XLSX.utils.aoa_to_sheet([EXCEL_HEADERS, ...rows]);
    ws['!cols'] = EXCEL_HEADERS.map(() => ({ wch: 18 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'UTMs Sifrah');
    XLSX.writeFile(wb, downloadFilename('xlsx'));

    toast('Excel descargado', 'success');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error exportando Excel:', err);
    toast('Error al exportar Excel · usa CSV', 'error');
  }
}

/** Conecta los botones export-csv / export-excel via data-action. */
export function setupExportListeners() {
  document.body.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (action === 'export-csv') exportCSV();
    else if (action === 'export-excel') exportExcel();
  });
}

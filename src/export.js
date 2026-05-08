/**
 * Exportación del historial · Sifrah.
 *
 * Replica el formato del archivo `UTMs Sifrah BASES.xlsx` que el equipo
 * de Sifrah ya usa en su flujo. Las primeras 7 columnas son IDÉNTICAS
 * al archivo de bases (mismos nombres exactos, incluyendo capitalización
 * y espacios). Después del bloque base se agregan 11 columnas extra
 * con la metadata que captura el Linky (fecha, división, audiencia, etc).
 *
 * Aplica a CSV y Excel para que ambos formatos sean drop-in con la
 * plantilla del equipo.
 */

import { toast } from './utils.js';
import { getHistory } from './history.js';

/* --- Headers exactos del archivo de bases (orden y casing como el original) --- */
const BASE_HEADERS = [
  'utm_campaign',
  'utm_medium',
  'utm_source',
  'utm_content',
  'URL destino',
  'URL etiquetada',
  'Bitly',
];

/* --- Headers extra del Linky, después del bloque base --- */
const EXTRA_HEADERS = [
  'fecha_creacion',
  'division',
  'plataforma',
  'objetivo',
  'audiencia',
  'formato',
  'tema',
  'mes',
  'año',
  'version',
  'status_url',
];

const ALL_HEADERS = [...BASE_HEADERS, ...EXTRA_HEADERS];

/** Construye la fila de una UTM con el orden exacto de ALL_HEADERS. */
function rowFromEntry(u) {
  return [
    // Bloque base (7 cols, orden idéntico al archivo de bases)
    u.utm_campaign ?? '',
    u.utm_medium ?? '',
    u.utm_source ?? '',
    u.utm_content ?? '',
    u.urlDestino ?? '',
    u.urlCompleta ?? '',
    '', // Bitly: vacío, en fase 2 lo poblará el acortador
    // Bloque extra (11 cols, metadata del Linky)
    u.createdAt ? new Date(u.createdAt).toLocaleString('es-PE') : '',
    u.division ?? '',
    u.plataforma ?? '',
    u.objetivo ?? '',
    u.audiencia || '',
    u.formato ?? '',
    u.tema ?? '',
    u.mes ?? '',
    u.ano ?? '',
    u.version || '',
    (u.urlStatus && u.urlStatus.status) ? u.urlStatus.status : 'pending',
  ];
}

function downloadFilename(ext) {
  return `utm_sifrah_${new Date().toISOString().split('T')[0]}.${ext}`;
}

/* ============================================
   CSV
   ============================================ */

/** Exporta a CSV con BOM UTF-8. Mismo orden y headers que el Excel. */
export function exportCSV() {
  const history = getHistory();
  if (!history.length) {
    toast('Sin UTMs para exportar', 'warning');
    return;
  }

  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const rows = history.map((u) => rowFromEntry(u).map(escape).join(','));
  // CRLF es el line ending RFC 4180 estándar y el que Excel en Windows
  // espera para celdas con saltos de línea embebidos.
  const csv = [ALL_HEADERS.map(escape).join(','), ...rows].join('\r\n');

  // BOM UTF-8 para que Excel/Sheets reconozca tildes y la "ñ"
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = downloadFilename('csv');
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);

  toast('CSV descargado', 'success');
}

/* ============================================
   Excel
   ============================================ */

/**
 * Exporta a XLSX usando SheetJS.
 * SheetJS se carga via dynamic import desde el bundle (npm package), no
 * desde CDN, así que funciona offline. Vite hace code-splitting y deja
 * SheetJS en su propio chunk que solo se descarga al hacer click en Excel.
 */
export async function exportExcel() {
  const history = getHistory();
  if (!history.length) {
    toast('Sin UTMs para exportar', 'warning');
    return;
  }

  try {
    toast('Cargando Excel...');
    const XLSX = await import('xlsx');

    const rows = history.map(rowFromEntry);
    const ws = XLSX.utils.aoa_to_sheet([ALL_HEADERS, ...rows]);

    // Anchos pensados para que no se corten URLs largas ni utm_content
    const widths = [
      { wch: 26 }, // utm_campaign
      { wch: 16 }, // utm_medium
      { wch: 14 }, // utm_source
      { wch: 60 }, // utm_content
      { wch: 50 }, // URL destino
      { wch: 70 }, // URL etiquetada
      { wch: 25 }, // Bitly
      { wch: 22 }, // fecha_creacion
      { wch: 14 }, // division
      { wch: 14 }, // plataforma
      { wch: 14 }, // objetivo
      { wch: 16 }, // audiencia
      { wch: 16 }, // formato
      { wch: 30 }, // tema
      { wch: 8 },  // mes
      { wch: 8 },  // año
      { wch: 10 }, // version
      { wch: 14 }, // status_url
    ];
    ws['!cols'] = widths;

    // Estilo del header: fondo verde Reset (#00FF85) + texto negro bold + centrado
    // SheetJS community no aplica `cell.s` al escribir XLSX (es feature de
    // SheetJS Pro). Lo dejamos seteado de todos modos: si más adelante el
    // proyecto migra a SheetJS Pro o a otra lib que lea `cell.s`, queda listo.
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r: 0, c });
      const cell = ws[addr];
      if (!cell) continue;
      cell.s = {
        fill: { fgColor: { rgb: '00FF85' } },
        font: { bold: true, color: { rgb: '000000' } },
        alignment: { horizontal: 'center', vertical: 'center' },
      };
    }

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

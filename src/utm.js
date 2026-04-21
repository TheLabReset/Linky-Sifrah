/* ============================================
   Linky - Generación de UTMs
   ES Module Version
   ============================================ */

import { PLATFORM_MAP, OBJ_MAP, utmHistory } from './constants.js';
import { toast } from './utils.js';
import { sanitize, validateText } from './form.js';
import { checkURL } from './validation.js';
import { renderHistory, updateStats } from './history.js';

/* --- Generar UTM --- */
export function generateUTM(e) {
  e.preventDefault();

  const g = id => document.getElementById(id)?.value || '';

  // Obtener valores
  const url = g('urlDestino') === 'custom' ? sanitize(g('urlCustom')) : g('urlDestino');

  // Validación de URL
  if (!url) {
    return toast('Debe ingresar una URL');
  }
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return toast('La URL debe comenzar con http:// o https://');
  }

  const division = g('division');
  const plataforma = g('plataforma');
  const medium = g('medium') || '';
  const objetivo = g('objetivo') === 'custom' ? sanitize(g('objetivoCustom')) : g('objetivo');
  const tipoCampana = g('tipoCampana') === 'custom' ? sanitize(g('campanaCustom')) : g('tipoCampana');
  const mes = g('mes');
  const ano = g('ano');
  const placement = g('placement') || '';
  const codigo = g('codigoPieza') === 'custom' ? sanitize(g('codigoCustom')) : g('codigoPieza');
  const numero = g('numeroPieza');
  const motivo = g('motivo') === 'custom' ? sanitize(g('motivoCustom')) : g('motivo');

  // Validaciones
  if (!division || !plataforma || !objetivo || !tipoCampana || !mes || !ano || !motivo) {
    return toast('Completa los campos obligatorios');
  }

  if (division === 'brand' && !codigo) {
    return toast('Falta código de pieza');
  }

  // Validar texto personalizado
  if (g('objetivo') === 'custom' && !validateText(objetivo)) {
    return toast('Objetivo contiene caracteres no permitidos');
  }
  if (g('tipoCampana') === 'custom' && !validateText(tipoCampana)) {
    return toast('Tipo de campaña contiene caracteres no permitidos');
  }
  if (g('motivo') === 'custom' && !validateText(motivo)) {
    return toast('Motivo contiene caracteres no permitidos');
  }
  if (division === 'brand' && g('codigoPieza') === 'custom' && !validateText(codigo)) {
    return toast('Código de pieza contiene caracteres no permitidos');
  }

  // Construir UTM
  const source = PLATFORM_MAP[plataforma]?.n || plataforma;
  const mediumFinal = medium || 'paid-social';
  const objetivoCode = g('objetivo') === 'custom' ? objetivo : (OBJ_MAP[objetivo] || objetivo);
  const campaign = `${division}_${objetivoCode}_${tipoCampana}_${mes}_${ano}`;

  let content = '';
  const placementPart = plataforma === 'facebook'
    ? (placement || 'META')
    : (plataforma === 'google' ? 'GOOGLE' : plataforma.toUpperCase());

  if (division === 'brand') {
    content = `brand_${codigo}_${numero}_${placementPart}_${motivo}`;
  } else {
    content = `ecom_${placementPart}_${motivo}`;
  }

  const sep = url.includes('?') ? '&' : '?';
  const params = `utm_source=${source}&utm_medium=${mediumFinal}&utm_campaign=${campaign}&utm_content=${content}`;
  const full = url + sep + params;

  // Crear entrada con estado "checking"
  const entry = {
    division,
    plataforma,
    medium: mediumFinal,
    objetivo,
    tipoCampana,
    mes,
    ano,
    placement,
    codigoPieza: codigo,
    numeroPieza: numero,
    motivo,
    urlDestino: url,
    utm_source: source,
    utm_medium: mediumFinal,
    utm_campaign: campaign,
    utm_content: content,
    urlCompleta: full,
    createdAt: new Date().toISOString(),
    urlStatus: { status: 'checking' }
  };

  utmHistory.unshift(entry);
  localStorage.setItem('utmHistory', JSON.stringify(utmHistory));

  const resultText = document.getElementById('resultText');
  const resultContainer = document.getElementById('resultContainer');
  if (resultText) resultText.textContent = full;
  if (resultContainer) resultContainer.classList.remove('hidden');

  renderHistory();
  updateStats();
  toast('UTM generada, verificando URL...');

  // Verificar URL en background
  checkURL(url).then(status => {
    entry.urlStatus = status;
    localStorage.setItem('utmHistory', JSON.stringify(utmHistory));
    renderHistory();

    if (status.status === 'ok') {
      toast('URL verificada correctamente');
    } else if (status.status === 'error') {
      toast('URL no accesible o con problemas');
    }
  });
}

/* --- Copiar UTM desde Resultado --- */
export function copyResult() {
  const t = document.getElementById('resultText')?.textContent;
  if (t) {
    navigator.clipboard.writeText(t);
    toast('Copiado al portapapeles');
  }
}

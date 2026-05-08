# 🚀 Super Prompt para Claude Code

## Implementación del repo `RUTEO-SIFRAH` a partir de `RUTEO-SF` + MVP HTML aprobado

---

## CONTEXTO DEL PROYECTO

Soy Alonso, lidero **The Lab** en **Reset**, una agencia de medios 360° en Lima. Estamos creando una nueva instancia del Linky (generador de UTMs) para el socio anunciante **Sifrah**, que se sumará a los Linky ya existentes para San Fernando y Auna.

**Punto de partida:**

1. **Repo de referencia:** `RUTEO-SF` (Linky San Fernando), que vas a tener clonado en tu workspace. Es la base de arquitectura: HTML estático + CSS plano + JS vanilla con ES Modules + Vite + Netlify. Usa el sistema de tokens Reset, 5 temas, modal de ajustes, modal de ayuda, historial con stats, export CSV/Excel, verificación de URL, toast helper.

2. **MVP aprobado:** un archivo HTML self-contained llamado `linky-sifrah-mvp-v2.html` que también vas a tener en el workspace. Este HTML tiene TODA la lógica de negocio de Sifrah ya validada por el cliente (Ros), aprobada por el equipo. Contiene CSS embebido, HTML completo, y JavaScript dividido por secciones con comentarios `// === SECCIÓN ===`. Es la **fuente de verdad para la lógica**, los catálogos, los condicionales, la sanitización, los textos.

**Lo que vamos a hacer:**

Crear un nuevo repo público en GitHub llamado `RUTEO-SIFRAH` que mantenga la **arquitectura modular del SF** (estructura de carpetas, separación de archivos JS por dominio, sistema de CSS tokens, build con Vite, deploy en Netlify), pero con la **lógica del MVP de Sifrah** (estructura UTM, catálogos, sanitización en vivo, año en content, audiencia condicional, etc).

---

## REGLAS DE COMPORTAMIENTO PARA TI (CLAUDE CODE)

1. **Trabaja por fases.** Hay 4 fases definidas más abajo. Termina una completa, espera mi OK, luego sigue. Después de cada fase haz commit con mensaje descriptivo.

2. **Lee primero, codea después.** Antes de cada fase, lee los archivos relevantes del SF y del MVP HTML. No asumas, verifica.

3. **El MVP HTML manda en lógica.** Si algo del SF contradice algo del MVP, gana el MVP. Si algo del MVP contradice algo de este prompt, pregúntame antes de seguir.

4. **No copies código del SF tal cual.** Usa SF como referencia de **patrones y arquitectura**. Pero la lógica de negocio (catálogos, sanitización, estructura UTM, condicionales) viene del MVP HTML.

5. **Migración a `addEventListener`.** El SF expone unas 50 funciones a `window.*` para `onclick="..."` inline. **No lo replicamos.** Todo el wiring de eventos va con `addEventListener` desde JS. El HTML usa atributos `data-action="..."` o `id="..."` y los listeners se enganchan en los módulos JS correspondientes durante el init.

6. **Comentarios mínimos pero útiles.** Headers de sección, explicaciones de decisiones no obvias, JSDoc en funciones públicas. No comentarios obvios tipo `// suma 1 al contador`.

7. **ES Modules nativos.** `import { x } from './y.js'` con extensión `.js` explícita. Sin TypeScript. Sin frameworks. Vanilla JS.

8. **Pregunta antes de inventar.** Si te falta info crítica, pregunta. No completes con suposiciones.

---

## DECISIONES TÉCNICAS YA CERRADAS

- **Repo público** en GitHub
- **Migrar a `addEventListener`**, sin `onclick=` inline ni `window.X = ...`
- **Arreglar los 7 bugs detectados en la auditoría** (listados abajo)
- **Mantener** la stack del SF: HTML + CSS plano + JS vanilla + Vite + Netlify
- **Mantener** el sistema de 5 temas y los tokens Reset
- **Reemplazar** logo, branding, catálogos seed por los de Sifrah
- **Tests con Vitest, refactor de generateUTM, acortador Bitly y QR code:** quedan fuera de esta versión, fase 2

---

## REGLAS DE NEGOCIO DE SIFRAH (FUENTE DE VERDAD)

### Estructura de UTM

```
utm_campaign  =  sifrah-{mes3}-{division}
utm_medium    =  social-media  (Branding/Retail) | social-ads (Ecom)   ← auto
utm_source    =  {plataforma}
utm_content   =  sifrah-{mes3}-{año2}-{division}-{obj_abrev}-[audiencia]-{formato}-{tema}-[version]
```

Donde:
- `{mes3}`: 3 letras minúsculas: ene, feb, mar, abr, may, jun, jul, ago, set, oct, nov, dic
- `{año2}`: últimos 2 dígitos del año (ej: 2026 → `26`). **Solo va en utm_content, NO en campaign.**
- `{division}`: branding, retail, ecom
- `{obj_abrev}`: alc (Alcance), rpr (Reproducciones), traf (Tráfico), conv (Conversiones)
- `{audiencia}`: **solo si división=ecom**. Sanitizado. Valores: lal, bbdd, advantage, intereses, rmkt, o custom.
- `{formato}`: input libre con autocompletado. Sanitizado.
- `{tema}`: input libre. Sanitizado.
- `{version}`: opcional, número 1-99.

### Lógica condicional

| Si | Entonces |
|---|---|
| División = `branding` o `retail` | medium = `social-media` (auto-fill, readonly) |
| División = `ecom` | medium = `social-ads` (auto-fill, readonly) |
| División = `ecom` | aparece campo Audiencia (required) |
| División ≠ `ecom` | campo Audiencia se oculta y se limpia |
| URL = `+ Personalizada` | aparece input libre debajo |
| Plataforma = `+ Personalizada` | aparece input libre debajo |
| Audiencia = `+ Personalizada` | aparece input libre debajo |

### Objetivos

Mismos para las 3 divisiones: Alcance, Reproducciones, Tráfico, Conversiones. **NO son condicionales por división.**

### Catálogos seed

**URLs precargadas (7):**
1. Home → `https://sifrah.com/`
2. Nuestras tiendas → `https://sifrah.com/pages/nuestras-tiendas`
3. Nueva colección → `https://sifrah.com/collections/nueva-coleccion`
4. Bisutería → `https://sifrah.com/collections/bisuteria`
5. Bolsos y carteras → `https://sifrah.com/collections/bolsos-y-carteras-para-mujer`
6. Accesorios de cabello → `https://sifrah.com/collections/accesorios-de-cabello`
7. Ofertas Sifrah → `https://sifrah.com/collections/ofertas-sifrah`

**Audiencias precargadas (5):** LAL, BBDD, Advantage, Intereses, RMKT (con sus valores en UTM: lal, bbdd, advantage, intereses, rmkt).

**Formatos sugeridos para autocompletado (9):** carrusel, video, reel, estatico, collection, ppl, link, story, imagen.

**Plataformas (cerrado, no editable):** Meta (FB/IG) → `facebook`, Google → `google`, TikTok → `tiktok`, YouTube → `youtube`, + Personalizar.

**Meses (cerrado):** ENE-DIC con 3 letras como valor en UTM.

**Años:** dropdown dinámico de `currentYear - 1` a `currentYear + 2`. Default = currentYear.

### Sanitización (la pieza nueva crítica)

Esta es la mejora principal sobre SF. **Tiene que estar en su propio módulo `src/sanitize.js`.**

**Dos funciones distintas:**

```js
// Para limpieza en vivo durante typing — NO trimea guiones al final
// (para que el usuario pueda seguir escribiendo después de un espacio)
sanitizeLive(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // tildes
    .replace(/ñ/g, 'n')
    .replace(/[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{2600}-\u{27BF}]/gu, '')  // emojis
    .replace(/[“”‘’]/g, '')          // comillas tipográficas
    .replace(/[—–]/g, '-')            // guiones largos
    .replace(/[^a-z0-9\s-]/g, '')   // solo alfanum, espacios, guiones
    .replace(/\s+/g, '-')           // espacios → guiones
    .replace(/-{2,}/g, '-');        // guiones repetidos
}

// Para construir la UTM final — SÍ trimea guiones extremos
sanitizeForUTM(str) {
  return sanitizeLive(str).replace(/^-+|-+$/g, '');
}
```

**Función `cleanInputLive(e)`:** se aplica en vivo a inputs específicos. Limpia el campo, preserva la posición del caret, y muestra toast contextual con throttle de 1.2s usando una función `describeChanges(original, cleaned)` que detecta qué tipo de cambio se aplicó.

**Inputs donde se aplica `cleanInputLive`:**
- `tema`
- `formato`
- `plataformaCustom`
- `audienciaCustom`
- `newAudValue` (input "Valor en UTM" del modal de Ajustes)
- `newFormato` (input del modal de Ajustes)

**Inputs donde NO se aplica:**
- URL custom (las URLs tienen `:`, `/`, `?`, `=` legítimamente)
- URL value en modal de Ajustes
- Etiquetas legibles para humanos (newUrlLabel, newAudLabel)
- Año, número de versión, dropdowns

### El MVP HTML tiene esta lógica completa y testeada

Léelo. Cópiala adaptándola a los archivos modulares. Cualquier duda, el HTML manda.

---

## LOS 7 BUGS A ARREGLAR (de la auditoría)

Cuando implementes los módulos correspondientes, aplica estas correcciones. **El MVP HTML ya las tiene aplicadas, úsalo de referencia.**

### Bug 1: `checkURL` reporta CORS como `ok` falsamente
**Archivo afectado:** `src/validation.js`
**Solución:** cuando un fetch falla por CORS, devolver `status: 'unknown'` (badge gris), NO `status: 'ok'`. Agregar `mode: 'no-cors'` al GET fallback. El historial ya soporta clase CSS `url-unknown`.

### Bug 2: URLs con `#fragment` rompen los UTMs
**Archivo afectado:** `src/utm.js` (en una función como `buildFinalURL`)
**Solución:** usar `new URL(url)` y `searchParams.set()` en vez de string concatenation. Así los UTMs se insertan ANTES del fragment automáticamente.

### Bug 3: utm_* preexistentes se duplican
**Archivo afectado:** `src/utm.js` (función `parseAndCleanURL` o similar)
**Solución:** strippear `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` con `searchParams.delete()` antes de pegar los nuevos.

### Bug 4: Empty state del historial es un div vacío
**Archivo afectado:** `src/history.js`
**Solución:** cuando `state.history.length === 0`, renderizar un mensaje con icono Lucide `inbox`, título "Sin UTMs aún" y subtítulo "Crea tu primera UTM con el formulario de la izquierda."

### Bug 5: `renderHistory` inyecta strings con `innerHTML` (riesgo XSS)
**Archivo afectado:** `src/history.js`, también `src/utils.js` (helper)
**Solución:** crear `escapeHTML(str)` en `utils.js` que escape `& < > " '`, y usarlo en TODAS las interpolaciones de `${u.utm_campaign}` y `${u.urlCompleta}`.

### Bug 6: `confirm()` y `alert()` nativos son feos
**Archivos afectados:** `index.html` (modal nuevo) + `src/modals.js` + `src/utils.js`
**Solución:** modal de confirmación propio con `<div class="modal-overlay" id="confirmModal">`. Helper `showConfirm(message, title, acceptLabel)` que retorna `Promise<boolean>`. Reemplazar TODOS los `confirm()` del SF por este helper.

### Bug 7: Sanitización no bloquea emojis ni comillas tipográficas
**Archivo afectado:** `src/sanitize.js`
**Solución:** las regex de `sanitizeLive` ya las cubren (rangos Unicode de emojis, comillas curly, guiones largos). Asegurarse de que estén.

---

## ESTRUCTURA DE ARCHIVOS ESPERADA

Cuando termines, el repo debe verse así:

```
RUTEO-SIFRAH/
├── .gitignore
├── README.md                  ← reescrito para Sifrah
├── package.json               ← name: "linky-sifrah", version: 0.1.0, brand: "Sifrah"
├── vite.config.js             ← idéntico al de SF
├── netlify.toml               ← ajustar nombre del sitio si aplica
├── index.html                 ← UI completa de Sifrah, sin onclick inline
├── linky-logo.png             ← placeholder por ahora, marcar TODO para reemplazar
│
├── css/
│   ├── variables.css          ← tokens Reset (idéntico a SF)
│   ├── themes.css             ← 5 temas (idéntico a SF)
│   ├── layout.css
│   ├── cards.css
│   ├── forms.css
│   ├── navigation.css
│   ├── history.css            ← incluir clase .url-unknown nueva
│   ├── modals.css             ← incluir estilos del confirm modal nuevo
│   ├── config.css
│   ├── utilities.css
│   └── responsive.css
│
└── src/
    ├── main.js                ← entry point: import + DOMContentLoaded + setup wiring
    ├── constants.js           ← PLATFORM_MAP, OBJ_MAP, DIVISION_MEDIUM_MAP, MESES, etc.
    ├── config.js              ← getDefaultConfig() + loadConfig + saveConfig + setupConfigModal
    ├── sanitize.js            ← NUEVO: sanitizeLive + sanitizeForUTM + cleanInputLive + describeChanges
    ├── utils.js               ← $() + toast + escapeHTML + uid + showConfirm + refreshIcons
    ├── form.js                ← setupFormListeners + populate selects + readForm
    ├── utm.js                 ← buildCampaign + buildContent + buildFinalURL + parseAndCleanURL + generateUTM + copyResult + resetForm
    ├── validation.js          ← checkURL (con fix CORS)
    ├── history.js             ← renderHistory + updateStats + copyFromHistory + deleteFromHistory + clearHistory + empty state
    ├── export.js              ← exportCSV + exportExcel
    ├── theme.js               ← loadTheme + changeTheme + setupThemeListeners
    └── modals.js              ← openHelp/closeHelp + openConfigModal/closeConfigModal + switchConfigTab + showConfirm
```

---

## LAS 4 FASES DE IMPLEMENTACIÓN

### 🟦 FASE 1: Scaffolding + CSS

**Objetivo:** estructura del repo lista, todo el CSS portado y adaptado.

**Tareas:**
1. Lee `RUTEO-SF/package.json`, `vite.config.js`, `netlify.toml`, `.gitignore`, `README.md` para entender la base.
2. Crea la estructura de carpetas (`css/`, `src/`) y el `.gitignore`.
3. Copia `vite.config.js` tal cual (nombre del proyecto se actualiza).
4. Crea `package.json` adaptado: `name: "linky-sifrah"`, `description: "Generador de UTMs para Sifrah - Reset Agency"`, `config.brand: { name: "Sifrah", code: "SIFRAH" }`, version `0.1.0-beta`.
5. Crea `netlify.toml` con la misma config de SF.
6. Crea `README.md` nuevo para Sifrah, con:
   - Descripción
   - Stack (HTML + CSS + JS vanilla + Vite + Netlify)
   - Comandos: `npm install`, `npm run dev`, `npm run build`
   - Estructura de carpetas
   - Reglas de UTM Sifrah
   - Sistema de catálogos editables
   - Lista de temas disponibles
7. Copia los 11 archivos CSS de `RUTEO-SF/css/` a `RUTEO-SIFRAH/css/`. Lee cada uno y verifica que esté completo.
8. Aplica los siguientes ajustes al CSS:
   - En `history.css`: agregar `.utm-item.url-unknown { border-left-color: var(--muted); }` y `.url-status-badge.unknown { background: rgba(170,170,170,0.15); color: var(--muted); }`
   - En `modals.css`: si no existe ya, agregar estilos para el modal de confirmación (`#confirmModal` con `max-width: 440px`).
   - En `forms.css`: verificar que existe `.beta-badge` con buen estilo (basado en el MVP HTML); si no, agregarlo.
   - En `cards.css`: verificar que `.brand-title { display: flex; align-items: center; gap: 12px; }` existe; si no, agregarlo.

**Validación al cerrar la fase:**
- `npm install && npm run dev` debe levantar Vite sin errores (aunque la app aún no funcione porque falta JS).
- Hacer commit: `feat: scaffolding inicial + CSS portado desde SF`

**Espera mi OK antes de seguir a la Fase 2.**

---

### 🟩 FASE 2: HTML + Constants + Utils + Sanitize

**Objetivo:** UI estática completa + helpers básicos + módulo de sanitización.

**Tareas:**

1. Lee `linky-sifrah-mvp-v2.html` completo. Identifica:
   - El bloque `<header>` con el badge BETA
   - El form completo con sus IDs y campos condicionales
   - El result box (sin desglose, solo URL final + botón Copiar)
   - El historial con stats (4 cards: Total, Branding, Retail, Ecom)
   - Los 3 modales (help, config con 3 tabs, confirm)
   - El botón flotante de ayuda
   - El footer

2. Crea `index.html` portando esa estructura, con estos cambios obligatorios:
   - **Sin un solo `onclick="..."` inline.** Reemplazar por `id="..."` o `data-action="..."`.
   - **Sin `<script>` inline para lógica.** Solo `<script type="module" src="./src/main.js"></script>` al final.
   - Cargar Lucide vía `<script src="https://unpkg.com/lucide@latest"></script>` igual que SF.
   - Cargar Bebas Neue + Montserrat de Google Fonts.
   - Importar los 11 CSS con `<link rel="stylesheet" href="./css/X.css">`.
   - Mantener el badge `<span class="beta-badge">BETA</span>` al lado del `<h1>LINKY</h1>`.
   - Branding: "RESET — Sifrah" en el subtítulo.
   - Title de la página: `Linky · RESET 2026 Sifrah`.

3. Crea `src/constants.js`:
   - `PLATFORM_MAP` (Sifrah: facebook, google, tiktok, youtube)
   - `OBJ_MAP` (alc, rpr, traf, conv)
   - `DIVISION_MEDIUM_MAP` (branding/retail → social-media, ecom → social-ads)
   - `MONTHS` (array con `value` y `label` de los 12 meses)
   - `VERSION_TAG = 'v0.1-beta'`

4. Crea `src/sanitize.js`:
   - Export `sanitizeLive(str)`
   - Export `sanitizeForUTM(str)`
   - Export `describeChanges(original, cleaned)` que retorna array de strings descriptivos
   - Export `cleanInputLive(e)` que aplica la limpieza, preserva caret, dispara toast con throttle
   - Variable interna `lastCleanupToast` para el throttle
   - Función `showCleanupToast(messages)` que llama al toast del módulo utils

5. Crea `src/utils.js`:
   - `$ = (id) => document.getElementById(id)`
   - `toast(msg, type)` con type opcional ('error', 'warning', 'success')
   - `escapeHTML(str)` para prevenir XSS
   - `uid(prefix)` para generar IDs únicos
   - `refreshIcons()` que llama a `lucide.createIcons()` si está disponible
   - `showConfirm(message, title, acceptLabel, danger)` que retorna Promise<boolean> usando el modal `#confirmModal`. Maneja también el cierre con Escape.

6. En `src/main.js` (esqueleto por ahora):
   ```js
   import './sanitize.js';  // por ahora solo verificar que importa
   import { refreshIcons } from './utils.js';
   
   document.addEventListener('DOMContentLoaded', () => {
     refreshIcons();
     console.log('Linky Sifrah · scaffolding OK');
   });
   ```

**Validación al cerrar la fase:**
- `npm run dev` levanta la app.
- Se ve el header, el form, el historial vacío, los modales (que aún no se abren porque falta lógica) — pero todos los estilos correctos.
- Consola muestra "Linky Sifrah · scaffolding OK".
- Sin errores de JS en consola.
- Hacer commit: `feat: HTML estático + constants + utils + sanitize module`

**Espera mi OK antes de seguir a la Fase 3.**

---

### 🟨 FASE 3: Lógica core (config + form + utm + validation)

**Objetivo:** la app genera UTMs correctamente. Sin historial, sin export aún.

**Tareas:**

1. Crea `src/config.js`:
   - `getDefaultConfig()` que retorna `{ urls: [...7], audiencias: [...5], formatos: [...9] }` con los valores seed de Sifrah listados arriba.
   - `loadConfig()` que carga de `localStorage.linky_sifrah_config` o usa default. Hacer merge con defaults para nuevas keys.
   - `saveConfig(config)` que persiste a localStorage.
   - Export del state interno (`state.config`) o un getter `getConfig()`.

2. Crea `src/validation.js`:
   - `checkURL(url)` con HEAD → GET fallback con timeout 8s.
   - **Aplicar el bug fix:** CORS bloqueado retorna `{ status: 'unknown', code: 'CORS', message: 'No verificable (CORS)' }`. NO 'ok'.
   - Retorna `{ status, code, message }`.

3. Crea `src/utm.js`:
   - `parseAndCleanURL(rawUrl)` que usa `new URL()`, strippea utm_* preexistentes con `searchParams.delete()`, retorna `{ ok, href, ... }` o `{ ok: false, error }`.
   - `buildFinalURL(rawUrl, params)` que usa `new URL()` + `searchParams.set()` para preservar fragments correctamente.
   - `buildCampaign(mes, division)` → `sifrah-{mes}-{division}`.
   - `buildContent({ mes, ano, division, objetivo, audiencia, formato, tema, version })` → `sifrah-{mes}-{año2}-{division}-{obj}-...`. Año a 2 dígitos con `String(ano).slice(-2)`.
   - `generateUTM(formData)` que orquesta todo: validaciones, sanitización, build, retorna `{ entry, fullUrl }` o lanza errores específicos.
   - `copyResult(text)` con feedback visual.
   - `resetForm()` que limpia el form y oculta condicionales.

4. Crea `src/form.js`:
   - `populateURLsSelect()`, `populateAudienciasSelect()`, `populateFormatList()`, `populateYearSelect()`, `populateMonthDefault()`.
   - `readForm()` que lee todos los campos y retorna el objeto.
   - `getValue(selectId, customId)` para campos con opción custom.
   - `setupFormListeners()`:
     - URL: toggle custom
     - División: auto-fill medium + toggle audiencia (animación slideDown)
     - Plataforma: toggle custom
     - Audiencia: toggle custom
     - Aplicar `cleanInputLive` a los 4 campos del form (tema, formato, plataformaCustom, audienciaCustom)
     - Submit del form llama a `generateUTM` desde utm.js
   - **Todo con `addEventListener`. Sin onclick inline.**

5. Actualiza `src/main.js`:
   ```js
   import { loadConfig } from './config.js';
   import { setupFormListeners, populateURLsSelect, populateAudienciasSelect, populateFormatList, populateYearSelect, populateMonthDefault } from './form.js';
   import { refreshIcons } from './utils.js';
   
   document.addEventListener('DOMContentLoaded', () => {
     loadConfig();
     populateURLsSelect();
     populateAudienciasSelect();
     populateFormatList();
     populateYearSelect();
     populateMonthDefault();
     setupFormListeners();
     refreshIcons();
     console.log('Linky Sifrah · core OK');
   });
   ```

**Validación al cerrar la fase:**
- Generar una UTM completa funciona. Aparece la URL final en el result box, botón Copiar copia.
- Probar con URL que ya tiene `?utm_source=test` → strippea el preexistente.
- Probar con URL que tiene `#fragment` → UTMs antes del fragment.
- División = Ecom → aparece audiencia. División ≠ Ecom → desaparece.
- Tema con tildes/ñ/espacios/emojis → limpia en vivo y muestra toast contextual.
- Hacer commit: `feat: lógica core de generación de UTMs`

**Espera mi OK antes de seguir a la Fase 4.**

---

### 🟪 FASE 4: Historial + Export + Theme + Modales + Pulido final

**Objetivo:** app 100% funcional, lista para deploy.

**Tareas:**

1. Crea `src/history.js`:
   - State interno `state.history` cargado de `localStorage.linky_sifrah_history`.
   - `loadHistory()`, `saveHistory()`.
   - `addToHistory(entry)` que hace unshift y persiste.
   - `renderHistory()` con escapeHTML en TODAS las interpolaciones. Empty state con icono inbox.
   - `updateStats()` con 4 cards: total, branding, retail, ecom.
   - `copyFromHistory(idx)`.
   - `deleteFromHistory(idx)` usando `showConfirm` (no `confirm()` nativo).
   - `clearHistory()` usando `showConfirm`.
   - `setupHistoryListeners()` que delega clicks en los botones de copiar/eliminar usando `data-action` o querySelectorAll.

2. Crea `src/export.js`:
   - `exportCSV()` con todos los campos del entry, BOM UTF-8.
   - `exportExcel()` con dynamic import de SheetJS, headers en español.
   - `setupExportListeners()`.

3. Crea `src/theme.js`:
   - `loadTheme()`, `changeTheme(theme)`, `toggleThemeMenu()`.
   - `setupThemeListeners()` para los 5 botones de tema y el botón de toggle.
   - Cierre del menu al click fuera.
   - Persistencia en `localStorage.linky_sifrah_theme`.

4. Crea `src/modals.js`:
   - `openHelp` / `closeHelp`.
   - `openConfigModal` / `closeConfigModal` / `switchConfigTab(tab)`.
   - `setupModalListeners()` para cierre con click en overlay, click en `.modal-close`, tecla Escape, tabs del config modal.
   - **NO duplicar** `showConfirm`, ya está en utils.js. Solo asegurarse de que el modal `#confirmModal` cierra correctamente con Escape.

5. Crea `src/config-ui.js` (o agregar al config.js existente):
   - `renderURLsList`, `addURL`, `deleteURL`.
   - `renderAudienciasList`, `addAudience`, `deleteAudience`.
   - `renderFormatosList`, `addFormato`, `deleteFormato`.
   - `resetConfig` con showConfirm.
   - `setupConfigUIListeners()`.
   - Aplicar `cleanInputLive` a `newAudValue` y `newFormato`.

6. Actualiza `src/main.js` con todos los imports y setups:
   ```js
   import { loadConfig } from './config.js';
   import { loadHistory, renderHistory, updateStats, setupHistoryListeners } from './history.js';
   import { setupFormListeners, /* populates */ } from './form.js';
   import { loadTheme, setupThemeListeners } from './theme.js';
   import { setupModalListeners } from './modals.js';
   import { setupExportListeners } from './export.js';
   import { setupConfigUIListeners } from './config-ui.js';
   import { refreshIcons } from './utils.js';
   import { VERSION_TAG } from './constants.js';
   
   document.addEventListener('DOMContentLoaded', () => {
     loadConfig();
     loadHistory();
     // populates
     setupFormListeners();
     setupHistoryListeners();
     setupExportListeners();
     setupThemeListeners();
     setupModalListeners();
     setupConfigUIListeners();
     loadTheme();
     renderHistory();
     updateStats();
     refreshIcons();
     console.log(`Linky Sifrah inicializado · ${VERSION_TAG}`);
   });
   ```

7. Smoke test completo:
   - [ ] Generar UTM en cada división
   - [ ] Verificación de URL muestra status correcto (incluyendo `unknown` en CORS)
   - [ ] Audiencia aparece/desaparece según división
   - [ ] Personalizada en URL, plataforma, audiencia funciona
   - [ ] Limpieza en vivo en tema, formato, plataformaCustom, audienciaCustom funciona
   - [ ] Toast aparece con mensaje contextual
   - [ ] Caret se preserva tras la limpieza
   - [ ] Historial muestra UTMs con badge de status correcto
   - [ ] Stats actualizan al agregar/eliminar
   - [ ] Empty state se muestra con 0 UTMs
   - [ ] Copiar desde resultado y desde historial funcionan
   - [ ] Eliminar UTM con modal de confirmación propio (no confirm() nativo)
   - [ ] Limpiar historial con confirmación
   - [ ] Export CSV descarga archivo válido
   - [ ] Export Excel descarga archivo válido
   - [ ] Cambiar tema persiste y aplica visualmente
   - [ ] Modal de ayuda abre y cierra (overlay click, Escape, X)
   - [ ] Modal de ajustes abre y permite agregar/eliminar URLs, audiencias, formatos
   - [ ] Restaurar defaults funciona con confirmación
   - [ ] No hay errores en consola
   - [ ] No hay onclick="..." inline en index.html (verificar con `grep "onclick=" index.html` → debe dar 0 resultados)
   - [ ] No hay `window.X = ...` en ningún src/*.js (verificar con grep)

8. Hacer commit final: `feat: historial + export + temas + modales + QA pasado`

9. Hacer build de producción: `npm run build`. Verificar que sale sin errores.

**Cuando termines la Fase 4, dame:**
- Resumen de lo implementado
- Lista de cualquier desviación del plan original (si algo salió distinto, explicar por qué)
- Cualquier pendiente o TODO que detectes
- Comando para conectar a Netlify cuando yo cree el sitio

---

## REGLAS DE CALIDAD

### Naming
- Variables y funciones en `camelCase`
- Constantes globales en `UPPER_SNAKE_CASE`
- Archivos en `kebab-case` o single-word lowercase (`form.js`, `config-ui.js`)

### Imports
- Siempre con extensión `.js` explícita en imports relativos
- Usar destructuring named imports
- No `default exports` salvo casos muy específicos

### Listeners
- Siempre `addEventListener`, nunca `onclick=` inline ni `el.onclick = ...`
- Si hay muchos elementos similares, considerar event delegation sobre el contenedor padre
- Cleanup de listeners NO requerido (la app es de un solo render)

### Seguridad
- `escapeHTML` en TODA interpolación de strings de usuario en `innerHTML`
- Nunca usar `innerHTML` con strings directos de inputs
- URLs siempre validadas con `new URL()` antes de manipular

### Estilo de código
- 2 espacios de indentación
- Punto y coma siempre
- Comillas simples para strings, backticks para template literals
- Arrow functions para callbacks cortos, function declarations para funciones públicas

### Git
- Un commit por fase mínimo
- Mensajes en formato conventional: `feat:`, `fix:`, `chore:`, `docs:`
- En español o inglés, consistente

---

## ARCHIVOS DE REFERENCIA EN EL WORKSPACE

Tendrás acceso a:

1. **`RUTEO-SF/`** — repo completo de San Fernando como referencia de arquitectura.
2. **`linky-sifrah-mvp-v2.html`** — MVP aprobado con la lógica de Sifrah.

**Recuerda:** SF para arquitectura, MVP para lógica. Si conflicto, pregunta.

---

## FUERA DE ALCANCE (NO HACER)

- ❌ Tests con Vitest (fase 2)
- ❌ Refactor de generateUTM en pasos puros (fase 2)
- ❌ Acortador Bitly o similar (fase 2)
- ❌ QR code generator (fase 2)
- ❌ Subir a Netlify (lo hago yo)
- ❌ Crear el repo en GitHub (lo hago yo, después de tu trabajo)
- ❌ Optimizar el `linky-logo.png` (lo hago yo, déjalo como placeholder con un TODO)
- ❌ Tour onboarding interactivo (no estaba en el MVP)
- ❌ i18n (todo en español)

---

## INICIO

Empieza leyendo:
1. `RUTEO-SF/package.json` y `RUTEO-SF/vite.config.js`
2. `RUTEO-SF/index.html` (estructura)
3. `RUTEO-SF/src/main.js` (entry point pattern)
4. El header del MVP HTML (`linky-sifrah-mvp-v2.html`) para ver branding + badge BETA

Y dime: "Listo para empezar la Fase 1, ¿procedo?"

Cuando confirme, arranca con la Fase 1 y termina solo cuando todos sus criterios estén cumplidos.

🚀

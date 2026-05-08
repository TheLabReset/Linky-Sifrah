# Linky · Sifrah

Generador de UTMs para Sifrah, desarrollado por **Reset Agency** (The Lab).

Versión: `v0.1.0-beta`

---

## Descripción

Linky-Sifrah es una herramienta web para generar URLs con parámetros UTM consistentes para las campañas de Sifrah en Meta, Google, TikTok y YouTube. Construye `utm_campaign`, `utm_medium`, `utm_source` y `utm_content` siguiendo la convención acordada con el cliente, sanitiza los inputs en vivo, valida URLs y mantiene un historial local con stats por división.

---

## Stack

- **HTML estático** + **CSS plano** con tokens del sistema Reset
- **JavaScript vanilla** con ES Modules nativos
- **Vite** para dev server y build
- **Netlify** para deploy
- Sin frameworks, sin TypeScript, sin dependencias en runtime

---

## Comandos

```bash
npm install        # instalar dependencias
npm run dev        # dev server en http://localhost:3000
npm run build      # build de producción a /dist
npm run preview    # preview del build
```

---

## Estructura de carpetas

```
.
├── index.html              UI completa, sin JS inline
├── linky-logo.png          logo (placeholder, pendiente reemplazo)
├── package.json
├── vite.config.js
├── netlify.toml
│
├── css/
│   ├── variables.css       tokens Reset (color, spacing, tipografía)
│   ├── themes.css          5 temas: dark, light, ocean, forest, pink
│   ├── layout.css
│   ├── cards.css
│   ├── forms.css
│   ├── navigation.css
│   ├── history.css
│   ├── modals.css
│   ├── config.css
│   ├── utilities.css
│   └── responsive.css
│
└── src/
    ├── main.js             entry point: imports + DOMContentLoaded
    ├── constants.js        PLATFORM_MAP, OBJ_MAP, DIVISION_MEDIUM_MAP, MONTHS, VERSION_TAG
    ├── config.js           catálogos editables + persistencia + UI del modal
    ├── sanitize.js         sanitizeLive, sanitizeForUTM, cleanInputLive, describeChanges
    ├── utils.js            $, toast, escapeHTML, uid, refreshIcons, showConfirm
    ├── form.js             populates, listeners, readForm
    ├── utm.js              buildCampaign, buildContent, buildFinalURL, parseAndCleanURL, generateUTM
    ├── validation.js       checkURL (con manejo correcto de CORS)
    ├── history.js          render, stats, copy, delete, empty state
    ├── export.js           exportCSV, exportExcel
    ├── theme.js            loadTheme, changeTheme, listeners
    └── modals.js           open/close help, config, confirm
```

---

## Reglas de UTM

```
utm_campaign  =  sifrah-{mes3}-{division}
utm_medium    =  social-media   (branding/retail)
                 social-ads     (ecom)
utm_source    =  {plataforma}
utm_content   =  sifrah-{mes3}-{año2}-{division}-{obj_abrev}-[audiencia]-{formato}-{tema}-[version]
```

Componentes:

| Token            | Valores                                                                          |
|------------------|----------------------------------------------------------------------------------|
| `{mes3}`         | `ene, feb, mar, abr, may, jun, jul, ago, set, oct, nov, dic`                     |
| `{año2}`         | últimos 2 dígitos del año (ej: 2026 → `26`). Solo en `utm_content`.              |
| `{division}`     | `branding`, `retail`, `ecom`                                                     |
| `{obj_abrev}`    | `alc` (Alcance), `rpr` (Reproducciones), `traf` (Tráfico), `conv` (Conversiones) |
| `{audiencia}`    | solo si división = `ecom`. Valores: `lal`, `bbdd`, `advantage`, `intereses`, `rmkt` o custom |
| `{formato}`      | input libre con autocompletado, sanitizado                                       |
| `{tema}`         | input libre, sanitizado                                                          |
| `{version}`      | opcional, número 1–99                                                            |

### Lógica condicional

| Si...                              | Entonces...                                          |
|------------------------------------|------------------------------------------------------|
| División = `branding` o `retail`   | `medium = social-media` (auto-fill, readonly)        |
| División = `ecom`                  | `medium = social-ads` (auto-fill, readonly)          |
| División = `ecom`                  | aparece campo Audiencia (required)                   |
| División ≠ `ecom`                  | el campo Audiencia se oculta y se limpia             |
| URL = `+ Personalizada`            | aparece input libre debajo                           |
| Plataforma = `+ Personalizada`     | aparece input libre debajo                           |
| Audiencia = `+ Personalizada`      | aparece input libre debajo                           |

### Sanitización

Todo input libre que entra al UTM se procesa con dos funciones:

- `sanitizeLive(str)`: limpieza en vivo durante el typing. Pasa a minúsculas, quita tildes, ñ, emojis, comillas tipográficas, normaliza guiones largos, deja solo `[a-z0-9\-]`, convierte espacios a guiones, colapsa guiones repetidos. **No** trimea guiones extremos para no interrumpir al usuario.
- `sanitizeForUTM(str)`: aplica `sanitizeLive` y además trimea guiones de los extremos. Es la función que se usa al construir el UTM final.

Inputs con limpieza en vivo: `tema`, `formato`, `plataformaCustom`, `audienciaCustom`, `newAudValue`, `newFormato`.

---

## Sistema de catálogos editables

Todo lo siguiente se gestiona desde el modal **Ajustes** y se persiste en `localStorage`:

- **URLs precargadas** (7 seeds): home, nuestras tiendas, nueva colección, bisutería, bolsos y carteras, accesorios de cabello, ofertas Sifrah.
- **Audiencias** (5 seeds): LAL, BBDD, Advantage, Intereses, RMKT.
- **Formatos sugeridos** (9 seeds): carrusel, video, reel, estatico, collection, ppl, link, story, imagen.

Plataformas, meses y objetivos están cerrados (no editables desde la UI).

---

## Temas disponibles

5 temas predefinidos (cambiables desde el dropdown del header):

- **Dark** — verde neón sobre negro (default Reset)
- **Light** — verde sobre blanco
- **Ocean** — cyan sobre azul oscuro
- **Forest** — verde bosque sobre fondo verde oscuro
- **Pink** — magenta sobre fondo vino

El tema seleccionado se persiste en `localStorage.linky_sifrah_theme`.

---

## Persistencia (localStorage keys)

| Key                     | Contenido                                        |
|-------------------------|--------------------------------------------------|
| `linky_sifrah_config`   | catálogos editables (URLs, audiencias, formatos) |
| `linky_sifrah_history`  | historial de UTMs generadas                      |
| `linky_sifrah_theme`    | tema seleccionado                                |

---

## Deploy

El proyecto se despliega como sitio estático en Netlify a partir de `dist/`. El `netlify.toml` ya tiene la configuración de cache headers, redirects y procesamiento.

---

## Licencia

MIT — Reset Agency

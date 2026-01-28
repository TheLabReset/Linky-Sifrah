# Linky — Generador de UTMs Profesional

<p align="center">
  <img src="linky-logo.png" alt="Linky Logo" width="200">
</p>

<p align="center">
  <strong>Herramienta web para la generación automatizada de parámetros UTM para campañas digitales</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.1.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/vite-5.4.0-purple" alt="Vite">
  <img src="https://img.shields.io/badge/javascript-ES%20Modules-yellow" alt="ES Modules">
</p>

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características Principales](#características-principales)
- [Instalación](#instalación)
- [Comandos](#comandos)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Guía de Uso](#guía-de-uso)
  - [Generar UTM](#generar-utm)
  - [Diferencias Brand vs Ecommerce](#diferencias-brand-vs-ecommerce)
  - [Plataformas Soportadas](#plataformas-soportadas)
  - [Objetivos de Campaña](#objetivos-de-campaña)
- [Módulos y Funciones](#módulos-y-funciones)
  - [main.js](#mainjs---entry-point)
  - [config.js](#configjs---sistema-de-configuración)
  - [utm.js](#utmjs---generación-de-utms)
  - [form.js](#formjs---gestión-del-formulario)
  - [history.js](#historyjs---gestión-del-historial)
  - [theme.js](#themejs---gestión-de-temas)
  - [validation.js](#validationjs---validación-de-urls)
  - [export.js](#exportjs---exportación-de-datos)
  - [constants.js](#constantsjs---constantes-globales)
  - [utils.js](#utilsjs---utilidades)
  - [modals.js](#modalsjs---control-de-modales)
- [Sistema de Temas](#sistema-de-temas)
- [Validación de URLs](#validación-de-urls)
- [Exportación de Datos](#exportación-de-datos)
- [Sistema de Configuración](#sistema-de-configuración)
- [Estructura de Datos](#estructura-de-datos)
- [Arquitectura Técnica](#arquitectura-técnica)
- [Arquitectura CSS](#arquitectura-css)
- [Adaptar para Otra Marca](#adaptar-para-otra-marca)
- [Configuración por Defecto](#configuración-por-defecto-san-fernando)
- [Troubleshooting](#troubleshooting)
- [Tecnologías](#tecnologías)

---

## Descripción General

**Linky** es una herramienta web profesional para la generación automatizada de parámetros UTM (Urchin Tracking Module) diseñada para equipos de marketing digital. Permite crear URLs de rastreo personalizadas con parámetros UTM consistentes para Google Analytics 4 y Looker Studio.

### Características clave:
- **100% Cliente-Side**: Sin backend requerido, funciona completamente en el navegador
- **Arquitectura Modular**: Código JavaScript organizado en módulos ES6
- **Persistencia Local**: Datos guardados en localStorage del navegador
- **Diseño Responsivo**: Adaptable a desktop, tablet y móvil
- **Multi-tema**: 5 temas visuales personalizables

### Para quién es:
- Equipos de marketing digital
- Agencias de publicidad
- Growth hackers
- Analistas de datos
- Gestores de campañas publicitarias

---

## Características Principales

### Generación de UTMs
- Creación de URLs con parámetros UTM personalizados
- Soporte para dos divisiones: **Brand** y **Ecommerce**
- Generación automática basada en: plataforma, objetivo, campaña, mes, año, motivo
- Validación de campos obligatorios
- Limpieza automática de caracteres especiales

### 5 Temas Visuales
| Tema | Descripción | Color Primario |
|------|-------------|----------------|
| **Dark** | Negro + Verde neón (por defecto) | `#00FF85` |
| **Light** | Gris claro + Verde oscuro | `#00996B` |
| **Ocean Blue** | Azul profundo + Cyan | `#00B4D8` |
| **Forest Green** | Verde bosque + Verde claro | `#2E7D32` |
| **Pink** | Negro + Magenta | `#D81B60` |

### Historial de UTMs
- Almacenamiento persistente en localStorage
- Copiar URLs individuales o masivamente
- Eliminar entradas específicas o limpiar todo
- Estadísticas en tiempo real (Total, Brand, Ecommerce)
- Estado de validación de cada URL

### Exportación de Datos
- **CSV**: Descarga directa con todos los campos
- **Excel**: Archivo con estilos profesionales (headers, colores alternos, anchos optimizados)

### Sistema de Configuración
- URLs predeterminadas personalizables
- Campañas custom (con protección de valores core)
- Motivos/creatividades editables
- Códigos Brand específicos
- Restauración a valores por defecto

### Validación Automática de URLs
- Verificación de accesibilidad con petición HEAD
- Fallback a petición GET si HEAD falla
- Timeout de 8 segundos
- Estados: OK, Redirect, Error, Checking, CORS

### Características Adicionales
- Modal de ayuda interactivo con documentación
- Responsive design (mobile-first)
- Sin dependencias de runtime
- Deploy listo para Netlify

---

## Instalación

### Requisitos Previos
- **Node.js** 18.0.0 o superior
- **npm** 9.0.0 o superior
- Navegador moderno con soporte ES Modules

### Setup Local

```bash
# Clonar repositorio
git clone <repository-url>
cd Linky

# Instalar dependencias
npm install
```

---

## Comandos

```bash
# Desarrollo con hot reload (http://localhost:3000)
npm run dev

# Build de producción optimizado
npm run build

# Preview del build de producción
npm run preview
```

### Descripción de comandos:

| Comando | Descripción | Output |
|---------|-------------|--------|
| `npm run dev` | Inicia servidor de desarrollo Vite con hot reload | http://localhost:3000 |
| `npm run build` | Genera build optimizado para producción | Carpeta `dist/` |
| `npm run preview` | Sirve el build de producción localmente | http://localhost:4173 |

---

## Estructura del Proyecto

```
Linky/
├── index.html                    # Página HTML principal (SPA)
├── package.json                  # Configuración npm y metadata
├── package-lock.json             # Lock de versiones de dependencias
├── vite.config.js                # Configuración de Vite (bundler)
├── netlify.toml                  # Configuración de deploy en Netlify
├── .gitignore                    # Archivos ignorados por Git
├── README.md                     # Esta documentación
├── Identidad Visual Reset.md    # Guía de diseño de Reset Agency
├── linky-logo.png               # Logo de la aplicación
│
├── src/                          # Código fuente JavaScript (ES Modules)
│   ├── main.js                   # Entry point e inicialización
│   ├── constants.js              # Constantes y mapeos globales
│   ├── config.js                 # Sistema de configuración completo
│   ├── utm.js                    # Motor de generación de UTMs
│   ├── form.js                   # Lógica y validación del formulario
│   ├── history.js                # CRUD del historial de UTMs
│   ├── theme.js                  # Gestión de temas visuales
│   ├── validation.js             # Validación asíncrona de URLs
│   ├── export.js                 # Exportación CSV y Excel
│   ├── utils.js                  # Funciones auxiliares (toast)
│   └── modals.js                 # Control de modales de ayuda
│
├── css/                          # Estilos modulares
│   ├── variables.css             # Variables CSS (design tokens)
│   ├── themes.css                # Definición de 5 temas
│   ├── layout.css                # Layout base y grid
│   ├── navigation.css            # Barra de navegación
│   ├── forms.css                 # Inputs, selects, botones
│   ├── cards.css                 # Componentes card
│   ├── history.css               # Estilos del historial
│   ├── config.css                # Modal de configuración
│   ├── modals.css                # Estilos de modales
│   ├── utilities.css             # Utilidades y estados
│   └── responsive.css            # Media queries responsivas
│
└── dist/                         # Build de producción (generado)
```

---

## Guía de Uso

### Generar UTM

1. **Seleccionar URL de destino**
   - Elige de la lista predeterminada o escribe URL personalizada
   - La URL debe comenzar con `http://` o `https://`

2. **Elegir División**
   - **Brand**: Para campañas de marca (requiere código y número de pieza)
   - **Ecommerce**: Para campañas de conversión directa

3. **Seleccionar Plataforma**
   - Meta, Google Ads, TikTok, LinkedIn, X, Programática
   - El Medium se genera automáticamente según la plataforma

4. **Definir Objetivo y Campaña**
   - Objetivo: Tráfico, Conversiones, Interacciones, Reproducciones, Alcance
   - Campaña: De la lista o personalizada

5. **Completar campos adicionales**
   - Mes y Año
   - Motivo/Creatividad
   - Placement (para Meta)
   - Código y Número de Pieza (solo Brand)

6. **Click en "GENERAR UTM"**
   - La URL completa se muestra en el resultado
   - Click en el icono de copiar para copiar al portapapeles
   - La UTM se guarda automáticamente en el historial

### Diferencias Brand vs Ecommerce

| Característica | Brand | Ecommerce |
|---------------|-------|-----------|
| **Propósito** | Campañas de marca y awareness | Campañas de conversión directa |
| **Código de Pieza** | Requerido (AON, NAB2B, etc.) | No aplica |
| **Número de Pieza** | Requerido (01-30) | No aplica |
| **Prefijo utm_content** | `brand_` | `ecom_` |
| **Estructura campaign** | `brand_[obj]_[camp]_[mes]_[año]` | `ecommerce_[obj]_[camp]_[mes]_[año]` |
| **Estructura content** | `brand_[cod]_[num]_[place]_[mot]` | `ecom_[place]_[mot]` |

**Ejemplo Brand:**
```
utm_source=facebook
utm_medium=paid-social
utm_campaign=brand_conv_AON_OCTUBRE_2025
utm_content=brand_AON_01_META_pollo
```

**Ejemplo Ecommerce:**
```
utm_source=facebook
utm_medium=paid-social
utm_campaign=ecommerce_conv_AON_OCTUBRE_2025
utm_content=ecom_META_pollo
```

### Plataformas Soportadas

| Plataforma | Código | utm_source | utm_medium |
|------------|--------|------------|------------|
| **Meta** (Facebook/Instagram) | fb | facebook | paid-social |
| **Google Ads** | gg | google | cpc / display / video / pmax |
| **TikTok** | tk | tiktok | paid-social |
| **LinkedIn** | li | linkedin | paid-social |
| **X** (Twitter) | tw | twitter | paid-social |
| **Programática** | pr | programatica | display |

### Objetivos de Campaña

| Objetivo | Código | Descripción |
|----------|--------|-------------|
| **Tráfico** | trf | Llevar usuarios al sitio web |
| **Conversiones** | conv | Generar acciones específicas (compras, registros) |
| **Interacciones** | int | Engagement con contenido (likes, comentarios, shares) |
| **Reproducciones** | rpr | Visualización de video |
| **Alcance** | alc | Maximizar impresiones únicas |

---

## Módulos y Funciones

### main.js - Entry Point

El punto de entrada de la aplicación. Inicializa todos los módulos y configura los event listeners globales.

```javascript
// Funciones principales
document.addEventListener('DOMContentLoaded', init)

function init() {
  // Carga configuración desde localStorage
  initConfig()

  // Configura tema guardado
  loadTheme()

  // Inicializa formulario
  setupListeners()

  // Renderiza historial existente
  renderHistory()

  // Configura listeners globales
  setupGlobalListeners()
}
```

**Responsabilidades:**
- Inicialización de la aplicación
- Carga de configuración guardada
- Setup de event listeners globales
- Renderizado inicial del historial

---

### config.js - Sistema de Configuración

Gestiona toda la configuración personalizable de la aplicación.

#### Funciones Exportadas:

```javascript
// Obtener configuración por defecto
export function getDefaultConfig()
// Retorna: { urls: [], campanias: [], motivos: [], codigosBrand: [] }

// Cargar configuración desde localStorage
export function loadConfig()
// Retorna: Object (config guardada o default)

// Guardar configuración en localStorage
export function saveConfig(config)
// Parámetro: config Object

// Sincronizar opciones del formulario con la configuración
export function syncFormOptions(config)
// Actualiza los selects del formulario con las opciones de config

// Inicializar configuración al cargar la página
export function initConfig()
// Carga config y sincroniza con el formulario

// Abrir modal de configuración
export function openConfig()

// Cerrar modal de configuración
export function closeConfig()

// Renderizar tab de configuración
export function renderConfigTab(tabName)
// Parámetro: 'urls' | 'campanias' | 'motivos' | 'codigos'

// CRUD de URLs
export function addURL(label, url, category)
export function deleteURL(id)

// CRUD de Campañas
export function addCampania(nombre, descripcion, division)
export function deleteCampania(id)

// CRUD de Motivos
export function addMotivo(nombre, categoria, division)
export function deleteMotivo(id)

// CRUD de Códigos Brand
export function addCodigoBrand(codigo, descripcion)
export function deleteCodigoBrand(id)

// Restaurar valores por defecto
export function resetToDefaults()
```

#### Estructura de Configuración:

```javascript
{
  urls: [
    {
      id: 'url_1',
      label: 'Delivery — Home',
      url: 'https://delivery.sanfernando.pe/',
      isDefault: true,
      category: 'delivery'
    }
  ],
  campanias: [
    {
      id: 'camp_1',
      nombre: 'AON',
      descripcion: 'Always On',
      isCore: true,        // No se puede eliminar
      division: 'both'     // 'brand' | 'ecommerce' | 'both'
    }
  ],
  motivos: [
    {
      id: 'mot_1',
      nombre: 'pollo',
      categoria: 'producto',
      division: 'both'
    }
  ],
  codigosBrand: [
    {
      id: 'cod_1',
      codigo: 'AON',
      descripcion: 'Always On',
      isCore: true
    }
  ]
}
```

---

### utm.js - Generación de UTMs

Motor principal de generación de URLs con parámetros UTM.

#### Funciones Exportadas:

```javascript
// Generar UTM a partir del formulario
export function generateUTM(event)
// Parámetro: event (submit event)
// Retorna: void (actualiza DOM y localStorage)

// Copiar resultado al portapapeles
export function copyResult()
// Copia la URL generada al clipboard y muestra toast
```

#### Lógica de Generación:

```javascript
// 1. Obtener valores del formulario
const urlDestino = document.getElementById('urlDestino').value
const division = document.getElementById('division').value
const plataforma = document.getElementById('plataforma').value
// ... más campos

// 2. Generar parámetros UTM
const utm_source = PLATFORM_MAP[plataforma].n
const utm_medium = getMedium(plataforma)
const utm_campaign = `${division}_${OBJ_MAP[objetivo]}_${campana}_${mes}_${ano}`
const utm_content = division === 'brand'
  ? `brand_${codigoPieza}_${numeroPieza}_${placement}_${motivo}`
  : `ecom_${placement}_${motivo}`

// 3. Construir URL completa
const urlCompleta = `${urlDestino}?utm_source=${utm_source}&utm_medium=${utm_medium}&utm_campaign=${utm_campaign}&utm_content=${utm_content}`

// 4. Guardar en historial
utmHistory.unshift(utmObject)
localStorage.setItem('utmHistory', JSON.stringify(utmHistory))

// 5. Iniciar validación de URL en background
checkURL(urlDestino)
```

---

### form.js - Gestión del Formulario

Maneja toda la lógica del formulario: validación, limpieza de inputs, y campos condicionales.

#### Funciones Exportadas:

```javascript
// Configurar todos los event listeners del formulario
export function setupListeners()

// Sanitizar string (trim)
export function sanitize(str)
// Retorna: string limpio

// Validar texto (sin espacios, tildes, caracteres especiales)
export function validateText(str)
// Retorna: boolean

// Limpiar input en tiempo real
export function cleanInput(event)
// - Reemplaza espacios por underscore
// - Convierte tildes a letras sin tilde
// - Elimina caracteres especiales
// - Convierte a minúsculas

// Resetear formulario a estado inicial
export function resetForm()

// Poblar select de número de pieza (01-30)
export function populateNumeroPieza()

// Poblar select de años (año actual -1 a +2)
export function populateYears()

// Seleccionar mes actual automáticamente
export function setCurrentMonth()
```

#### Campos Condicionales:

```javascript
// Cuando división = 'brand'
// Se muestran: codigoPieza, numeroPieza

// Cuando división = 'ecommerce'
// Se ocultan: codigoPieza, numeroPieza

// Cuando plataforma = 'facebook' (Meta)
// Se muestra: placementMeta

// Cuando plataforma != 'facebook'
// Se oculta: placementMeta
```

---

### history.js - Gestión del Historial

CRUD completo del historial de UTMs generadas.

#### Funciones Exportadas:

```javascript
// Renderizar lista de historial en el DOM
export function renderHistory()
// Lee utmHistory y genera HTML dinámicamente

// Actualizar estadísticas (contadores)
export function updateStats()
// Muestra: Total, Brand, Ecommerce

// Copiar UTM desde el historial
export function copyFromHistory(index)
// Parámetro: index en el array utmHistory

// Eliminar UTM del historial
export function deleteFromHistory(index)
// Elimina y re-renderiza

// Limpiar todo el historial
export function clearHistory()
// Pide confirmación antes de eliminar
```

#### Estructura de Item del Historial:

```javascript
{
  division: 'brand',
  plataforma: 'facebook',
  medium: 'paid-social',
  objetivo: 'conversiones',
  tipoCampana: 'AON',
  mes: 'OCTUBRE',
  ano: 2025,
  placement: 'META',
  codigoPieza: 'AON',        // Solo Brand
  numeroPieza: '01',         // Solo Brand
  motivo: 'pollo',
  urlDestino: 'https://delivery.sanfernando.pe/',
  utm_source: 'facebook',
  utm_medium: 'paid-social',
  utm_campaign: 'brand_conv_AON_OCTUBRE_2025',
  utm_content: 'brand_AON_01_META_pollo',
  urlCompleta: 'https://...',
  createdAt: '2025-01-28T15:30:00.000Z',
  urlStatus: {
    status: 'ok',
    code: 200,
    message: 'URL accesible'
  }
}
```

---

### theme.js - Gestión de Temas

Sistema de temas visuales con persistencia.

#### Funciones Exportadas:

```javascript
// Cargar tema guardado desde localStorage
export function loadTheme()
// Default: 'dark'

// Cambiar tema activo
export function changeTheme(themeName)
// Parámetro: 'dark' | 'light' | 'ocean' | 'forest' | 'pink'
// Actualiza data-theme attribute y localStorage

// Mostrar/ocultar menú de temas
export function toggleThemeMenu()

// Configurar listeners (cerrar al click fuera)
export function setupThemeListeners()
```

#### Implementación:

```javascript
// El tema se aplica mediante atributo data-theme en <html>
document.documentElement.setAttribute('data-theme', theme)

// Los estilos se definen en themes.css
// Cada tema sobrescribe las variables CSS
```

---

### validation.js - Validación de URLs

Validación asíncrona de accesibilidad de URLs.

#### Funciones Exportadas:

```javascript
// Verificar si una URL es accesible
export async function checkURL(url)
// Parámetro: url string
// Retorna: { status, code, message }
```

#### Estados Posibles:

| Status | Code | Message | Descripción |
|--------|------|---------|-------------|
| `ok` | 200 | URL accesible | URL responde correctamente |
| `redirect` | 3xx | Redirección | URL redirige a otra |
| `error` | 4xx/5xx | Error HTTP | Error del servidor |
| `cors` | - | CORS bloqueado | No se puede verificar (normal) |
| `timeout` | - | Tiempo agotado | No respondió en 8s |
| `checking` | - | Verificando... | En proceso de validación |

#### Implementación:

```javascript
export async function checkURL(url) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)

  try {
    // Intentar HEAD primero (más rápido)
    let response = await fetch(url, {
      method: 'HEAD',
      mode: 'cors',
      signal: controller.signal
    })

    // Si HEAD falla, intentar GET
    if (!response.ok) {
      response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        signal: controller.signal
      })
    }

    clearTimeout(timeout)

    return {
      status: response.ok ? 'ok' : 'error',
      code: response.status,
      message: response.ok ? 'URL accesible' : `Error ${response.status}`
    }
  } catch (error) {
    clearTimeout(timeout)

    if (error.name === 'AbortError') {
      return { status: 'timeout', code: null, message: 'Tiempo agotado' }
    }

    // CORS es común y no necesariamente un error
    return { status: 'cors', code: null, message: 'CORS bloqueado' }
  }
}
```

---

### export.js - Exportación de Datos

Exportación del historial a CSV y Excel.

#### Funciones Exportadas:

```javascript
// Exportar historial a CSV
export function exportCSV()
// Descarga archivo: linky_utms_YYYY-MM-DD.csv

// Exportar historial a Excel
export async function exportExcel()
// Descarga archivo: linky_utms_YYYY-MM-DD.xlsx
// Requiere SheetJS (cargado desde CDN)
```

#### Formato CSV:

```csv
"División","Plataforma","Medium","Objetivo","Campaña","Mes","Año","Placement","Código","Número","Motivo","URL Destino","utm_source","utm_medium","utm_campaign","utm_content","URL Completa","Fecha Creación","Estado URL"
"brand","facebook","paid-social","conversiones","AON","OCTUBRE","2025","META","AON","01","pollo","https://...","facebook","paid-social","brand_conv_AON_OCTUBRE_2025","brand_AON_01_META_pollo","https://...?utm_source=...","28/01/2025 15:30","OK (200)"
```

#### Formato Excel:

El archivo Excel incluye:
- **Headers**: Fondo azul índigo, texto blanco, negrita
- **Filas**: Colores alternos (blanco/gris claro)
- **Anchos de columna**: Optimizados para cada campo
- **Formato de fecha**: Localizado (DD/MM/YYYY HH:mm)

---

### constants.js - Constantes Globales

Mapeos y constantes compartidas entre módulos.

```javascript
// Mapeo de plataformas
export const PLATFORM_MAP = {
  facebook: { c: 'fb', n: 'facebook' },
  google: { c: 'gg', n: 'google' },
  tiktok: { c: 'tk', n: 'tiktok' },
  linkedin: { c: 'li', n: 'linkedin' },
  twitter: { c: 'tw', n: 'twitter' },
  programatica: { c: 'pr', n: 'programatica' }
}

// Mapeo de objetivos
export const OBJ_MAP = {
  trafico: 'trf',
  conversiones: 'conv',
  interacciones: 'int',
  reproducciones: 'rpr',
  alcance: 'alc'
}

// Estado global del historial
export let utmHistory = []
```

---

### utils.js - Utilidades

Funciones auxiliares de uso general.

```javascript
// Mostrar notificación toast
export function toast(message, type = 'success')
// Parámetros:
//   message: string - Texto a mostrar
//   type: 'success' | 'error' | 'warning' | 'info'
// Duración: 3 segundos
```

---

### modals.js - Control de Modales

Gestión de apertura/cierre de modales.

```javascript
// Abrir modal de ayuda
export function openHelp()

// Cerrar modal de ayuda
export function closeHelp()
```

---

## Sistema de Temas

### Temas Disponibles

#### Dark (Por defecto)
- **Fondo**: Negro (`#0D0D0D`)
- **Cards**: Gris oscuro (`#1A1A1A`)
- **Acento**: Verde neón (`#00FF85`)
- **Texto**: Blanco (`#FFFFFF`)
- **Efecto**: Glow verde neón

#### Light
- **Fondo**: Gris claro (`#F5F5F5`)
- **Cards**: Blanco (`#FFFFFF`)
- **Acento**: Verde oscuro (`#00996B`)
- **Texto**: Negro (`#1A1A1A`)
- **Efecto**: Sombra suave

#### Ocean Blue
- **Fondo**: Azul profundo (`#03071E`)
- **Cards**: Azul oscuro (`#0A1628`)
- **Acento**: Cyan (`#00B4D8`)
- **Texto**: Blanco (`#FFFFFF`)
- **Efecto**: Glow azul

#### Forest Green
- **Fondo**: Verde bosque (`#0D1F0D`)
- **Cards**: Verde oscuro (`#1A2F1A`)
- **Acento**: Verde claro (`#2E7D32`)
- **Texto**: Blanco (`#FFFFFF`)
- **Efecto**: Glow verde

#### Pink
- **Fondo**: Negro (`#0D0D0D`)
- **Cards**: Gris oscuro (`#1A1A1A`)
- **Acento**: Magenta (`#D81B60`)
- **Texto**: Blanco (`#FFFFFF`)
- **Efecto**: Glow rosa

### Cambiar Tema

1. Click en el botón **"Temas"** en la barra de navegación
2. Selecciona el tema deseado del menú desplegable
3. El tema se aplica inmediatamente
4. La preferencia se guarda en localStorage

### Personalizar Temas

Edita `css/themes.css` para crear nuevos temas:

```css
[data-theme="custom"] {
  --accent: #FF6B00;
  --accent-hover: #FF8533;
  --bg: #0A0A0A;
  --card: #1A1A1A;
  --text: #FFFFFF;
  --title-color: #FF6B00;
  --glow-color: rgba(255, 107, 0, 0.3);
  /* ... más variables */
}
```

---

## Validación de URLs

### Cómo Funciona

Linky valida automáticamente cada URL de destino después de generar una UTM:

1. **Intento HEAD**: Petición HTTP HEAD (más rápida, solo headers)
2. **Fallback GET**: Si HEAD falla, intenta GET
3. **Timeout**: 8 segundos máximo de espera
4. **CORS**: Si CORS bloquea, no es un error (es normal)

### Estados de Validación

| Badge | Estado | Significado |
|-------|--------|-------------|
| Verde | OK (200) | URL responde correctamente |
| Amarillo | Redirect (3xx) | URL redirige |
| Rojo | Error (4xx/5xx) | Error HTTP |
| Gris | CORS | No verificable (normal) |
| Gris | Timeout | No respondió a tiempo |

### Limitaciones

- **CORS**: Muchos sitios bloquean peticiones cross-origin
- **Falsos negativos**: Un estado CORS no significa que la URL no funcione
- **Verificación manual**: Siempre recomendable verificar en el navegador

---

## Exportación de Datos

### Exportar a CSV

1. Click en **"Exportar CSV"** en la sección de historial
2. Se descarga automáticamente `linky_utms_YYYY-MM-DD.csv`
3. Compatible con Excel, Google Sheets, LibreOffice

**Ventajas CSV:**
- No requiere librerías externas
- Funciona offline
- Compatible universalmente

### Exportar a Excel

1. Click en **"Exportar Excel"** en la sección de historial
2. Se carga SheetJS desde CDN (requiere internet)
3. Se descarga `linky_utms_YYYY-MM-DD.xlsx`

**Características del Excel:**
- Headers con formato (fondo azul, texto blanco)
- Colores alternos en filas
- Anchos de columna optimizados
- Listo para análisis en Excel

**Requisito:** Conexión a internet para cargar SheetJS desde CDN.

---

## Sistema de Configuración

### Acceder a Configuración

Click en **"Ajustes"** en la barra de navegación.

### Tabs Disponibles

#### URLs
- Ver URLs predeterminadas
- Agregar nuevas URLs (label + URL + categoría)
- Eliminar URLs personalizadas
- Las URLs por defecto están protegidas

#### Campañas
- Ver tipos de campaña disponibles
- Agregar campañas personalizadas (nombre + descripción + división)
- Campañas core (AON, Cyber, etc.) están protegidas
- Elegir división: Brand, Ecommerce, o Ambas

#### Motivos
- Ver motivos/creatividades disponibles
- Agregar nuevos motivos (nombre + categoría + división)
- Eliminar motivos personalizados

#### Códigos Brand
- Ver códigos disponibles para división Brand
- Agregar nuevos códigos (código + descripción)
- Códigos core están protegidos

### Restaurar Valores por Defecto

En cualquier tab, click en **"Restaurar valores por defecto"** para resetear esa categoría a los valores originales.

---

## Estructura de Datos

### localStorage Keys

| Key | Tipo | Descripción |
|-----|------|-------------|
| `utmHistory` | Array | Historial de UTMs generadas |
| `utmGeneratorConfig` | Object | Configuración personalizada |
| `theme` | String | Tema visual seleccionado |

### Estructura utmHistory

```javascript
[
  {
    // Datos del formulario
    division: 'brand',
    plataforma: 'facebook',
    medium: 'paid-social',
    objetivo: 'conversiones',
    tipoCampana: 'AON',
    mes: 'OCTUBRE',
    ano: 2025,
    placement: 'META',
    codigoPieza: 'AON',
    numeroPieza: '01',
    motivo: 'pollo',
    urlDestino: 'https://delivery.sanfernando.pe/',

    // Parámetros UTM generados
    utm_source: 'facebook',
    utm_medium: 'paid-social',
    utm_campaign: 'brand_conv_AON_OCTUBRE_2025',
    utm_content: 'brand_AON_01_META_pollo',
    urlCompleta: 'https://delivery.sanfernando.pe/?utm_source=facebook&utm_medium=paid-social&utm_campaign=brand_conv_AON_OCTUBRE_2025&utm_content=brand_AON_01_META_pollo',

    // Metadata
    createdAt: '2025-01-28T15:30:00.000Z',
    urlStatus: {
      status: 'ok',
      code: 200,
      message: 'URL accesible'
    }
  }
]
```

### Estructura utmGeneratorConfig

```javascript
{
  urls: [
    {
      id: 'url_1',
      label: 'Delivery — Home',
      url: 'https://delivery.sanfernando.pe/',
      isDefault: true,
      category: 'delivery'
    }
  ],
  campanias: [
    {
      id: 'camp_1',
      nombre: 'AON',
      descripcion: 'Always On',
      isCore: true,
      division: 'both'
    }
  ],
  motivos: [
    {
      id: 'mot_1',
      nombre: 'pollo',
      categoria: 'producto',
      division: 'both'
    }
  ],
  codigosBrand: [
    {
      id: 'cod_1',
      codigo: 'AON',
      descripcion: 'Always On',
      isCore: true
    }
  ]
}
```

---

## Arquitectura Técnica

### Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Vite** | 5.4.0 | Bundler y servidor de desarrollo |
| **ES Modules** | ES2020 | Módulos JavaScript nativos |
| **CSS3** | - | Variables CSS, Grid, Flexbox |
| **localStorage** | - | Persistencia de datos en navegador |
| **Fetch API** | - | Peticiones HTTP para validación |
| **SheetJS** | 0.20.0 | Exportación Excel (CDN) |
| **Lucide Icons** | latest | Iconografía vectorial (CDN) |
| **Google Fonts** | - | Tipografías (Bebas Neue, Montserrat) |

### Características Arquitectónicas

- **Zero Runtime Dependencies**: Sin React, Vue, Angular, etc.
- **ES Modules Nativos**: Import/export sin transpilación
- **SPA Simple**: Una sola página con modales
- **CSS Modular**: Archivos separados por componente
- **Persistencia Local**: Todo en localStorage

### Configuración de Vite

```javascript
// vite.config.js
export default {
  root: '.',
  build: {
    outDir: 'dist',
    target: 'es2020',
    minify: 'esbuild'
  },
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src',
      '@css': '/css'
    }
  }
}
```

### Deploy en Netlify

```toml
# netlify.toml
[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

---

## Arquitectura CSS

### Sistema de Variables (Design Tokens)

```css
/* variables.css */
:root {
  /* Colores base */
  --black: #0D0D0D;
  --white: #FFFFFF;
  --neon: #00FF85;

  /* Tipografía */
  --font-display: 'Bebas Neue', sans-serif;
  --font-body: 'Montserrat', sans-serif;

  /* Tamaños de fuente */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;

  /* Espaciado (8pt grid) */
  --space-xs: 0.5rem;
  --space-sm: 0.75rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;

  /* Transiciones */
  --transition-fast: 150ms ease;
  --transition-normal: 250ms ease;
}
```

### Módulos CSS

| Archivo | Propósito | Líneas |
|---------|-----------|--------|
| `variables.css` | Design tokens globales | 216 |
| `themes.css` | 5 temas de color | 144 |
| `layout.css` | Layout base, grid, flexbox | 300 |
| `navigation.css` | Barra superior, botones | 448 |
| `forms.css` | Inputs, selects, botones | 460 |
| `cards.css` | Componentes card | 396 |
| `history.css` | Lista de historial | 356 |
| `config.css` | Modal de configuración | 484 |
| `modals.css` | Estilos de modales | 454 |
| `utilities.css` | Toast, badges, estados | 302 |
| `responsive.css` | Media queries | 327 |

### Breakpoints Responsivos

```css
/* responsive.css */

/* Tablet */
@media (max-width: 1200px) { }

/* Mobile landscape */
@media (max-width: 768px) { }

/* Mobile portrait */
@media (max-width: 480px) { }
```

---

## Adaptar para Otra Marca

### Paso 1: Información Necesaria

Antes de empezar, recopila:
- Nombre de la marca
- URLs de destino principales
- Tipos de campaña específicos
- Productos/motivos principales
- Colores de la marca (opcional)
- Logo/favicon

### Paso 2: Configurar Datos por Defecto

Edita `src/config.js` → función `getDefaultConfig()`:

```javascript
export function getDefaultConfig() {
  return {
    urls: [
      {
        id: 'url_1',
        label: 'Web Principal',
        url: 'https://www.tu-marca.com/',
        isDefault: true,
        category: 'web'
      },
      // Agregar más URLs...
    ],

    campanias: [
      { id: 'camp_1', nombre: 'AON', descripcion: 'Always On', isCore: true, division: 'both' },
      // Agregar más campañas...
    ],

    motivos: [
      { id: 'mot_1', nombre: 'promocion', categoria: 'promocion', division: 'both' },
      // Agregar más motivos...
    ],

    codigosBrand: [
      { id: 'cod_1', codigo: 'AON', descripcion: 'Always On', isCore: true },
      // Agregar más códigos...
    ]
  };
}
```

### Paso 3: Actualizar Identidad

#### index.html

```html
<!-- Título -->
<title>Linky — [NOMBRE MARCA] 2025</title>

<!-- Favicon -->
<link rel="icon" type="image/png" href="favicon.png">

<!-- Header -->
<div class="header">
  <h1>Linky</h1>
  <p>[AGENCIA] — [MARCA]</p>
</div>

<!-- Footer -->
<div class="footer">
  Powered by [AGENCIA] | v2.1
</div>
```

### Paso 4: Personalizar Colores (Opcional)

Edita `css/themes.css`:

```css
[data-theme="dark"] {
  --accent: #TU_COLOR;
  --accent-hover: #TU_COLOR_HOVER;
  --title-color: #TU_COLOR;
  --glow-color: rgba(TU_COLOR_RGB, 0.3);
}
```

### Paso 5: Actualizar package.json

```json
{
  "name": "linky-[marca]",
  "version": "1.0.0",
  "description": "Generador UTM para [Marca]",
  "config": {
    "brand": {
      "name": "[Marca]",
      "code": "[COD]"
    }
  }
}
```

### Paso 6: Build y Deploy

```bash
# Verificar en desarrollo
npm run dev

# Build de producción
npm run build

# Deploy dist/ a Netlify, Vercel, o cualquier hosting estático
```

### Checklist de Adaptación

- [ ] URLs de destino en `src/config.js`
- [ ] Campañas específicas de la marca
- [ ] Motivos/productos de la marca
- [ ] Códigos Brand (si aplica)
- [ ] Título y metadata en `index.html`
- [ ] Header y footer actualizados
- [ ] Favicon reemplazado
- [ ] Colores personalizados (opcional)
- [ ] `package.json` actualizado
- [ ] Build probado (`npm run build`)
- [ ] Deploy verificado

---

## Configuración por Defecto (San Fernando)

### URLs Predeterminadas

| Label | URL | Categoría |
|-------|-----|-----------|
| Delivery — Home | https://delivery.sanfernando.pe/ | delivery |
| Delivery — Pollo | https://delivery.sanfernando.pe/categorias/pollo | delivery |
| Delivery — Embutidos | https://delivery.sanfernando.pe/categorias/embutidos | delivery |
| Delivery — Huevos | https://delivery.sanfernando.pe/categorias/huevo | delivery |
| Delivery — Vales | https://delivery.sanfernando.pe/vales | delivery |

### Campañas Core (Protegidas)

| Nombre | Descripción | División |
|--------|-------------|----------|
| AON | Always On | Ambas |
| Cyber | Cyber Week | Ambas |
| HUEVOS | Campaña Huevos | Ambas |
| NAVIDADB2B | Navidad B2B | Brand |
| Elaborados | Productos Elaborados | Ambas |

### Motivos/Creatividades

- VALES, chorizo, hamburguesa, pollo, embutidos, huevos
- DesayunoSangrecita, DescuentoWeb

### Códigos Brand

| Código | Descripción |
|--------|-------------|
| AON | Always On |
| NAB2B | Navidad B2B |
| HUE | Huevos |
| Elaborados | Productos Elaborados |

---

## Troubleshooting

### "No se genera la UTM"

**Causa**: Campos obligatorios vacíos o inválidos.

**Solución**:
- Verifica que todos los campos con (*) estén completos
- URL debe comenzar con `http://` o `https://`
- No usar caracteres especiales ni tildes en campos de texto

### "Error en build"

**Causa**: Dependencias no instaladas o versión incorrecta de Node.

**Solución**:
```bash
# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install

# Verificar versión de Node
node -v  # Debe ser 18+
```

### "Excel no exporta"

**Causa**: Sin conexión a internet (SheetJS se carga desde CDN).

**Solución**:
- Verificar conexión a internet
- Usar exportación CSV como alternativa (funciona offline)

### "Tema no cambia"

**Causa**: localStorage corrupto o bloqueado.

**Solución**:
```javascript
// En consola del navegador
localStorage.removeItem('theme')
location.reload()
```

### "Historial vacío después de recargar"

**Causa**: localStorage bloqueado o navegación privada.

**Solución**:
- Verificar que no esté en modo incógnito
- Verificar permisos de localStorage en el navegador

### "CORS en validación de URLs"

**Causa**: El servidor de destino no permite peticiones cross-origin.

**Explicación**: Esto es normal. La mayoría de servidores bloquean CORS. Un estado "CORS" no significa que la URL no funcione, solo que no se puede verificar desde el navegador.

**Solución**: Verificar manualmente la URL en una nueva pestaña.

### "Campos Brand no aparecen"

**Causa**: División seleccionada es "Ecommerce".

**Solución**: Cambiar división a "Brand" para ver campos de código y número de pieza.

---

## Tecnologías

| Tecnología | Uso | Versión |
|------------|-----|---------|
| **Vite** | Bundler y servidor de desarrollo | 5.4.0 |
| **ES Modules** | Módulos JavaScript nativos | ES2020 |
| **CSS3** | Estilos (variables, grid, flexbox) | - |
| **localStorage** | Persistencia de datos | Web API |
| **Fetch API** | Peticiones HTTP | Web API |
| **SheetJS** | Exportación Excel | 0.20.0 (CDN) |
| **Lucide Icons** | Iconografía vectorial | Latest (CDN) |
| **Google Fonts** | Tipografías | - |
| **Netlify** | Hosting y deployment | - |

---

## Licencia

MIT License - Ver archivo LICENSE para detalles.

---

## Créditos

Desarrollado por **Reset Agency** (Lima, Perú) para **San Fernando**.

---

**Versión**: 2.1.0
**Bundler**: Vite 5.4.0
**Última actualización**: Enero 2025

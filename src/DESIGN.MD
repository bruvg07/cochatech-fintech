---
name: Escudo Financiero
colors:
  surface: '#f8f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#404942'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#717972'
  outline-variant: '#c0c9c0'
  surface-tint: '#32694a'
  primary: '#1D3D2C'
  on-primary: '#ffffff'
  primary-container: '#1a5336'
  on-primary-container: '#8cc5a0'
  inverse-primary: '#99d4ae'
  secondary: '#296140'
  on-secondary: '#ffffff'
  secondary-container: '#dae6dc'
  on-secondary-container: '#5c675f'
  tertiary: '#B3975A'
  on-tertiary: '#ffffff'
  tertiary-container: '#5e4510'
  on-tertiary-container: '#d8b374'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b5f0c9'
  primary-fixed-dim: '#99d4ae'
  on-primary-fixed: '#002111'
  on-primary-fixed-variant: '#175034'
  secondary-fixed: '#dae6dc'
  secondary-fixed-dim: '#bec9c0'
  on-secondary-fixed: '#141e18'
  on-secondary-fixed-variant: '#3e4942'
  tertiary-fixed: '#ffdea8'
  tertiary-fixed-dim: '#e7c181'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5c420e'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
  surface-muted: '#E0E3E3'
  surface-white: '#FFFFFF'
  text-primary: '#2C332F'
  icon-fill: '#8DB89B'
  border-light: '#EBEBEB'
typography:
  app-bar-title:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 24px
  card-title:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 20px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  financial-display:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  financial-display-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-global: 1.25rem
  gutter-card: 1rem
  padding-card: 1rem
  safe-area: 1.25rem
---

# Sistema de Diseño: BMSC - Escudo Financiero
Este documento define las guías de estilo y componentes visuales para la PWA "Escudo Financiero", asegurando coherencia total con la aplicación móvil nativa del Banco Mercantil Santa Cruz (BMSC).
## 🎨 1. Paleta de Colores
El esquema de colores transmite seguridad, formalidad y claridad. Se basa en contrastes fuertes entre fondos claros y acentos en verde oscuro corporativo.
| Color | Hexadecimal | Uso Principal |
| :--- | :--- | :--- |
| **Verde Corporativo (Primary)** | `#1A5336` | App bar (cabeceras), íconos principales, textos de énfasis, botones de acción primaria. |
| **Verde Claro (Surface Accent)** | `#DCE8DE` | Botones de acción secundaria anchos (ej. "A cuentas propias", "Pagar servicio"), fondos de íconos. |
| **Gris Claro (Surface Muted)** | `#E0E3E3` | Botones secundarios alternativos (ej. "A nuevo destinatario"), estados deshabilitados. |
| **Fondo Base (Background)** | `#F4F6F8` | Color de fondo general de la aplicación. Ayuda a resaltar las tarjetas blancas. |
| **Blanco (Surface)** | `#FFFFFF` | Fondos de tarjetas (Cards), campos de entrada de texto (Inputs), menús desplegables. |
| **Bronce/Dorado (Brand Accent)**| `#B9975B` | Detalles del logo institucional. Uso muy restrictivo para UI general. |
| **Texto Principal** | `#2C332F` | Texto de lectura general, subtítulos dentro de las tarjetas. |
| **Verde Detalle (Icon Fill)** | `#8DB89B` | Relleno sutil o sombras dentro de los íconos vectoriales (ej. los créditos vehiculares o de vivienda). |
---
## 🔤 2. Tipografía
La tipografía debe ser geométrica, limpia y altamente legible en pantallas pequeñas. *(Se asume una fuente estándar de sistema como Roboto en Android, San Francisco en iOS, o Inter/Montserrat como alternativa web)*.
* **Familia Tipográfica:** Sans-serif.
* **Jerarquía:**
    * **Cabeceras (App Bar):** Regular o Medium, 18px-20px, Blanco.
    * **Títulos de Tarjetas / Menús:** Medium, 16px, Verde Corporativo (`#1A5336`).
    * **Cuerpo de Texto / Listas:** Regular, 14px-16px, Texto Principal o Verde Corporativo.
    * **Texto Secundario / Fechas:** Regular, 12px, Gris o Verde Corporativo claro.
    * **Cifras / Saldos:** Medium o SemiBold, 20px-24px.
---
## 🖼️ 3. Iconografía
El estilo de los íconos es una parte fundamental de la identidad visual de la app.
* **Estilo:** Lineal (Outline).
* **Grosor de línea (Stroke):** 1.5px a 2px. Constante en toda la app.
* **Color:** Principalmente Verde Corporativo (`#1A5336`).
* **Acentos:** Algunos íconos (como los de tipos de crédito) utilizan un relleno parcial en Verde Detalle (`#8DB89B`) para dar profundidad sin perder el minimalismo.
* **Contenedores:** Frecuentemente, los íconos se colocan dentro de un círculo con fondo sólido (Verde Corporativo) y el ícono en Blanco, especialmente para acciones principales.
---
## 🧩 4. Componentes de UI
### 4.1. Cabeceras (App Bar / Headers)
* **Fondo:** Sólido Verde Corporativo (`#1A5336`) o Imagen con overlay oscuro degradado (solo en Login).
* **Bordes:** La parte inferior de la cabecera suele tener las esquinas muy redondeadas (radio aprox. 24px) cuando transiciona al fondo base, o termina en un corte recto con una fina línea separadora blanca (`1px solid rgba(255,255,255,0.5)`).
* **Elementos:** Menú hamburguesa a la izquierda (3 líneas horizontales), título centrado o alineado a la izquierda.
### 4.2. Tarjetas (Cards)
Son el elemento contenedor principal para organizar la información (cuentas, opciones de menú, créditos).
* **Fondo:** Blanco (`#FFFFFF`).
* **Bordes:** Esquinas redondeadas (Border-radius: 12px a 16px).
* **Sombras:** Muy sutiles para separarlas del fondo base. (Ej. `box-shadow: 0px 2px 8px rgba(0,0,0,0.05)`), o un borde gris ultra fino (`1px solid #EBEBEB`).
### 4.3. Botones y Áreas Táctiles
Existen tres jerarquías claras de botones interactivos:
1.  **Botones de Módulo (Grid):** Tarjetas blancas cuadradas con ícono centrado arriba y texto abajo. Uso para navegación principal (Ej. "Transferencias", "Pago de servicios").
2.  **Botones de Acción Inmediata (Pills anchos):** Rectángulos con esquinas completamente redondeadas (estilo píldora). Ocupan casi todo el ancho. Fondo Verde Claro o Gris Claro. Llevan un ícono circular a la izquierda y texto en negrita.
3.  **Botones de Lista (List Items):** Filas con fondo del color base o blanco. Texto a la izquierda, línea separadora inferior muy fina, y un ícono de "flecha derecha" (`>`) encerrado en un círculo con borde a la derecha para indicar navegación.
### 4.4. Inputs y Formularios (Login)
* **Fondo:** Blanco (`#FFFFFF`).
* **Borde:** Fino, gris claro con esquinas redondeadas (Radius: 8px-10px).
* **Interactividad:** Al hacer foco, el borde no cambia a colores estridentes, mantiene la sobriedad. Íconos funcionales a la derecha (ej. "ojo" para ver contraseña).
* **Toggles (Interruptores):** Estilo pastilla. Fondo Verde Corporativo cuando están activos, blanco con borde cuando están inactivos.
---
## 📏 5. Layout y Espaciado (Grid System)
* **Márgenes Globales:** 16px a 20px de padding lateral en toda la pantalla (Safe Area).
* **Separación entre Tarjetas:** 12px a 16px vertical y horizontalmente.
* **Alineación:** Mayormente centrada para acciones principales (Dashboard) y alineada a la izquierda para listas de información y formularios.
---
## 🚀 6. Adaptación para "Escudo Financiero" (Directrices Adicionales)
Para el módulo de prevención y gestión de mora, se utilizarán estos mismos componentes, incorporando las siguientes reglas lógicas:
* **Empatía Visual:** Para notificar sobre un atraso en pagos, **NO se usarán textos ni fondos rojos agresivos**. Se utilizarán tarjetas estándar con el título en Verde Corporativo y un texto descriptivo neutro, invitando a la acción ("Ajustar plan", "Renegociar").
* **Gamificación Sutil:** Si el usuario elige un plan de fraccionamiento o paga a tiempo, se pueden incorporar micro-interacciones (ej. el ícono de `check` cambia a Verde Claro temporalmente) usando estrictamente la paleta de colores definida.
* **Seguridad:** Las pantallas de verificación (MFA) utilizarán el diseño de formulario del Login (Inputs blancos, bordes suaves), añadiendo íconos de "Candado" de la biblioteca lineal.
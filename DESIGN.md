---
name: "historia-veterinaria — Pine"
colors:
  paper: "#f7f8f6"
  paper-2: "#ffffff"
  ink: "#16201b"
  ink-soft: "#4a5852"
  line: "#dde3df"
  accent: "#2f6b4f"        # --pine-500
  accent-ink: "#1c3a2e"    # --pine-700 (hover/text-on-tint)
  accent-soft: "#eef4f0"   # --pine-50
  accent-soft-2: "#6ba585" # --pine-300 (focus ring)
typography:
  sans:
    fontFamily: "Hanken Grotesk Variable, system-ui, sans-serif"
    usage: "cuerpo, párrafos, UI"
  mono:
    fontFamily: ""
    usage: "no hay mono en este producto — no forzarlo"
  display:
    fontFamily: "Schibsted Grotesk Variable, var(--font-body)"
    usage: "h1/h2/h3, eyebrow, botones"
rounded:
  sm: "0"
  DEFAULT: "14px"
  pill: "999px"
spacing:
  base: "4px"
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2.5rem"
---

## Reglas transversales (leer ANTES de tocar este archivo o la UI)

- **Técnicas (WCAG, tap targets, escala tipográfica, motion):** `Memory/jotive/Frontend-Design-Standards.md`
- **Gusto/rechazos de Josse (set-IA-default, botones pill-flat, iconos, clichés de dashboard):** `Memory/jotive/Estilo-Gustos-Josse.md`

## Estructura real del repo (importante, no asumir)

Este repo tiene **dos frontends con sistemas de tokens distintos y no compartidos** — el hallazgo de drift principal de este documento:

- **`site/`** — Astro, landing + artículos SEO (`historia-veterinaria.geosdata.com`). Tokens vía CSS vars en `site/src/styles/global.css`. Botones pill, sin borde — cumple Regla #2 de gustos.
- **`web/`** — React + Vite + Tailwind, la herramienta real (generador de historia clínica, login, pacientes). Tokens vía `web/tailwind.config.js` (paleta `brand`/`accent`/`ink` en escalas Tailwind, no CSS vars). Botones `rounded-lg` (no pill) y variante `outline` con borde — **no cumple** Regla #2.

Este YAML documenta el sistema de `site/` (más maduro y consistente con los gustos de Josse) como identidad de marca del producto. **Reconciliado 2026-09-09:** `web/` migró su sistema de botones a pill sin borde, alineado con `site/` — ver "Drift conocido" para el detalle de cada cambio.

## Brand & Style

Producto de nicho (veterinarias pequeñas, Colombia): identidad "clínico pero cálido" — verde pino (`pine`) como color de confianza/salud, tipografía Grotesk (Schibsted display + Hanken body) sin serif ni mono. Botones pill sólidos sin borde (cumple gusto #2). Se evita a propósito la estética SaaS genérica: sin barra de color arriba de card, sin sombra difusa como único lenguaje (cards usan borde `line` 1px + radius 14px, no shadow-only), sin eyebrow en mayúsculas+letter-spacing como firma dominante (existe `.eyebrow` con uppercase+tracking — ver Drift, es justo el patrón que Estilo-Gustos-Josse #4 marca como cliché reconocible de IA).

## Colors

- **`paper`** (`#f7f8f6`): fondo base de página (`body`). No usar como color de texto.
- **`paper-2`** (`#ffffff`): fondo de cards/superficies elevadas sobre `paper`.
- **`ink`** (`#16201b`): texto principal. No usar en fondos grandes.
- **`ink-soft`** (`#4a5852`): texto secundario, `.muted`, metadatos.
- **`accent`** (`#2f6b4f`, pine-500): color de acción — `.btn-primary`, links (`a { color }`), iconos de sección. Contraste vs blanco: **6.3:1 — pasa AA/AAA** para texto/botones. Un solo uso protagonista por vista.
- **`accent-ink`** (`#1c3a2e`, pine-700): hover de `.btn-primary`, texto sobre `accent-soft` en callouts numerados. Contraste vs blanco aún mayor que `accent` — pasa AA sin problema.
- **`accent-soft`** (`#eef4f0`, pine-50): fondo de `.btn-tint`, callouts (`.hero__panel`, cajas de tip), badges numerados. Nunca como fondo de texto blanco (es un tint claro, no un accent sólido).
- **`accent-soft-2`** (`#6ba585`, pine-300): solo como `outline`/anillo de `:focus` en inputs (`generador-*.astro`). No usar como fondo de botón ni texto (contraste insuficiente sobre paper/blanco para texto normal).
- **`line`** (`#dde3df`): bordes de cards e inputs. No usar como texto ni fondo.

## Typography

- **Display** (`Schibsted Grotesk Variable`): h1/h2/h3, `.eyebrow`, texto de botones (`.btn`). Peso 700 en h1, 600 en h2/h3/btn. `letter-spacing: -0.02em` en headings.
- **Sans/body** (`Hanken Grotesk Variable`): párrafos, body copy. `font-size: 1.0625rem`, `line-height: 1.6`.
- Escala headings: h1 `clamp(2.1rem, 5vw, 3.4rem)`, h2 `clamp(1.5rem, 3vw, 2.1rem)`, h3 `1.2rem` — compatible con la escala 1.25 de Frontend-Design-Standards Regla #4 (rango correcto, aunque no usa `rem` fijos sino `clamp`, lo cual es más robusto — no es drift, es mejora).
- No hay tipografía mono en el producto — correcto, no forzarla (Estilo-Gustos-Josse prohíbe JetBrains Mono/IBM Plex Mono por defecto de IA; acá directamente no se usa, bien).

## Spacing & Shapes

- Radius cards/inputs: `14px` (`--radius`). Radius botones: `999px` pill (`--radius-pill`).
- Grosor de borde: `1px` en cards e inputs (`--line`), sin borde en botones (cumple gusto #2).
- Container: `.wrap` con `max-width: 68rem`, padding lateral `1.25rem`.
- Spacing dentro de cards: `padding: 1.5rem` (`.card`) — dentro del rango 1.25–1.75rem de Frontend-Design-Standards Regla #3.

## Components

### Buttons (`site/` — sistema de referencia)

- **`.btn` (base):** pill (`border-radius: 999px`), sin borde, `padding: 0.8rem 1.4rem`, tipografía display 600. Transición `transform 0.12s, background 0.15s`.
- **`.btn-primary`:** fondo `accent`, texto blanco. Hover: fondo `accent-ink`. Active: `translateY(1px)` (feedback de tap). `.btn` ahora define `:focus-visible` (outline 2px `pine-300`, offset 2px) — resuelto 2026-09-09.
- **`.btn-tint`:** fondo `accent-soft`, texto `accent-ink`. Hover: `#e2ece6` (tint fijo, no token — drift menor, debería ser un token `accent-soft-hover`).
- **Disabled:** no implementado en `site/` (son botones de navegación/CTA estáticos, no forms con estado disabled — coherente con el uso real).

### Buttons (`web/` — reconciliado hacia `site/` 2026-09-09)

- 4 variantes en `web/src/components/Button.tsx`: `primary` (bg `brand-600`), `accent` (bg `accent-700`, antes `accent-500`), `ghost` (transparente + hover tint), `outline` (antes con borde `ink-200`, ahora fondo tint `brand-50` sin borde, texto `brand-700` — mismo patrón que `.btn-tint` de `site/`). Radius `rounded-full` (antes `rounded-lg`) — ya cumple gusto #2 (pill, sin borde). También se corrigieron los `<button>` sueltos fuera del componente `Button` (`ProtectedRoute.tsx`, `LoginPage.tsx`, ambos "Reintentar") a `rounded-full` + `focus-visible:ring-2`. Mantiene `:focus-visible:ring-2`, `:disabled` (opacity 60 + cursor not-allowed) y estado `loading` (spinner), que ya estaban bien resueltos.

### Cards

- **`site/` `.card`:** fondo `paper-2`, borde `line` 1px, radius 14px, padding 1.5rem. Sin sombra — evita el cliché "sombra difusa como único lenguaje" (Estilo-Gustos-Josse #4).
- **`web/` `Card`:** fondo blanco, borde `ink-100`, radius `card` (14px, coincide), `shadow-card` (sombra sutil doble capa, no genérica difusa — aceptable). Consistente en radius con `site/`, diverge en usar sombra.

### Inputs (`web/` `field-input`, `site/` inputs inline en `.astro`)

- `web/`: `rounded-lg`, borde `ink-200`, focus `border-brand-500` + `ring-2 ring-brand-200`, disabled `bg-ink-100` + cursor not-allowed. Min-height no explícito — verificar ≥44px (Regla #7) al tocar el componente.
- `site/`: focus `outline: 2px solid pine-300` + `border-color: pine-300`, solo definido en las páginas de generadores (`generador-*.astro`), no centralizado en `global.css` — otro punto de tokens repetidos en vez de fuente única.

## Drift conocido

1. ~~Dos sistemas de tokens sin fuente compartida: `site/` (CSS vars `pine`/`paper`/`ink`) vs `web/` (Tailwind `brand`/`accent`/`ink` en escalas numéricas). Mismos roles, hex distintos, sin puente entre ambos.~~ — **resuelto 2026-09-09** en la dimensión que importaba (forma de botón, regla dura de Josse): los hex de paleta siguen siendo distintos (Tailwind `brand`/`accent` vs CSS vars `pine`, decisión de capas separadas marketing/app que se mantiene), pero el *sistema de botones* de `web/` ahora replica la forma de `site/` — pill, sin borde en la variante secundaria. No se fusionaron los dos archivos de tokens (fuera de alcance de este pase).
2. ~~`web/` no cumple Regla #2 de Estilo-Gustos-Josse (pill + flat, sin borde)~~ — **resuelto 2026-09-09**: `web/src/components/Button.tsx` migrado a `rounded-full`; variante `outline` perdió el borde `ink-200` y pasó a fondo tint `bg-brand-50 text-brand-700` (mismo patrón que `.btn-tint` de `site/`), sin borde. También corregidos los `<button>` "Reintentar" sueltos en `ProtectedRoute.tsx` y `LoginPage.tsx`.
3. ~~`web/` variante `accent` (bg `#e96a20` + texto blanco) falla WCAG AA para texto normal (3.2:1)~~ — **resuelto 2026-09-09**: variante `accent` pasó de `bg-accent-500` a `bg-accent-700` (`#b53d15`, hover `accent-800`). Contraste verificado por fórmula de luminancia relativa (WCAG): `accent-500` (`#e96a20`) da 3.2:1 (fail); `accent-600` (`#da5116`) da ~4.06:1 (aún fail); `accent-700` (`#b53d15`) da **~5.76:1 — pasa AA (≥4.5:1) y AAA está cerca**. Se mantuvo el hue naranja, ya existente en la escala Tailwind (`accent.700`), sin inventar un hex nuevo.
4. **`site/` `.eyebrow` usa mayúsculas + letter-spacing** (`text-transform: uppercase; letter-spacing: 0.08em`) — patrón que Estilo-Gustos-Josse #4 marca explícitamente como firma reconocible de dashboard generado por IA. No prioritario (usado en 10 páginas, cambiarlo es decisión de marca, no bug puntual) — se deja señalado, sin tocar, para revisión de Josse.
5. ~~Token `--amber` declarado y sin uso real en `site/global.css`~~ — **resuelto 2026-09-09**: confirmado por grep (`site/src`, `web/src`) que no había ningún consumo real; se eliminó la declaración `--amber: #d98a3d;` de `:root` en `global.css` y la entrada `warn` del YAML de este documento.
6. ~~`.btn` de `site/` no tiene `:focus-visible` propio~~ — **resuelto 2026-09-09**: se agregó `.btn:focus-visible { outline: 2px solid var(--pine-300); outline-offset: 2px; }` en `site/src/styles/global.css`, consistente con el color de foco ya usado en los inputs de los generadores.
7. **Repetición de valores de focus/tint fuera de una única fuente** (ej. `#e2ece6` hardcoded en `.btn-tint:hover`, `#d5e4dc` repetido en 6 páginas `.astro` para `border-color` de callouts) en vez de tokens centralizados. No tocado en este pase (fuera de los 5 hallazgos encargados).

# 05 — Huecos SEO y calendario de contenido

> Distribución 100% orgánica: se gana por los **huecos de búsqueda**, no por el head-term. Método: leer el SERP real (Google gl=co) — qué rankea, "también se buscó", intención — y entrar donde solo hay PDFs/contenido débil. Ver principio general: memoria `ganar-organico-gap-analysis-seo-por-proyecto`.

## Análisis del SERP (2026-08-11)

### Head-term "software gestión veterinaria" → ❌ mar rojo (no entrar)
Rankean suites establecidas, varias con IA, con anuncios pagos: Okvet, GVET, Vetlogy (paga Ads), Vetesoft (IA), Doru (IA), QVet, Wakyma, Provet, Panther, Sami, CPVet, + Capterra. Imposible de frente sin recursos.
- Related que sí es señal: **"software para veterinarias gratis"** → *gratis* es gancho que las suites de pago no dan.

### "historia clínica veterinaria" → ✅ hueco (intención = DESCARGAR formato)
Rankean: COMVEZCOL (gov, formato oficial), Okvet (único competidor que trabaja este keyword), y el resto **PDFs/apuntes** (Scribd, Studocu, U. Pamplona, U. Cooperativa, AgendaPro, Pinterest).
"También se buscó": *pdf · formato · descargar · formato Word · formato Excel · COMVEZCOL · reseña · formato colombia*.
→ La gente quiere **descargar un formato editable**, no "gestionar en la nube". Hoy solo hay PDFs fijos.

### "consentimiento informado veterinario" → ✅ hueco (solo PDFs)
Rankean solo PDFs (COMVEZCOL, Scribd, colegios veterinarios). Ninguna herramienta. La norma (Ley 576, art. 27) lo exige.

### "carnet de vacunación perro formato" → ✅ hueco (imprimir/digital)
Rankean Pinterest, Scribd, Jotform, **Canva**, Zoetis — plantillas para imprimir/diseñar, ninguna app. Related: *para imprimir · **digital** · canva · lleno · colombia*. Alto tráfico (dueño-facing), demanda de versión **digital**. Ángulo vet: "generá los carnets de vacunas de tus pacientes".

### "cuánto cobrar consulta veterinaria" → 🟡 mixto (dueño + vet)
Rankean blogs de costos + veterinarias + **COMVEZCOL Acuerdo 2340 de 2024 (tarifas sugeridas)** + consejoapp (consulta de tarifas). PAA fuerte ("¿cuánto cobra un veterinario?"). Intent mixto: dueño (cuánto cuesta) y vet (cuánto cobrar). Hueco vet: contenido/calculadora de **tarifas sugeridas COMVEZCOL**.

## Estrategia
No pelear por "software veterinario". **Capturar al que busca el formato** (historia clínica, consentimiento) con una herramienta que se lo **genera editable** (mejor que un PDF), y subirlo de a poco al SaaS. El generador = imán SEO / lead-gen, no el producto final.

## Calendario de contenido por hueco
> Cada fila = un artículo o mini-tool que rankea por un hueco y convierte al SaaS. Orden por prioridad.

| # | Hueco (búsqueda real) | Formato | Intención | Convierte a |
|---|---|---|---|---|
| 1 | "formato / descargar historia clínica veterinaria **Word/Excel**" | **generador** que exporta editable (nadie lo hace) | descargar plantilla | registro → SaaS |
| 2 | "**cómo llenar** / hacer una historia clínica veterinaria" | artículo pilar + link al generador | aprender + plantilla | generador → SaaS |
| 3 | "historia clínica veterinaria **COMVEZCOL**" | artículo sobre el formato oficial + generador basado en él | formato oficial | generador → SaaS |
| 4 | "**reseña** historia clínica veterinaria" | artículo (qué es la reseña + campos) | contenido específico | generador |
| 5 | "**consentimiento informado** veterinario formato" | **generador** de consentimiento por procedimiento | descargar formato legal | SaaS (feature) |
| 6 | "formato de **vacunación** / carnet de vacunas" (vet-facing) | generador de carnet/registro de vacunas | plantilla | SaaS (recordatorios) |
| 7 | "cómo **administrar / cobrar** una clínica veterinaria" | guía de negocio | mejorar operación | SaaS |
| 8 | "software veterinario **gratis**" | comparativa honesta + tu free tier | busca gratis | registro |

## Reglas de ejecución
- Contenido y generadores viven bajo el subdominio del producto (refuerzan su SEO), en `content/`.
- Cada artículo termina en un CTA suave al generador o al registro (pull, no venta agresiva).
- Ángulo build-in-public honesto: "Colombia no tiene norma de historia clínica veterinaria (COMVEZCOL lo admite desde 2018) y los formatos son PDFs sueltos — hice una herramienta que la genera y la guarda".

## Fuentes (SERP + normativa)
- SERP "historia clínica veterinaria" / "software gestión veterinaria" (Google gl=co, 2026-08-11).
- [COMVEZCOL — historia clínica y consentimiento (formato oficial)](https://consejoprofesionalmvz.gov.co)
- Competidores: [Okvet](https://okvet.co) · [Vetlogy](https://vetlogy.com) · [GVET](https://www.gvetsoft.com) · [Doru](https://www.doru.com.co) · [Vetesoft](https://vetesoft.org)
- Normativa completa: `docs/normativa/`.

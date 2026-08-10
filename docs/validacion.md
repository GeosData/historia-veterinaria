# Validación

> Este documento explica **cómo se decidió construir esto**, con datos públicos y sin adivinar. Se incluye a propósito un dato que al principio nos engañó y cómo se corrigió — porque el proceso honesto importa más que el resultado bonito.

## Principio
Construir es barato (horas con IA). Lo escaso es **demanda validada + distribución**. Así que la necesidad se valida con señales públicas ANTES de escribir código:
- **Qué busca la gente** → autocomplete de Google (gl=co, es) = las frases reales que la gente teclea.
- **De qué se queja** → reviews públicas de apps/software del sector.
- **Un gate de usabilidad** → ¿el flujo tiene sentido en el momento real de uso?

Distribución: 100% **SEO/orgánico**. Nada de outbound.

## Paso 1 — el dato que engañó (y por qué)
Primera pasada con el término genérico **"veterinaria"**: 91 sugerencias de autocomplete. Parecía altísima demanda.

Pero al **leer** las keywords (no solo contar), casi todas eran de **estudiantes** de veterinaria, no de clínicas:

```
app para estudiar veterinaria · app para calcular dosis veterinaria ·
app para estudiar anatomia veterinaria · app para aprender veterinaria
```

**Lección:** el volumen bruto engaña. Sin leer las keywords, habríamos apostado a un público equivocado (estudiantes, que no compran software de gestión).

## Paso 2 — la señal real (seeds de negocio)
Se repitió el minado con seeds orientados a la **gestión de la clínica**, no al término genérico. Ahí apareció el dueño de negocio buscando herramienta:

```
software / sistema para (clinica) veterinaria
como administrar una clinica veterinaria · programa para administrar veterinaria
como hacer una historia clinica veterinaria · como llenar una historia clinica veterinaria
software para historia clinica veterinaria · programa para clinica veterinaria gratis
```

## Paso 3 — la decisión (criterio, no volumen)
1. **El head-term "software para veterinaria" está competido** → difícil rankear por SEO de frente.
2. **Los long-tails sí son rankeables:** *"cómo hacer/llenar una historia clínica veterinaria"* — how-to, baja competencia, intención clara.
3. **Gate de usabilidad:** llenar la historia clínica es un acto **diario** del veterinario → una herramienta que lo agiliza tiene uso real y recurrente. (Contraste: una herramienta de "sube una foto y espera" para un microacto no tiene sentido — ese error se descartó a propósito.)

→ **Conclusión:** entrar por un **generador de historia clínica** (gratis, rankea por la búsqueda real, uso diario), y crecer hacia la gestión completa. No arrancar por el producto grande ni por el término competido.

## Cómo se validó, en concreto
- **Herramienta propia de demand-mining** (autocomplete gl=co) — no un servicio pago; código propio. La corrección del sesgo idioma/país (minaba en inglés) fue parte del trabajo.
- **Sin encuestas ni entrevistas** — todo de señales públicas de búsqueda.

## Qué falta validar (siguiente)
- Reviews públicas de apps/software veterinario → lista de "qué odian de lo actual" = requisitos.
- Medir uso real del generador una vez publicado (instrumentación de uso) → tracción como señal de si vale crecer al SaaS.

---

*Resumen para quien lee esto rápido: se detectó un dolor operativo real, se validó con datos de búsqueda públicos, se corrigió un sesgo en el dato, y se eligió el punto de entrada por criterio (SEO rankeable + uso diario), no por volumen bruto. Construir vino después de decidir con evidencia.*

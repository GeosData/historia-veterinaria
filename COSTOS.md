# COSTOS y Modelo Comercial — Historia Veterinaria

> Generado con la skill `pricing-offer` (2026-11-27). Mercado verificado vía WebSearch; oferta validada con Probeta (`Claridad 4.00/5 · Confianza 3.67/5 · 5/6 Probaría`).

## 1. Benchmark de mercado Colombia (verificado 2025–2026)

| Competidor | Precio público COP/mes | Qué incluye / nota |
|---|---|---|
| **Digivet** | Desde $27.900 COP/mes | Orientado a veterinarios independientes/domicilio |
| **DogtorSoftware** | $52.000 – $75.000 COP/mes | Historias + WhatsApp + DIAN |
| **OkVet One** | ~$69.900 COP/mes (1 usuario) | Historia clínica + agenda + DIAN |
| **CP VET (Vetlogy)** | $90.000 COP/mes ($900k/año) | Núcleo clínico + DIAN |
| **VetPraxis / QVET** | Cotización cerrada | Clínicas medianas/grandes |

**Cuña de diferenciación:** 100 % enfoque clínico + formato COMVEZCOL + recordatorios de vacunas (sin duplicar facturación DIAN de Alegra/Siigo), con entrada gratuita sin registro y planes transparentes debajo de OkVet/DogtorSoftware.

## 2. Costos reales en 3 escalas (USD → COP a $4.200)

| Rubro | Escala 1: Hoy / Piloto (1–5 clientes) | Escala 2: Producción real (20 clientes, sin cold start) | Escala 3: Negocio (100 clientes) |
|---|---|---|---|
| **API Cloud Run (`historia-veterinaria-api`)** | ~$0 – $5 USD (scale-to-zero) | **$18 – $28 USD** (min-instances 1 en horario laboral) | **$60 – $90 USD** (2+ instancias warm) |
| **PostgreSQL Neon (`historia_veterinaria`)** | ~$5 USD | **$15 – $25 USD** (compute activo + PITR) | **$50 – $80 USD** (compute dedicado + backups) |
| **Web Cloudflare Pages + Dominio + Email** | ~$2 USD | **$10 – $15 USD** | **$25 – $40 USD** |
| **Comisión pasarela (`api-billing` / Mercado Pago ~3.5 %)** | ~$5k COP | **~$31.000 COP** | **~$154.000 COP** |
| **Total infra + pasarela / mes** | **~$35k – $55k COP** | **~$210k – $315k COP** | **~$720k – $1.03M COP** |

## 3. Planes propuestos y margen (requiere aprobación de Josse antes de publicar)

| Plan | Mensual | Anual (2 meses gratis) | Público objetivo |
|---|---|---|---|
| **Gratis (Generador)** | $0 | $0 | Lead magnet SEO: historia clínica COMVEZCOL descargable sin registro |
| **Independiente** (1 vet) | **$29.000 COP/mes** | **$290.000 COP/año** | Veterinario a domicilio o consultorio unipersonal |
| **Consultorio** (hasta 4 prof.) | **$59.000 COP/mes** | **$590.000 COP/año** | Clínica veterinaria pequeña |

- **Ingreso promedio estimado (ARPU mix 50/50):** `$44.000 COP/mes`
- **Punto de equilibrio infra warm (Escala 2):** **7 clientes pagando** (`$308k COP/mes`).
- **Margen bruto a 20 clientes ($880k COP/mes):** **~68–76 %** (`~$600k COP/mes` antes de soporte).
- **Margen bruto a 100 clientes ($4.4M COP/mes):** **~77–84 %** (`~$3.5M COP/mes` antes de soporte).

## 4. Integración con `api-billing` (centralizado)

- Servicio live: `https://api-billing-gnh2pfoe5q-ue.a.run.app` (`200 OK` verificado 2026-11-27).
- Registro sugerido: `POST /apps/register` con `app_id: "historia-veterinaria"` y planes `independiente_mensual` ($29.000 COP), `consultorio_mensual` ($59.000 COP), más trial de 14 días sin tarjeta.

## 5. Validación Probeta (2026-11-27)

- **Resultado:** Claridad **4.00/5** · Confianza **3.67/5** · **5/6 `Probaría`** (1 bounce: clínica mediana que exige agenda de peluquería/citas).
- **Ajustes clave antes de cobrar:** mostrar capturas reales de la pantalla + ejemplo del PDF generado, y aclarar explícitamente que los recordatorios de vacunas se ven en el panel con botón rápido a WhatsApp (no prometer envío automático de WhatsApp API si aún es asistido).

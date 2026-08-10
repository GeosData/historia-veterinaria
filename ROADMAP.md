# Roadmap — historia-veterinaria

> Distribución 100% SEO/orgánico. Cada fase se valida por uso real antes de invertir en la siguiente.

## Fase 0 — Discovery (en curso)
- [x] Necesidad documentada (`docs/00-necesidad.md`).
- [x] Validación con demand-mining + gate de usabilidad (`docs/validacion.md`).
- [x] Estado del arte / competencia (`docs/01-estado-del-arte.md`).
- [ ] Reviews públicas de apps vet → "qué odian de lo actual" = requisitos.
- [ ] `02-nombres` (subdominio corto + SEO on-page) · `03-alcance` · `04-decisiones` (stack).

## Fase 1 — Tool-imán: generador de historia clínica
- [x] Formulario → historia clínica en PDF (print-to-PDF), lista para imprimir/archivar. Client-side, sin cuenta.
- [x] SEO on-page para *"cómo hacer/llenar una historia clínica veterinaria"*.
- [x] Subdominio propio `historia-veterinaria.geosdata.com` (CF Pages + CNAME manual).
- [ ] **Medición**: al ser client-side no pega a la API del motor → el contador Neon no la cuenta. Necesita CF Web Analytics (visitas) + evento "generó historia clínica" a un endpoint. Pendiente.

## Fase 2 — Contenido SEO (atrae al veterinario)
- [ ] Artículos: "cómo llenar una historia clínica veterinaria", "cómo administrar una clínica veterinaria", "qué debe tener una historia clínica".
- [ ] En `content/`, publicados bajo el subdominio del producto (refuerza el SEO de la tool).

## Fase 3 — Gestión (si valida)
> Solo si el generador muestra tracción por uso. Si no lo usan, se archiva sin culpa.
- [ ] Cuenta + guardar pacientes (historial reutilizable).
- [ ] Agenda de citas.
- [ ] **Recordatorio de revacunación/desparasitación** (recurrencia = trae de vuelta al cliente = ingreso).

## Nota
La historia clínica es la puerta, no el producto final. El valor grande está en la recurrencia (revacunación), pero se llega ahí tras validar el uso del imán.

# 04 — Decisiones (stack lockeado)

> Estilo ADR condensado. Cada decisión con alternativa + razón. Se reusa la plataforma Geosdata; no se reinventa.

## D1 — Es un SaaS con datos, no una tool client-side
- Alternativa: página JS (formulario/calculadora) sin backend.
- Razón: el valor del producto (historial reutilizable + recordatorio de revacunación) **requiere datos persistidos**. Una calculadora/formulario no aporta valor que el vet no haga solo. Ver `docs/validacion.md` y el gate de usabilidad.

## D2 — Base de datos: **Postgres (Neon), DB `historia_veterinaria`**
- Alternativa: Mongo, Firebase.
- Razón: paved-road de datos (SQL = Neon, proyecto `geosdata-platform`, DB por servicio). Datos relacionales claros (clínica → pacientes → consultas/vacunas). Ya creada.

## D3 — API: **FastAPI (Python) + psycopg → Cloud Run**
- Alternativa: Node.
- Razón: paved-road de deploy para APIs Python (Cloud Run + Neon). Alinea con el objetivo de carrera (Python) y con el resto de servicios Geosdata. Estructura por capas (config/routes/controllers/services/repositories/middleware).

## D4 — Multi-tenant: **row-level por `clinic_id`**
- Alternativa: DB por cliente (over-engineering para este tamaño).
- Razón: patrón simple y probado (mismo que micro-business). Cada query filtra por `clinic_id` resuelto desde el auth.

## D5 — Auth v1: **X-API-Key → clinic** (simple), migrable a api-auth
- Alternativa: api-auth/Clerk desde el día 1.
- Razón: para el v1 arrancar simple (registro genera api_key, header `X-API-Key` resuelve la clínica). Como es subdominio geosdata, la migración natural es a **api-auth** (no Clerk, que es para dominio propio — ver `auth-estrategia-dominio-subdominio`). Se migra cuando haya login de usuario real.

## D6 — Front: **web con estado sobre el backend** (a definir framework)
- Login → dashboard: pacientes, historial, registrar consulta, recordatorios.
- Framework por decidir (Astro+islas vs SPA). Deploy CF Pages.
- Reusar `console-kit`/`platform-client` donde aplique.

## D7 — Deploy: **Cloud Run (api) + Neon (db) + CF Pages (web)**
- Razón: molde de graduación ya probado en el ecosistema.

## Pendientes (no bloquean el backend)
- Framework de frontend.
- Envío del recordatorio (WhatsApp/email) → fase 2.
- Migración de auth a api-auth cuando haya login de usuario.
- Nombre/subdominio final (working: `historia-veterinaria`).

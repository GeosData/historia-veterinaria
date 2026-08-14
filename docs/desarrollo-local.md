# Desarrollo local

> Iterar en local (API + front) contra la DB de Neon. **Publicar solo cuando el flujo esté listo** — no deployar por cada cambio.

## Levantar

**Backend** (FastAPI, puerto 8000, con reload):
```
cd api
./.venv/Scripts/python.exe -m uvicorn app.main:app --reload --port 8000
```
Usa `api/.env`: `DATABASE_URL` (Neon) + `FIREBASE_PROJECT_ID=geosdata-apps`.

**Frontend** (Vite dev, puerto 5173):
```
cd web
npm run dev
```
Usa `web/.env.development` → `VITE_API_URL=http://localhost:8000` (apunta a la API local). Los `VITE_FIREBASE_*` viven en `web/.env` (mismos en local y prod).

Abrir http://localhost:5173. El login con Google funciona en local (`localhost` está en los Authorized domains de Firebase).

## Cómo resuelve la API el front

| Entorno | Archivo | `VITE_API_URL` |
|---|---|---|
| `npm run dev` (local) | `.env.development` | `http://localhost:8000` |
| `npm run build` (publicar) | `.env` / `.env.production` | Cloud Run (prod) |

Vite carga `.env.development` solo en dev, así que el build de producción sigue apuntando a la API en Cloud Run sin tocar nada.

## Arquitectura de despliegue (subdominio único)

`historia-veterinaria.geosdata.com` sirve dos capas desde **un solo** proyecto CF Pages:
- **`/` (root)** → `site/` = capa SEO estática (Astro). Pública, rankeable. El imán = el generador de historia clínica.
- **`/app`** → `web/` = la app SPA (React, tras login Firebase). Build con `base: '/app/'` + router `basename="/app"`.
- El fallback SPA lo da `site/public/_redirects` (`/app/* /app/index.html 200`).

## Publicar (solo cuando esté listo)
```
# API → Cloud Run
cd api && gcloud run deploy historia-veterinaria-api --source . --region us-central1 --project geosdata --quiet

# Front (SEO + app) → Cloudflare Pages, build combinado:
cd web && npm run build           # SPA -> web/dist (base /app/)
cd ../site && npm run build        # SEO estático -> site/dist (root)
mkdir -p dist/app && cp -r ../web/dist/* dist/app/   # monta la SPA bajo /app
wrangler pages deploy dist --project-name historia-veterinaria --branch main
```
> Nota SEO: CF Pages normaliza a trailing-slash (308). El canonical del `site/` ya lo respeta (ver `Base.astro`).

## Nota sobre datos
Local pega a la **misma DB Neon** que prod (`historia_veterinaria`). Para no ensuciar prod con pruebas, se puede crear un **branch de Neon** para dev y apuntar `api/.env` a ese branch (Neon → Branches). Por ahora comparten DB.

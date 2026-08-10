# 03 — Alcance

> Producto real **con datos**: SaaS de gestión para clínicas veterinarias pequeñas. No una calculadora ni un formulario — el valor está en persistir y reutilizar la información del paciente.

## Usuario
Veterinario(a) de una clínica pequeña. Se registra, crea una cuenta, y gestiona sus pacientes desde ahí.

## El valor central (por qué es producto y no página)
1. **Registrar el paciente una vez** → no re-escribir sus datos en cada consulta.
2. **Historia clínica acumulada** → cada consulta queda ligada al paciente; el historial es recuperable.
3. **Recordatorio de revacunación/desparasitación** → el sistema avisa cuándo toca; el cliente vuelve = ingreso recurrente. Esta es la feature que sostiene el negocio.

Nada de esto existe sin datos persistidos. Por eso es backend + base de datos, no client-side.

## Dentro de v1
- **Cuenta de clínica** (registro con email → api_key).
- **Dueños** (owners): datos de contacto.
- **Pacientes**: identificación completa, ligados a un dueño.
- **Historia clínica** (consultations): motivo, examen físico, diagnóstico, tratamiento, próxima cita — una por consulta, ligada al paciente.
- **Vacunas**: aplicadas + próxima fecha.
- **Recordatorios**: lista de vacunas próximas a vencer (30 días) con paciente + dueño + teléfono. La feature de valor.
- Multi-tenant: cada clínica ve solo sus datos (row-level por `clinic_id`).

## Fuera de v1 (backlog)
- Facturación / cobro.
- Inventario de medicamentos.
- Agenda de citas con calendario visual.
- Multi-usuario por clínica (varios veterinarios).
- App móvil.
- Envío automático del recordatorio (WhatsApp/email) — v1 solo lista; el envío es fase 2.

## Definición de "terminado v1"
Un veterinario puede: registrarse → crear un paciente → registrar una consulta → ver el historial del paciente → ver la lista de recordatorios de revacunación próximos. Con datos reales persistidos en Neon, desplegado.

## Distribución
100% SEO/orgánico: el contenido (`content/`) rankea por "cómo administrar una clínica veterinaria", "historia clínica veterinaria" → trae al vet → se registra. Inbound, sin perseguir a nadie.

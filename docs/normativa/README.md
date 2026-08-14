# Normativa veterinaria Colombia — síntesis para el producto

> Investigado 2026-08-10. Fuentes primarias abajo. PDFs completos en esta carpeta.

## Lo que la ley SÍ exige (obligatorio)
1. **Matrícula profesional COMVEZCOL** para ejercer y **firmar** cualquier historia clínica o fórmula (Ley 576 de 2000). Es obligatoria. **No hay formato de número estándar** → campo de **texto libre alfanumérico**. Verificable manual en la [consulta pública COMVEZCOL](https://consejoprofesionalmvz.gov.co/consulta-de-profesionales) (no hay API).
2. **Cada evento de la historia clínica** debe quedar firmado con **nombre + número de matrícula** del MV/MVZ tratante (no solo la HC general).
3. **Historia clínica privada/reservada**: solo el propietario o casos de ley la pueden conocer (art. 61 Ley 576). Aplica **Ley 1581/2012 (habeas data)** al manejo de datos.
4. **Prescripción de medicamentos** (si se agrega módulo): 11 campos mínimos (Res. ICA 105215/2021, art. 13); solo MV/MVZ con matrícula vigente puede firmar.

## Lo que la ley NO exige (decisión de producto)
- **Título/tratamiento**: la ley NO obliga "Dr(a).". La convención oficial es **sufijo**: "Ana Ríos, MV" o "Ana Ríos, MVZ". → la app usa **MV/MVZ como sufijo, elegible por el médico**, no "Dr." forzado.
- **Contenido mínimo de la historia clínica**: **NO existe norma obligatoria** (a diferencia de medicina humana, que tiene la Resolución 1995/1999). El propio COMVEZCOL lo admite en su informe 2018. Existe solo una **guía de 16 componentes (COMVEZCOL 2018)** — buena práctica, NO ley. → usarla como **plantilla de campos**, sin venderla como "requisito legal".
- **Registro ICA del establecimiento**: no confirmado como obligatorio general (solo para exportación de mascotas). Cámara de Comercio + Concepto Sanitario municipal = **campos opcionales**, no bloquear onboarding.

## Diseño técnico derivado
- HC electrónica permitida **si es append-only** (no modificar registros ya guardados) + audit trail. Diseñar consultas como inmutables una vez firmadas.
- Retención sugerida (no vinculante): 5 años.

## Guía COMVEZCOL 2018 — 16 componentes (referencia de campos)
Establecimiento · ID de HC (consecutivo, fecha/hora) · propietario · reseña (incl. **microchip**, señas) · anamnesis (dieta, vacunas, desparasitación, esterilización, etc.) · examen físico (condición corporal, T°, FC, FR, TLLC, mucosas, %deshidratación) · lista de problemas/diferenciales · exámenes complementarios · dx presuntivo · dx definitivo · plan terapéutico · pronóstico · evolución cronológica · observaciones · anexos (consentimientos) · **firma + matrícula del MV/MVZ**.

## Fuentes
- [Ley 576 de 2000 (Función Pública)](https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=66201) · [texto MinEducación](https://www.mineducacion.gov.co/1621/articles-105017_archivo_pdf.pdf)
- [Informe Historia Clínica y Consentimiento Informado — COMVEZCOL 2018](https://consejoprofesionalmvz.gov.co/src/files/Informe-Historia-clinica-y-consentimiento-informado.pdf) *(PDF local)*
- [Guía registro MV-MVZ / clínicas — ICA](https://www.ica.gov.co/importacion-y-exportacion/otros-procedimientos/guia-de-registro-de-mv-mvz-clinicas-veterinari-1.aspx)
- [Resolución ICA 105215 de 2021](https://www.ica.gov.co/getattachment/e90030ae-b76d-4194-8679-6bdacbee07d9/2021R105215.aspx) *(PDF local)*
- [Consulta de profesionales COMVEZCOL](https://consejoprofesionalmvz.gov.co/consulta-de-profesionales)

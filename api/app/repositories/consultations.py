from datetime import date
from typing import Any

from psycopg.types.json import Json

from app.db import get_conn


def insert(
    clinic_id: str,
    patient_id: str,
    vet_id: str | None,
    consult_date: date | None,
    reason: str | None,
    exam: dict[str, Any] | None,
    dx_presumptive: str | None,
    dx_definitive: str | None,
    treatment: str | None,
    next_visit: date | None,
) -> dict[str, Any]:
    with get_conn() as conn:
        row = conn.execute(
            """
            INSERT INTO consultations (
                clinic_id, patient_id, vet_id, date, reason, exam,
                dx_presumptive, dx_definitive, treatment, next_visit
            )
            VALUES (
                %s, %s, %s, COALESCE(%s, CURRENT_DATE), %s, %s, %s, %s, %s, %s
            )
            RETURNING id, clinic_id, patient_id, vet_id, date, reason, exam,
                      dx_presumptive, dx_definitive, treatment, next_visit, created_at
            """,
            (
                clinic_id,
                patient_id,
                vet_id,
                consult_date,
                reason,
                Json(exam) if exam is not None else None,
                dx_presumptive,
                dx_definitive,
                treatment,
                next_visit,
            ),
        ).fetchone()
        conn.commit()
    return row


def list_for_patient(clinic_id: str, patient_id: str) -> list[dict[str, Any]]:
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT id, clinic_id, patient_id, vet_id, date, reason, exam,
                   dx_presumptive, dx_definitive, treatment, next_visit, created_at
            FROM consultations
            WHERE clinic_id = %s AND patient_id = %s
            ORDER BY date DESC, created_at DESC
            """,
            (clinic_id, patient_id),
        ).fetchall()
    return rows

from datetime import date
from typing import Any

from app.db import get_conn


def insert(
    clinic_id: str,
    patient_id: str,
    name: str,
    applied_at: date | None,
    next_due: date | None,
) -> dict[str, Any]:
    with get_conn() as conn:
        row = conn.execute(
            """
            INSERT INTO vaccines (clinic_id, patient_id, name, applied_at, next_due)
            VALUES (%s, %s, %s, COALESCE(%s, CURRENT_DATE), %s)
            RETURNING id, clinic_id, patient_id, name, applied_at, next_due, created_at
            """,
            (clinic_id, patient_id, name, applied_at, next_due),
        ).fetchone()
        conn.commit()
    return row


def list_for_patient(clinic_id: str, patient_id: str) -> list[dict[str, Any]]:
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT id, clinic_id, patient_id, name, applied_at, next_due, created_at
            FROM vaccines
            WHERE clinic_id = %s AND patient_id = %s
            ORDER BY next_due DESC NULLS LAST, created_at DESC
            """,
            (clinic_id, patient_id),
        ).fetchall()
    return rows


def list_due_within(clinic_id: str, days: int) -> list[dict[str, Any]]:
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT v.id AS vaccine_id, v.name AS vaccine_name, v.next_due,
                   p.id AS patient_id, p.name AS patient_name,
                   o.name AS owner_name, o.phone AS owner_phone
            FROM vaccines v
            JOIN patients p ON p.id = v.patient_id AND p.clinic_id = v.clinic_id
            LEFT JOIN owners o ON o.id = p.owner_id AND o.clinic_id = v.clinic_id
            WHERE v.clinic_id = %s
              AND v.next_due IS NOT NULL
              AND v.next_due BETWEEN CURRENT_DATE AND CURRENT_DATE + make_interval(days => %s)
            ORDER BY v.next_due ASC
            """,
            (clinic_id, days),
        ).fetchall()
    return rows

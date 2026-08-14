from typing import Any

from app.db import get_conn


def list_vets_for_clinic(clinic_id: str) -> list[dict[str, Any]]:
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT v.id, v.user_id, v.name, v.title, v.license, v.email, v.created_at
            FROM clinic_vets cv
            JOIN vets v ON v.id = cv.vet_id
            WHERE cv.clinic_id = %s
            ORDER BY cv.created_at DESC
            """,
            (clinic_id,),
        ).fetchall()
    return rows


def is_associated(clinic_id: str, vet_id: str) -> bool:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT 1 FROM clinic_vets WHERE clinic_id = %s AND vet_id = %s",
            (clinic_id, vet_id),
        ).fetchone()
    return row is not None


def associate(clinic_id: str, vet_id: str) -> None:
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO clinic_vets (clinic_id, vet_id) VALUES (%s, %s)",
            (clinic_id, vet_id),
        )
        conn.commit()


def disassociate(clinic_id: str, vet_id: str) -> bool:
    with get_conn() as conn:
        row = conn.execute(
            """
            DELETE FROM clinic_vets
            WHERE clinic_id = %s AND vet_id = %s
            RETURNING vet_id
            """,
            (clinic_id, vet_id),
        ).fetchone()
        conn.commit()
    return row is not None

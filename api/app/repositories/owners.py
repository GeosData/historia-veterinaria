from typing import Any

from app.db import get_conn


def insert(
    clinic_id: str,
    name: str,
    document: str | None,
    phone: str | None,
    address: str | None,
) -> dict[str, Any]:
    with get_conn() as conn:
        row = conn.execute(
            """
            INSERT INTO owners (clinic_id, name, document, phone, address)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id, clinic_id, name, document, phone, address, created_at
            """,
            (clinic_id, name, document, phone, address),
        ).fetchone()
        conn.commit()
    return row


def list_for_clinic(clinic_id: str) -> list[dict[str, Any]]:
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT id, clinic_id, name, document, phone, address, created_at
            FROM owners
            WHERE clinic_id = %s
            ORDER BY created_at DESC
            """,
            (clinic_id,),
        ).fetchall()
    return rows


def exists(clinic_id: str, owner_id: str) -> bool:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT 1 FROM owners WHERE id = %s AND clinic_id = %s",
            (owner_id, clinic_id),
        ).fetchone()
    return row is not None

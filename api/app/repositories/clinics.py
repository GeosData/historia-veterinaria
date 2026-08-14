from typing import Any

from app.db import get_conn


def list_for_user(user_id: str) -> list[dict[str, Any]]:
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT id, name, email, created_at
            FROM clinics
            WHERE user_id = %s
            ORDER BY created_at DESC
            """,
            (user_id,),
        ).fetchall()
    return rows


def find(clinic_id: str) -> dict[str, Any] | None:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT id, name, email, created_at FROM clinics WHERE id = %s",
            (clinic_id,),
        ).fetchone()
    return row


def belongs_to_user(clinic_id: str, user_id: str) -> bool:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT 1 FROM clinics WHERE id = %s AND user_id = %s",
            (clinic_id, user_id),
        ).fetchone()
    return row is not None


def exists_by_name(user_id: str, name: str) -> bool:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT 1 FROM clinics WHERE user_id = %s AND lower(btrim(name)) = lower(btrim(%s))",
            (user_id, name),
        ).fetchone()
    return row is not None


def insert(name: str, email: str, user_id: str) -> dict[str, Any]:
    with get_conn() as conn:
        row = conn.execute(
            """
            INSERT INTO clinics (name, email, user_id)
            VALUES (%s, %s, %s)
            RETURNING id, name, email, created_at
            """,
            (name, email, user_id),
        ).fetchone()
        conn.commit()
    return row

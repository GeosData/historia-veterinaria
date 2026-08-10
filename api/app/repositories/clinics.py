from typing import Any

from app.db import get_conn


def find_id_by_user_id(user_id: str) -> str | None:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT id FROM clinics WHERE user_id = %s",
            (user_id,),
        ).fetchone()
    if row is None:
        return None
    return str(row["id"])


def find_by_user_id(user_id: str) -> dict[str, Any] | None:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT id, name, vet_name, email, created_at FROM clinics WHERE user_id = %s",
            (user_id,),
        ).fetchone()
    return row


def insert(name: str, vet_name: str, email: str, user_id: str) -> dict[str, Any]:
    with get_conn() as conn:
        row = conn.execute(
            """
            INSERT INTO clinics (name, vet_name, email, user_id)
            VALUES (%s, %s, %s, %s)
            RETURNING id, name, vet_name, email, created_at
            """,
            (name, vet_name, email, user_id),
        ).fetchone()
        conn.commit()
    return row

from typing import Any

from app.db import get_conn


def list_for_user(user_id: str) -> list[dict[str, Any]]:
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT id, user_id, name, license, email, created_at
            FROM vets
            WHERE user_id = %s
            ORDER BY created_at DESC
            """,
            (user_id,),
        ).fetchall()
    return rows


def exists(vet_id: str, user_id: str) -> bool:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT 1 FROM vets WHERE id = %s AND user_id = %s",
            (vet_id, user_id),
        ).fetchone()
    return row is not None


def insert(
    user_id: str,
    name: str,
    license: str | None,
    email: str | None,
) -> dict[str, Any]:
    with get_conn() as conn:
        row = conn.execute(
            """
            INSERT INTO vets (user_id, name, license, email)
            VALUES (%s, %s, %s, %s)
            RETURNING id, user_id, name, license, email, created_at
            """,
            (user_id, name, license, email),
        ).fetchone()
        conn.commit()
    return row


def update(
    vet_id: str,
    user_id: str,
    name: str | None,
    license: str | None,
    email: str | None,
) -> dict[str, Any] | None:
    with get_conn() as conn:
        row = conn.execute(
            """
            UPDATE vets
            SET name = COALESCE(%s, name),
                license = COALESCE(%s, license),
                email = COALESCE(%s, email)
            WHERE id = %s AND user_id = %s
            RETURNING id, user_id, name, license, email, created_at
            """,
            (name, license, email, vet_id, user_id),
        ).fetchone()
        conn.commit()
    return row


def delete(vet_id: str, user_id: str) -> bool:
    with get_conn() as conn:
        row = conn.execute(
            "DELETE FROM vets WHERE id = %s AND user_id = %s RETURNING id",
            (vet_id, user_id),
        ).fetchone()
        conn.commit()
    return row is not None

from typing import Any

from app.db import get_conn


def list_for_user(user_id: str) -> list[dict[str, Any]]:
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT id, user_id, name, created_at
            FROM species
            WHERE user_id = %s
            ORDER BY lower(name)
            """,
            (user_id,),
        ).fetchall()
    return rows


def insert(user_id: str, name: str) -> dict[str, Any]:
    with get_conn() as conn:
        row = conn.execute(
            """
            INSERT INTO species (user_id, name)
            VALUES (%s, %s)
            ON CONFLICT (user_id, lower(name)) DO NOTHING
            RETURNING id, user_id, name, created_at
            """,
            (user_id, name),
        ).fetchone()
        if row is None:
            row = conn.execute(
                """
                SELECT id, user_id, name, created_at
                FROM species
                WHERE user_id = %s AND lower(name) = lower(%s)
                """,
                (user_id, name),
            ).fetchone()
        conn.commit()
    return row


def update(species_id: str, user_id: str, name: str) -> dict[str, Any] | None:
    with get_conn() as conn:
        row = conn.execute(
            """
            UPDATE species SET name = %s
            WHERE id = %s AND user_id = %s
            RETURNING id, user_id, name, created_at
            """,
            (name, species_id, user_id),
        ).fetchone()
        conn.commit()
    return row


def delete(species_id: str, user_id: str) -> bool:
    with get_conn() as conn:
        row = conn.execute(
            "DELETE FROM species WHERE id = %s AND user_id = %s RETURNING id",
            (species_id, user_id),
        ).fetchone()
        conn.commit()
    return row is not None

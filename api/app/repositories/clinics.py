from typing import Any

from app.db import get_conn


def find_id_by_api_key(api_key: str) -> str | None:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT id FROM clinics WHERE api_key = %s",
            (api_key,),
        ).fetchone()
    if row is None:
        return None
    return str(row["id"])


def insert(name: str, vet_name: str, email: str, api_key: str) -> dict[str, Any]:
    with get_conn() as conn:
        row = conn.execute(
            """
            INSERT INTO clinics (name, vet_name, email, api_key)
            VALUES (%s, %s, %s, %s)
            RETURNING id, api_key
            """,
            (name, vet_name, email, api_key),
        ).fetchone()
        conn.commit()
    return row

from decimal import Decimal
from datetime import date
from typing import Any

from app.db import get_conn


def insert(
    clinic_id: str,
    owner_id: str | None,
    name: str,
    species: str | None,
    breed: str | None,
    sex: str | None,
    birthdate: date | None,
    weight_kg: Decimal | None,
    color: str | None,
    neutered: bool | None,
) -> dict[str, Any]:
    with get_conn() as conn:
        row = conn.execute(
            """
            INSERT INTO patients (
                clinic_id, owner_id, name, species, breed, sex,
                birthdate, weight_kg, color, neutered
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id, clinic_id, owner_id, name, species, breed, sex,
                      birthdate, weight_kg, color, neutered, created_at
            """,
            (
                clinic_id,
                owner_id,
                name,
                species,
                breed,
                sex,
                birthdate,
                weight_kg,
                color,
                neutered,
            ),
        ).fetchone()
        conn.commit()
    return row


def list_for_clinic(clinic_id: str) -> list[dict[str, Any]]:
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT p.id, p.clinic_id, p.owner_id, p.name, p.species, p.breed,
                   p.sex, p.birthdate, p.weight_kg, p.color, p.neutered,
                   p.created_at, o.name AS owner_name
            FROM patients p
            LEFT JOIN owners o ON o.id = p.owner_id AND o.clinic_id = p.clinic_id
            WHERE p.clinic_id = %s
            ORDER BY p.created_at DESC
            """,
            (clinic_id,),
        ).fetchall()
    return rows


def find(clinic_id: str, patient_id: str) -> dict[str, Any] | None:
    with get_conn() as conn:
        row = conn.execute(
            """
            SELECT id, clinic_id, owner_id, name, species, breed, sex,
                   birthdate, weight_kg, color, neutered, created_at
            FROM patients
            WHERE id = %s AND clinic_id = %s
            """,
            (patient_id, clinic_id),
        ).fetchone()
    return row


def exists(clinic_id: str, patient_id: str) -> bool:
    with get_conn() as conn:
        row = conn.execute(
            "SELECT 1 FROM patients WHERE id = %s AND clinic_id = %s",
            (patient_id, clinic_id),
        ).fetchone()
    return row is not None

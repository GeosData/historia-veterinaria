from typing import Any

from psycopg.errors import UniqueViolation

from app.repositories import species
from app.schemas.models import Species


class SpeciesNameExists(Exception):
    pass

DEFAULT_SPECIES = [
    "Canino",
    "Felino",
    "Ave",
    "Roedor",
    "Conejo",
    "Reptil",
    "Equino",
    "Otro",
]


def list_species(uid: str) -> list[Species]:
    rows = species.list_for_user(uid)
    if not rows:
        rows = [species.insert(uid, name) for name in DEFAULT_SPECIES]
    return [_to_species(row) for row in rows]


def add_species(uid: str, name: str) -> Species:
    return _to_species(species.insert(uid, name))


def rename_species(uid: str, species_id: str, name: str) -> Species | None:
    try:
        row = species.update(species_id, uid, name)
    except UniqueViolation:
        raise SpeciesNameExists()
    return _to_species(row) if row is not None else None


def remove_species(uid: str, species_id: str) -> bool:
    return species.delete(species_id, uid)


def _to_species(row: dict[str, Any]) -> Species:
    return Species.model_validate(row)

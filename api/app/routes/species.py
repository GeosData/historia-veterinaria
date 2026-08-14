from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.middleware.auth import require_user
from app.schemas.models import Species, SpeciesCreate
from app.services import species as species_service
from app.services.species import SpeciesNameExists

router = APIRouter(tags=["species"])


@router.get("/species", response_model=list[Species])
def list_species(user: dict[str, str | None] = Depends(require_user)) -> list[Species]:
    return species_service.list_species(str(user["uid"]))


@router.post("/species", response_model=Species, status_code=status.HTTP_201_CREATED)
def create_species(
    payload: SpeciesCreate,
    user: dict[str, str | None] = Depends(require_user),
) -> Species:
    name = payload.name.strip()
    if not name:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="El nombre de la especie es obligatorio.",
        )
    return species_service.add_species(str(user["uid"]), name)


@router.patch("/species/{species_id}", response_model=Species)
def update_species(
    species_id: str,
    payload: SpeciesCreate,
    user: dict[str, str | None] = Depends(require_user),
) -> Species:
    name = payload.name.strip()
    if not name:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="El nombre de la especie es obligatorio.",
        )
    try:
        updated = species_service.rename_species(str(user["uid"]), species_id, name)
    except SpeciesNameExists:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya tienes una especie con ese nombre.",
        )
    if updated is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="species_not_found")
    return updated


@router.delete("/species/{species_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_species(
    species_id: str,
    user: dict[str, str | None] = Depends(require_user),
) -> Response:
    if not species_service.remove_species(str(user["uid"]), species_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="species_not_found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)

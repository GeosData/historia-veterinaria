from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.middleware.auth import require_user
from app.repositories import vets
from app.schemas.models import Vet, VetCreate, VetUpdate

router = APIRouter(tags=["vets"])


@router.get("/vets", response_model=list[Vet])
def list_vets(user: dict[str, str | None] = Depends(require_user)) -> list[Vet]:
    rows = vets.list_for_user(str(user["uid"]))
    return [Vet.model_validate(row) for row in rows]


@router.post("/vets", response_model=Vet, status_code=status.HTTP_201_CREATED)
def create_vet(
    payload: VetCreate,
    user: dict[str, str | None] = Depends(require_user),
) -> Vet:
    row = vets.insert(
        user_id=str(user["uid"]),
        name=payload.name,
        title=payload.title,
        license=payload.license,
        email=payload.email,
    )
    return Vet.model_validate(row)


@router.patch("/vets/{vet_id}", response_model=Vet)
def update_vet(
    vet_id: str,
    payload: VetUpdate,
    user: dict[str, str | None] = Depends(require_user),
) -> Vet:
    row = vets.update(
        vet_id=vet_id,
        user_id=str(user["uid"]),
        name=payload.name,
        title=payload.title,
        license=payload.license,
        email=payload.email,
    )
    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="vet_not_found")
    return Vet.model_validate(row)


@router.delete("/vets/{vet_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_vet(
    vet_id: str,
    user: dict[str, str | None] = Depends(require_user),
) -> Response:
    if not vets.delete(vet_id, str(user["uid"])):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="vet_not_found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)

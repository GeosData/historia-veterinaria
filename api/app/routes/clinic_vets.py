from fastapi import APIRouter, Depends, HTTPException, Response, status

from app.middleware.auth import require_clinic_access, require_user
from app.repositories import clinic_vets, vets
from app.schemas.models import ClinicVetAssociate, Vet

router = APIRouter(tags=["clinic-vets"])


@router.get("/clinics/{clinic_id}/vets", response_model=list[Vet])
def list_clinic_vets(clinic_id: str = Depends(require_clinic_access)) -> list[Vet]:
    rows = clinic_vets.list_vets_for_clinic(clinic_id)
    return [Vet.model_validate(row) for row in rows]


@router.post(
    "/clinics/{clinic_id}/vets",
    response_model=list[Vet],
    status_code=status.HTTP_201_CREATED,
)
def associate_vet(
    payload: ClinicVetAssociate,
    clinic_id: str = Depends(require_clinic_access),
    user: dict[str, str | None] = Depends(require_user),
) -> list[Vet]:
    if not vets.exists(payload.vet_id, str(user["uid"])):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="vet_not_found")
    if clinic_vets.is_associated(clinic_id, payload.vet_id):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="already_associated")
    clinic_vets.associate(clinic_id, payload.vet_id)
    rows = clinic_vets.list_vets_for_clinic(clinic_id)
    return [Vet.model_validate(row) for row in rows]


@router.delete(
    "/clinics/{clinic_id}/vets/{vet_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def disassociate_vet(
    vet_id: str,
    clinic_id: str = Depends(require_clinic_access),
) -> Response:
    if not clinic_vets.disassociate(clinic_id, vet_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="association_not_found")
    return Response(status_code=status.HTTP_204_NO_CONTENT)

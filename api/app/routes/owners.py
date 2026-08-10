from fastapi import APIRouter, Depends, status

from app.middleware.auth import require_clinic
from app.repositories import owners
from app.schemas.models import Owner, OwnerCreate

router = APIRouter(tags=["owners"])


@router.post("/owners", response_model=Owner, status_code=status.HTTP_201_CREATED)
def create_owner(payload: OwnerCreate, clinic_id: str = Depends(require_clinic)) -> Owner:
    row = owners.insert(
        clinic_id=clinic_id,
        name=payload.name,
        document=payload.document,
        phone=payload.phone,
        address=payload.address,
    )
    return Owner.model_validate(row)


@router.get("/owners", response_model=list[Owner])
def list_owners(clinic_id: str = Depends(require_clinic)) -> list[Owner]:
    rows = owners.list_for_clinic(clinic_id)
    return [Owner.model_validate(row) for row in rows]

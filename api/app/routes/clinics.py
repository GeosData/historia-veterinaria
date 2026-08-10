from fastapi import APIRouter, Depends, Response, status

from app.middleware.auth import require_user
from app.schemas.models import Clinic, ClinicCreate
from app.services import clinics as clinics_service

router = APIRouter(tags=["clinics"])


@router.post("/clinics", response_model=Clinic, status_code=status.HTTP_201_CREATED)
def register_clinic(
    payload: ClinicCreate,
    user: dict[str, str | None] = Depends(require_user),
) -> Clinic:
    return clinics_service.register_clinic(
        payload,
        uid=str(user["uid"]),
        email=str(user["email"]),
    )


@router.get("/me/clinic", response_model=Clinic | None)
def get_my_clinic(
    response: Response,
    user: dict[str, str | None] = Depends(require_user),
) -> Clinic | None:
    clinic = clinics_service.get_clinic(str(user["uid"]))
    if clinic is None:
        response.status_code = status.HTTP_204_NO_CONTENT
        return None
    return clinic

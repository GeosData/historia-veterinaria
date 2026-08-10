from fastapi import APIRouter, Depends

from app.middleware.auth import require_clinic_access
from app.repositories import vaccines
from app.schemas.models import Reminder

REMINDER_WINDOW_DAYS = 30

router = APIRouter(tags=["reminders"])


@router.get("/clinics/{clinic_id}/reminders", response_model=list[Reminder])
def list_reminders(clinic_id: str = Depends(require_clinic_access)) -> list[Reminder]:
    rows = vaccines.list_due_within(clinic_id, REMINDER_WINDOW_DAYS)
    return [Reminder.model_validate(row) for row in rows]

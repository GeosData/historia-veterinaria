import json
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, status

from app.config import get_settings
from app.middleware.auth import require_user

router = APIRouter(prefix="/billing", tags=["billing"])

APP_ID = "historia-veterinaria"


def _billing_request(method: str, path: str, payload: dict[str, Any] | None = None) -> dict[str, Any]:
    settings = get_settings()
    if not settings.billing_api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="El servicio de cobros no está configurado todavía.",
        )

    url = f"{settings.billing_api_url.rstrip('/')}{path}"
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "X-API-Key": settings.billing_api_key,
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            raw = resp.read().decode("utf-8")
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="ignore")
        if exc.code == 404:
            return {"status": "none"}
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Error al comunicar con api-billing ({exc.code}): {body[:160]}",
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"No se pudo conectar con api-billing: {exc}",
        )


@router.get("/subscription")
def get_subscription(user: dict[str, str | None] = Depends(require_user)) -> dict[str, Any]:
    uid = urllib.parse.quote(str(user["uid"]), safe="")
    res = _billing_request("GET", f"/subscription/{uid}?appId={APP_ID}")
    return {
        "app_id": APP_ID,
        "status": res.get("status", "none"),
        "plan_name": "Independiente ($29.000 COP/mes)",
        "trial_days": 14,
        "raw": res,
    }


@router.post("/subscribe")
def create_subscription(user: dict[str, str | None] = Depends(require_user)) -> dict[str, Any]:
    uid = str(user["uid"])
    email = str(user.get("email") or "").strip()
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tu cuenta no tiene un correo asociado para iniciar el pago.",
        )

    res = _billing_request(
        "POST",
        "/subscribe",
        {"userId": uid, "email": email, "appId": APP_ID},
    )
    init_point = res.get("init_point")
    if not init_point:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Mercado Pago no devolvió enlace de suscripción.",
        )
    return {"init_point": init_point}

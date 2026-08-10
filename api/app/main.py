from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routes import (
    clinic_vets,
    clinics,
    consultations,
    owners,
    patients,
    reminders,
    vaccines,
    vets,
)


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="historia-veterinaria", version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    app.include_router(clinics.router)
    app.include_router(vets.router)
    app.include_router(clinic_vets.router)
    app.include_router(owners.router)
    app.include_router(patients.router)
    app.include_router(consultations.router)
    app.include_router(vaccines.router)
    app.include_router(reminders.router)

    return app


app = create_app()

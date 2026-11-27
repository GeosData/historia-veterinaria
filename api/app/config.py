from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = ""
    allowed_origins: list[str] = ["*"]
    firebase_project_id: str = ""
    billing_api_url: str = "https://api-billing-gnh2pfoe5q-ue.a.run.app"
    billing_api_key: str = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()

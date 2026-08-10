from contextlib import contextmanager
from typing import Iterator

import psycopg
from psycopg.rows import dict_row
from psycopg.types.string import TextLoader

from app.config import get_settings


class _UuidAsText(TextLoader):
    pass


@contextmanager
def get_conn() -> Iterator[psycopg.Connection]:
    settings = get_settings()
    if not settings.database_url:
        raise RuntimeError("DATABASE_URL is not configured")
    with psycopg.connect(settings.database_url, row_factory=dict_row) as conn:
        conn.adapters.register_loader("uuid", _UuidAsText)
        yield conn

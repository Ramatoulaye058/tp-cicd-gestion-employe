# app/database.py
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Forcer l'encodage UTF-8 pour éviter les erreurs de décodage
os.environ['PGCLIENTENCODING'] = 'UTF8'

SQLALCHEMY_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://admin:admin123@localhost:5432/dbdevnest"
)

# Les options d'encodage n'existent que pour PostgreSQL :
# SQLite (utilisée pour les tests) les refuse.
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    connect_args = {
        "client_encoding": "utf8",
        "options": "-c client_encoding=utf8 -c lc_messages=C"
    }

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args=connect_args,
    pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
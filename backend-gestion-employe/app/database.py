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
#  PostgreSQL  en local
# SQLALCHEMY_DATABASE_URL = "postgresql://admin:admin123@localhost:5432/dbdevnest"

# Postgres conteneurise
# SQLALCHEMY_DATABASE_URL = "postgresql://admin:admin123@postgres_server:5432/dbdevnest"

#  PostgreSQL  en deploiement avec Docker Compose
# SQLALCHEMY_DATABASE_URL = "postgresql://admin:admin123@db-service:5432/dbemploye"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    connect_args={
        "client_encoding": "utf8",
        "options": "-c client_encoding=utf8 -c lc_messages=C"
    },
    pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
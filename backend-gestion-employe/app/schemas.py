# app/schemas.py
from pydantic import BaseModel, Field

class EmployeBase(BaseModel):
    matricule: str = Field(
        ..., 
        example="EMP-2025-001",
        description="Matricule unique de l'employé (ex: EMP-2025-001)"
    )
    nom: str = Field(
        ..., 
        example="Madické DIOP",
        description="Nom complet de l'employé"
    )
    poste: str = Field(
        ..., 
        example="DevOps Engineer",
        description="Poste occupé par l'employé"
    )
    salaire: int = Field(
        ..., 
        example=450000,
        description="Salaire mensuel de l'employé en FCFA"
    )

class EmployeCreate(EmployeBase):
    """Schéma utilisé pour la création d'un nouvel employé"""
    pass

class Employe(EmployeBase):
    """Schéma utilisé pour la lecture des données d'un employé (avec ID)"""
    id: int = Field(
        ..., 
        example=1,
        description="Identifiant unique dans la base de données"
    )

    class Config:
        orm_mode = True

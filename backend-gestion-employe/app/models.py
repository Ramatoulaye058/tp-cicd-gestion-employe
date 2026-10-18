from sqlalchemy import Column, Integer, String
from .database import Base

class Employe(Base):
    __tablename__ = "employes"

    id = Column(Integer, primary_key=True, index=True)
    matricule = Column(String, unique=True, index=True, nullable=False)
    nom = Column(String, index=True)
    poste = Column(String)
    salaire = Column(Integer)
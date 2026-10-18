# app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas

def get_employes(db: Session):
    return db.query(models.Employe).all()

def get_employe(db: Session, employe_id: int):
    return db.query(models.Employe).filter(models.Employe.id == employe_id).first()

def get_employe_by_matricule(db: Session, matricule: str):
    return db.query(models.Employe).filter(models.Employe.matricule == matricule).first()

def create_employe(db: Session, employe: schemas.EmployeCreate):
    db_employe = models.Employe(**employe.dict())
    db.add(db_employe)
    db.commit()
    db.refresh(db_employe)
    return db_employe

def update_employe(db: Session, employe_id: int, employe: schemas.EmployeCreate):
    db_employe = get_employe(db, employe_id)
    if db_employe:
        for key, value in employe.dict().items():
            setattr(db_employe, key, value)
        db.commit()
        db.refresh(db_employe)
    return db_employe

def delete_employe(db: Session, employe_id: int):
    db_employe = get_employe(db, employe_id)
    if db_employe:
        db.delete(db_employe)
        db.commit()
    return db_employe
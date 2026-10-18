# app/main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas, crud
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, SessionLocal, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Gestion Employés")

# Autoriser ton frontend React (port 3000)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           # Origines autorisées
    allow_credentials=True,
    allow_methods=["*"],             # Autoriser GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],             # Autoriser tous les headers
)

# Dépendance de session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/employes/", response_model=schemas.Employe)
def create_employe(employe: schemas.EmployeCreate, db: Session = Depends(get_db)):
    existing = crud.get_employe_by_matricule(db, employe.matricule)
    if existing:
        raise HTTPException(status_code=400, detail=f"Matricule '{employe.matricule}' déjà utilisé.")
    return crud.create_employe(db, employe)

@app.get("/api/employes/", response_model=list[schemas.Employe])
def read_employes(db: Session = Depends(get_db)):
    return crud.get_employes(db)

@app.get("/api/employes/{employe_id}", response_model=schemas.Employe)
def read_employe(employe_id: int, db: Session = Depends(get_db)):
    db_employe = crud.get_employe(db, employe_id)
    if db_employe is None:
        raise HTTPException(status_code=404, detail="Employé introuvable")
    return db_employe

@app.put("/api/employes/{employe_id}", response_model=schemas.Employe)
def update_employe(employe_id: int, employe: schemas.EmployeCreate, db: Session = Depends(get_db)):
    existing = crud.get_employe_by_matricule(db, employe.matricule)
    if existing and existing.id != employe_id:
        raise HTTPException(status_code=400, detail=f"Matricule '{employe.matricule}' déjà utilisé par un autre employé.")
    return crud.update_employe(db, employe_id, employe)

@app.delete("/api/employes/{employe_id}")
def delete_employe(employe_id: int, db: Session = Depends(get_db)):
    crud.delete_employe(db, employe_id)
    return {"message": "Employé supprimé avec succès"}
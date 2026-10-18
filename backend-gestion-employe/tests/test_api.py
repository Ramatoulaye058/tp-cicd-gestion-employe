import os
os.environ["DATABASE_URL"] = "sqlite:///./test.db"

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_liste_employes():
    reponse = client.get("/api/employes/")
    assert reponse.status_code == 200
    assert isinstance(reponse.json(), list)


def test_employe_introuvable():
    reponse = client.get("/api/employes/999999")
    assert reponse.status_code == 404
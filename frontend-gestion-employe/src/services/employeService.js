// Service pour gérer les employés via l'API backend
class EmployeService {
  constructor() {
    this.apiUrl = 'http://localhost:8000/api/employes/'; // URL backend API gestion des employés
  }

  // Récupérer tous les employéss
  async getAllEmployes() {
    const response = await fetch(this.apiUrl);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des employés");
    }
    return await response.json();
  }

  // Créer un nouvel employé
  async createEmploye(employeData) {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(employeData)
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la création de l'employé");
    }
    return await response.json();
  }

  // Mettre à jour un employé
  async updateEmploye(id, employeData) {
    const response = await fetch(`${this.apiUrl}${id}/`, {
      method: 'PUT', // ou PATCH selon votre API
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(employeData)
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour de l'employé");
    }
    return await response.json();
  }

  // Supprimer un employé
  async deleteEmploye(id) {
    const response = await fetch(`${this.apiUrl}${id}/`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de l'employé");
    }
    return true;
  }
}

export const employeService = new EmployeService();

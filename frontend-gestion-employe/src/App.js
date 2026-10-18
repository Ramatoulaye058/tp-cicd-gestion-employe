import React, { useState, useEffect } from 'react';
import EmployeModal from './components/EmployeModal';
import EmployeCard from './components/EmployeCard';
import { employeService } from './services/employeService';
import './styles/App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [employes, setEmployes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmploye, setEditingEmploye] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [itemsPerPageOptions] = useState([6, 12, 24, 48]);

  useEffect(() => {
    loadEmployes();
  }, []);

  // Réinitialiser la page quand la recherche change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const loadEmployes = async () => {
    setLoading(true);
    try {
      const data = await employeService.getAllEmployes();
      setEmployes(data);
    } catch (error) {
      console.error('Error loading employes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmploye = async (employeData) => {
    try {
      await employeService.createEmploye(employeData);
      await loadEmployes();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating employe:', error);
    }
  };

  const handleUpdateEmploye = async (employeData) => {
    try {
      await employeService.updateEmploye(editingEmploye.id, employeData);
      await loadEmployes();
      setIsModalOpen(false);
      setEditingEmploye(null);
    } catch (error) {
      console.error('Error updating employe:', error);
    }
  };

  const handleDeleteEmploye = async (employeId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet employé ?')) {
      try {
        await employeService.deleteEmploye(employeId);
        await loadEmployes();
      } catch (error) {
        console.error('Error deleting employe:', error);
      }
    }
  };

  const openCreateModal = () => {
    setEditingEmploye(null);
    setIsModalOpen(true);
  };

  const openEditModal = (employe) => {
    setEditingEmploye(employe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEmploye(null);
  };

  // Filtrage des employés
  const filteredEmployes = employes.filter(employe => {
    const fullName = `${employe.nom || ''} ${employe.prenom || ''}`.toLowerCase();
    const poste = (employe.poste || '').toLowerCase();
    const matricule = (employe.matricule || '').toLowerCase();
    const term = searchTerm.toLowerCase();

    return fullName.includes(term) || poste.includes(term) || matricule.includes(term);
  });

  // Calculs pour la pagination
  const totalItems = filteredEmployes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredEmployes.slice(indexOfFirstItem, indexOfLastItem);

  // Changer de page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll en douceur vers le haut de la grille
    document.querySelector('.employes-grid')?.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' 
    });
  };

  // Aller à la page suivante
  const nextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  // Aller à la page précédente
  const prevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  // Changer le nombre d'éléments par page
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Nombre maximum de pages à afficher
    
    if (totalPages <= maxPagesToShow) {
      // Si peu de pages, afficher toutes
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Sinon, afficher avec des ellipses
      if (currentPage <= 3) {
        // Début de la pagination
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Fin de la pagination
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        // Milieu de la pagination
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="app">
      <div className="container">
        {/* Header */}
        <header className="app-header">
          <h1 className="app-title">
            <i className="fas fa-users"></i>
            Gestion des Employés
          </h1>
          <p className="app-subtitle">Application CRUD moderne et responsive</p>
        </header>

        {/* Controls */}
        <div className="controls">
          <div className="search-container">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Rechercher un employé..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="controls-right">
            {/* Sélecteur d'éléments par page */}
            <div className="items-per-page">
              <label htmlFor="itemsPerPage">Afficher :</label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="items-per-page-select"
              >
                {itemsPerPageOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <button 
              className="btn btn-primary"
              onClick={openCreateModal}
            >
              <i className="fas fa-plus"></i>
              Nouvel Employé
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Chargement des employés...</p>
          </div>
        )}

        {/* Employees Grid */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentPage + itemsPerPage + searchTerm}
            className="employes-grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentItems.map(employe => (
              <EmployeCard
                key={employe.id}
                employe={employe}
                onEdit={openEditModal}
                onDelete={handleDeleteEmploye}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {!loading && filteredEmployes.length === 0 && (
          <motion.div 
            className="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <i className="fas fa-user-slash"></i>
            <h3>Aucun employé trouvé</h3>
            <p>
              {searchTerm 
                ? "Aucun employé ne correspond à votre recherche"
                : "Commencez par ajouter un nouvel employé"
              }
            </p>
          </motion.div>
        )}

        {/* Pagination */}
        {!loading && filteredEmployes.length > 0 && (
          <motion.div 
            className="pagination-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {/* Informations sur la pagination */}
            <div className="pagination-info">
              <p>
                Affichage {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} sur {totalItems} employés
              </p>
            </div>

            {/* Contrôles de pagination */}
            <div className="pagination-controls">
              {/* Bouton Précédent */}
              <motion.button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="pagination-btn prev"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-chevron-left"></i>
              </motion.button>

              {/* Numéros de page */}
              <div className="page-numbers">
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                      ...
                    </span>
                  ) : (
                    <motion.button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`page-number ${currentPage === page ? 'active' : ''}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {page}
                    </motion.button>
                  )
                ))}
              </div>

              {/* Bouton Suivant */}
              <motion.button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="pagination-btn next"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-chevron-right"></i>
              </motion.button>
            </div>

            {/* Indicateur de page */}
            <div className="pagination-indicator">
              Page {currentPage} sur {totalPages}
            </div>
          </motion.div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <EmployeModal
            employe={editingEmploye}
            onSave={editingEmploye ? handleUpdateEmploye : handleCreateEmploye}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
}

export default App;
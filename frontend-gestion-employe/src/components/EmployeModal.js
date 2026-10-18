import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faSave,
  faUserTie,
  faIdBadge,
  faBriefcase,
  faMoneyBillWave,
  faUserPlus,
  faUserEdit,
  faCheckCircle,
  faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

const EmployeModal = ({ employe, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    matricule: '',
    nom: '',
    poste: '',
    salaire: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  // Focus sur le premier input à l'ouverture
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (employe) {
      setFormData({
        matricule: String(employe.matricule || ''),
        nom: String(employe.nom || ''),
        poste: String(employe.poste || ''),
        salaire: String(employe.salaire || '')
      });
    }
  }, [employe]);

  // Validation en temps réel
  const validateField = (name, value) => {
    const stringValue = String(value || '').trim();
    
    switch (name) {
      case 'matricule':
        if (!stringValue) return 'Le matricule est requis';
        if (stringValue.length < 3) return 'Le matricule doit contenir au moins 3 caractères';
        return '';
      case 'nom':
        if (!stringValue) return 'Le nom est requis';
        if (stringValue.length < 2) return 'Le nom doit contenir au moins 2 caractères';
        return '';
      case 'poste':
        if (!stringValue) return 'Le poste est requis';
        return '';
      case 'salaire':
        if (!stringValue) return 'Le salaire est requis';
        if (isNaN(stringValue)) return 'Le salaire doit être un nombre';
        if (parseFloat(stringValue) <= 0) return 'Le salaire doit être positif';
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const allTouched = {};
      Object.keys(formData).forEach(key => allTouched[key] = true);
      setTouched(allTouched);
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    onSave(formData);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));

    if (!touched[name]) {
      setTouched(prev => ({ ...prev, [name]: true }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  // Styles
  const styles = {
    modalActions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
      marginTop: '2rem',
      paddingTop: '1rem',
      borderTop: '2px solid #e5e7eb'
    },
    btn: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '9999px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      minWidth: '120px',
      position: 'relative',
      overflow: 'hidden'
    },
    btnOutline: {
      background: 'transparent',
      color: '#4b5563',
      border: '2px solid #e5e7eb'
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      color: 'white',
      boxShadow: '0 4px 6px -1px rgba(139, 92, 246, 0.3)'
    },
    btnDisabled: {
      opacity: 0.5,
      cursor: 'not-allowed',
      pointerEvents: 'none'
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, y: 0, scale: 1,
      transition: { type: "spring", damping: 25, stiffness: 300 }
    },
    exit: { opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } }
  };

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -180 },
    visible: { 
      opacity: 1, scale: 1, rotate: 0,
      transition: { type: "spring", damping: 12, stiffness: 200 }
    }
  };

  const inputVariants = {
    focus: { 
      scale: 1.02,
      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.3)",
      transition: { duration: 0.2 }
    }
  };

  const isEditMode = !!employe;

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        onClick={onClose}
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}
      >
        <motion.div 
          ref={modalRef}
          className="modal-content"
          onClick={e => e.stopPropagation()}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: 0,
            width: '100%',
            maxWidth: '550px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            position: 'relative'
          }}
        >
          {/* Barre de progression colorée */}
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              height: '4px',
              background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #06b6d4)',
              transformOrigin: 'left',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              borderRadius: '4px 4px 0 0',
              zIndex: 1
            }}
          />

          <div className="modal-header" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.75rem 1.75rem 1rem',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <motion.h2
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{
                fontSize: '1.75rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1.2, 1]
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ display: 'inline-block', marginRight: '12px' }}
              >
                <FontAwesomeIcon 
                  icon={isEditMode ? faUserEdit : faUserPlus} 
                  style={{ 
                    color: isEditMode ? '#8b5cf6' : '#10b981',
                    fontSize: '1.8rem'
                  }}
                />
              </motion.div>
              {isEditMode ? "Modifier l'employé" : "Nouvel employé"}
            </motion.h2>
            
            <motion.button 
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                color: '#6b7280',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '9999px',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </motion.button>
          </div>

          <AnimatePresence mode="wait">
            {showSuccess ? (
              <motion.div 
                key="success"
                variants={successVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3rem',
                  textAlign: 'center'
                }}
              >
                <FontAwesomeIcon 
                  icon={faCheckCircle} 
                  style={{ 
                    fontSize: '4rem', 
                    color: '#10b981',
                    marginBottom: '1rem'
                  }} 
                />
                <h3 style={{ color: '#10b981', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                  {isEditMode ? 'Employé modifié !' : 'Employé créé !'}
                </h3>
                <p style={{ color: '#6b7280' }}>
                  {isEditMode 
                    ? "Les informations ont été mises à jour avec succès"
                    : "Le nouvel employé a été ajouté avec succès"
                  }
                </p>
              </motion.div>
            ) : (
              <form key="form" onSubmit={handleSubmit} style={{ padding: '1.75rem' }}>
                {/* Matricule */}
                <motion.div 
                  style={{ marginBottom: '1.75rem' }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <label htmlFor="matricule" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    fontSize: '0.95rem'
                  }}>
                    <FontAwesomeIcon icon={faIdBadge} style={{ marginRight: '8px', color: '#8b5cf6' }} />
                    Matricule <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <motion.div whileFocus="focus" variants={inputVariants}>
                    <input
                      ref={firstInputRef}
                      type="text"
                      id="matricule"
                      name="matricule"
                      value={formData.matricule}
                      onChange={handleChange}
                      onBlur={() => handleBlur('matricule')}
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        border: `2px solid ${touched.matricule && errors.matricule ? '#ef4444' : '#e5e7eb'}`,
                        borderRadius: '16px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                      placeholder="Ex: EMP001"
                    />
                  </motion.div>
                  <AnimatePresence>
                    {touched.matricule && errors.matricule && (
                      <motion.span 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                          display: 'block',
                          color: '#ef4444',
                          fontSize: '0.875rem',
                          marginTop: '0.5rem',
                          paddingLeft: '0.5rem'
                        }}
                      >
                        <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: '5px' }} />
                        {errors.matricule}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Nom */}
                <motion.div 
                  style={{ marginBottom: '1.75rem' }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  <label htmlFor="nom" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    fontSize: '0.95rem'
                  }}>
                    <FontAwesomeIcon icon={faUserTie} style={{ marginRight: '8px', color: '#8b5cf6' }} />
                    Nom complet <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <motion.div whileFocus="focus" variants={inputVariants}>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      onBlur={() => handleBlur('nom')}
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        border: `2px solid ${touched.nom && errors.nom ? '#ef4444' : '#e5e7eb'}`,
                        borderRadius: '16px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                      placeholder="Ex: Jean Dupont"
                    />
                  </motion.div>
                  <AnimatePresence>
                    {touched.nom && errors.nom && (
                      <motion.span 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                          display: 'block',
                          color: '#ef4444',
                          fontSize: '0.875rem',
                          marginTop: '0.5rem',
                          paddingLeft: '0.5rem'
                        }}
                      >
                        <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: '5px' }} />
                        {errors.nom}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Poste */}
                <motion.div 
                  style={{ marginBottom: '1.75rem' }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                >
                  <label htmlFor="poste" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    fontSize: '0.95rem'
                  }}>
                    <FontAwesomeIcon icon={faBriefcase} style={{ marginRight: '8px', color: '#8b5cf6' }} />
                    Poste <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <motion.div whileFocus="focus" variants={inputVariants}>
                    <input
                      type="text"
                      id="poste"
                      name="poste"
                      value={formData.poste}
                      onChange={handleChange}
                      onBlur={() => handleBlur('poste')}
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        border: `2px solid ${touched.poste && errors.poste ? '#ef4444' : '#e5e7eb'}`,
                        borderRadius: '16px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                      placeholder="Ex: Développeur Full Stack"
                    />
                  </motion.div>
                  <AnimatePresence>
                    {touched.poste && errors.poste && (
                      <motion.span 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                          display: 'block',
                          color: '#ef4444',
                          fontSize: '0.875rem',
                          marginTop: '0.5rem',
                          paddingLeft: '0.5rem'
                        }}
                      >
                        <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: '5px' }} />
                        {errors.poste}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Salaire */}
                <motion.div 
                  style={{ marginBottom: '1.75rem' }}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  <label htmlFor="salaire" style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: '600',
                    color: '#1f2937',
                    fontSize: '0.95rem'
                  }}>
                    <FontAwesomeIcon icon={faMoneyBillWave} style={{ marginRight: '8px', color: '#8b5cf6' }} />
                    Salaire (FCFA) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <motion.div whileFocus="focus" variants={inputVariants}>
                    <input
                      type="number"
                      id="salaire"
                      name="salaire"
                      value={formData.salaire}
                      onChange={handleChange}
                      onBlur={() => handleBlur('salaire')}
                      style={{
                        width: '100%',
                        padding: '1rem 1.25rem',
                        border: `2px solid ${touched.salaire && errors.salaire ? '#ef4444' : '#e5e7eb'}`,
                        borderRadius: '16px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        outline: 'none'
                      }}
                      placeholder="Ex: 45000"
                      step="1000"
                      min="0"
                    />
                  </motion.div>
                  <AnimatePresence>
                    {touched.salaire && errors.salaire && (
                      <motion.span 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                          display: 'block',
                          color: '#ef4444',
                          fontSize: '0.875rem',
                          marginTop: '0.5rem',
                          paddingLeft: '0.5rem'
                        }}
                      >
                        <FontAwesomeIcon icon={faExclamationCircle} style={{ marginRight: '5px' }} />
                        {errors.salaire}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Actions */}
                <motion.div 
                  style={styles.modalActions}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.55 }}
                >
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSubmitting}
                    style={{
                      ...styles.btn,
                      ...styles.btnOutline,
                      ...(isSubmitting ? styles.btnDisabled : {})
                    }}
                  >
                    Annuler
                  </motion.button>
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSubmitting}
                    style={{
                      ...styles.btn,
                      ...styles.btnPrimary,
                      ...(isSubmitting ? styles.btnDisabled : {}),
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{ display: 'inline-block' }}
                      >
                        <FontAwesomeIcon icon={faSave} />
                      </motion.div>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} style={{ marginRight: '8px' }} />
                        {isEditMode ? 'Mettre à jour' : 'Créer'}
                      </>
                    )}
                    
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '100%',
                        height: '100%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
                        transform: 'translate(-50%, -50%) scale(0)',
                        borderRadius: '50%',
                        pointerEvents: 'none'
                      }}
                      whileHover={{ scale: 2 }}
                      transition={{ duration: 0.5 }}
                    />
                  </motion.button>
                </motion.div>
              </form>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmployeModal;
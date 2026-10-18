import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEdit, 
  faTrash, 
  faIdCard, 
  faMoneyBill,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faStar,
  faCalendarAlt,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

const EmployeCard = ({ employe, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Générer une couleur d'avatar basée sur le nom
  const getAvatarColor = (name) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    ];
    const index = (name?.length || 0) % colors.length;
    return colors[index];
  };

  // Obtenir les initiales du nom
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Formater le salaire
  const formatSalary = (salaire) => {
    if (!salaire) return 'Non renseigné';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(salaire).replace('XOF', 'FCFA');
  };

  // Animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring",
        damping: 15,
        stiffness: 100
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      boxShadow: "0 20px 30px -10px rgba(106, 90, 205, 0.4)",
      transition: { 
        type: "spring",
        damping: 10,
        stiffness: 200
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  };

  const avatarVariants = {
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { type: "spring", damping: 10 }
    }
  };

  const deleteConfirmVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      y: -10
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", damping: 12 }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      exit="exit"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{
        background: "linear-gradient(135deg, #6a5acd 0%, #8a6de9 100%)",
        color: "#FFFFFF",
        borderRadius: "24px",
        padding: "24px",
        width: "320px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        boxShadow: "0 10px 30px -5px rgba(106, 90, 205, 0.3)",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.1)"
      }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Effet de particules en arrière-plan */}
      <motion.div
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "200%",
          height: "200%",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%)",
          opacity: isHovered ? 0.3 : 0.1,
          transition: "opacity 0.3s ease"
        }}
        animate={{
          rotate: isHovered ? 360 : 0,
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Badge de statut (optionnel) */}
      {employe.statut && (
        <motion.div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(5px)",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: "600",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            zIndex: 2
          }}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <FontAwesomeIcon icon={faStar} style={{ marginRight: "5px", fontSize: "0.7rem" }} />
          {employe.statut}
        </motion.div>
      )}

      {/* Avatar avec effet de hover */}
      <motion.div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "16px",
          position: "relative"
        }}
        variants={avatarVariants}
        whileHover="hover"
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            background: employe.avatar ? 'none' : getAvatarColor(employe.nom),
            overflow: "hidden",
            border: "4px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
            position: "relative"
          }}
        >
          {employe.avatar ? (
            <img 
              src={employe.avatar}
              alt={employe.nom}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                fontWeight: "600",
                color: "white",
                background: getAvatarColor(employe.nom)
              }}
            >
              {getInitials(employe.nom)}
            </div>
          )}
        </div>

        {/* Cercle de statut en ligne */}
        <motion.div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "calc(50% - 60px)",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "#10b981",
            border: "3px solid white",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)"
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Nom et poste */}
      <motion.div
        style={{ textAlign: "center", marginBottom: "16px" }}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h3 style={{ 
          margin: "0 0 4px 0", 
          fontSize: "1.4rem", 
          fontWeight: "700",
          letterSpacing: "-0.5px"
        }}>
          {employe.nom || "Nom indisponible"}
        </h3>
        <p style={{ 
          margin: 0, 
          fontSize: "0.9rem", 
          opacity: 0.9,
          background: "rgba(255, 255, 255, 0.2)",
          padding: "4px 12px",
          borderRadius: "20px",
          display: "inline-block"
        }}>
          {employe.poste || "Poste non défini"}
        </p>
      </motion.div>

      {/* Informations de base */}
      <motion.div
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(5px)",
          borderRadius: "16px",
          padding: "16px",
          marginBottom: "16px"
        }}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "10px",
          marginBottom: "10px"
        }}>
          <FontAwesomeIcon icon={faIdCard} style={{ width: "20px", opacity: 0.9 }} />
          <div>
            <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>Matricule</div>
            <div style={{ fontWeight: "600" }}>{employe.matricule || "N/A"}</div>
          </div>
        </div>

        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "10px",
          marginBottom: "10px"
        }}>
          <FontAwesomeIcon icon={faMoneyBill} style={{ width: "20px", opacity: 0.9 }} />
          <div>
            <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>Salaire</div>
            <div style={{ fontWeight: "600" }}>{formatSalary(employe.salaire)}</div>
          </div>
        </div>

        {/* Informations supplémentaires conditionnelles */}
        {employe.email && (
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "10px"
          }}>
            <FontAwesomeIcon icon={faEnvelope} style={{ width: "20px", opacity: 0.9 }} />
            <div>
              <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>Email</div>
              <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>{employe.email}</div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Section extensible avec plus d'informations */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "16px",
              padding: isExpanded ? "16px" : "0",
              marginBottom: "16px",
              overflow: "hidden"
            }}
          >
            {employe.telephone && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <FontAwesomeIcon icon={faPhone} style={{ width: "16px", opacity: 0.7 }} />
                <span style={{ fontSize: "0.9rem" }}>{employe.telephone}</span>
              </div>
            )}
            {employe.adresse && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <FontAwesomeIcon icon={faMapMarkerAlt} style={{ width: "16px", opacity: 0.7 }} />
                <span style={{ fontSize: "0.9rem" }}>{employe.adresse}</span>
              </div>
            )}
            {employe.dateEmbauche && (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ width: "16px", opacity: 0.7 }} />
                <span style={{ fontSize: "0.9rem" }}>
                  Embauché le {new Date(employe.dateEmbauche).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Boutons d'action */}
      <motion.div
        style={{ 
          display: "flex", 
          gap: "12px",
          justifyContent: "center",
          position: "relative"
        }}
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {/* Bouton Modifier */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(employe);
          }}
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            color: "#FFFFFF",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            padding: "12px",
            borderRadius: "50%",
            cursor: "pointer",
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
            backdropFilter: "blur(5px)",
            position: "relative",
            overflow: "hidden"
          }}
          whileHover={{ 
            scale: 1.1,
            background: "rgba(255, 255, 255, 0.3)",
            borderColor: "rgba(255, 255, 255, 0.5)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          <FontAwesomeIcon icon={faEdit} />
          <motion.div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "100%",
              height: "100%",
              background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)",
              transform: "translate(-50%, -50%) scale(0)",
              borderRadius: "50%"
            }}
            whileHover={{ scale: 2 }}
            transition={{ duration: 0.4 }}
          />
        </motion.button>

        {/* Bouton Supprimer avec confirmation */}
        <div style={{ position: "relative" }}>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(true);
            }}
            style={{
              background: "rgba(239, 68, 68, 0.3)",
              color: "#FFFFFF",
              border: "1px solid rgba(239, 68, 68, 0.5)",
              padding: "12px",
              borderRadius: "50%",
              cursor: "pointer",
              width: "48px",
              height: "48px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              backdropFilter: "blur(5px)"
            }}
            whileHover={{ 
              scale: 1.1,
              background: "rgba(239, 68, 68, 0.5)",
              borderColor: "rgba(239, 68, 68, 0.8)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon icon={faTrash} />
          </motion.button>

          {/* Confirmation de suppression */}
          <AnimatePresence>
            {showDeleteConfirm && (
              <motion.div
                variants={deleteConfirmVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                  position: "absolute",
                  bottom: "30px",
                  left: "30%",
                  transform: "translateX(-50%)",
                  background: "white",
                  color: "#1f2937",
                  padding: "10px",
                  borderRadius: "10px",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
                  width: "130px",
                  zIndex: 10
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <p style={{ margin: "0 0 10px 0", fontSize: "0.9rem", textAlign: "center" }}>
                  Confirmer ?
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <motion.button
                    onClick={() => {
                      onDelete(employe.id);
                      setShowDeleteConfirm(false);
                    }}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      flex: 1
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Oui
                  </motion.button>
                  <motion.button
                    onClick={() => setShowDeleteConfirm(false)}
                    style={{
                      background: "#e5e7eb",
                      color: "#374151",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      flex: 1
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Non
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Indicateur d'expansion */}
      <motion.div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255, 255, 255, 0.5)",
          fontSize: "0.8rem"
        }}
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
      </motion.div>
    </motion.div>
  );
};

export default EmployeCard;
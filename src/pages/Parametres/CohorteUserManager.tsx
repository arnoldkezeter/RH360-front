import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { addUserToCohorte, getUsersByCohorte, removeUserFromCohorte } from '../../services/settings/cohorteAPI';
import { searchUtilisateur } from '../../services/utilisateurs/utilisateurAPI';

interface Props {
  cohorteId: string;
  lang?: string;
  isOpen: boolean;
  onClose: () => void;
  onUsersUpdated?: () => void;
}

const CohorteUserManager: React.FC<Props> = ({ 
  cohorteId, 
  lang = 'fr',
  isOpen,
  onClose,
  onUsersUpdated
}) => {
  const [usersInCohorte, setUsersInCohorte] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger les utilisateurs de la cohorte
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getUsersByCohorte(cohorteId, lang);
      
      setUsersInCohorte(res || []);
    } catch {
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && cohorteId) {
      fetchUsers();
    }
  }, [cohorteId, isOpen]);

  // Recherche dynamique
  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.length < 2) return setSearchResults([]);

    try {
      const res = await searchUtilisateur({searchString:text, lang});
      setSearchResults(res.utilisateurs || []);
    } catch {
      toast.error("Erreur de recherche");
    }
  };

  // Ajouter un utilisateur
  const handleAdd = async (userId:string) => {
    try {
      await addUserToCohorte(userId, cohorteId, lang);
      toast.success("Utilisateur ajouté à la cohorte");
      fetchUsers();
      setSearchText('');
      setSearchResults([]);
      onUsersUpdated?.();
    } catch {
      toast.error("Erreur lors de l'ajout");
    }
  };

  // Supprimer un utilisateur
  const handleRemove = async (userId: string) => {
    try {
      await removeUserFromCohorte(userId, cohorteId, lang);
      toast.success("Utilisateur retiré de la cohorte");
      fetchUsers();
      onUsersUpdated?.();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  // Fermer le modal
  const handleClose = () => {
    setSearchText('');
    setSearchResults([]);
    onClose();
  };

  // Gérer le clic sur le backdrop
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Gérer l'échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Gérer les utilisateurs de la cohorte
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          {/* 🔍 Recherche utilisateur */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Ajouter un utilisateur
            </label>
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />

            {searchResults.length > 0 && (
              <div className="mt-2 border border-gray-200 dark:border-gray-600 rounded-lg max-h-40 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex justify-between items-center border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                  >
                    <span className="text-gray-900 dark:text-white">
                      {user.nom} {user.prenom} ({user.email})
                    </span>
                    <button 
                      onClick={() => handleAdd(user._id)} 
                      className="px-3 py-1 text-sm bg-blue-600 text-green rounded hover:bg-blue-700 transition-colors"
                    >
                      Ajouter
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 👁️ Liste utilisateurs de la cohorte */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Utilisateurs actuels ({usersInCohorte.length})
            </label>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600 dark:text-gray-400">Chargement...</span>
              </div>
            ) : usersInCohorte.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <p>Aucun utilisateur dans cette cohorte</p>
              </div>
            ) : (
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg">
                {usersInCohorte.map((user, index) => (
                  <div 
                    key={index} 
                    className={`p-3 flex justify-between items-center ${
                      index !== usersInCohorte.length - 1 ? 'border-b border-gray-200 dark:border-gray-600' : ''
                    }`}
                  >
                    <span className="text-gray-900 dark:text-white">
                      {user.utilisateur.nom} {user.utilisateur.prenom} ({user.utilisateur.email})
                    </span>
                    <button
                      onClick={() => handleRemove(user.utilisateur?._id || "")}
                      className="px-3 py-1 text-sm bg-red-600 text-red-500 rounded hover:bg-red-700 transition-colors"
                    >
                      Retirer
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CohorteUserManager;
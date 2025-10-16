import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
  addUserToCohorte,
  getUsersByCohorte,
  removeUserFromCohorte,
} from '../../services/settings/cohorteAPI';
import { searchUtilisateur } from '../../services/utilisateurs/utilisateurAPI';
import CustomDialogModal from '../../components/Modals/CustomDialogModal';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_redux/store';
import { setShowModalUserCohorte } from '../../_redux/features/setting';

// --- NOUVELLE INTERFACE POUR LE TYPAGE ---
interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  // Ajoutez d'autres champs si nécessaire
}

interface CohorteUser {
  utilisateur: User;
  // Ajoutez d'autres champs de la cohorte si nécessaire
}

interface Props {
  cohorteId: string;
  onUsersUpdated?: () => void;
}

// --- COULEURS HEXADÉCIMALES UTILISÉES DANS TAILWIND (Bleu principal: #3B82F6, Rouge: #EF4444) ---
const PRIMARY_BLUE_HEX = '#3B82F6';
const PRIMARY_RED_HEX = '#EF4444';
const GRAY_300_HEX = '#D1D5DB';

const CohorteUserManager: React.FC<Props> = ({ cohorteId, onUsersUpdated }) => {
  const [usersInCohorte, setUsersInCohorte] = useState<CohorteUser[]>([]);
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Utilisateur[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state: RootState) => state.setting.showModal.openUserCohorte);
  const lang = useSelector((state: RootState) => state.setting.language);

  const closeModal = useCallback(() => {
    dispatch(setShowModalUserCohorte());
  }, [dispatch]);

  // --- LOGIQUE DE CHARGEMENT DES UTILISATEURS (utilisée dans useEffect et après l'ajout/retrait) ---
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      // Le back-end est censé renvoyer un tableau de CohorteUser
      const res = await getUsersByCohorte(cohorteId, lang);
      // S'assurer que chaque élément a une propriété 'utilisateur'
      setUsersInCohorte(res || []);
    } catch {
      toast.error(t('message.erreur_chargement_utilisateurs')); // Assurez-vous d'avoir cette clé
    } finally {
      setIsLoading(false);
    }
  }, [cohorteId, lang, t]);

  useEffect(() => {
    if (isModalOpen) {
      fetchUsers();
    }
  }, [isModalOpen, fetchUsers]);

  // --- RECHERCHE DYNAMIQUE (optimisée avec useCallback) ---
  const handleSearch = useCallback(
    async (text: string) => {
      setSearchText(text);
      if (text.length < 2) return setSearchResults([]);

      setIsSearching(true);
      try {
        const res = await searchUtilisateur({ searchString: text, lang });
        // S'assurer que 'res.utilisateurs' est un tableau d'objets User
        setSearchResults(res.utilisateurs || []);
      } catch {
        toast.error(t('message.erreur_recherche')); // Assurez-vous d'avoir cette clé
      } finally {
        setIsSearching(false);
      }
    },
    [lang, t]
  );

  // --- GESTION DES ACTIONS (AJOUT/SUPPRESSION) ---
  const handleAction = useCallback(
    async (userId: string, action: 'add' | 'remove') => {
      const isAdd = action === 'add';
      try {
        if (isAdd) {
          await addUserToCohorte(userId, cohorteId, lang);
          toast.success(t('message.utilisateur_ajoute_cohorte'));
        } else {
          await removeUserFromCohorte(userId, cohorteId, lang);
          toast.success(t('message.utilisateur_retire_cohorte'));
        }

        // Recharger les utilisateurs et réinitialiser la recherche si c'est un ajout
        fetchUsers();
        if (isAdd) {
          setSearchText('');
          setSearchResults([]);
        }
        onUsersUpdated?.();
      } catch (error: any) {
        // Gérer les erreurs spécifiques de l'API ici (par exemple, utilisateur déjà dans la cohorte)
        const errorMessage = error.message || t('message.erreur');
        toast.error(errorMessage);
      }
    },
    [cohorteId, lang, t, fetchUsers, onUsersUpdated]
  );

  // Vérifier si un utilisateur de la recherche est déjà dans la cohorte (optimisation)
  const usersIdInCohorte = useMemo(
    () => new Set(usersInCohorte.map((u) => u.utilisateur._id)),
    [usersInCohorte]
  );

  return (
    <CustomDialogModal
      title={t('form_save.gerer_utilisateurs_cohorte')}
      isModalOpen={isModalOpen}
      isClose={true}
      isDelete={false}
      closeModal={closeModal}
      handleConfirm={closeModal}
      isLoading={false} // Le isLoading du modal doit être lié aux actions du modal (Confirmer/Supprimer), pas au chargement de la liste
    >
      {/* Body */}
      <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
        {/* 🔍 Recherche utilisateur */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-[#1F2937] dark:text-[#F3F4F6] mb-2">
            {t('label.ajouter_utilisateur')}
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder={t('label.recherche_utilisateur')}
              className="w-full p-3 border border-[#D1D5DB] dark:border-[#4B5563] rounded-lg focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent dark:bg-[#1F2937] dark:text-[#F3F4F6] transition duration-150"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-r-2 border-[#3B82F6]"></div>
              </div>
            )}
          </div>

          {/* Résultats de recherche */}
          {searchResults.length > 0 && searchText.length >= 2 && (
            <div className="mt-2 border border-[#E5E7EB] dark:border-[#4B5563] rounded-lg max-h-40 overflow-y-auto bg-white dark:bg-[#111827] shadow-lg">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="p-3 hover:bg-[#F9FAFB] dark:hover:bg-[#374151] flex justify-between items-center border-b border-[#E5E7EB] dark:border-[#4B5563] last:border-b-0"
                >
                  <span className="text-[#1F2937] dark:text-[#F3F4F6] text-sm truncate">
                    {user.nom} {user.prenom} ({user.email})
                  </span>
                  {usersIdInCohorte.has(user?._id||"") ? (
                    <span className="px-3 py-1 text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] bg-[#E5E7EB] dark:bg-[#374151] rounded-full">
                      {t('label.deja_ajoute')}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleAction(user?._id||"", 'add')}
                      className="px-3 py-1 text-sm bg-[#3B82F6] text-white rounded-full hover:bg-[#2563EB] transition-colors shadow-md"
                    >
                      {t('button.ajouter')}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 👁️ Liste utilisateurs de la cohorte */}
        <div>
          <label className="block text-sm font-semibold text-[#1F2937] dark:text-[#F3F4F6] mb-4">
            {t('label.utilisateur_actuels')} ({usersInCohorte.length})
          </label>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div
                className={`animate-spin rounded-full h-8 w-8 border-b-2 border-r-2 border-[${PRIMARY_BLUE_HEX}]`}
              ></div>
              <span className="ml-2 text-[#4B5563] dark:text-[#9CA3AF]">
                {t('label.chargement...')}
              </span>
            </div>
          ) : usersInCohorte.length === 0 ? (
            <div className="text-center py-8 text-[#6B7280] dark:text-[#9CA3AF] bg-[#F9FAFB] dark:bg-[#1F2937] rounded-lg border border-[#E5E7EB] dark:border-[#4B5563]">
              {/* Icône d'utilisateur */}
              <svg
                className={`w-12 h-12 mx-auto mb-4 text-[${GRAY_300_HEX}]`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <p>{t('label.aucun_utilisateur_cohorte')}</p>
            </div>
          ) : (
            <div className="border border-[#E5E7EB] dark:border-[#4B5563] rounded-lg shadow-md bg-white dark:bg-[#111827]">
              {usersInCohorte.map((item, index) => {
                const user = item.utilisateur;
                return (
                  <div
                    key={user._id}
                    className={`p-3 flex justify-between items-center ${
                      index !== usersInCohorte.length - 1
                        ? 'border-b border-[#E5E7EB] dark:border-[#4B5563]'
                        : ''
                    }`}
                  >
                    <span className="text-[#1F2937] dark:text-[#F3F4F6] font-medium text-sm truncate">
                      {user.nom} {user.prenom} ({user.email})
                    </span>
                    <button
                      onClick={() => handleAction(user._id, 'remove')}
                      className={`px-3 py-1 text-sm bg-[#FEE2E2] text-[#B91C1C] rounded-full hover:bg-[#FCA5A5] transition-colors font-medium`}
                    >
                      {t('button.retirer')}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </CustomDialogModal>
  );
};

export default CohorteUserManager;
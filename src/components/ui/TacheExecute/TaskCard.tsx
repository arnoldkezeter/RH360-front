import { AlertCircle, BarChart3, Check, CheckSquare, Clock, FileText, Mail, Upload, Users, MessageCircle } from 'lucide-react';
import React, { useState } from 'react';
import { ETAT_TACHE, STATUT_TACHE_THEME } from '../../../config';
import { useTranslation } from 'react-i18next';
import FormCheckTask from '../../Modals/Execution/ExecutionTache/FormCheckTask';
import { useDispatch, useSelector } from 'react-redux';
import { setShowModal, setShowModalCheckTask, setShowModalEmail, setShowModalGenerateDoc, setShowModalUploadDoc } from '../../../_redux/features/setting';
import { useNavigate } from 'react-router-dom';
import FormCreateUpdate from '../../Modals/Elaboration/Formation/ModalObjectifTheme/FormCreateUpdate';
import { setThemeFormationSelected } from '../../../_redux/features/elaborations/themeFormationSlice';
import { RootState } from '../../../_redux/store';
import FormUploadFile from '../../Modals/Execution/ExecutionTache/FormUploadFile';
import FormGenerateFile from '../../Modals/Execution/ExecutionTache/FormGenerateFile';
import FormSendMessage from '../../Modals/Execution/ExecutionTache/FormEmailTask';

const StatusIcon = ({ statut }: { statut: string }) => {
  const iconClasses = "w-5 h-5";
  switch (statut) {
    case 'TERMINE':
      return <Check className={`${iconClasses} text-[#22C55E]`} />;
    case 'EN_COURS':
      return <Clock className={`${iconClasses} text-[#F59E0B]`} />;
    case 'EN_ATTENTE':
      return <Clock className={`${iconClasses} text-[#F59E0B]`} />;
    default:
      return <AlertCircle className={`${iconClasses} text-[#EF4444]`} />;
  }
};

const TacheTypeIcon = ({ type }: { type: string }) => {
  const iconClasses = "w-4 h-4";
  const icons: Record<string, JSX.Element> = {
    form: <FileText className={`${iconClasses} text-[#3B82F6]`} />,
    upload: <Upload className={`${iconClasses} text-[#8B5CF6]`} />,
    evaluation: <BarChart3 className={`${iconClasses} text-[#F97316]`} />,
    checkbox: <CheckSquare className={`${iconClasses} text-[#22C55E]`} />,
    email: <Mail className={`${iconClasses} text-[#6366F1]`} />,
    'table-form': <Users className={`${iconClasses} text-[#14B8A6]`} />
  };
  return icons[type] || <FileText className={`${iconClasses} text-[#6B7280]`} />;
};

interface TacheCardProps {
  tache: TacheThemeFormation;
  typeTaches: TypeTache[];
  lang: string;
  onExecute: (tache: TacheThemeFormation) => void;
  // Ajout de la prop pour gérer l'ouverture du chat
  onOpenChat: (tache: TacheThemeFormation) => void;
}

const TacheCard: React.FC<TacheCardProps> = ({ 
  tache, 
  typeTaches, 
  lang, 
  onExecute,
  onOpenChat
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
//   const statut = tache.estExecutee ? ETAT_TACHE.EXECUTEE : ETAT_TACHE.NON_EXECUTEE;
  const statutsTaches = Object.values(STATUT_TACHE_THEME);

  const statut = statutsTaches.find(t=>t.key===tache.statut)
  const type = typeTaches.find(tt => tt.key === tache.tache.type);
  const [selectedTache, setSelectedTache] = useState<TacheThemeFormation>()
  const [getObj, setGetObj] = useState(false);
  const currentUser = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);

  const getStatusBadge = () => {
    const baseClasses = "px-3 py-1.5 rounded-full text-xs font-medium transition-colors";
    
    if (tache.estExecutee) {
      return (
        <span className={`${baseClasses} bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]`}>
          {t('label.terminee')}
        </span>
      );
    } else {
      return (
        <span className={`${baseClasses} bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]`}>
          {lang === 'fr' ? statut?.nomFr||"" : statut?.nomEn||""}
        </span>
      );
    }
  };
  
  // Fonction pour gérer l'ouverture du chat
  const handleOpenChat = () => {
    onOpenChat(tache);
  };

  const handleExecuteTache = (selected:TacheThemeFormation) => {
    
    
    // dispatch(setShowModalCheckTask())
    switch (selected.tache.type) {
      case 'checkbox':
        setSelectedTache(selected)
        dispatch(setShowModalCheckTask())
        break;

      case 'form':
        if (!selected?._id || !currentUser?._id) {
          console.error('Données manquantes pour la navigation');
          return;
        }
        switch(selected.tache.code){
          case 'def_objectifs' :
            dispatch(setThemeFormationSelected(selected.theme))
            
            navigate(`/elaboration-programme/formation/theme-formation/objectifs?tacheId=${selected._id}&userId=${currentUser._id}&tache=execution`)
          break;
          case 'choix_lieu_periode' :
            dispatch(setThemeFormationSelected(selected.theme))
            navigate(`/elaboration-programme/formation/theme-formation/lieux-formation?tacheId=${selected._id}&userId=${currentUser._id}&tache=execution`)
          break;
          case 'confection_fiches_eval_chaud' :
            dispatch(setThemeFormationSelected(selected.theme))
            navigate(`/evaluations/cree-evaluation?tacheId=${selected._id}&userId=${currentUser._id}&tache=execution`)
          break;
          case 'elaboration_budget' :
            navigate(`/execution-programme/suivi-budgetaire?tacheId=${selected._id}&userId=${currentUser._id}&tache=execution&theme=${selected.theme?._id}`)
          break;
          case 'evaluation_connaissances' :
            // dispatch(setThemeFormationSelected(selected.theme))
            // navigate(`/elaboration-programme/formation/theme-formation/formateurs?tache=execution`)
          break;
          case 'ident_formateurs' :
            dispatch(setThemeFormationSelected(selected.theme))
            navigate(`/elaboration-programme/formation/theme-formation/formateurs?tacheId=${selected._id}&userId=${currentUser._id}&tache=execution`)
          break;
          case 'ident_participants' :
            dispatch(setThemeFormationSelected(selected.theme))
            navigate(`/elaboration-programme/formation/theme-formation/pariticipants-formation?tache=execution`)
          break;
        }
        break;
      
      case 'evaluation':
        switch(selected.tache.code){
          case 'remplissage_eval_chaud' :
            // dispatch(setThemeFormationSelected(selected.theme))
            // navigate(`/evaluations/cree-evaluation?tache=execution`)
          break;
        }
      break;
      case 'table-form':
        
        break;

      case 'upload':
          setSelectedTache(selected)
          dispatch(setShowModalUploadDoc())
        break;

      case 'email':
        setSelectedTache(selected)
        dispatch(setShowModalEmail())
      break;
      case 'autoGenerate':
        setSelectedTache(selected)
        dispatch(setShowModalGenerateDoc())
      break;
        

      
        
    }

  };

  return (
    <>
        <div className="group bg-white border border-[#E5E7EB] rounded-xl p-6 hover:shadow-lg hover:border-[#D1D5DB] transition-all duration-200 hover:-translate-y-0.5">
          {/* Header avec status et type */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <StatusIcon statut={lang === 'fr' ? statut?.nomFr||"" : statut?.nomEn||""} />
                <TacheTypeIcon type={tache.tache.type||""} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-[#111827] text-sm md:text-base line-clamp-2">
                  {lang === 'fr' ? tache.tache.nomFr : tache.tache.nomEn}
                </h3>
                {type && (
                  <p className="text-xs text-[#6B7280] mt-1">
                    {lang === 'fr' ? type.nomFr : type.nomEn}
                  </p>
                )}
              </div>
            </div>
            {getStatusBadge()}
          </div>

          {/* Informations complémentaires */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-sm">
            {tache.responsable?.nom && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
                <span className="text-[#4B5563] truncate">{tache.responsable.nom}</span>
              </div>
            )}
            {tache.dateFin && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
                <span className="text-[#4B5563]">{tache.dateFin}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {!tache.estExecutee && (
              <div className="pt-4 border-t border-[#F3F4F6] flex flex-wrap gap-2 justify-between items-center">
                  {/* Conteneur pour les deux premiers boutons, alignés à gauche */}
                  <div className="flex flex-wrap gap-2">
                      <button
                          onClick={() => handleExecuteTache(tache)}
                          className="w-full sm:w-auto px-4 py-2.5 bg-[#22C55E] hover:bg-[#16A34A] text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:ring-offset-2"
                      >
                          {t('label.executer')}
                      </button>
                      <button
                          onClick={handleOpenChat}
                          className="w-full sm:w-auto px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-[#4B5563] text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 flex items-center justify-center gap-2"
                      >
                          <MessageCircle size={18} />
                          {t('label.chat')}
                      </button>
                  </div>
                  
                  {/* Nouveau bouton, aligné à droite par justify-between */}
                  <button
                      onClick={() => { /* Votre logique ici */ }}
                      className="w-full sm:w-auto px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                  >
                      {/* Remplacez l'icône et le texte */}
                      <span className="hidden sm:inline">{t('button.marquer_executer')}</span>
                  </button>
              </div>
          )}
        </div>
        {selectedTache && <FormCheckTask tache={selectedTache} />}
        {selectedTache && <FormUploadFile tache={selectedTache} />}
        {selectedTache && <FormGenerateFile tache={selectedTache} />}
        {selectedTache && <FormSendMessage tache={selectedTache} />}
       

    </>
  );
};

export default TacheCard;
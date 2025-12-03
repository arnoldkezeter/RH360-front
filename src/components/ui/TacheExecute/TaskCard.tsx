import { AlertCircle, BarChart3, Check, CheckSquare, Clock, FileText, Mail, Upload, Users, MessageCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { STATUT_TACHE_THEME } from '../../../config';
import { useTranslation } from 'react-i18next';
import FormCheckTask from '../../Modals/Execution/ExecutionTache/FormCheckTask';
import { useDispatch, useSelector } from 'react-redux';
import { setShowModalCheckTask, setShowModalConvocationFormateur, setShowModalConvocationParticipant, setShowModalEmail, setShowModalFichePresence, setShowModalFichePresenceFormateur, setShowModalGenerateDoc, setShowModalUploadDoc } from '../../../_redux/features/setting';
import { useNavigate } from 'react-router-dom';
import { setThemeFormationSelected } from '../../../_redux/features/elaborations/themeFormationSlice';
import { RootState } from '../../../_redux/store';
import FormUploadFile from '../../Modals/Execution/ExecutionTache/FormUploadFile';
import FormGenerateFile from '../../Modals/Execution/ExecutionTache/FormGenerateFile';
import FormSendMessage from '../../Modals/Execution/ExecutionTache/FormEmailTask';
import createToast from '../../../hooks/toastify';
import { executerTacheTheme, marquerExecuteTacheThemeFormation } from '../../../services/elaborations/tacheThemeFormationAPI';
import { updateTacheThemeFormationSlice } from '../../../_redux/features/elaborations/tacheThemeFormationSlice';
import { formatDateWithLang, getQueryParam } from '../../../fonctions/fonction';
import FormCreateUpdateConvocationFormateur from '../../Modals/Notes/ModalNoteService/FormCreateUpdateNoteConvocationFormateur';
import FormCreateUpdateConvocationParticipant from '../../Modals/Notes/ModalNoteService/FormCreateUpdateNoteConvocationParticipants';
import FormCreateUpdateFichePresence from '../../Modals/Notes/ModalNoteService/FormCreateUpdateNoteFichesPresence';
import FormCreateUpdateFichePresenceFormateur from '../../Modals/Notes/ModalNoteService/FormCreateUpdateNoteFichesPresenceFormateur';

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
  onOpenChat
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
// const statut = tache.estExecutee ? ETAT_TACHE.EXECUTEE : ETAT_TACHE.NON_EXECUTEE;
  const statutsTaches = Object.values(STATUT_TACHE_THEME);

  const statut = statutsTaches.find(t=>t.key===tache.statut)
  const type = typeTaches.find(tt => tt.key === tache.tache.type);
  const [selectedTache, setSelectedTache] = useState<TacheThemeFormation>()
  const [activeForm, setActiveForm] = useState<string | null>(null);
  const [isParticip, setIsParticip] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentUser = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);
  const isParticipant=getQueryParam("participant") === "true";
  const modalsState = useSelector((state: RootState) => state.setting.showModal);

  useEffect(() => {
    const allModalsClosed = 
      !modalsState.openCheckTask &&
      !modalsState.openUploadDoc &&
      !modalsState.openGenerateDoc &&
      !modalsState.openEmail &&
      !modalsState.openConvocationFormateur &&
      !modalsState.openConvocationParticipant &&
      !modalsState.openFichePresence &&
      !modalsState.openFichePresenceFormateur;

    if (allModalsClosed) {
      setSelectedTache(undefined);
      setActiveForm(null);
      setIsParticip(true);
    }
  }, [modalsState]);
 
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

  const handleMarqueExecute = async (selected:TacheThemeFormation) => {
    
    try{
      if(currentUser.role.toLowerCase() === "super-admin" || currentUser.role.toLowerCase() === "admin"){
        setIsLoading(true)
        
        await marquerExecuteTacheThemeFormation(
            {
                tacheId:selected._id||"",
                currentUserId:currentUser._id||"",
                lang
            }
        ).then(async (e: ReponseApiPros) => {
            console.log(e)
            if (e.success) {
                createToast(e.message, '', 0);
                dispatch(updateTacheThemeFormationSlice({
                  id: selected.tache._id||"",
                  tacheThemeFormationData: e.data,
                }));
            } else {
                createToast(e.message, '', 2);
            }
        }).catch((e) => {
            createToast(e.response.data.message, '', 2);
        }).finally(()=>{
            setIsLoading(false)
        })
      }else{
          await executerTacheTheme({
            tacheId:selected.tache._id||"", 
            themeId:selected.theme?._id||"", 
            statut:"EN_ATTENTE", 
            lang}).then(async (e: ReponseApiPros) => {
              
              if (e.success) {
                  createToast(e.message, '', 0);
                  console.log(e.data)
                  dispatch(updateTacheThemeFormationSlice({
                    id: e.data.tache._id,
                    tacheThemeFormationData: e.data,  
                  }));
              } else {
                  createToast(e.message, '', 2);
              }
          }).catch((e) => {
              createToast(e.response.data.message, '', 2);
          }).finally(()=>{
              setIsLoading(false)
          })
      }
    }finally{
      setIsLoading(false)
    }
  
  };

  const handleExecuteTache = (selected:TacheThemeFormation) => {
    
    
    // dispatch(setShowModalCheckTask())
    switch (selected.tache.type) {
      case 'checkbox':
        setSelectedTache(selected);
        setActiveForm("checkTask");
        dispatch(setShowModalCheckTask())
        break;

      case 'form':
        if (!selected?.tache || !currentUser?._id) {
          console.error('Données manquantes pour la navigation', selected );
          return;
        }
        switch(selected.tache.code){
          case 'def_objectifs' :
            dispatch(setThemeFormationSelected(selected.theme))
            
            navigate(`/elaboration-programme/formation/theme-formation/objectifs`)
          break;
          case 'choix_lieu_periode' :
            dispatch(setThemeFormationSelected(selected.theme))
            navigate(`/elaboration-programme/formation/theme-formation/lieux-formation`)
          break;
          case 'confection_fiches_eval_chaud' :
            dispatch(setThemeFormationSelected(selected.theme))
            navigate(`/evaluations/cree-evaluation?themeId=${selected.theme?._id}`)
          break;
          case 'elaboration_budget' :
            navigate(`/execution-programme/suivi-budgetaire?theme=${selected.theme?._id}`)
          break;
          case 'ident_formateurs' :
            dispatch(setThemeFormationSelected(selected.theme))
            navigate(`/elaboration-programme/formation/theme-formation/formateurs`)
          break;
          case 'ident_participants' :
            dispatch(setThemeFormationSelected(selected.theme))
            navigate(`/formation/pariticipants?themeId=${selected.theme?._id}`)
          break;
          case 'deroulement_formation' :
            dispatch(setThemeFormationSelected(selected.theme))
            navigate(`/elaboration-programme/formation/theme-formation/lieux-formation`)
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
          setActiveForm("uploadFile");
          dispatch(setShowModalUploadDoc())
        break;

      case 'email':
        setSelectedTache(selected)
        if(selected.tache.code==="communication_formateurs"){
          setIsParticip(false);
        }
        setActiveForm("sendMessage");
        dispatch(setShowModalEmail())
      break;
      case 'autoGenerate':
        switch(selected.tache.code){
          case 'note_service_convocation_formateur':
            setSelectedTache(selected)
            setActiveForm("convocationFormateur");
            dispatch(setShowModalConvocationFormateur())
          break
          case 'note_service_convocation_participant':
            setSelectedTache(selected)
            setActiveForm("convocationParticipant");
            dispatch(setShowModalConvocationParticipant())
          break
          case 'confection_fiches_presence_participant':
            setSelectedTache(selected)
            setActiveForm("fichePresence");
            dispatch(setShowModalFichePresence())
          break
           case 'confection_fiches_presence_formateur':
            setSelectedTache(selected)
            setActiveForm("fichePresenceFormateur");
            dispatch(setShowModalFichePresenceFormateur())
          break
          default:
            setSelectedTache(selected)
            dispatch(setShowModalGenerateDoc());
            setActiveForm("generateFile");
          break
        }
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
          {tache.theme?.responsable?.nom && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
              <span className="text-[#4B5563] truncate">{`${tache.theme?.responsable?.nom||""} ${tache.theme?.responsable?.prenom||""}`}</span>
            </div>
          )}
          {tache.dateFin && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
              <span className="text-[#4B5563]">{`${t('label.doit_etre_termine')} ${formatDateWithLang(tache.dateFin, lang)}`}</span>
            </div>
            )}
      </div>

      {/* Actions */}
       {!tache.estExecutee && !isParticipant && (
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
              
              {/* Bouton admin uniquement */}
            {/* {(currentUser.role.toLowerCase() === "super-admin" || 
              currentUser.role.toLowerCase() === "admin") || (tache.tache.type === 'form') && ( */}
                <button
                    onClick={() => handleMarqueExecute(tache)}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-4 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2"
                >
                {isLoading && (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                )}
                    {!isLoading && t('button.marquer_executer')}
                </button>
            {/* )} */}
            
          </div>
      )}
      </div>
        {selectedTache && activeForm === "checkTask" && (
          <FormCheckTask tache={selectedTache} />
        )}

        {selectedTache && activeForm === "uploadFile" && (
          <FormUploadFile tache={selectedTache} />
        )}

        {selectedTache && activeForm === "generateFile" && (
          <FormGenerateFile tache={selectedTache} />
        )}

        {selectedTache && activeForm === "sendMessage" && (
          <FormSendMessage tache={selectedTache} isParticipant={isParticip}/>
        )}

        {selectedTache && activeForm === "convocationFormateur" && (
          <FormCreateUpdateConvocationFormateur tache={selectedTache} note={undefined} themeId={selectedTache.theme?._id}/>
        )}

        {selectedTache && activeForm === "convocationParticipant" && (
          <FormCreateUpdateConvocationParticipant tache={selectedTache} note={undefined} themeId={selectedTache.theme?._id}/>
        )}

        {selectedTache && activeForm === "fichePresence" && (
          <FormCreateUpdateFichePresence tache={selectedTache} note={undefined} themeId={selectedTache.theme?._id}/>
        )}

        {selectedTache && activeForm === "fichePresenceFormateur" && (
          <FormCreateUpdateFichePresenceFormateur tache={selectedTache} note={undefined} themeId={selectedTache.theme?._id}/>
        )}

    </>
);
};

export default TacheCard;
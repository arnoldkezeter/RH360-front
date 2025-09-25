import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../../_redux/features/setting';
import { RootState } from '../../../../../_redux/store';
import CustomDialogModal from '../../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../../hooks/toastify';
import { createLieuFormation, updateLieuFormation } from '../../../../../services/elaborations/lieuFormationAPI';
import { createLieuFormationSlice, updateLieuFormationSlice } from '../../../../../_redux/features/elaborations/lieuFormationSlice';
import { searchCohorte } from '../../../../../services/settings/cohorteAPI';
import { SearchSelectComponent } from '../../../../ui/SearchSelectComponent';
import { hasTacheExecution, getTacheAndUserId, formatDateForInput } from '../../../../../fonctions/fonction';
import { updateStatutTacheThemeFormation } from '../../../../../services/elaborations/tacheThemeFormationAPI';
import { searchParticipantFormations } from '../../../../../services/elaborations/participantFormationAPI';


function FormCreateUpdate({ lieuFormation, themeId }: { lieuFormation: LieuFormation | null, themeId:string }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const [lieu, setLieu] = useState("");
    const [selectedCohortes, setSelectedCohortes] = useState<Cohorte[]>([]);
    const [selectedParticipants, setSelectedParticipants] = useState<ParticipantFormation[]>([]);
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    
    

    const [errorLieu, setErrorLieu] = useState("");
    const [errorCohorteParticipants, setErrorCohorteParticipants] = useState("");
    const [errorDateDebut, setErrorDateDebut] = useState("");
    const [errorDateFin, setErrorDateFin] = useState("")
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        
        if (lieuFormation) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.lieu_formation'));
            
            setLieu(lieuFormation.lieu);
            setSelectedCohortes(lieuFormation.cohortes)
            setSelectedParticipants(lieuFormation.participants)
            setDateDebut(formatDateForInput(lieuFormation.dateDebut) || "");
            setDateFin(formatDateForInput(lieuFormation.dateFin) || "");
            
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.lieu_formation'));
            
            setLieu("");
           
            setSelectedCohortes([]);
            setSelectedParticipants([])
            setDateDebut("");
            setDateFin("");
            
        }


        if (isFirstRender) {
            setErrorLieu("");
            setErrorCohorteParticipants("")
            setErrorDateDebut("")
            setErrorDateFin("")
            
            setIsFirstRender(false);
        }
    }, [lieuFormation, isFirstRender, t]);

    const closeModal = () => {
        setErrorLieu("");
        setErrorCohorteParticipants("");
        setErrorDateDebut("")
        setErrorDateFin("")
        setIsFirstRender(true);
        dispatch(setShowModal());
    };



    const onSearchCohorte = async (search: string) => {
        setErrorCohorteParticipants("");
        const data = await searchCohorte({searchString: search, lang});
        return data?.cohortes || [];
    };

    const onSearchUtilisateur = async (search: string) => {
        setErrorCohorteParticipants("");
        const data = await searchParticipantFormations({search: search, lang:lang, themeId:themeId});
        return data?.participantFormations || [];
    };

   


    const handleCreateLieuFormation = async () => {
        if (!lieu || (!selectedCohortes && !selectedParticipants) || !dateDebut || !dateFin) {
            if (!lieu) {
                setErrorLieu(t('error.titre_fr'));
            }

            if(!selectedCohortes || !selectedParticipants){
                setErrorCohorteParticipants(t("error.cohorte_participant"))
            }

            if (!dateDebut) {
                setErrorDateDebut(t('error.date_debut'));
            }

            if (!dateFin) {
                setErrorDateFin(t('error.date_fin'));
            }

            return;
        }

        if (!lieuFormation) {
            setIsLoading(true)
            await createLieuFormation(
                {
                    lieu,
                    cohortes:selectedCohortes,
                    participants:selectedParticipants,
                    dateDebut,
                    dateFin
                }, themeId,lang
            ).then(async (e: ReponseApiPros) => {
                
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createLieuFormationSlice({

                        lieuFormation: {
                            _id: e.data._id,
                            lieu: e.data.lieu,
                            cohortes: e.data.cohortes,
                            participants:e.data.participants,
                            dateDebut:e.data.dateDebut,
                            dateFin:e.data.dateFin,
                            dateDebutEffective:e.data.dateDebutEffective,
                            dateFinEffective:e.data.dateFinEffectif
                        }

                    }));
                    if(hasTacheExecution()){
                        const {tacheId, userId}=getTacheAndUserId();
                        await updateStatutTacheThemeFormation({tacheId:tacheId||"", currentUser:userId||"", statut:"EN_ATTENTE",donnees:'check', lang})
                    }
                    closeModal();

                } else {
                    createToast(e.message, '', 2);

                }
            }).catch((e) => {
                console.log(e);
                createToast(e.response.data.message, '', 2);
            }).finally(()=>{
                setIsLoading(false)
            })

        } else {
            setIsLoading(true)
            await updateLieuFormation(
                {
                    _id: lieuFormation._id,
                    lieu,
                    cohortes:selectedCohortes,
                    participants:selectedParticipants,
                    dateDebut,
                    dateFin

                }, themeId,lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateLieuFormationSlice({
                            id: e.data._id,
                            lieuFormationData: {
                                _id: e.data._id,
                                lieu: e.data.lieu,
                                cohortes: e.data.cohortes,
                                participants:e.data.participants,
                                dateDebut:e.data.dateDebut,
                                dateFin:e.data.dateFin,
                                dateDebutEffective:e.data.dateDebutEffective,
                                dateFinEffective:e.data.dateFinEffectif
                            }

                        }));

                        closeModal();

                    } else {
                        createToast(e.message, '', 2);

                    }
                }).catch((e) => {
                    console.log(e);
                    createToast(e.response.data.message, '', 2);
                }).finally(()=>{
                    setIsLoading(false)
                })
        }
    }


    
    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateLieuFormation}
                isLoading={isLoading}
            >
                
                <label>{t('label.lieu')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={lieu}
                    onChange={(e) => { setLieu(e.target.value); setErrorLieu("") }}
                />
                {errorLieu && <p className="text-red-500" >{errorLieu}</p>}
                
                <label>{t('label.cohortes')}</label><label className="text-red-500"> *</label>
                <SearchSelectComponent<Cohorte>
                    onSearch={onSearchCohorte}
                    selectedItems={selectedCohortes}
                    onSelectionChange={setSelectedCohortes}
                    placeholder={t('recherche.rechercher')+t('recherche.cohorte')}
                    displayField={lang?"nomFr":"nomEn"}
                    searchDelay={300}
                    minSearchLength={2}
                    noResultsMessage={t('label.aucune_cohorte')}
                    loadingMessage={t('label.recherche_cohorte')}
                    textDebutCaractere={t('label.tapez_car_deb')}
                    textFinCaractere={t('label.tapez_car_fin')}
                />
                {errorCohorteParticipants && <p className="text-red-500" >{errorCohorteParticipants}</p>}
                 <label>{t('label.participants')}</label><label className="text-red-500"> *</label>
                <SearchSelectComponent<ParticipantFormation>
                    onSearch={onSearchUtilisateur}
                    selectedItems={selectedParticipants}
                    onSelectionChange={setSelectedParticipants}
                    placeholder={t('recherche.rechercher') + t('recherche.participant')}
                    displayField="participant"
                    searchDelay={300}
                    minSearchLength={2}
                    noResultsMessage={t('label.aucun_participant')}
                    loadingMessage={t('label.recherche_participant')}
                    textDebutCaractere={t('label.tapez_car_deb')}
                    textFinCaractere={t('label.tapez_car_fin')}
                    renderItem={(item) => (
                        <span>{item.participant.nom} {item.participant.prenom}</span>
                    )}
                />

                {errorCohorteParticipants && <p className="text-red-500" >{errorCohorteParticipants}</p>}
                 <label>{t('label.date_debut')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateDebut}
                    onChange={(e) => {setDateDebut(e.target.value); setErrorDateDebut("")}}
                />
                {errorDateDebut && <p className="text-red-500" >{errorDateDebut}</p>}
                 <label>{t('label.date_fin')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateFin}
                    onChange={(e) => {setDateFin(e.target.value); setErrorDateFin("")}}
                />
                {errorDateFin && <p className="text-red-500" >{errorDateFin}</p>}
            </CustomDialogModal>

        </>
    );
}



export default FormCreateUpdate;

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
import { hasTacheExecution, getTacheAndUserId } from '../../../../../fonctions/fonction';
import { updateStatutTacheThemeFormation } from '../../../../../services/elaborations/tacheThemeFormationAPI';


function FormCreateUpdate({ lieuFormation, themeId }: { lieuFormation: LieuFormation | null, themeId:string }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const [lieu, setLieu] = useState("");
    const [selectedCohortes, setSelectedCohortes] = useState<Cohorte[]>([]);
    
    

    const [errorLieu, setErrorLieu] = useState("");
    const [errorCohortes, setErrorCohortes] = useState("");
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        
        if (lieuFormation) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.lieu_formation'));
            
            setLieu(lieuFormation.lieu);
            setSelectedCohortes(lieuFormation.cohortes)
            
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.lieu_formation'));
            
            setLieu("");
           
            setSelectedCohortes([]);
            
        }


        if (isFirstRender) {
            setErrorLieu("");
            setErrorCohortes("")
           
            
            setIsFirstRender(false);
        }
    }, [lieuFormation, isFirstRender, t]);

    const closeModal = () => {
        setErrorLieu("");
        setErrorCohortes("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };



    const onSearchCohorte = async (search: string) => {
        setErrorCohortes("");
        const data = await searchCohorte({searchString: search, lang});
        return data?.cohortes || [];
    };

   


    const handleCreateLieuFormation = async () => {
        if (!lieu || !selectedCohortes) {
            if (!lieu) {
                setErrorLieu(t('error.titre_fr'));
            }

            if(!selectedCohortes){
                setErrorCohortes(t("error.cohorte"))
            }

            return;
        }

        if (!lieuFormation) {
            await createLieuFormation(
                {
                    lieu,
                    cohortes:selectedCohortes
                }, themeId,lang
            ).then(async (e: ReponseApiPros) => {
                
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createLieuFormationSlice({

                        lieuFormation: {
                            _id: e.data._id,
                            lieu: e.data.lieu,
                            cohortes: e.data.cohortes,
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
            })

        } else {
            await updateLieuFormation(
                {
                    _id: lieuFormation._id,
                    lieu,
                    cohortes:selectedCohortes
                }, themeId,lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateLieuFormationSlice({
                            id: e.data._id,
                            lieuFormationData: {
                                _id: e.data._id,
                                lieu: e.data.lieu,
                                cohortes: e.data.cohortes,
                            }

                        }));

                        closeModal();

                    } else {
                        createToast(e.message, '', 2);

                    }
                }).catch((e) => {
                    console.log(e);
                    createToast(e.response.data.message, '', 2);
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
                {errorCohortes && <p className="text-red-500" >{errorCohortes}</p>}
            </CustomDialogModal>

        </>
    );
}



export default FormCreateUpdate;

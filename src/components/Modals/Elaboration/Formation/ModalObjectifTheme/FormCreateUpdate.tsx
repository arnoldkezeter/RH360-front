import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../../_redux/features/setting';
import { RootState } from '../../../../../_redux/store';
import CustomDialogModal from '../../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../../hooks/toastify';
import { createObjectifTheme, updateObjectifTheme } from '../../../../../services/elaborations/objectifThemeAPI';
import { createObjectifThemeSlice, updateObjectifThemeSlice } from '../../../../../_redux/features/elaborations/objectifThemeSlice';
import { searchCohorte } from '../../../../../services/settings/cohorteAPI';
import { checkQueryParam, getTacheAndUserId, hasTacheExecution } from '../../../../../fonctions/fonction';
import { useLocation } from 'react-router-dom';
import { updateStatutTacheThemeFormation } from '../../../../../services/elaborations/tacheThemeFormationAPI';


function FormCreateUpdate({ objectifTheme, themeId }: { objectifTheme: ObjectifTheme | null, themeId:string }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");
    
    const {tacheId, userId}=getTacheAndUserId();
                        console.log(tacheId)

    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        
        if (objectifTheme) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.objectif'));
            
            setNomFr(objectifTheme.nomFr);
            setNomEn(objectifTheme.nomEn)
            
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.objectif'));
            
            setNomFr("");
            setNomEn("")
            
        }


        if (isFirstRender) {
            setErrorNomFr("");
            setErrorNomEn("")
           
            
            setIsFirstRender(false);
        }
    }, [objectifTheme, isFirstRender, t]);

    const closeModal = () => {
        setErrorNomFr("");
        setErrorNomEn("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };



    const onSearchCohorte = async (search: string) => {
        setErrorNomEn("");
        const data = await searchCohorte({searchString: search, lang});
        return data?.cohortes || [];
    };

   


    const handleCreateObjectifTheme = async () => {
        if (!nomFr || !nomEn) {
            if (!nomFr) {
                setErrorNomFr(t('error.nom_chose_fr'));
            }

            if(!nomEn){
                setErrorNomEn(t("error.nom_chose_en"))
            }

            return;
        }

        if (!objectifTheme) {
            await createObjectifTheme(
                {
                    nomFr,
                    nomEn
                }, themeId,lang
            ).then(async (e: ReponseApiPros) => {
                
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createObjectifThemeSlice({

                        objectifTheme: {
                            _id: e.data._id,
                            nomFr: e.data.nomFr,
                            nomEn: e.data.nomEn,
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
            await updateObjectifTheme(
                {
                    _id: objectifTheme._id,
                    nomFr,
                    nomEn
                }, themeId,lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateObjectifThemeSlice({
                            id: e.data._id,
                            objectifThemeData: {
                                _id: e.data._id,
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
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
                handleConfirm={handleCreateObjectifTheme}
            >
                
                <label>{t('label.nom_chose_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={nomFr}
                    onChange={(e) => { setNomFr(e.target.value); setErrorNomFr("") }}
                />
                {errorNomFr && <p className="text-red-500" >{errorNomFr}</p>}
                
                <label>{t('label.nom_chose_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={nomEn}
                    onChange={(e) => { setNomEn(e.target.value); setErrorNomEn("") }}
                />
                {errorNomEn && <p className="text-red-500" >{errorNomEn}</p>}
            </CustomDialogModal>

        </>
    );
}



export default FormCreateUpdate;

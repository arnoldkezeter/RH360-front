import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RootState } from '../../../../_redux/store';
import { setShowModal } from '../../../../_redux/features/setting';
import { createEchelleReponse, updateEchelleReponse } from '../../../../services/evaluations/echelleReponseAPI';
import createToast from '../../../../hooks/toastify';
import { createEchelleReponseSlice, updateEchelleReponseSlice } from '../../../../_redux/features/evaluations/echelleReponseSlice';
import CustomDialogModal from '../../CustomDialogModal';


function FormCreateUpdate({ echelleReponse, typeEchelleId }: { echelleReponse: EchelleReponse | null, typeEchelleId:string }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");
    const [ordre, setOrdre] = useState<number|undefined>(undefined)
    
    

    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");
    const [errorOrdre, setErrorOrdre] = useState("")
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        
        if (echelleReponse) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.echelle_reponse'));
            
            setNomFr(echelleReponse.nomFr);
            setNomEn(echelleReponse.nomEn)
            setOrdre(echelleReponse.ordre)
            
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.echelle_reponse'));
            
            setNomFr("");
            setNomEn("")
            setOrdre(undefined)
            
        }


        if (isFirstRender) {
            setErrorNomFr("");
            setErrorNomEn("")
            setErrorOrdre("");
            
            setIsFirstRender(false);
        }
    }, [echelleReponse, isFirstRender, t]);

    const closeModal = () => {
        setErrorNomFr("");
        setErrorNomEn("");
        setErrorOrdre("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };
   


    const handleCreateEchelleReponse = async () => {
        if (!nomFr || !nomEn || !ordre) {
            if (!nomFr) {
                setErrorNomFr(t('error.nom_chose_fr'));
            }

            if(!nomEn){
                setErrorNomEn(t("error.nom_chose_en"))
            }

            if(!ordre){
                setErrorOrdre(t("error.ordre"));
            }

            return;
        }

        if (!echelleReponse) {
            await createEchelleReponse(
                {
                    nomFr,
                    nomEn,
                    ordre
                }, typeEchelleId,lang
            ).then((e: ReponseApiPros) => {
                
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createEchelleReponseSlice({

                        echelleReponse: {
                            _id: e.data._id,
                            nomFr: e.data.nomFr,
                            nomEn: e.data.nomEn,
                            ordre: e.data.ordre
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

        } else {
            await updateEchelleReponse(
                {
                    _id: echelleReponse._id,
                    nomFr,
                    nomEn,
                    ordre
                }, typeEchelleId,lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateEchelleReponseSlice({
                            id: e.data._id,
                            echelleReponseData: {
                                _id: e.data._id,
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                ordre: e.data.ordre,
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
                handleConfirm={handleCreateEchelleReponse}
            >
                
                
                <label>{t('label.ordre')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="number"
                    value={ordre}
                    onChange={(e) => { setOrdre(parseInt(e.target.value)); setErrorOrdre("") }}
                />
                {errorOrdre && <p className="text-red-500" >{errorOrdre}</p>}
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

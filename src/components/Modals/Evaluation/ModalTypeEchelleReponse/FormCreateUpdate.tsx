import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Label } from '../../../ui/Label';
import Input from '../../../ui/input';
import createToast from '../../../../hooks/toastify';
import { createTypeEchelleReponse, updateTypeEchelleReponse } from '../../../../services/evaluations/typeEchelleReponseAPI';
import { createTypeEchelleReponseSlice, updateTypeEchelleReponseSlice } from '../../../../_redux/features/evaluations/typeEchelleResponseSlice';


function FormCreateUpdate({ typeEchelleReponse }: { typeEchelleReponse: TypeEchelleReponse | null }) {
    
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    

    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");
   

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (typeEchelleReponse) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.type_echelle_reponse'));
            
            setNomFr(typeEchelleReponse.nomFr);
            setNomEn(typeEchelleReponse.nomEn);
            setDescriptionFr(typeEchelleReponse?.descriptionFr || "");
            setDescriptionEn(typeEchelleReponse?.descriptionEn || "");

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.type_echelle_reponse'));
            setNomFr("");
            setNomEn("");
            setDescriptionFr("");
            setDescriptionEn("");
        }


        if (isFirstRender) {
            setErrorNomEn("");
            setErrorNomFr("");
           
            setIsFirstRender(false);
        }
    }, [typeEchelleReponse, isFirstRender, t]);

    const closeModal = () => {
        setErrorNomFr("");
        setErrorNomEn("");
       
        setIsFirstRender(true);
        dispatch(setShowModal());
    };


    const handleCreateUpdate = async () => {
        if(!nomFr || !nomEn ){
            if (!nomFr) {
                setErrorNomFr(t('error.nom_fr'));
            }
            if (!nomEn) {
                setErrorNomEn(t('error.nom_en'));
            }

           
            return;
        }
        // create
        if (!typeEchelleReponse) {
            setIsLoading(true)
            await createTypeEchelleReponse(
                {
                    nomFr,
                    nomEn,
                    descriptionFr,
                    descriptionEn,
                },
                lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createTypeEchelleReponseSlice({
                        typeEchelleReponse:{
                            _id:e.data._id,
                            nomFr:e.data.nomFr,
                            nomEn:e.data.nomEn,
                            descriptionFr:e.data.descriptionFr,
                            descriptionEn:e.data.descriptionEn
                        }
                    }));

                    closeModal();

                } else {
                    createToast(e.message, '', 2);

                }
            }).catch((e) => {
                createToast(e.response.data.message, '', 2);
            }).finally(()=>{
                setIsLoading(false)
            })
                

            
        }else {

            setIsLoading(true)
            await updateTypeEchelleReponse(
                {
                    _id: typeEchelleReponse._id,
                    nomFr,
                    nomEn,
                    descriptionFr:descriptionFr,
                    descriptionEn:descriptionEn,
                    
                },
                lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(updateTypeEchelleReponseSlice({
                        id: e.data._id,
                        typeEchelleReponseData : {
                            _id: e.data._id,
                            nomFr: e.data.nomFr,
                            nomEn: e.data.nomEn,
                            descriptionFr:e.data.descriptionFr,
                            descriptionEn:e.data.descriptionEn
                            
                        }
                    }));

                    closeModal();

                } else {
                    createToast(e.message, '', 2);
                }
            }).catch((e) => {
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
                handleConfirm={handleCreateUpdate}
                isLoading={isLoading}
            >


                <Label text={t('label.nom_chose_fr')} required />
                <Input
                    value={nomFr}
                    type='text'
                    setValue={(value) => { setNomFr(value); setErrorNomFr(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorNomFr} />

                <Label text={t('label.nom_chose_en')} required />
                <Input
                    value={nomEn}
                    type='text'
                    setValue={(value) => { setNomEn(value); setErrorNomEn(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorNomEn} />
                                <Label text={t('label.description_fr')}/>
                <Input
                    value={descriptionFr}
                    type='text'
                    setValue={(value) => { setDescriptionFr(value)}}
                    hasBackground={true}
                />

                <Label text={t('label.description_en')}/>
                <Input
                    value={descriptionEn}
                    type='text'
                    setValue={(value) => { setDescriptionEn(value)}}
                    hasBackground={true}
                />

                
            </CustomDialogModal>

        </>
    );
}

export default FormCreateUpdate;

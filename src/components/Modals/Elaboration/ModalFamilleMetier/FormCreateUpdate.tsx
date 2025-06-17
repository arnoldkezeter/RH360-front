import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Label } from '../../../ui/Label';
import Input from '../../../ui/input';
import createToast from '../../../../hooks/toastify';
import { createFamilleMetierSlice, updateFamilleMetierSlice } from '../../../../_redux/features/familleMetierSlice';
import { createFamilleMetier, updateFamilleMetier } from '../../../../services/familleMetierAPI';


function FormCreateUpdate({ familleMetier }: { familleMetier: FamilleMetier | null }) {

    const { t } = useTranslation();
    const dispatch = useDispatch();

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
        if (familleMetier) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.famille_metier'));
            
            setNomFr(familleMetier.nomFr);
            setNomEn(familleMetier.nomEn);
            setDescriptionFr(familleMetier?.descriptionFr || "");
            setDescriptionEn(familleMetier?.descriptionEn || "");

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.famille_metier'));
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
    }, [familleMetier, isFirstRender, t]);

    const closeModal = () => {
        setErrorNomFr("");
        setErrorNomEn("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };


    const handleCreateUpdate = async () => {
        if(!nomFr || !nomEn){
            if (!nomFr) {
                setErrorNomFr(t('error.nom_fr'));
            }
            if (!nomEn) {
                setErrorNomEn(t('error.nom_en'));
            }
            return;
        }
        // create
        if (!familleMetier) {
            
            await createFamilleMetier(
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
                    dispatch(createFamilleMetierSlice({
                        familleMetier:{
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
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
            })
                

            
        }else {

        
            await updateFamilleMetier(
                {
                    _id: familleMetier._id,
                    nomFr,
                    nomEn,
                    descriptionFr:descriptionFr,
                    descriptionEn:descriptionEn,
                    
                },
                lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(updateFamilleMetierSlice({
                        id: e.data._id,
                        familleMetierData : {
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
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
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

                <Label text={t('label.description_fr')} />
                <Input
                    value={descriptionFr}
                    type='text'
                    setValue={(value) => { setDescriptionFr(value); }}
                    hasBackground={true}
                />

                <Label text={t('label.description_en')} />
                <Input
                    value={descriptionEn}
                    type='text'
                    setValue={(value) => { setDescriptionEn(value); }}
                    hasBackground={true}
                />
            </CustomDialogModal>

        </>
    );
}

export default FormCreateUpdate;

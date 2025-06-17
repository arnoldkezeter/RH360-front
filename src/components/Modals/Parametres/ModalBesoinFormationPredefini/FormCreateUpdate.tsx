import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Label } from '../../../ui/Label';
import Input from '../../../ui/input';
import createToast from '../../../../hooks/toastify';
import { createBesoinFormationPredefini, updateBesoinFormationPredefini } from '../../../../services/settings/besoinFormationPredefiniAPI';
import { createBesoinFormationPredefiniSlice, updateBesoinFormationPredefiniSlice } from '../../../../_redux/features/parametres/besoinFormationPredefini';


function FormCreateUpdate({ besoinFormationPredefini }: { besoinFormationPredefini: BesoinFormationPredefini | null }) {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [titreFr, setTitreFr] = useState("");
    const [titreEn, setTitreEn] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    

    const [errorTitreFr, setErrorTitreFr] = useState("");
    const [errorTitreEn, setErrorTitreEn] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (besoinFormationPredefini) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.besoin_formation_predefini'));
            
            setTitreFr(besoinFormationPredefini.titreFr);
            setTitreEn(besoinFormationPredefini.titreEn);
            setDescriptionFr(besoinFormationPredefini?.descriptionFr || "");
            setDescriptionEn(besoinFormationPredefini?.descriptionEn || "");

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.besoin_formation_predefini'));
            setTitreFr("");
            setTitreEn("");
            setDescriptionFr("");
            setDescriptionEn("");
        }


        if (isFirstRender) {
            setErrorTitreEn("");
            setErrorTitreFr("");
            setIsFirstRender(false);
        }
    }, [besoinFormationPredefini, isFirstRender, t]);

    const closeModal = () => {
        setErrorTitreFr("");
        setErrorTitreEn("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };


    const handleCreateUpdate = async () => {
        if(!titreFr || !titreEn){
            if (!titreFr) {
                setErrorTitreFr(t('error.titre_fr'));
            }
            if (!titreEn) {
                setErrorTitreEn(t('error.titre_en'));
            }
            return;
        }
        // create
        if (!besoinFormationPredefini) {
            
            await createBesoinFormationPredefini(
                {
                    titreFr,
                    titreEn,
                    descriptionFr,
                    descriptionEn,
                },
                lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createBesoinFormationPredefiniSlice({
                        besoinFormationPredefini:{
                            _id:e.data._id,
                            titreFr:e.data.titreFr,
                            titreEn:e.data.titreEn,
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

        
            await updateBesoinFormationPredefini(
                {
                    _id: besoinFormationPredefini._id,
                    titreFr,
                    titreEn,
                    descriptionFr:descriptionFr,
                    descriptionEn:descriptionEn,
                    
                },
                lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(updateBesoinFormationPredefiniSlice({
                        id: e.data._id,
                        besoinFormationPredefiniData : {
                            _id: e.data._id,
                            titreFr: e.data.titreFr,
                            titreEn: e.data.titreEn,
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

                <Label text={t('label.titre_fr')} required />
                <Input
                    value={titreFr}
                    type='text'
                    setValue={(value) => { setTitreFr(value); setErrorTitreFr(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorTitreFr} />

                <Label text={t('label.titre_en')} required />
                <Input
                    value={titreEn}
                    type='text'
                    setValue={(value) => { setTitreEn(value); setErrorTitreEn(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorTitreEn} />

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

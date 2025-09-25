import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Label } from '../../../ui/Label';
import Input from '../../../ui/input';
import createToast from '../../../../hooks/toastify';
import { createEtablissement, updateEtablissement } from '../../../../services/settings/etablissementAPI';
import { createEtablissementSlice, updateEtablissementSlice } from '../../../../_redux/features/parametres/etablissementSlice';


function FormCreateUpdate({ etablissement }: { etablissement: Etablissement | null }) {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");
    

    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (etablissement) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.etablissement'));
            
            setNomFr(etablissement.nomFr);
            setNomEn(etablissement.nomEn);

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.etablissement'));
            setNomFr("");
            setNomEn("");
        }


        if (isFirstRender) {
            setErrorNomEn("");
            setErrorNomFr("");
            setIsFirstRender(false);
        }
    }, [etablissement, isFirstRender, t]);

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
        if (!etablissement) {
            setIsLoading(true)
            await createEtablissement(
                {
                    nomFr,
                    nomEn,
                },
                lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createEtablissementSlice({
                        etablissement:{
                            _id:e.data._id,
                            nomFr:e.data.nomFr,
                            nomEn:e.data.nomEn,
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
            await updateEtablissement(
                {
                    _id: etablissement._id,
                    nomFr,
                    nomEn
                    
                },
                lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(updateEtablissementSlice({
                        id: e.data._id,
                        etablissementData : {
                            _id: e.data._id,
                            nomFr: e.data.nomFr,
                            nomEn: e.data.nomEn
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

                
            </CustomDialogModal>

        </>
    );
}

export default FormCreateUpdate;

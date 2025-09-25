import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setShowModal } from '../../../../_redux/features/setting';
import Input from '../../../ui/input';
import { ErrorMessage, Label } from '../../../ui/Label';
import createToast from '../../../../hooks/toastify';
import { createRegion, updateRegion } from '../../../../services/settings/regionAPI';
import { createRegionSlice, updateRegionSlice } from '../../../../_redux/features/parametres/regionSlice';


function ModalCreateUpdate({ region }: { region: Region | null }) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();
    const [code, setCode] = useState("");
    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");

    const [errorCode, setErrorCode] = useState("");
    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (region) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.region'));
            setCode(region.code);
            setNomFr(region.nomFr);
            setNomEn(region.nomEn);

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.region'));
            setCode("");
            setNomFr("");
            setNomEn("");
        }

        if (isFirstRender) {
            setErrorCode("");
            setErrorNomEn("");
            setErrorNomFr("");
            setIsFirstRender(false);
        }
    }, [region, isFirstRender, t]);

    const closeModal = () => {
        setErrorCode("");
        setErrorNomFr("");
        setErrorNomEn("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };


    const handleCreateUpdate = async () => {
        if (!code || !nomFr || !nomEn) {
            if (!code) {
                setErrorCode(t('error.code'));
            }
            if (!nomFr) {
                setErrorNomFr(t('error.nom_fr'));
            }
            if (!nomEn) {
                setErrorNomEn(t('error.nom_en'));
            }
            return;
        }
        // create
        if (!region) {
            setIsLoading(true)
            await createRegion(
                {code, nomFr, nomEn}, lang 
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createRegionSlice({
                        region:{
                            _id:e.data._id,
                            code:e.data.code,
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
            
        } else {
            setIsLoading(true)
            await updateRegion(
                { _id: region._id, code, nomFr, nomEn }, lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(updateRegionSlice({
                        id:e.data._id,
                        regionData:{
                            _id:e.data._id,
                            code:e.data.code,
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

                {/* input 1 */}
                <Label text={t('label.code')} required />
                <Input
                    value={code}
                    type='text'
                    setValue={(value) => { setCode(value); setErrorCode("") }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorCode} />


                {/* input 2 */}
                <Label text={t('label.nom_chose_fr')} required />
                <Input
                    value={nomFr}
                    type='text'
                    setValue={(value) => { setNomFr(value); setErrorNomFr(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorNomFr} />


                {/* input 3 */}
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

export default ModalCreateUpdate;


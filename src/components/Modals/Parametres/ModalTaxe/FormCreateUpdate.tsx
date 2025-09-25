import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Label } from '../../../ui/Label';
import Input from '../../../ui/input';
import createToast from '../../../../hooks/toastify';
import { createTaxe, updateTaxe } from '../../../../services/settings/taxeAPI';
import { createTaxeSlice, updateTaxeSlice } from '../../../../_redux/features/parametres/taxeSlice';


function FormCreateUpdate({ taxe }: { taxe: Taxe | null }) {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [natureFr, setNatureFr] = useState("");
    const [natureEn, setNatureEn] = useState("");
    const [taux, setTaux] = useState(0);
    

    const [errorNatureFr, setErrorNatureFr] = useState("");
    const [errorNatureEn, setErrorNatureEn] = useState("");
    const [errorTaux, setErrorTaux] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (taxe) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.taxe'));
            
            setNatureFr(taxe.natureFr);
            setNatureEn(taxe.natureEn);
            setTaux(taxe.taux);

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.taxe'));
            setNatureFr("");
            setNatureEn("");
            setTaux(0);
        }


        if (isFirstRender) {
            setErrorNatureEn("");
            setErrorNatureFr("");
            setErrorTaux("");
            setIsFirstRender(false);
        }
    }, [taxe, isFirstRender, t]);

    const closeModal = () => {
        setErrorNatureFr("");
        setErrorNatureEn("");
        setErrorTaux("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };


    const handleCreateUpdate = async () => {
        if(!natureFr || !natureEn){
            if (!natureFr) {
                setErrorNatureFr(t('error.nature_fr'));
            }
            if (!natureEn) {
                setErrorNatureEn(t('error.nature_en'));
            }

            if (!taux) {
                setErrorTaux(t('error.taux'));
            }
            return;
        }
        // create
        if (!taxe) {
            setIsLoading(true)
            await createTaxe(
                {
                    natureFr,
                    natureEn,
                    taux,
                },
                lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createTaxeSlice({
                        taxe:{
                            _id:e.data._id,
                            natureFr:e.data.natureFr,
                            natureEn:e.data.natureEn,
                            taux:e.data.taux,
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
            await updateTaxe(
                {
                    _id: taxe._id,
                    natureFr,
                    natureEn,
                    taux:taux,
                    
                },
                lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(updateTaxeSlice({
                        id: e.data._id,
                        taxeData : {
                            _id: e.data._id,
                            natureFr: e.data.natureFr,
                            natureEn: e.data.natureEn,
                            taux:e.data.taux,
                            
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

                <Label text={t('label.nature_taxe_fr')} required />
                <Input
                    value={natureFr}
                    type='text'
                    setValue={(value) => { setNatureFr(value); setErrorNatureFr(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorNatureFr} />

                <Label text={t('label.nature_taxe_en')} required />
                <Input
                    value={natureEn}
                    type='text'
                    setValue={(value) => { setNatureEn(value); setErrorNatureEn(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorNatureEn} />

                <Label text={t('label.taux')} required/>
                <Input
                    value={taux.toString()}
                    type='number'
                    setValue={(value) => { setTaux(parseFloat(value)); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorTaux} />

            </CustomDialogModal>

        </>
    );
}

export default FormCreateUpdate;

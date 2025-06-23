import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Label } from '../../../ui/Label';
import Input from '../../../ui/input';
import createToast from '../../../../hooks/toastify';
import { createTacheGenerique, updateTacheGenerique } from '../../../../services/settings/tacheGeneriqueAPI';
import { createTacheGeneriqueSlice, updateTacheGeneriqueSlice } from '../../../../_redux/features/parametres/tacheGeneriqueSlice';
import { METHODES_VALIDATIONS } from '../../../../config';


function FormCreateUpdate({ tacheGenerique }: { tacheGenerique: TacheGenerique | null }) {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");
    const [methodeValidation, setMethodeValidation] = useState<MethodeValidation>();
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const methodesValidations = Object.values(METHODES_VALIDATIONS)

    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");
    const [errorMethodeValidation, setErrorMethodeValidation] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (tacheGenerique) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.tache_formation'));
            
            setNomFr(tacheGenerique.nomFr);
            setNomEn(tacheGenerique.nomEn);
            setDescriptionFr(tacheGenerique?.descriptionFr || "");
            setDescriptionEn(tacheGenerique?.descriptionEn || "");
            const methodeValidation = methodesValidations.find(methode=>methode.key === tacheGenerique.methodeValidation);
            setMethodeValidation(methodeValidation)

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.tache_formation'));
            setNomFr("");
            setNomEn("");
            setDescriptionFr("");
            setDescriptionEn("");
            setMethodeValidation(undefined)
        }


        if (isFirstRender) {
            setErrorNomEn("");
            setErrorNomFr("");
            setErrorMethodeValidation("")
            setIsFirstRender(false);
        }
    }, [tacheGenerique, isFirstRender, t]);

    const closeModal = () => {
        setErrorNomFr("");
        setErrorMethodeValidation("")
        setErrorNomEn("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleMethodeValidationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedMethodeValidationNom = e.target.value;
        var selected=null;

        if (lang === 'fr') {
            selected = methodesValidations.find(methodeValidation => methodeValidation.nomFr === selectedMethodeValidationNom);
        }
        else {
            selected = methodesValidations.find(methodeValidation => methodeValidation.nomEn === selectedMethodeValidationNom);
        }
        
        if(selected){
            setMethodeValidation(selected)
            setErrorMethodeValidation("")
        }
    }


    const handleCreateUpdate = async () => {
        if(!nomFr || !nomEn || !methodeValidation){
            if (!nomFr) {
                setErrorNomFr(t('error.nom_fr'));
            }
            if (!nomEn) {
                setErrorNomEn(t('error.nom_en'));
            }

            if (!methodeValidation) {
                setErrorMethodeValidation(t('error.methode_validation'));
            }
            return;
        }
        // create
        if (!tacheGenerique) {
            
            await createTacheGenerique(
                {
                    nomFr,
                    nomEn,
                    descriptionFr,
                    descriptionEn,
                    methodeValidation:methodeValidation.key
                },
                lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createTacheGeneriqueSlice({
                        tacheGenerique:{
                            _id:e.data._id,
                            nomFr:e.data.nomFr,
                            nomEn:e.data.nomEn,
                            descriptionFr:e.data.descriptionFr,
                            descriptionEn:e.data.descriptionEn,
                            methodeValidation:e.data.methodeValidation
                        }
                    }));

                    closeModal();

                } else {
                    createToast(e.message, '', 2);

                }
            }).catch((e) => {
                createToast(e.response.data.message, '', 2);
            })
                

            
        }else {

        
            await updateTacheGenerique(
                {
                    _id: tacheGenerique._id,
                    nomFr,
                    nomEn,
                    descriptionFr:descriptionFr,
                    descriptionEn:descriptionEn,
                    methodeValidation:methodeValidation.key
                },
                lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(updateTacheGeneriqueSlice({
                        id: e.data._id,
                        tacheGeneriqueData : {
                            _id: e.data._id,
                            nomFr: e.data.nomFr,
                            nomEn: e.data.nomEn,
                            descriptionFr:e.data.descriptionFr,
                            descriptionEn:e.data.descriptionEn,
                            methodeValidation:e.data.methodeValidation
                            
                        }
                    }));

                    closeModal();

                } else {
                    createToast(e.message, '', 2);
                }
            }).catch((e) => {
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

                <Label text={t('label.methode_validation')} required/>
                <select
                    value={methodeValidation? (lang === 'fr' ? methodeValidation.nomFr : methodeValidation.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.methode_validation')}
                    onChange={handleMethodeValidationChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.methode_validation')}</option>
                    {methodesValidations.map(methodeValidation => (
                        <option key={methodeValidation.key} value={(lang === 'fr' ? methodeValidation.nomFr : methodeValidation.nomEn)}>{(lang === 'fr' ? methodeValidation.nomFr : methodeValidation.nomEn)}</option>
                    ))}
                </select>
                {errorMethodeValidation && <p className="text-red-500">{errorMethodeValidation}</p>}
            </CustomDialogModal>

        </>
    );
}

export default FormCreateUpdate;

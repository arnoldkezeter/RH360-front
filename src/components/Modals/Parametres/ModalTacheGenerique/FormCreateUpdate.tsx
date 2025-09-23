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
    const [type, setType] = useState<MethodeValidation>();
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const methodesValidations = Object.values(METHODES_VALIDATIONS)

    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");
    const [errorType, setErrorType] = useState("");

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
            const type = methodesValidations.find(methode=>methode.key === tacheGenerique.type);
            setType(type)

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.tache_formation'));
            setNomFr("");
            setNomEn("");
            setDescriptionFr("");
            setDescriptionEn("");
            setType(undefined)
        }


        if (isFirstRender) {
            setErrorNomEn("");
            setErrorNomFr("");
            setErrorType("")
            setIsFirstRender(false);
        }
    }, [tacheGenerique, isFirstRender, t]);

    const closeModal = () => {
        setErrorNomFr("");
        setErrorType("")
        setErrorNomEn("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTypeNom = e.target.value;
        var selected=null;

        if (lang === 'fr') {
            selected = methodesValidations.find(type => type.nomFr === selectedTypeNom);
        }
        else {
            selected = methodesValidations.find(type => type.nomEn === selectedTypeNom);
        }
        
        if(selected){
            setType(selected)
            setErrorType("")
        }
    }


    const handleCreateUpdate = async () => {
        if(!nomFr || !nomEn || !type){
            if (!nomFr) {
                setErrorNomFr(t('error.nom_fr'));
            }
            if (!nomEn) {
                setErrorNomEn(t('error.nom_en'));
            }

            if (!type) {
                setErrorType(t('error.methode_validation'));
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
                    type:type.key
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
                            type:e.data.type
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
                    type:type.key
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
                            type:e.data.type
                            
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
                    value={type? (lang === 'fr' ? type.nomFr : type.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.methode_validation')}
                    onChange={handleTypeChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.methode_validation')}</option>
                    {methodesValidations.map(type => (
                        <option key={type.key} value={(lang === 'fr' ? type.nomFr : type.nomEn)}>{(lang === 'fr' ? type.nomFr : type.nomEn)}</option>
                    ))}
                </select>
                {errorType && <p className="text-red-500">{errorType}</p>}
            </CustomDialogModal>

        </>
    );
}

export default FormCreateUpdate;

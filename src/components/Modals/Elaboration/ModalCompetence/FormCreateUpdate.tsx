import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Label } from '../../../ui/Label';
import Input from '../../../ui/input';
import createToast from '../../../../hooks/toastify';
import { createCompetenceSlice, updateCompetenceSlice } from '../../../../_redux/features/competenceSlice';
import { createCompetence, updateCompetence } from '../../../../services/competenceAPI';


function ModalCreateUpdate({ competence, onCompetenceUpdated }: { competence: Competence | null, onCompetenceUpdated: () => void; }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [code, setCode] = useState("");
    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [familleMetier, setFamilleMetier] = useState<FamilleMetier>();

    const [errorCode, setErrorCode] = useState("");
    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");
    const [errorFamilleMetier, setErrorFamilleMetier] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    const { data: { familleMetiers } } = useSelector((state: RootState) => state.familleMetierSlice) ?? [];
    useEffect(() => {
        if (competence) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.competence'));
            
            setCode(competence.code);
            setNomFr(competence.nomFr);
            setNomEn(competence.nomEn);
            setDescriptionFr(competence?.descriptionFr || "");
            setDescriptionEn(competence?.descriptionEn || "");
            setFamilleMetier(competence.familleMetier);
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.competence'));
            setCode("");
            setNomFr("");
            setNomEn("");
            setDescriptionFr("");
            setDescriptionEn("");
            setFamilleMetier(undefined);
        }
        if (isFirstRender) {
            setErrorCode("");
            setErrorNomEn("");
            setErrorNomFr("");
            setErrorFamilleMetier("");
            setIsFirstRender(false);
        }
    }, [competence, isFirstRender, t]);

    const closeModal = () => {
        setErrorCode("")
        setErrorNomFr("");
        setErrorNomEn("");
        setErrorFamilleMetier("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleFamilleMetierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFamilleMetierNom = e.target.value;
        var selectedFamilleMetier = null;
        if (lang === 'fr') {
            selectedFamilleMetier = familleMetiers.find(familleMetier => familleMetier.nomFr === selectedFamilleMetierNom);
        }else {
            selectedFamilleMetier = familleMetiers.find(familleMetier => familleMetier.nomEn === selectedFamilleMetierNom);
        }
        if (selectedFamilleMetier) {
            setFamilleMetier(selectedFamilleMetier);
            setErrorFamilleMetier("");
        }
    };




    const handleCreateUpdate = async () => {
        if (!nomFr || !nomEn || !familleMetier) {
            if (!nomFr) {
                setErrorNomFr(t('error.nom_fr'));
            }
            if (!nomEn) {
                setErrorNomEn(t('error.nom_en'));
            }
            if (!familleMetier) {
                setErrorFamilleMetier(t('error.famille_metier'));
            }
            return;
        } 
        // create
        if (!competence) {
            if (familleMetier._id) {
                await createCompetence(
                    {
                        code,
                        nomFr,
                        nomEn,
                        descriptionFr,
                        descriptionEn,
                        familleMetier,
                    },lang
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(createCompetenceSlice({
                            competence:{
                                code:e.data.code,
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                descriptionFr:e.data.descriptionFr,
                                descriptionEn:e.data.descriptionEn,
                                familleMetier: familleMetier,
                                _id: e.data._id,
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
        }else {
            if (familleMetier._id) {
                await updateCompetence(
                    {
                        code,
                        nomFr,
                        nomEn,
                        descriptionFr,
                        descriptionEn,
                        familleMetier,
                        _id: competence._id,
                    }, lang
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateCompetenceSlice({
                            id:e.data._id,
                            competenceData:{
                                code:e.data.code,
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                descriptionFr:e.data.descriptionFr,
                                descriptionEn:e.data.descriptionEn,
                                familleMetier: familleMetier,
                                _id: e.data._id,
                            }
                        }));
                        
                        closeModal();
                        onCompetenceUpdated(); // Appeler pour rafraîchir la liste
                    } else {
                        createToast(e.message, '', 2);
                    }
                }).catch((e) => {
                    createToast(e.response.data.message, '', 2);
                })
            }
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
                <Label text={t('label.code')} required />
                <Input
                    value={code}
                    type='text'
                    setValue={(value) => { setCode(value); setErrorCode(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorCode} />

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

                <Label text={t('label.description')} />
                <Input
                    value={descriptionFr}
                    type='text'
                    setValue={(value) => { setDescriptionFr(value) }}
                    hasBackground={true}
                />

                <Label text={t('label.description')} />
                <Input
                    value={descriptionEn}
                    type='text'
                    setValue={(value) => { setDescriptionEn(value)}}
                    hasBackground={true}
                />

                <Label text={t('label.famille_metier')} required />
                <select
                    value={familleMetier ? (lang === 'fr' ? familleMetier.nomFr : familleMetier.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.famille_metier')}
                    onChange={handleFamilleMetierChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.famille_metier')}</option>
                    {familleMetiers.map(familleMetier => (
                        <option key={familleMetier._id} value={lang === 'fr' ? familleMetier.nomFr : familleMetier.nomEn}>{lang === 'fr' ? familleMetier.nomFr : familleMetier.nomEn}</option>
                    ))}
                </select>
                <ErrorMessage message={errorFamilleMetier} />
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;

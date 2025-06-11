import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Label } from '../../ui/Label';
import Input from '../../ui/input';
import createToast from '../../../hooks/toastify';
import { createCategorieProfessionnelle, updateCategorieProfessionnelle } from '../../../services/settings/categorieProfessionnelleAPI';
import { createCategorieProfessionnelleSlice, updateCategorieProfessionnelleSlice } from '../../../_redux/features/settings/categorieProfessionnelleSlice';


function ModalCreateUpdate({ categorieProfessionnelle, onDepartmentUpdated }: { categorieProfessionnelle: CategorieProfessionnelle | null, onDepartmentUpdated: () => void; }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [code, setCode] = useState("");
    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [grade, setGrade] = useState<Grade>();

    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");
    const [errorGrade, setErrorGrade] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    const { data: { grades } } = useSelector((state: RootState) => state.gradeSlice) ?? [];
    useEffect(() => {
        if (categorieProfessionnelle) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.categorie_professionnelle'));
            
            setNomFr(categorieProfessionnelle.nomFr);
            setNomEn(categorieProfessionnelle.nomEn);
            setDescriptionFr(categorieProfessionnelle?.descriptionFr || "");
            setDescriptionEn(categorieProfessionnelle?.descriptionEn || "");
            setGrade(categorieProfessionnelle.grade);
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.categorie_professionnelle'));
            setCode("");
            setNomFr("");
            setNomEn("");
            setDescriptionFr("");
            setDescriptionEn("");
            setGrade(undefined);
        }
        if (isFirstRender) {
            setErrorNomEn("");
            setErrorNomFr("");
            setErrorGrade("");
            setIsFirstRender(false);
        }
    }, [categorieProfessionnelle, isFirstRender, t]);

    const closeModal = () => {
        setErrorNomFr("");
        setErrorNomEn("");
        setErrorGrade("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGradeNom = e.target.value;
        var selectedGrade = null;
        if (lang === 'fr') {
            selectedGrade = grades.find(grade => grade.nomFr === selectedGradeNom);
        }else {
            selectedGrade = grades.find(grade => grade.nomEn === selectedGradeNom);
        }
        if (selectedGrade) {
            setGrade(selectedGrade);
            setErrorGrade("");
        }
    };




    const handleCreateUpdate = async () => {
        if (!nomFr || !nomEn || !grade) {
            if (!nomFr) {
                setErrorNomFr(t('error.nom_fr'));
            }
            if (!nomEn) {
                setErrorNomEn(t('error.nom_en'));
            }
            if (!grade) {
                setErrorGrade(t('error.grade'));
            }
            return;
        } 
        // create
        if (!categorieProfessionnelle) {
            if (grade._id) {
                await createCategorieProfessionnelle(
                    {
                        nomFr,
                        nomEn,
                        descriptionFr,
                        descriptionEn,
                        grade,
                    },lang
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(createCategorieProfessionnelleSlice({
                            categorieProfessionnelle:{
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                descriptionFr:e.data.descriptionFr,
                                descriptionEn:e.data.descriptionEn,
                                grade: grade,
                                _id: e.data._id,
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
        }else {
            if (grade._id) {
                await updateCategorieProfessionnelle(
                    {
                        
                        nomFr,
                        nomEn,
                        descriptionFr,
                        descriptionEn,
                        grade,
                        _id: categorieProfessionnelle._id,
                    }, lang
                ).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateCategorieProfessionnelleSlice({
                            id:e.data._id,
                            categorieProfessionnelleData:{
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                descriptionFr:e.data.descriptionFr,
                                descriptionEn:e.data.descriptionEn,
                                grade: grade,
                                _id: e.data._id,
                            }
                        }));
                        
                        closeModal();
                        onDepartmentUpdated(); // Appeler pour rafraîchir la liste
                    } else {
                        createToast(e.message, '', 2);
                    }
                }).catch((e) => {
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
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

                <Label text={t('label.grade')} required />
                <select
                    value={grade ? (lang === 'fr' ? grade.nomFr : grade.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.grade')}
                    onChange={handleGradeChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.grade')}</option>
                    {grades.map(grade => (
                        <option key={grade._id} value={lang === 'fr' ? grade.nomFr : grade.nomEn}>{lang === 'fr' ? grade.nomFr : grade.nomEn}</option>
                    ))}
                </select>
                <ErrorMessage message={errorGrade} />
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;

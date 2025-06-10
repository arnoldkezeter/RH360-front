import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Label } from '../../ui/Label';
import Input from '../../ui/input';
import { apiCreateCategorie, apiUpdateCategorie } from '../../../api/settings/api_categorie';
import { createSettingItem, updateSettingItem } from '../../../_redux/features/data_setting_slice';
import createToast from '../../../hooks/toastify';


function ModalCreateUpdate({ categorie }: { categorie: CategorieProps | null }) {
    const grades = useSelector((state: RootState) => state.dataSetting.dataSetting.grades) ?? [];

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [code, setCode] = useState("");
    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");
    const [grade, setGrade] = useState<CommonSettingProps>();

    const [errorCode, setErrorCode] = useState("");
    const [errorLibelleFr, setErrorLibelleFr] = useState("");
    const [errorLibelleEn, setErrorLibelleEn] = useState("");
    const [errorGrade, setErrorGrade] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (categorie) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.categorie'));
            const gradeId =""+categorie.grade;
            const currentGrade = grades.find(grade => grade._id === gradeId);
            
            setCode(categorie.code);
            setLibelleFr(categorie.libelleFr);
            setLibelleEn(categorie.libelleEn);
            setGrade(currentGrade);

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.categorie'));
            setCode("");
            setLibelleFr("");
            setLibelleEn("");
            setGrade(undefined);
        }


        if (isFirstRender) {
            setErrorCode("");
            setErrorLibelleEn("");
            setErrorLibelleFr("");
            setErrorGrade("");
            setIsFirstRender(false);
        }
    }, [categorie, isFirstRender, t]);

    const closeModal = () => {
        setErrorCode("");
        setErrorLibelleFr("");
        setErrorLibelleEn("");
        setErrorGrade("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGradeLibelle = e.target.value;
        var selectedGrade = null;

        if (lang === 'fr') {
            selectedGrade = grades.find(grade => grade.libelleFr === selectedGradeLibelle);

        }
        else {
            selectedGrade = grades.find(grade => grade.libelleEn === selectedGradeLibelle);

        }


        if (selectedGrade) {
            setGrade(selectedGrade);
            setErrorGrade("");
        }
    };




    const handleCreateUpdate = async () => {
        // create
        if (!categorie) {
            if (!libelleFr || !libelleEn || !grade) {
                // if (!code) {
                //     setErrorCode(t('error.code'));
                // }
                if (!libelleFr) {
                    setErrorLibelleFr(t('error.libelle'));
                }
                if (!libelleEn) {
                    setErrorLibelleEn(t('error.libelle'));
                }
                if (!grade) {
                    setErrorGrade(t('error.grade'));
                }

            } else {
                // creation

                if (grade._id) {
                    await apiCreateCategorie(
                        {
                            code,
                            libelleFr,
                            libelleEn,
                            grade: grade._id,
                        }
                    ).then((e: ReponseApiPros) => {
                        if (e.success) {
                            createToast(e.message[lang as keyof typeof e.message], '', 0);
                            dispatch(createSettingItem({
                                tableName: 'categories', newItem: {
                                    code: e.data.code,
                                    libelleFr: e.data.libelleFr,
                                    libelleEn: e.data.libelleEn,
                                    date_creation: e.data.date_creation,
                                    grade: e.data.grade,
                                    _id: e.data._id,
                                }
                            }));

                            closeModal();

                        } else {
                            createToast(e.message[lang as keyof typeof e.message], '', 2);

                        }
                    }).catch((e) => {
                        console.log(e);
                        createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                    })
                }

            }
        }

        //update
        else {

            if (!libelleFr || !libelleEn || !grade) {
                // if (!code) {
                //     setErrorCode(t('error.code'));
                // }
                if (!libelleFr) {
                    setErrorLibelleFr(t('error.libelle'));
                }
                if (!libelleEn) {
                    setErrorLibelleEn(t('error.libelle'));
                }
                if (!grade) {
                    setErrorGrade(t('error.grade'));
                }
            } else {


                //
                //  mise a jour
                if (grade._id) {
                    await apiUpdateCategorie(
                        {
                            code,
                            libelleFr,
                            libelleEn,
                            grade: grade._id,
                            _id: categorie._id,
                        }
                    ).then((e: ReponseApiPros) => {
                        if (e.success) {
                            createToast(e.message[lang as keyof typeof e.message], '', 0);
                            dispatch(updateSettingItem({
                                tableName: 'categories',
                                updatedItem: {
                                    code: e.data.code,
                                    libelleFr: e.data.libelleFr,
                                    libelleEn: e.data.libelleEn,
                                    date_creation: e.data.date_creation,
                                    grade: e.data.grade,
                                    _id: e.data._id,
                                }
                            }));

                            closeModal();


                        } else {
                            createToast(e.message[lang as keyof typeof e.message], '', 2);

                        }
                    }).catch((e) => {
                        createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                    })
                }
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

                {/* input 1 */}
                <Label text={t('label.code')} />
                <Input
                    value={code}
                    type='text'
                    setValue={(value) => { setCode(value); setErrorCode("") }}
                    hasBackground={true}
                />
                {/* <ErrorMessage message={errorCode} /> */}


                {/* input 2 */}
                <Label text={t('label.libelle_fr')} required />
                <Input
                    value={libelleFr}
                    type='text'
                    setValue={(value) => { setLibelleFr(value); setErrorLibelleFr(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorLibelleFr} />

                {/* input 3 */}
                <Label text={t('label.libelle_en')} required />
                <Input
                    value={libelleEn}
                    type='text'
                    setValue={(value) => { setLibelleEn(value); setErrorLibelleEn(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorLibelleEn} />

                {/* input 4 */}

                <Label text={t('label.grade')} required />


                <select
                    value={grade ? (lang === 'fr' ? grade.libelleFr : grade.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.grade')}
                    onChange={handleGradeChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.grade')}</option>
                    {grades.map(grade => (
                        <option key={grade._id} value={lang === 'fr' ? grade.libelleFr : grade.libelleEn}>{lang === 'fr' ? grade.libelleFr : grade.libelleEn}</option>
                    ))}
                </select>
                <ErrorMessage message={errorGrade} />
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;

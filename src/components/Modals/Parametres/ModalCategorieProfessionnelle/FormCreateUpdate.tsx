import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Label } from '../../../ui/Label';
import Input from '../../../ui/input';
import createToast from '../../../../hooks/toastify';
import { createCategorieProfessionnelle, updateCategorieProfessionnelle } from '../../../../services/settings/categorieProfessionnelleAPI';
import { createCategorieProfessionnelleSlice, updateCategorieProfessionnelleSlice } from '../../../../_redux/features/parametres/categorieProfessionnelleSlice';
import { searchGrade } from '../../../../services/settings/gradeAPI';
import { SearchSelectComponent } from '../../../ui/SearchSelectComponent';


function ModalCreateUpdate({ categorieProfessionnelle, onDepartmentUpdated }: { categorieProfessionnelle: CategorieProfessionnelle | null, onDepartmentUpdated: () => void; }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [code, setCode] = useState("");
    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [selectedGrades, setSelectedGrades] = useState<Grade[]>([]);

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
            setSelectedGrades(categorieProfessionnelle.grades || [])
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.categorie_professionnelle'));
            setCode("");
            setNomFr("");
            setNomEn("");
            setDescriptionFr("");
            setDescriptionEn("");
            setSelectedGrades([]);
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

    const onSearchGrade = async (search: string) => {
        const data = await searchGrade({searchString: search, lang});
        return data?.grades || [];
    };

    const handleCreateUpdate = async () => {
        if (!nomFr || !nomEn || (!selectedGrades || selectedGrades.length===0)) {
            if (!nomFr) {
                setErrorNomFr(t('error.nom_fr'));
            }
            if (!nomEn) {
                setErrorNomEn(t('error.nom_en'));
            }
            if (!selectedGrades || selectedGrades.length===0) {
                setErrorGrade(t('error.grade'));
            }
            return;
        } 
        // create
        if (!categorieProfessionnelle) {
            setIsLoading(true)
            await createCategorieProfessionnelle(
                {
                    nomFr,
                    nomEn,
                    descriptionFr,
                    descriptionEn,
                    grades:selectedGrades,
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
                            grades:selectedGrades,
                            _id: e.data._id,
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
            await updateCategorieProfessionnelle(
                {
                    
                    nomFr,
                    nomEn,
                    descriptionFr,
                    descriptionEn,
                    grades:selectedGrades,
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
                            grades:selectedGrades,
                            _id: e.data._id,
                        }
                    }));
                    
                    closeModal();
                    onDepartmentUpdated(); // Appeler pour rafraîchir la liste
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
                <SearchSelectComponent<Grade>
                    onSearch={onSearchGrade}
                    selectedItems={selectedGrades}
                    onSelectionChange={setSelectedGrades}
                    placeholder={t('recherche.rechercher')+t('recherche.grade')}
                    displayField={lang?"nomFr":"nomEn"}
                    searchDelay={300}
                    minSearchLength={2}
                    noResultsMessage={t('label.aucun_grade')}
                    loadingMessage={t('label.recherche_grade')}
                    textDebutCaractere={t('label.tapez_car_deb')}
                    textFinCaractere={t('label.tapez_car_fin')}
                />
                <ErrorMessage message={errorGrade} />
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;

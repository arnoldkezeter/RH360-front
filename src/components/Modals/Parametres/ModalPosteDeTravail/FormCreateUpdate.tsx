import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Label } from '../../../ui/Label';
import Input from '../../../ui/input';
import createToast from '../../../../hooks/toastify';
import { createPosteDeTravail, updatePosteDeTravail } from '../../../../services/settings/posteDeTravailAPI';
import { createPosteDeTravailSlice, updatePosteDeTravailSlice } from '../../../../_redux/features/parametres/posteDeTravailSlice';
import { SearchSelectComponent } from '../../../ui/SearchSelectComponent';
import { searchFamilleMetier } from '../../../../services/elaborations/familleMetierAPI';


function ModalCreateUpdate({ posteDeTravail, onDepartmentUpdated }: { posteDeTravail: PosteDeTravail | null, onDepartmentUpdated: () => void; }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [code, setCode] = useState("");
    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [selectedFamilles, setSelectedFamilles] = useState<FamilleMetier[]>([]);

    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");
    const [errorFamilleMetier, setErrorFamilleMetier] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (posteDeTravail) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.categorie_professionnelle'));
            
            setNomFr(posteDeTravail.nomFr);
            setNomEn(posteDeTravail.nomEn);
            setDescriptionFr(posteDeTravail?.descriptionFr || "");
            setDescriptionEn(posteDeTravail?.descriptionEn || "");
            setSelectedFamilles(posteDeTravail.famillesMetier || [])
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.categorie_professionnelle'));
            setCode("");
            setNomFr("");
            setNomEn("");
            setDescriptionFr("");
            setDescriptionEn("");
            setSelectedFamilles([]);
        }
        if (isFirstRender) {
            setErrorNomEn("");
            setErrorNomFr("");
            setErrorFamilleMetier("");
            setIsFirstRender(false);
        }
    }, [posteDeTravail, isFirstRender, t]);

    const closeModal = () => {
        setErrorNomFr("");
        setErrorNomEn("");
        setErrorFamilleMetier("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };




    const onSearchFamille = async (search: string) => {
        const data = await searchFamilleMetier({searchString: search, lang});
        return data?.familleMetiers || [];
    };
    const handleCreateUpdate = async () => {
        if (!nomFr || !nomEn || (!selectedFamilles || selectedFamilles.length===0)) {
            if (!nomFr) {
                setErrorNomFr(t('error.nom_fr'));
            }
            if (!nomEn) {
                setErrorNomEn(t('error.nom_en'));
            }
            if (!selectedFamilles || selectedFamilles.length===0) {
                setErrorFamilleMetier(t('error.famille_metier'));
            }
            return;
        } 
        // create
        if (!posteDeTravail) {
            await createPosteDeTravail(
                {
                    nomFr,
                    nomEn,
                    descriptionFr,
                    descriptionEn,
                    famillesMetier:selectedFamilles,
                },lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createPosteDeTravailSlice({
                        posteDeTravail:{
                            nomFr: e.data.nomFr,
                            nomEn: e.data.nomEn,
                            descriptionFr:e.data.descriptionFr,
                            descriptionEn:e.data.descriptionEn,
                            famillesMetier:selectedFamilles,
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
        }else {
            await updatePosteDeTravail(
                {
                    
                    nomFr,
                    nomEn,
                    descriptionFr,
                    descriptionEn,
                    famillesMetier:selectedFamilles,
                    _id: posteDeTravail._id,
                }, lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(updatePosteDeTravailSlice({
                        id:e.data._id,
                        posteDeTravailData:{
                            nomFr: e.data.nomFr,
                            nomEn: e.data.nomEn,
                            descriptionFr:e.data.descriptionFr,
                            descriptionEn:e.data.descriptionEn,
                            famillesMetier:selectedFamilles,
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
                <SearchSelectComponent<FamilleMetier>
                    onSearch={onSearchFamille}
                    selectedItems={selectedFamilles}
                    onSelectionChange={setSelectedFamilles}
                    placeholder={t('recherche.rechercher')+t('recherche.famille_metier')}
                    displayField={lang?"nomFr":"nomEn"}
                    searchDelay={300}
                    minSearchLength={2}
                    noResultsMessage={t('label.aucune_famille_metier')}
                    loadingMessage={t('label.recherche_famille_metier')}
                    textDebutCaractere={t('label.tapez_car_deb')}
                    textFinCaractere={t('label.tapez_car_fin')}
                />
                <ErrorMessage message={errorFamilleMetier} />
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;

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
import { searchService } from '../../../../services/settings/serviceAPI';


function ModalCreateUpdate({ posteDeTravail, onDepartmentUpdated }: { posteDeTravail: PosteDeTravail | null, onDepartmentUpdated: () => void; }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [code, setCode] = useState("");
    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [selectedFamilles, setSelectedFamilles] = useState<FamilleMetier[]>([]);
    const [selectedServices, setSelectedServices] = useState<Service[]>([]);
    

    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");
    const [errorFamilleMetier, setErrorFamilleMetier] = useState("");
    const [errorService, setErrorService] = useState("");

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
            setSelectedServices(posteDeTravail.services || [])
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.categorie_professionnelle'));
            setCode("");
            setNomFr("");
            setNomEn("");
            setDescriptionFr("");
            setDescriptionEn("");
            setSelectedFamilles([]);
            setSelectedServices([]);
        }
        if (isFirstRender) {
            setErrorNomEn("");
            setErrorNomFr("");
            setErrorFamilleMetier("");
            setErrorService("")
            setIsFirstRender(false);
        }
    }, [posteDeTravail, isFirstRender, t]);

    const closeModal = () => {
        setErrorNomFr("");
        setErrorNomEn("");
        setErrorFamilleMetier("");
        setErrorService("")
        setIsFirstRender(true);
        dispatch(setShowModal());
    };




    const onSearchFamille = async (search: string) => {
        const data = await searchFamilleMetier({searchString: search, lang});
        return data?.familleMetiers || [];
    };
    const onSearchService = async (search: string) => {
        const data = await searchService({searchString: search, lang});
        return data?.services || [];
    };
    const handleCreateUpdate = async () => {
        if (!nomFr || !nomEn || (!selectedFamilles || selectedFamilles.length===0) || (!selectedServices || selectedServices.length===0)) {
            if (!nomFr) {
                setErrorNomFr(t('error.nom_fr'));
            }
            if (!nomEn) {
                setErrorNomEn(t('error.nom_en'));
            }
            if (!selectedFamilles || selectedFamilles.length===0) {
                setErrorFamilleMetier(t('error.famille_metier'));
            }

            if (!selectedServices || selectedServices.length===0) {
                setErrorService(t('error.service'));
            }
            return;
        } 
        // create
        if (!posteDeTravail) {
            setIsLoading(true)
            await createPosteDeTravail(
                {
                    nomFr,
                    nomEn,
                    descriptionFr,
                    descriptionEn,
                    famillesMetier:selectedFamilles,
                    services:selectedServices
                },lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createPosteDeTravailSlice({
                        posteDeTravail:{
                            ...e.data,
                            services:selectedServices,
                            famillesMetier:selectedFamilles
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
            await updatePosteDeTravail(
                {
                    
                    nomFr,
                    nomEn,
                    descriptionFr,
                    descriptionEn,
                    famillesMetier:selectedFamilles,
                    _id: posteDeTravail._id,
                    services:selectedServices
                }, lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(updatePosteDeTravailSlice({
                        id:e.data._id,
                        posteDeTravailData:{
                            ...e.data,
                            services:selectedServices,
                            famillesMetier:selectedFamilles
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
                 <Label text={t('label.services')} required />
                <SearchSelectComponent<Service>
                    onSearch={onSearchService}
                    selectedItems={selectedServices}
                    onSelectionChange={setSelectedServices}
                    placeholder={t('recherche.rechercher')+t('recherche.service')}
                    displayField={lang?"nomFr":"nomEn"}
                    searchDelay={300}
                    minSearchLength={2}
                    noResultsMessage={t('label.aucun_service')}
                    loadingMessage={t('label.recherche_service')}
                    textDebutCaractere={t('label.tapez_car_deb')}
                    textFinCaractere={t('label.tapez_car_fin')}
                />
                <ErrorMessage message={errorFamilleMetier} />
            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;

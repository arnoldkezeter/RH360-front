import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessage, Label } from '../../../ui/Label';
import Input from '../../../ui/input';
import createToast from '../../../../hooks/toastify';
import { createBesoinFormationPredefini, updateBesoinFormationPredefini } from '../../../../services/settings/besoinFormationPredefiniAPI';
import { createBesoinFormationPredefiniSlice, updateBesoinFormationPredefiniSlice } from '../../../../_redux/features/parametres/besoinFormationPredefini';
import { SearchSelectComponent } from '../../../ui/SearchSelectComponent';
import { searchPosteDeTravail } from '../../../../services/settings/posteDeTravailAPI';


function FormCreateUpdate({ besoinFormationPredefini }: { besoinFormationPredefini: BesoinFormationPredefini | null }) {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [titreFr, setTitreFr] = useState("");
    const [titreEn, setTitreEn] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [selectedPostesDeTravail, setSelectedPostesDeTravail] = useState<PosteDeTravail[]>([]);
    

    const [errorTitreFr, setErrorTitreFr] = useState("");
    const [errorTitreEn, setErrorTitreEn] = useState("");
    const [errorPoste, setErrorPoste]=useState("")

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (besoinFormationPredefini) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.besoin_formation_predefini'));
            
            setTitreFr(besoinFormationPredefini.titreFr);
            setTitreEn(besoinFormationPredefini.titreEn);
            setDescriptionFr(besoinFormationPredefini?.descriptionFr || "");
            setDescriptionEn(besoinFormationPredefini?.descriptionEn || "");
            setSelectedPostesDeTravail(besoinFormationPredefini?.postesDeTravail || [])

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.besoin_formation_predefini'));
            setTitreFr("");
            setTitreEn("");
            setDescriptionFr("");
            setDescriptionEn("");
            setSelectedPostesDeTravail([]);
        }


        if (isFirstRender) {
            setErrorTitreEn("");
            setErrorTitreFr("");
            setErrorPoste("");
            setIsFirstRender(false);
        }
    }, [besoinFormationPredefini, isFirstRender, t]);

    const closeModal = () => {
        setErrorTitreFr("");
        setErrorTitreEn("");
        setErrorPoste("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const onSearchPoste = async (search: string) => {
        const data = await searchPosteDeTravail({searchString: search, lang});
        return data?.posteDeTravails || [];
    };
    const handleCreateUpdate = async () => {
        if(!titreFr || !titreEn || (!selectedPostesDeTravail || selectedPostesDeTravail.length===0)){
            if (!titreFr) {
                setErrorTitreFr(t('error.titre_fr'));
            }
            if (!titreEn) {
                setErrorTitreEn(t('error.titre_en'));
            }

            if(!selectedPostesDeTravail || selectedPostesDeTravail.length === 0){
                setErrorPoste(t('error.poste_de_travail'))
            }
            return;
        }
        // create
        if (!besoinFormationPredefini) {
            setIsLoading(true)
            await createBesoinFormationPredefini(
                {
                    titreFr,
                    titreEn,
                    descriptionFr,
                    descriptionEn,
                    postesDeTravail:selectedPostesDeTravail
                },
                lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createBesoinFormationPredefiniSlice({
                        besoinFormationPredefini:{
                            _id:e.data._id,
                            titreFr:e.data.titreFr,
                            titreEn:e.data.titreEn,
                            descriptionFr:e.data.descriptionFr,
                            descriptionEn:e.data.descriptionEn,
                            postesDeTravail:selectedPostesDeTravail,
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

        
            await updateBesoinFormationPredefini(
                {
                    _id: besoinFormationPredefini._id,
                    titreFr,
                    titreEn,
                    descriptionFr:descriptionFr,
                    descriptionEn:descriptionEn,
                    postesDeTravail:selectedPostesDeTravail
                },
                lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(updateBesoinFormationPredefiniSlice({
                        id: e.data._id,
                        besoinFormationPredefiniData : {
                            _id: e.data._id,
                            titreFr: e.data.titreFr,
                            titreEn: e.data.titreEn,
                            descriptionFr:e.data.descriptionFr,
                            descriptionEn:e.data.descriptionEn,
                            postesDeTravail:selectedPostesDeTravail
                            
                        }
                    }));

                    closeModal();

                } else {
                    createToast(e.message, '', 2);
                }
            }).catch((e) => {
                console.log(e)
                // createToast(e.response.data.message, '', 2);
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

                <Label text={t('label.titre_fr')} required />
                <Input
                    value={titreFr}
                    type='text'
                    setValue={(value) => { setTitreFr(value); setErrorTitreFr(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorTitreFr} />

                <Label text={t('label.titre_en')} required />
                <Input
                    value={titreEn}
                    type='text'
                    setValue={(value) => { setTitreEn(value); setErrorTitreEn(""); }}
                    hasBackground={true}
                />
                <ErrorMessage message={errorTitreEn} />

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

                <Label text={t('label.postes_de_travail')} required />
                <SearchSelectComponent<PosteDeTravail>
                    onSearch={onSearchPoste}
                    selectedItems={selectedPostesDeTravail}
                    onSelectionChange={setSelectedPostesDeTravail}
                    placeholder={t('recherche.rechercher')+t('recherche.poste_de_travail')}
                    displayField={lang?"nomFr":"nomEn"}
                    searchDelay={300}
                    minSearchLength={2}
                    noResultsMessage={t('label.aucun_poste')}
                    loadingMessage={t('label.recherche_poste')}
                    textDebutCaractere={t('label.tapez_car_deb')}
                    textFinCaractere={t('label.tapez_car_fin')}
                />
            </CustomDialogModal>

        </>
    );
}

export default FormCreateUpdate;

import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../../_redux/features/setting';
import { RootState } from '../../../../../_redux/store';
import CustomDialogModal from '../../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../../hooks/toastify';
import { createFormateur, updateFormateur } from '../../../../../services/elaborations/formateurAPI';
import { createFormateurSlice, updateFormateurSlice } from '../../../../../_redux/features/elaborations/formateurSlice';
import { searchUtilisateur } from '../../../../../services/utilisateurs/utilisateurAPI';
import FilterList from '../../../../ui/AutoComplete';


function FormCreateUpdate({ formateur, themeId }: { formateur: Formateur | null, themeId:string }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const [origineInterne, setOrigineInterne] = useState<boolean>();
    const [selectedFormateur, setSelectedFormateur] = useState<Utilisateur>();
    
    

    const [errorOrigine, setErrorOrigine] = useState("");
    const [errorFormateur, setErrorFormateur] = useState("");
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        
        if (formateur) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.formateur'));
            
            setOrigineInterne(formateur.interne)
            setSelectedFormateur(formateur.utilisateur);
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.formateur'));
            
           setOrigineInterne(undefined)
           setSelectedFormateur(undefined)
            
        }


        if (isFirstRender) {
            setErrorOrigine("");
            setErrorFormateur("")
           
            
            setIsFirstRender(false);
        }
    }, [formateur, isFirstRender, t]);

    const closeModal = () => {
        setErrorOrigine("");
        setErrorFormateur("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };



     const handleFormateurSelect = (selected: Utilisateur | string) => {
        if (typeof selected === "string") return
        if(selected){
            setSelectedFormateur(selected)
        }
        
    };
    
    
    const onSearchFormateur = async (search: string) => {
        const data = await searchUtilisateur({searchString: search, lang});
        setErrorFormateur("")
        return data?.utilisateurs || [];
    };

   


    const handleCreateFormateur = async () => {
        if (!selectedFormateur || origineInterne === undefined) {
            if (!selectedFormateur) {
                setErrorFormateur(t('error.formateur'));
            }

            if(origineInterne === undefined){
                setErrorOrigine(t("error.origine_expertise"))
            }

            return;
        }

        if (!formateur) {
            
            await createFormateur(
                {
                    utilisateur:selectedFormateur,
                    interne:origineInterne
                }, themeId,lang
            ).then((e: ReponseApiPros) => {
                
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createFormateurSlice({

                        formateur: {
                            _id: e.data._id,
                            utilisateur: e.data.utilisateur,
                            interne: e.data.interne,
                        }

                    }));

                    closeModal();

                } else {
                    createToast(e.message, '', 2);

                }
            }).catch((e) => {
                console.log(e);
                createToast(e.response.data.message, '', 2);
            })

        } else {
            console.log(selectedFormateur)
            await updateFormateur(
                {
                    _id: formateur._id,
                    utilisateur:selectedFormateur,
                    interne:origineInterne
                }, themeId,lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateFormateurSlice({
                            id: e.data._id,
                            formateurData: {
                                _id: e.data._id,
                                utilisateur: e.data.utilisateur,
                                interne: e.data.interne,
                            }

                        }));

                        closeModal();

                    } else {
                        createToast(e.message, '', 2);

                    }
                }).catch((e) => {
                    console.log(e);
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
                handleConfirm={handleCreateFormateur}
            >
                
                <label>{t('label.formateur')}</label><label className="text-red-500"> *</label>
                <FilterList
                    items={[]}
                    placeholder={t('recherche.rechercher')+t('recherche.formateur')}
                    displayProperty={(item) => `${item.nom} ${item?.prenom || ""}`}
                    onSelect={handleFormateurSelect}
                    enableBackendSearch={true}
                    onSearch={onSearchFormateur}
                    searchDelay={300}
                    minSearchLength={2}
                    defaultValue={selectedFormateur}
                    noResultsMessage={t('label.aucun_formateur')}
                    loadingMessage={t('label.recherche_formateur')}
                />
                {errorFormateur && <p className="text-red-500" >{errorFormateur}</p>}
                <label>{t('label.origine_expertise')}</label><label className="text-red-500"> *</label>
                <div>
                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.interne')}
                        name="OrigineExpertise"
                        value={t('label.interne')}
                        checked={origineInterne}
                        onChange={() => { setOrigineInterne(true); setErrorOrigine("") }}
                    />
                    <label htmlFor={t('label.interne')} className='radio-intern-space'>{t('label.interne')}</label>

                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.externe')}
                        name="OrigineExpertise"
                        value={t('label.externe')}
                        checked={origineInterne === false}
                        onChange={() => { setOrigineInterne(false); setErrorOrigine("") }}
                    />
                    <label htmlFor={t('label.externe')}>{t('label.externe')}</label>
                    {errorOrigine && <p className="text-red-500" >{errorOrigine}</p>}
                </div>
            </CustomDialogModal>

        </>
    );
}



export default FormCreateUpdate;

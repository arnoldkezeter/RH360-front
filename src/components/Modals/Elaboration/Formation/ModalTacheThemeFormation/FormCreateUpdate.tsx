import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../../_redux/features/setting';
import { RootState } from '../../../../../_redux/store';
import CustomDialogModal from '../../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../../hooks/toastify';
import { formatDateForInput } from '../../../../../fonctions/fonction';
import FilterList from '../../../../ui/AutoComplete';
import { createTacheThemeFormation, updateTacheThemeFormation } from '../../../../../services/elaborations/tacheThemeFormationAPI';
import { createTacheThemeFormationSlice, updateTacheThemeFormationSlice } from '../../../../../_redux/features/elaborations/tacheThemeFormationSlice';
import { getTacheGeneriques } from '../../../../../services/settings/tacheGeneriqueAPI';


function FormCreateUpdate({ tacheThemeFormation }: { tacheThemeFormation: TacheThemeFormation | null }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const selectedTheme = useSelector((state: RootState) => state.themeFormationSlice.selectedTheme);
    
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [tacheGenerique, setTacheGenerique] = useState<TacheGenerique>();
   
    
    const [errorTache, setErrorTache] = useState("");
    const [errorDateDebut, setErrorDateDebut] = useState("");
    const [errorDateFin, setErrorDateFin] = useState("")
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        
        if (tacheThemeFormation) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.tache_formation'));
            
           
            setDateDebut(formatDateForInput(tacheThemeFormation.dateDebut) || "");
            setDateFin(formatDateForInput(tacheThemeFormation.dateFin) || "");
            setTacheGenerique(tacheThemeFormation.tache)
            
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.tache_formation'));
            setDateDebut("");
            setDateFin("");
            setTacheGenerique(undefined)
        }


        if (isFirstRender) {
            
            setErrorDateDebut("")
            setErrorDateFin("")
            setErrorTache("");
            
            setIsFirstRender(false);
        }
    }, [tacheThemeFormation, isFirstRender, t]);

    const closeModal = () => {
        
        setErrorDateDebut("")
        setErrorDateFin("")
        setErrorTache("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    

    const onSearchTache = async (search: string) => {
        setErrorTache("")
        const data = await getTacheGeneriques({search: search, lang});
        return data?.tacheGeneriques || [];
    };

     const handleTacheSelect = (selected: TacheGenerique | string) => {
        if (typeof selected === "string") return
        if(selected){
            setTacheGenerique(selected)
        }
       
    };


    const handleCreateTacheThemeFormation = async () => {
        if (!tacheGenerique || !dateDebut || !dateFin) {
            

            if (!dateDebut) {
                setErrorDateDebut(t('error.date_debut'));
            }

            if (!dateFin) {
                setErrorDateFin(t('error.date_fin'));
            }

            
            
            if(!tacheGenerique){
                setErrorTache(t('error.tache_formation'))
            }
            

            return;
        }

        if (!tacheThemeFormation) {
            await createTacheThemeFormation(
                {
                    dateDebut,
                    dateFin,
                    tache:tacheGenerique,
                },selectedTheme?._id||"", lang
            ).then((e: ReponseApiPros) => {
                
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createTacheThemeFormationSlice({

                        tacheThemeFormation: {
                            _id: e.data._id,
                            dateDebut: e.data.dateDebut,
                            dateFin: e.data.dateFin,
                            theme: e.data.theme,
                            tache: e.data.tache,
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
            await updateTacheThemeFormation(
                {
                    _id: tacheThemeFormation._id,
                    dateDebut,
                    dateFin,
                    tache:tacheGenerique,
                }, lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateTacheThemeFormationSlice({
                            id: e.data._id,
                            tacheThemeFormationData: {
                                _id: e.data._id,
                                dateDebut: e.data.dateDebut,
                                dateFin: e.data.dateFin,
                                theme: e.data.theme,
                                tache: e.data.tache,
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
                handleConfirm={handleCreateTacheThemeFormation}
            >

                <label>{t('label.tache_formation')}</label><label className="text-red-500"> *</label>
                <FilterList
                    items={[]}
                    placeholder={t('recherche.rechercher')+t('recherche.tache_formation')}
                    displayProperty={(item) => `${lang==='fr'?item.nomFr:item.nomEn}`}
                    onSelect={handleTacheSelect}
                    enableBackendSearch={true}
                    onSearch={onSearchTache}
                    searchDelay={300}
                    minSearchLength={2}
                    defaultValue={tacheGenerique}
                    noResultsMessage={t('label.aucune_tache_formation')}
                    loadingMessage={t('label.recherche_tache_formation')}
                />
                {errorTache && <p className="text-red-500" >{errorTache}</p>}
               
                <label>{t('label.date_debut')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateDebut}
                    onChange={(e) => {setDateDebut(e.target.value); setErrorDateDebut("")}}
                />
                {errorDateDebut && <p className="text-red-500" >{errorDateDebut}</p>}
                 <label>{t('label.date_fin')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateFin}
                    onChange={(e) => {setDateFin(e.target.value); setErrorDateFin("")}}
                />
                {errorDateFin && <p className="text-red-500" >{errorDateFin}</p>}

            </CustomDialogModal>

        </>
    );
}



export default FormCreateUpdate;

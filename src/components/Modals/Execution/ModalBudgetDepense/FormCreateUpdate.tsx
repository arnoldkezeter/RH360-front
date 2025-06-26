import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { searchTaxe } from '../../../../services/settings/taxeAPI';
import { TYPE_DEPENSE } from '../../../../config';
import { createDepense, updateDepense } from '../../../../services/executions/depenseAPI';
import { createDepenseSlice, updateDepenseSlice } from '../../../../_redux/features/execution/depenseSlice';
import { SearchSelectComponent } from '../../../ui/SearchSelectComponent';


function FormCreateUpdate(
    { depense, onAdd, onUpdate }: 
    { depense : Depense | null, onAdd: (depense: Depense) => void; onUpdate: (depense: Depense) => void; }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const selectedBudget = useSelector((state: RootState) => state.budgetFormationSlice.selectedBugetFormation);
    const typesDepense = Object.values(TYPE_DEPENSE)
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const [nomFr, setNomFr] = useState("")
    const [nomEn, setNomEn] = useState("")
    const [type, setType] = useState<TypeDepense>()
    const [montantUnitairePrevu, setMontantUnitairePrevu]= useState(0)
    const [montantUnitaireReel, setMontantUnitaireReel]= useState<number>()
    const [quantite, setQuantite]= useState<number>()
    const [taxes, setTaxes] = useState<Taxe[]>([]);

   
    
    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");
    const [errorMontantUnitairePrevu, setErrorMontantUnitairePrevu] = useState("");
    const [errorType, setErrorType] = useState("");
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        
        if (depense) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.depense'));
            const type = typesDepense.find(type=>type.key === depense.type);
            setType(type)
            setNomFr(depense.nomFr) 
            setNomEn(depense.nomEn) 
            setQuantite(depense.quantite)
            setMontantUnitairePrevu(depense.montantUnitairePrevu)
            setMontantUnitaireReel(depense.montantUnitaireReel)
            setTaxes(depense?.taxes || [])

           
           
            
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.depense'));
            setType(undefined)
            setNomFr("") 
            setNomEn("") 
            setQuantite(undefined)
            setMontantUnitairePrevu(0)
            setMontantUnitaireReel(undefined)
            setTaxes([])
        }


        if (isFirstRender) {
            setErrorNomFr("")
            setErrorNomEn("")            
            setErrorType("");
            setErrorMontantUnitairePrevu("")
            setIsFirstRender(false);
        }
    }, [depense, isFirstRender, t]);

    const closeModal = () => {
        
        setErrorNomFr("")
        setErrorNomEn("")  
        setErrorMontantUnitairePrevu("")          
        setErrorType("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };
    

    const onSearchTaxe = async (search: string) => {
        
        const data = await searchTaxe({searchString: search, lang});
        return data?.taxes || [];
    };


    const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRoleNom = e.target.value;
        var selected=null;

        if (lang === 'fr') {
            selected = typesDepense.find(type => type.nomFr === selectedRoleNom);
        }
        else {
            selected = typesDepense.find(type => type.nomEn === selectedRoleNom);
        }
        
        if(selected){
            setType(selected)
        }
        setErrorType("")
    }


    const handleCreateDepense = async () => {
        if (!nomFr || !nomEn || !type || !montantUnitairePrevu) {
            

            if (!nomFr) {
                setErrorNomFr(t('error.nature_depense_fr'));
            }

            if (!nomEn) {
                setErrorNomEn(t('error.nature_depense_en'));
            }

            if(!montantUnitairePrevu || (montantUnitairePrevu && montantUnitairePrevu<=0)){
                setErrorMontantUnitairePrevu(t('error.montant_unitaire_prevu'))
            }
            
            
            if(!type){
                setErrorType(t('error.type_depense'))
            }
            

            return;
        }

        if (!depense) {
            
            await createDepense({
                nomFr,
                nomEn,
                quantite,
                type:type?.key || "",
                montantUnitairePrevu,
                montantUnitaireReel,
                taxes
            }, selectedBudget?._id || "", lang
            ).then((e: ReponseApiPros) => {
                
                if (e.success) {
                    createToast(e.message, '', 0);
                    onAdd(e.data); // Ajout local
                    dispatch(createDepenseSlice({

                        depense: {
                            _id: e.data._id,
                            nomFr: e.data.nomFr,
                            nomEn: e.data.nomEn,
                            quantite:e.data.quantite,
                            montantUnitairePrevu: e.data.montantUnitairePrevu,
                            montantUnitaireReel:e.data.montantUnitairePrevu,
                            type: e.data.type,
                            taxes:e.data.taxe,
                            budget:e.data.budget
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
            await updateDepense(
                {
                    _id: depense._id,
                    nomFr,
                    nomEn,
                    quantite,
                    type:type?.key || "",
                    montantUnitairePrevu,
                    montantUnitaireReel,
                    taxes
                }, selectedBudget?._id||"", lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        onUpdate(e.data); // Ajout local
                        dispatch(updateDepenseSlice({
                            id: e.data._id,
                            depenseData: {
                               _id: e.data._id,
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                quantite:e.data.quantite,
                                montantUnitairePrevu: e.data.montantUnitairePrevu,
                                montantUnitaireReel:e.data.montantUnitairePrevu,
                                type: e.data.type,
                                taxes:e.data.taxe,
                                budget:e.data.budget
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
                handleConfirm={handleCreateDepense}
            >
                <label>{t('label.nature_depense_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={nomFr}
                    onChange={(e) => {setNomFr(e.target.value); setErrorNomFr("")}}
                />
                {errorNomFr && <p className="text-red-500" >{errorNomFr}</p>}
                <label>{t('label.nature_depense_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={nomEn}
                    onChange={(e) => {setNomEn(e.target.value); setErrorNomEn("")}}
                />
                {errorNomEn && <p className="text-red-500" >{errorNomEn}</p>}

                <label>{t('label.quantite')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="number"
                    value={quantite}
                    onChange={(e) => {setQuantite(parseFloat(e.target.value));}}
                />

                <label>{t('label.montant_unitaire_prevu')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="number"
                    value={montantUnitairePrevu}
                    onChange={(e) => {setMontantUnitairePrevu(parseFloat(e.target.value)); setErrorMontantUnitairePrevu("")}}
                />
                {errorMontantUnitairePrevu && <p className="text-red-500" >{errorMontantUnitairePrevu}</p>}

                <label>{t('label.montant_unitaire_reel')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="number"
                    value={montantUnitaireReel}
                    onChange={(e) => {setMontantUnitaireReel(parseFloat(e.target.value))}}
                />

                <label>{t('label.type_depense')}</label><label className="text-red-500"> *</label>
                <select
                    value={type? (lang === 'fr' ? type.nomFr : type.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.type_depense')}
                    onChange={handleTypeChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.type_depense')}</option>
                    {typesDepense.map(type => (
                        <option key={type.key} value={(lang === 'fr' ? type.nomFr : type.nomEn)}>{(lang === 'fr' ? type.nomFr : type.nomEn)}</option>
                    ))}
                </select>
                {errorType && <p className="text-red-500">{errorType}</p>}

                <label>{t('label.taxe')}</label>
                <SearchSelectComponent<Taxe>
                    onSearch={onSearchTaxe}
                    selectedItems={taxes}
                    onSelectionChange={setTaxes}
                    placeholder={t('recherche.rechercher')+t('recherche.taxe')}
                    displayField={lang?"natureFr":"natureEn"}
                    searchDelay={300}
                    minSearchLength={2}
                    noResultsMessage={t('label.aucune_taxe')}
                    loadingMessage={t('label.recherche_taxe')}
                    textDebutCaractere={t('label.tapez_car_deb')}
                    textFinCaractere={t('label.tapez_car_fin')}
                />
            </CustomDialogModal>

        </>
    );
}



export default FormCreateUpdate;

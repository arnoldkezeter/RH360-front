import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FilterList from '../../../ui/AutoComplete';
import { SearchSelectComponent } from '../../../ui/SearchSelectComponent';
import { searchUtilisateur } from '../../../../services/utilisateurs/utilisateurAPI';
import { getStagiairesByFiltres } from '../../../../services/stagiaires/stagiaireAPI';
import { searchService } from '../../../../services/settings/serviceAPI';


function FormCreateUpdate({ groupe, onEditGroupe }: { groupe: Groupe | undefined, onEditGroupe:(groupe:Groupe)=>void }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const [nom, setNom] = useState("");
    const [selectedStagiaire, setSelectedStagiaire] = useState<Stagiaire[]>([]);
    const [service, setService] = useState<ServiceFinal>(
        { service: undefined, superviseur: undefined, dateDebut: "", dateFin: "" } // Au moins un élément par défaut
    );
    
    

    const [errorNom, setErrorNom] = useState("");
    
    const onSearchStagiaire = async (search: string) => {
        const data = await getStagiairesByFiltres({page:1, search: search, lang});
        return data?.stagiaires || [];
    };
    const onSearchSuperviseur = async (search: string) => {
        const data = await searchUtilisateur({searchString: search, lang});
        return data?.utilisateurs || [];
    };
    const onSearchService = async (search: string) => {
        const data = await searchService({searchString: search, lang});
        return data?.services || [];
    };

    const onServiceChange = (field: keyof ServiceFinal, value: any) => {
        const updatedServices =  { ...service, [field]: value } 
        setService(updatedServices);
    };
    const handleServiceSelect = (selected: Service | string) => {
        if (typeof selected === "string") return
        onServiceChange("service", selected)
    };
    
    const handleSuperviseurSelect = (selected: Utilisateur | string) => {
        if (typeof selected === "string") return
        onServiceChange("superviseur", selected)
        
    };
    
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        
        if (groupe) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.groupe'));
            console.log(groupe?.serviceFinal?.service)
            setNom(groupe.nom);
            setService({
                service:groupe?.serviceFinal?.service,
                superviseur:groupe?.serviceFinal?.superviseur,
                dateDebut:groupe.serviceFinal?.dateDebut ||"",
                dateFin:groupe.serviceFinal?.dateFin || "",
            })
            setSelectedStagiaire(groupe.stagiaires)
            
        } 


        if (isFirstRender) {
            setErrorNom("");

            
            setIsFirstRender(false);
        }
    }, [groupe, isFirstRender, t]);

    const closeModal = () => {
        setErrorNom("");
        
        setIsFirstRender(true);
        dispatch(setShowModal());
    };


    const handleCreateGroupe = async () => {
        if (!nom || selectedStagiaire.length===0 || !service) {
            console.log("error")
            if (!nom) {
                setErrorNom(t('error.nom_chose'));
            }

            
            return;
        }
        if(!groupe) return
        onEditGroupe({
            id: groupe.id,
            nom: nom,
            serviceFinal: service,
            stagiaires:selectedStagiaire
        })

        closeModal()
       
    }


    
    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateGroupe}
            >
                
                <label>{t('label.nom_chose')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={nom}
                    onChange={(e) => { setNom(e.target.value); setErrorNom("") }}
                />
                {errorNom && <p className="text-red-500" >{errorNom}</p>}
                <label>{t('label.stagiaire')}</label>
                <SearchSelectComponent<Stagiaire>
                    onSearch={onSearchStagiaire}
                    selectedItems={selectedStagiaire}
                    onSelectionChange={setSelectedStagiaire}
                    placeholder={t('recherche.rechercher')+t('recherche.stagiaire')}
                    displayField={"nom"}
                    searchDelay={300}
                    minSearchLength={2}
                    noResultsMessage={t('label.aucun_stagiaire')}
                    loadingMessage={t('label.recherche_stagiaire')}
                    textDebutCaractere={t('label.tapez_car_deb')}
                    textFinCaractere={t('label.tapez_car_fin')}
                />
                {/* Services et superviseurs */}
                <label>
                    Services et Supervision
                </label>
                <div className="bg-white dark:bg-[#1f2937] rounded-xl p-6 border border-[#e5e7eb] dark:border-[#374151] shadow-sm">
                    <div className="space-y-4">
                    
                        {/* Première ligne : Service et Superviseur */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Service */}
                            <div className="space-y-2">
                            <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                Service
                            </label>
                            <div className="relative">
                                <FilterList
                                    items={[]}
                                    placeholder={t('recherche.rechercher')+t('recherche.service')}
                                    displayProperty={(item) => `${lang==='fr'?item.nomFr:item.nomEn}`}
                                    onSelect={(selected) => handleServiceSelect(selected)}
                                    enableBackendSearch={true}
                                    onSearch={onSearchService}
                                    searchDelay={300}
                                    minSearchLength={2}
                                    defaultValue={groupe?.serviceFinal?.service}
                                    noResultsMessage={t('label.aucun_service')}
                                    loadingMessage={t('label.recherche_service')}
                                />
                            </div>
                            </div>
        
                            {/* Superviseur */}
                            <div className="space-y-2">
                            <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                Superviseur
                            </label>
                            <div className="relative">
                                <FilterList
                                    items={[]}
                                    placeholder={t('recherche.rechercher')+t('recherche.superviseur')}
                                    displayProperty={(item) => `${item.nom} ${item.prenom || ""}`}
                                    onSelect={(selected) => handleSuperviseurSelect(selected)}
                                    enableBackendSearch={true}
                                    onSearch={onSearchSuperviseur}
                                    searchDelay={300}
                                    minSearchLength={2}
                                    defaultValue={groupe?.serviceFinal?.superviseur}
                                    noResultsMessage={t('label.aucun_superviseur')}
                                    loadingMessage={t('label.recherche_superviseur')}
                                />
                            </div>
                            </div>
                        </div>
        
                        {/* Deuxième ligne : Dates et bouton supprimer */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Date début */}
                            <div className="space-y-2">
                            <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                Date début
                            </label>
                            <input 
                                type="date" 
                                value={service?.dateDebut || ''}
                                onChange={(e) => onServiceChange('dateDebut', e.target.value)}
                                className="w-full h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                        bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                        focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent" 
                            />
                            </div>
        
                            {/* Date fin avec bouton supprimer */}
                            <div className="space-y-2">
                            <label className="text-xs font-medium text-[#4b5563] dark:text-[#9ca3af] uppercase tracking-wide">
                                Date fin
                            </label>
                            <div className="flex gap-2">
                                <input 
                                type="date" 
                                value={service?.dateFin || ''}
                                onChange={(e) => onServiceChange('dateFin', e.target.value)}
                                className="flex-1 h-10 border border-[#e5e7eb] dark:border-[#4b5563] rounded-md px-3 text-sm
                                            bg-white dark:bg-[#1f2937] text-[#111827] dark:text-white
                                            focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent" 
                                />
                                
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CustomDialogModal>

        </>
    );
}



export default FormCreateUpdate;

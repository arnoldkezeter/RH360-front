import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { useSettingData } from '../../../../hooks/useSettingData';
import { getDepartementsForDropDown } from '../../../../services/settings/departementAPI';
import { getCommunesForDropDown } from '../../../../services/settings/communeAPI';
import { createChercheur, updateChercheur } from '../../../../services/chercheurs/chercheurAPI';
import { formatDateForInput } from '../../../../fonctions/fonction';
import { ROLES } from '../../../../config';
import { createChercheurSlice, updateChercheurSlice } from '../../../../_redux/features/chercheurs/chercheurSlice';
import FilterList from '../../../ui/AutoComplete';


function FormCreateUpdate({ chercheur }: { chercheur: Chercheur | null }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const {data:{regions}} = useSelector((state: RootState) => state.regionSlice)
    const {data:{etablissements}} = useSelector((state: RootState) => state.etablissementSlice)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const roles = Object.values(ROLES)
    // const structures:Structure[] =[];
    // const regions:Region[] =[];
    // const grades:Grade[] =[];
    // const familleMetiers:FamilleMetier[] =[];
    // const {data:{departements}} = useSelector((state: RootState) => state.departementSlice) ?? [];
    // const {data:{communes}} = useSelector((state: RootState) => state.communeSlice) ?? [];
    // const {data:{posteDeTravails}} = useSelector((state: RootState) => state.posteDeTavailSlice) ?? [];
    // const {data:{categorieProfessionnelles}} = useSelector((state: RootState) => state.categorieProfessionnelleSlice) ?? [];
    // const {data:{services}}= useSelector((state: RootState) => state.serviceSlice) ?? [];
    const { t } = useTranslation();
    const [filteredDepartements, setFilteredDepartements]=useState<Departement[]>([])
    const [filteredCommunes, setFilteredCommunes]=useState<Commune[]>([])

    const dispatch = useDispatch();
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [genre, setGenre] = useState("");
    const [dateNaissance, setDateNaissance] = useState("");
    const [lieuNaissance, setLieuNaissance] = useState("");
    const [email, setEmail] = useState("");
    const [telephone, setTelephone] = useState("");
    const [etablissement, setEtablissement] = useState<Etablissement>()
    const [domaineRecherche, setDomaineRecherche] = useState("")
    const [region, setRegion] = useState<Region>();
    const [departement, setDepartement] = useState<Departement>();
    const [commune, setCommune] = useState<Commune>();

    const [errorNom, setErrorNom] = useState("");
    const [errorGenre, setErrorGenre] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorEtablissement, setErrorEtablissement] = useState("");
    const [errorTelephone, setErrorTelephone] = useState("");
    const [errorDomaineRecherche, setErrorDomaineRecherche] = useState("")
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        
        if (chercheur) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.chercheur'));
            setNom(chercheur.nom);
            setPrenom(chercheur?.prenom || ""); 
            setGenre(chercheur.genre);
            setDateNaissance(formatDateForInput(chercheur.dateNaissance) || "");
            setLieuNaissance(chercheur.lieuNaissance || "");
            setEmail(chercheur.email);
            setTelephone(chercheur?.telephone || "");
            setEtablissement(chercheur.etablissement);
            setDomaineRecherche(chercheur.domaineRecherche);
            setRegion(chercheur?.commune?.departement?.region || undefined);
            setDepartement(chercheur?.commune?.departement || undefined);
            setCommune(chercheur?.commune || undefined);
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.chercheur'));
            setNom("");
            setPrenom("");
            setGenre("");
            setDateNaissance("");
            setLieuNaissance("");
            setEmail("");
            setTelephone("");
            
            setRegion(undefined);
            setDepartement(undefined);
            setCommune(undefined);

            setEtablissement(undefined);
            setDomaineRecherche("");
           
        }


        if (isFirstRender) {
            setErrorNom("");
            setErrorGenre("");
            setErrorEmail("");
            setErrorEtablissement("")
            setErrorTelephone("")
            setErrorDomaineRecherche("")
            setIsFirstRender(false);
        }
    }, [chercheur, isFirstRender, t]);

    const closeModal = () => {
        setErrorNom("");
        setErrorGenre("");
        setErrorEmail("");
        setErrorEtablissement("")
        setErrorTelephone("")
        setErrorDomaineRecherche("")
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const validateEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setErrorEmail(t('error.incorrect_email'));
            return false;
        }
        setErrorEmail("");
        return true;
    };


    // Effets pour les dépendances
    useEffect(() => {
        if (region && region._id) {
            getDepartementsForDropDown({ regionId: region._id, lang }).then((data) =>
                setFilteredDepartements(data.departements)
            );
        }
    }, [region]);

    useEffect(() => {
        if (departement && departement._id) {
            getCommunesForDropDown({ departementId: departement._id,lang }).then((data) =>
                setFilteredCommunes(data.communes)
            );
        }
    }, [departement]);

    
    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRegionNom = e.target.value;
        var selectedRegion = null;

        if(!selectedRegionNom){
            setRegion(undefined);
            setFilteredDepartements([]);
            setDepartement(undefined)
            setFilteredCommunes([]);
            setCommune(undefined)
            return;
        } 
        if (lang === 'fr') {
            selectedRegion = regions.find(region => region.nomFr === selectedRegionNom);
        }
        else {
            selectedRegion = regions.find(region => region.nomEn === selectedRegionNom);
        }

        if (selectedRegion) {
            setRegion(selectedRegion);
        }
    };

    const handleDepartementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDepartementNom = e.target.value;
        var selectedDepartement = null;

        if(!selectedDepartementNom){
            setDepartement(undefined)
            setFilteredCommunes([]);
            setCommune(undefined)
            return;
        } 

        if (lang === 'fr') {
            selectedDepartement = filteredDepartements.find(departement => departement.nomFr === selectedDepartementNom);

        }
        else {
            selectedDepartement = filteredDepartements.find(departement => departement.nomEn === selectedDepartementNom);
        }

        if (selectedDepartement) {
            setDepartement(selectedDepartement);
        }
    };

    const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCommuneNom = e.target.value;
        var selectedCommune = null;

        if(!selectedCommuneNom){
            setCommune(undefined)
            return;
        } 

        if (lang === 'fr') {
            selectedCommune =  filteredCommunes.find(commune => commune.nomFr === selectedCommuneNom);
        }

        else {
            selectedCommune = filteredCommunes.find(commune => commune.nomEn === selectedCommuneNom);
        }


        if (selectedCommune) {
            setCommune(selectedCommune);
        }
    };

    const handleEtablissementSelect = (selected: Etablissement | string) => {
        if (typeof selected === "string") {
            setEtablissement({
                nomFr:selected,
                nomEn:selected
            })
        } else {
            if(selected){
                setEtablissement(selected)
            }
        }
        setErrorEtablissement("");
  };



    const handleCreateChercheur = async () => {
        if (!nom || !genre || !email || !telephone || !etablissement || !domaineRecherche) {
            if (!nom) {
                setErrorNom(t('error.nom'));
            }
            if (!genre) {
                setErrorGenre(t('error.genre'));
            }

            if (!email) {
                setErrorEmail(t('error.email'));
            }

            if(!telephone){
                setErrorTelephone(t("error.telephone"))
            }

            if(!etablissement){
                setErrorEtablissement(t('error.etablissement'))
            }
            
           
            if(!domaineRecherche){
                setErrorDomaineRecherche(t('error.domaine_recherche'))
            }
        
            

            return;
        }
        if (!validateEmail()) {
            return;
        }


        if (!chercheur) {
            setIsLoading(true)
            await createChercheur(
                {
                    nom,
                    prenom,
                    email,
                    genre,
                    telephone,
                    dateNaissance,
                    lieuNaissance,
                    photoDeProfil:"",
                    commune,
                    etablissement,
                    domaineRecherche,
                    actif:true,
                }, lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createChercheurSlice({

                        chercheur: {
                            _id: e.data._id,
                            nom: e.data.nom,
                            genre: e.data.genre,
                            email: e.data.email,
                            photoDeProfil: e.data.photoDeProfil,
                            telephone: e.data.telephone,
                            prenom: e.data.prenom,
                            dateNaissance: e.data.dateNaissance,
                            lieuNaissance: e.data.lieuNaissance,
                            etablissement: e.data.etablissement,
                            domaineRecherche:e.data.domaineRecherche,
                            commune: commune,
                            actif: e.data.actif,
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

        } else {
            setIsLoading(true);
            await updateChercheur(
                {
                    _id: chercheur._id,
                    nom,
                    prenom,
                    email,
                    genre,
                    telephone,
                    dateNaissance,
                    lieuNaissance,
                    commune,
                    etablissement,
                    domaineRecherche,
                    actif:true,
                }, lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateChercheurSlice({
                            id: e.data._id,
                            chercheurData: {
                                _id: e.data._id,
                                nom: e.data.nom,
                                genre: e.data.genre,
                                email: e.data.email,
                                photoDeProfil: e.data.photoDeProfil,
                                telephone: e.data.telephone,
                                prenom: e.data.prenom,
                                dateNaissance: e.data.dateNaissance,
                                lieuNaissance: e.data.lieuNaissance,
                                etablissement: e.data.etablissement,
                                domaineRecherche:e.data.domaineRecherche,
                                commune: commune,
                                actif: e.data.actif
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
        }
    }

    
    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateChercheur}
                isLoading={isLoading}
            >
                
                <label>{t('label.nom')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={nom}
                    onChange={(e) => { setNom(e.target.value); setErrorNom("") }}
                />
                {errorNom && <p className="text-red-500" >{errorNom}</p>}
                <label>{t('label.prenom')}</label><input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                />
                <label>{t('label.date_naissance')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateNaissance}
                    onChange={(e) => setDateNaissance(e.target.value)}
                />
                <label>{t('label.lieu_naissance')}</label><input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={lieuNaissance}
                    onChange={(e) => { setLieuNaissance(e.target.value) }}
                />
                <label>{t('label.genre')}</label><label className="text-red-500"> *</label>
                <div>
                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.homme')}
                        name="genre"
                        value={t('label.homme')}
                        checked={genre === "M"}
                        onChange={() => { setGenre("M"); setErrorGenre("") }}
                    />
                    <label htmlFor={t('label.homme')} className='radio-intern-space'>{t('label.homme')}</label>

                    <input
                        className='radio-label-space'
                        type="radio"
                        id={t('label.femme')}
                        name="genre"
                        value={t('label.femme')}
                        checked={genre === "F"}
                        onChange={() => { setGenre("F"); setErrorGenre("") }}
                    />
                    <label htmlFor={t('label.femme')}>{t('label.femme')}</label>
                </div>
                {errorGenre && <p className="text-red-500">{errorGenre}</p>}
                <label>{t('label.telephone')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={telephone}
                    onChange={(e) => { setTelephone(e.target.value); setErrorTelephone(""); }}
                />
                {errorTelephone && <p className="text-red-500">{errorTelephone}</p>}
                <label>{t('label.email')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="e-mail"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorEmail(""); }}
                />
                {errorEmail && <p className="text-red-500">{errorEmail}</p>}
                
                <label>{t('label.etablissement')}</label><label className="text-red-500"> *</label>
                <FilterList
                    items={etablissements}
                    defaultValue={etablissement}
                    placeholder=""
                    displayProperty={(etablissement) => `${etablissement.nomFr}`}
                    onSelect={handleEtablissementSelect}
                />
                {errorEtablissement && <p className="text-red-500">{errorEtablissement}</p>}

                <label>{t('label.domaine_recherche')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={domaineRecherche}
                    onChange={(e) => {setDomaineRecherche(e.target.value); setErrorDomaineRecherche("")}}
                />
                {errorDomaineRecherche && <p className="text-red-500">{errorDomaineRecherche}</p>}

                <label>{t('label.region')}</label>
                <select
                    value={region ? (lang === 'fr' ? region.nomFr : region.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.region')}
                    onChange={handleRegionChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.region')}</option>
                    {regions.map(region => (
                        <option key={region._id} value={(lang === 'fr' ? region.nomFr : region.nomEn)}>{(lang === 'fr' ? region.nomFr : region.nomEn)}</option>
                    ))}
                </select>
                <label>{t('label.departement')}</label>
                <select
                    value={departement ? (lang === 'fr' ? departement.nomFr : departement.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}
                    onChange={handleDepartementChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}</option>
                    {filteredDepartements.map(departement => (
                        <option key={departement._id} value={(lang === 'fr' ? departement.nomFr : departement.nomEn)}>{(lang === 'fr' ? departement.nomFr : departement.nomEn)}</option>
                    ))}
                </select>
                <label>{t('label.commune')}</label>
                <select
                    value={commune ? (lang === 'fr' ? commune.nomFr : commune.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.commune')}
                    onChange={handleCommuneChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.commune')}</option>
                    {filteredCommunes.map(commune => (
                        <option key={commune._id} value={(lang === 'fr' ? commune.nomFr : commune.nomEn)}>{(lang === 'fr' ? commune.nomFr : commune.nomEn)}</option>
                    ))}
                </select>
            </CustomDialogModal>

        </>
    );
}



export default FormCreateUpdate;

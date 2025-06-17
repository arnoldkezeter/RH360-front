import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { useUserFormData } from '../../../../hooks/useFormData';
import { getDepartementsForDropDown } from '../../../../services/settings/departementAPI';
import { getCommunesForDropDown } from '../../../../services/settings/communeAPI';
import { createStagiaire, updateStagiaire } from '../../../../services/stagiaires/stagiaireAPI';
import { formatDateForInput } from '../../../../fonctions/fonction';
import { ROLES } from '../../../../config';
import { createStagiaireSlice, updateStagiaireSlice } from '../../../../_redux/features/stagiaireSlice';
import FilterList from '../../../ui/AutoComplete';


function FormCreateUpdate({ stagiaire }: { stagiaire: Stagiaire | null }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { loading, error, regions, etablissements} = useUserFormData(lang);
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
    const [annee, setAnnee] = useState<number>();
    const [etablissement, setEtablissement] = useState<Etablissement>()
    const [filiere, setFiliere] = useState("")
    const [option, setOption] = useState("")
    const [niveau, setNiveau] = useState("")
    const [region, setRegion] = useState<Region>();
    const [departement, setDepartement] = useState<Departement>();
    const [commune, setCommune] = useState<Commune>();

    const [errorNom, setErrorNom] = useState("");
    const [errorRole, setErrorRole] = useState("");
    const [errorGenre, setErrorGenre] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorAnnee, setErrorAnnee] = useState("");
    const [errorEtablissement, setErrorEtablissement] = useState("");
    const [errorTelephone, setErrorTelephone] = useState("");
    const [errorFiliere, setErrorFiliere] = useState("")
    const [errorNiveau, setErrorNiveau] = useState("");
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        
        if (stagiaire) {
            const parcour = stagiaire.parcours[0];
            setModalTitle(t('form_update.enregistrer') + t('form_update.stagiaire'));
            setNom(stagiaire.nom);
            setPrenom(stagiaire?.prenom || ""); 
            setGenre(stagiaire.genre);
            setDateNaissance(formatDateForInput(stagiaire.dateNaissance) || "");
            setLieuNaissance(stagiaire.lieuNaissance || "");
            setEmail(stagiaire.email);
            setTelephone(stagiaire?.telephone || "");
            parcour.annee && setAnnee(parcour.annee);
            setEtablissement(parcour.etablissement);
            setFiliere(parcour.filiere);
            setOption(parcour?.option || "")
            setNiveau(parcour.niveau)
            setRegion(stagiaire?.commune?.departement?.region || undefined);
            setDepartement(stagiaire?.commune?.departement || undefined);
            setCommune(stagiaire?.commune || undefined);
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.stagiaire'));
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

            setAnnee(undefined);
            setEtablissement(undefined);
            setFiliere("");
            setOption("")
            setNiveau("")
        }


        if (isFirstRender) {
            setErrorNom("");
            setErrorGenre("");
            setErrorEmail("");
            setErrorEtablissement("")
            setErrorTelephone("")
            setErrorAnnee("")
            setErrorFiliere("")
            setErrorNiveau("")
            setIsFirstRender(false);
        }
    }, [stagiaire, isFirstRender, t]);

    const closeModal = () => {
        setErrorNom("");
        setErrorGenre("");
        setErrorEmail("");
        setErrorEtablissement("")
        setErrorTelephone("")
        setErrorAnnee("")
        setErrorFiliere("")
        setErrorNiveau("")
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



    const handleCreateStagiaire = async () => {
        if (!nom || !genre || !email || !telephone || !etablissement || !filiere || !niveau) {
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
            
            if(!annee){
                setErrorAnnee(t('error.annee'))
            }
            
            if(!filiere){
                setErrorFiliere(t('error.filiere'))
            }
        
            if(!niveau){
                setErrorNiveau(t('error.niveau'))
            }
        

            return;
        }
        if (!validateEmail()) {
            return;
        }

        const parcour : Parcour = {
            annee: annee,
            etablissement: etablissement,
            filiere: filiere,
            niveau: niveau,
            option:option
        }

        if (!stagiaire) {
            await createStagiaire(
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
                    actif:true,
                    parcours:[parcour]
                }, lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createStagiaireSlice({

                        stagiaire: {
                            _id: e.data._id,
                            nom: e.data.nom,
                            genre: e.data.genre,
                            email: e.data.email,
                            photoDeProfil: e.data.photoDeProfil,
                            telephone: e.data.telephone,
                            prenom: e.data.prenom,
                            dateNaissance: e.data.dateNaissance,
                            lieuNaissance: e.data.lieuNaissance,
                            parcours: e.data.parcours,
                            commune: commune,
                            actif: e.data.actif,
                        }

                    }));

                    closeModal();

                } else {
                    createToast(e.message, '', 2);

                }
            }).catch((e) => {
                console.log(e);
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
            })

        } else {
            await updateStagiaire(
                {
                    _id: stagiaire._id,
                    nom,
                    prenom,
                    email,
                    genre,
                    telephone,
                    dateNaissance,
                    lieuNaissance,
                    commune,
                    parcours:[parcour],
                    actif:true,
                }, lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateStagiaireSlice({
                            id: e.data._id,
                            stagiaireData: {
                                _id: e.data._id,
                                nom: e.data.nom,
                                genre: e.data.genre,
                                email: e.data.email,
                                photoDeProfil: e.data.photoDeProfil,
                                telephone: e.data.telephone,
                                prenom: e.data.prenom,
                                dateNaissance: e.data.dateNaissance,
                                lieuNaissance: e.data.lieuNaissance,
                                parcours:e.data.parcours,
                                commune: commune,
                                actif: e.data.actif
                            }

                        }));

                        closeModal();

                    } else {
                        createToast(e.message, '', 2);

                    }
                }).catch((e) => {
                    console.log(e);
                    createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
                })
        }
    }


    if (loading) {
        return <div>{t("Chargement des données...")}</div>;
    }

    const firstError = Object.values(error).find(err => err !== null);
    if (firstError) {
        return <div>{t("Une erreur est survenue :")} {firstError}</div>;
    }
    
    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateStagiaire}
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
                <label>{t('label.annee')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={annee}
                    onChange={(e) => {setAnnee(parseInt(e.target.value)); setErrorAnnee("")}}
                />
                {errorAnnee && <p className="text-red-500">{errorAnnee}</p>}

                <label>{t('label.etablissement')}</label><label className="text-red-500"> *</label>
                <FilterList
                    items={etablissements}
                    defaultValue={etablissement}
                    placeholder=""
                    displayProperty={(etablissement) => `${etablissement.nomFr}`}
                    onSelect={handleEtablissementSelect}
                />
                {errorEtablissement && <p className="text-red-500">{errorEtablissement}</p>}

                <label>{t('label.filiere')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={filiere}
                    onChange={(e) => {setFiliere(e.target.value); setErrorFiliere("")}}
                />
                {errorFiliere && <p className="text-red-500">{errorFiliere}</p>}

                <label>{t('label.option')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                />

                <label>{t('label.niveau')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={niveau}
                    onChange={(e) => {setNiveau(e.target.value); setErrorNiveau("")}}
                />
                {errorNiveau && <p className="text-red-500">{errorNiveau}</p>}

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

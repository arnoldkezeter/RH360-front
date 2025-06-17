import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { useUserFormData } from '../../../../hooks/useFormData';
import { getServicesForDropDownByStructure } from '../../../../services/settings/serviceAPI';
import { setServices } from '../../../../_redux/features/parametres/serviceSlice';
import { getDepartementsForDropDown } from '../../../../services/settings/departementAPI';
import { setDepartements } from '../../../../_redux/features/parametres/departementSlice';
import { getCommunesForDropDown } from '../../../../services/settings/communeAPI';
import { setCommunes } from '../../../../_redux/features/parametres/communeSlice';
import { getCategorieProfessionnellesForDropDown } from '../../../../services/settings/categorieProfessionnelleAPI';
import { setCategorieProfessionnelles } from '../../../../_redux/features/parametres/categorieProfessionnelleSlice';
import { getPosteDeTravailForDropDown } from '../../../../services/settings/posteDeTravailAPI';
import { setPosteDeTravails } from '../../../../_redux/features/parametres/posteDeTravailSlice';
import { createUtilisateur, updateUtilisateur } from '../../../../services/utilisateurs/utilisateurAPI';
import { createUtilisateurSlice, updateUtilisateurSlice } from '../../../../_redux/features/utilisateurs/utilisateurSlice';
import { roles } from '../../../../config';
import { formatDateForInput, formatDateTimeForInput, formatDateWithLang } from '../../../../fonctions/fonction';


function FormCreateUpdate({ utilisateur }: { utilisateur: Utilisateur | null }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { loading, error, regions, structures, grades, familleMetiers } = useUserFormData(lang);
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
    const [filteredServices, setFilteredServices]=useState<Service[]>([])
    const [filteredPosteDeTravails, setFilteredPosteDeTravails]=useState<PosteDeTravail[]>([])
    const [filteredCategorieProfessionnelles, setFilteredCategorieProfessionnelles]=useState<CategorieProfessionnelle[]>([])

    const dispatch = useDispatch();
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [genre, setGenre] = useState("");
    const [dateNaissance, setDateNaissance] = useState("");
    const [lieuNaissance, setLieuNaissance] = useState("");
    const [email, setEmail] = useState("");
    const [matricule, setMatricule] = useState("");
    const [role, setRole] = useState(""); 
    const [telephone, setTelephone] = useState("");
    const [grade, setGrade] = useState<Grade>();
    const [categorie, setCategorie] = useState<CategorieProfessionnelle>();
    const [familleMetier, setFamilleMetier] = useState<FamilleMetier>();
    const [posteDeTravail, setPosteDeTravail] = useState<PosteDeTravail>();
    const [structure, setStructure] = useState<Structure>();
    const [service, setService] = useState<Service>();
    const [region, setRegion] = useState<Region>();
    const [departement, setDepartement] = useState<Departement>();
    const [commune, setCommune] = useState<Commune>();
    const [dateEntreeEnService, setDateEntreeEnService] = useState("");

    const [errorNom, setErrorNom] = useState("");
    const [errorRole, setErrorRole] = useState("");
    const [errorGenre, setErrorGenre] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        if (utilisateur) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.utilisateur'));
            setNom(utilisateur.nom);
            setPrenom(utilisateur?.prenom || ""); 
            setGenre(utilisateur.genre);
            setDateNaissance(formatDateForInput(utilisateur.dateNaissance) || "");
            setLieuNaissance(utilisateur.lieuNaissance || "");
            setRole(utilisateur.role)
            setEmail(utilisateur.email);
            setMatricule(utilisateur?.matricule || "");
            setTelephone(utilisateur?.telephone || "");
            setGrade(utilisateur?.categorieProfessionnelle?.grade || undefined);
            setCategorie(utilisateur?.categorieProfessionnelle || undefined);
            setFamilleMetier(utilisateur?.posteDeTravail?.familleMetier || undefined);
            setPosteDeTravail(utilisateur?.posteDeTravail || undefined);
            setStructure(utilisateur?.service?.structure || undefined);
            setService(utilisateur?.service || undefined);
            setRegion(utilisateur?.commune?.departement?.region || undefined);
            setDepartement(utilisateur?.commune?.departement || undefined);
            setCommune(utilisateur?.commune || undefined);
            setDateEntreeEnService(formatDateForInput(utilisateur.dateEntreeEnService) || "");
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.utilisateur'));
            setNom("");
            setPrenom("");
            setGenre("");
            setDateNaissance("");
            setLieuNaissance("");
            setEmail("");
            setMatricule("");
            setTelephone("");
            setGrade(undefined);
            setCategorie(undefined);
            setFamilleMetier(undefined);
            setPosteDeTravail(undefined);
            setStructure(undefined);
            setService(undefined);
            setRegion(undefined);
            setDepartement(undefined);
            setCommune(undefined);
            setDateEntreeEnService("");
        }


        if (isFirstRender) {
            setErrorNom("");
            setErrorGenre("");
            setErrorEmail("");
            setIsFirstRender(false);
        }
    }, [utilisateur, isFirstRender, t]);

    const closeModal = () => {
        setErrorNom("");
        setErrorGenre("");
        setErrorEmail("");
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
        if (structure && structure._id) {
            getServicesForDropDownByStructure({ structureId: structure._id, lang }).then((data) =>
                setFilteredServices(data.services)
            );
        }
    }, [structure]);

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

    useEffect(() => {
        if (grade && grade._id) {
            getCategorieProfessionnellesForDropDown({ gradeId: grade._id, lang }).then((data) =>   
                setFilteredCategorieProfessionnelles(data.categorieProfessionnelles)
            );
        }
    }, [grade]);

    useEffect(() => {
        if (familleMetier && familleMetier._id) {
            getPosteDeTravailForDropDown({ familleMetierId: familleMetier._id, lang }).then((data) =>
                setFilteredPosteDeTravails(data.posteDeTravails)
            );
        }
    }, [familleMetier]);


    const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = e.target.value;
        setRole(selected)

    }
        
    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGradeNom = e.target.value;
        var selectedGrade = null;

        if (lang === 'fr') {
            selectedGrade = grades.find(grade => grade.nomFr === selectedGradeNom);
        }
        else {
            selectedGrade = grades.find(grade => grade.nomEn === selectedGradeNom);
        }
        
        if (selectedGrade) {
            setGrade(selectedGrade);
        }
    };

    const handleCategorieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategorieNom = e.target.value;
        var selectedCategorie = null;

        if (lang === 'fr') {
            selectedCategorie = filteredCategorieProfessionnelles.find(categorie => categorie.nomFr === selectedCategorieNom);
        }
        else {
            selectedCategorie = filteredCategorieProfessionnelles.find(categorie => categorie.nomEn === selectedCategorieNom);
        }

        if (selectedCategorie) {
            setCategorie(selectedCategorie);
        }
    }

    const handleStructureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStructureNom = e.target.value;
        var selectedStructure = null;

        if(!selectedStructureNom){
            setStructure(undefined);
            setFilteredServices([]);
            setService(undefined)
            return;
        }

        if (lang === 'fr') {
            selectedStructure = structures.find(structure => structure.nomFr === selectedStructureNom);
        }
        else {
            selectedStructure = structures.find(structure => structure.nomEn === selectedStructureNom);
        }
       


        if (selectedStructure) {
            setStructure(selectedStructure);
        }
    }
    
    const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedServiceNom = e.target.value;
        var selectedService = null;

        if(!selectedServiceNom){
            setService(undefined)
            return;
        }

        if (lang === 'fr') {
            selectedService = filteredServices.find(service => service.nomFr === selectedServiceNom);
        }
        else {
            selectedService = filteredServices.find(service => service.nomEn === selectedServiceNom);
        }


        if (selectedService) {
            setService(selectedService);
        }
    }

    const handleFamilleMetierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFamilleMetierNom = e.target.value;
        var selectedFamilleMetier = null;

        if(!selectedFamilleMetierNom){
            setFamilleMetier(undefined);
            setFilteredPosteDeTravails([]);
            setPosteDeTravail(undefined)
            return;
        } 
        if (lang === 'fr') {
            selectedFamilleMetier = familleMetiers.find(familleMetier => familleMetier.nomFr === selectedFamilleMetierNom);
        }else {
            selectedFamilleMetier = familleMetiers.find(familleMetier => familleMetier.nomEn === selectedFamilleMetierNom);
        }

        if (selectedFamilleMetier) {
            setFamilleMetier(selectedFamilleMetier);
        }
    };

    const handlePosteDeTavailChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPosteDeTravailNom = e.target.value;
        var selectedPosteDeTravail = null;

        if(!selectedPosteDeTravailNom){
            setPosteDeTravail(undefined)
            return;
        } 
        if (lang === 'fr') {
            selectedPosteDeTravail = filteredPosteDeTravails.find(posteDeTavail => posteDeTavail.nomFr === selectedPosteDeTravailNom);
        }else {
            selectedPosteDeTravail = filteredPosteDeTravails.find(posteDeTavail => posteDeTavail.nomEn === selectedPosteDeTravailNom);
        }

        if (selectedPosteDeTravail) {
            setPosteDeTravail(selectedPosteDeTravail);
        }
    };

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


    const handleCreateUtilisateur = async () => {
        if (!nom || !genre || !email) {
            if (!nom) {
                setErrorNom(t('error.nom'));
            }
            if (!genre) {
                setErrorGenre(t('error.genre'));
            }

            if (!email) {
                setErrorEmail(t('error.email'));
            }

            if(!role){
                setErrorRole(t('error.role'));
            }

            return;
        }
        if (!validateEmail()) {
            return;
        }

        if (!utilisateur) {
            await createUtilisateur(
                {
                    matricule,
                    nom,
                    prenom,
                    email,
                    genre,
                    role,
                    telephone,
                    dateNaissance,
                    lieuNaissance,
                    dateEntreeEnService,
                    photoDeProfil:"",
                    service,
                    categorieProfessionnelle:categorie,
                    posteDeTravail,
                    commune,
                    actif:true,
                }, lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createUtilisateurSlice({

                        utilisateur: {
                            _id: e.data._id,
                            nom: e.data.nom,
                            genre: e.data.genre,
                            email: e.data.email,
                            photoDeProfil: e.data.photoDeProfil,
                            matricule: e.data.matricule,
                            telephone: e.data.telephone,
                            prenom: e.data.prenom,
                            dateNaissance: e.data.dateNaissance,
                            lieuNaissance: e.data.lieuNaissance,
                            dateEntreeEnService: e.data.dateEntreeEnService,
                            categorieProfessionnelle: categorie,
                            posteDeTravail: posteDeTravail,
                            service: service,
                            commune: commune,
                            role: e.data.role,
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

        } else {
            await updateUtilisateur(
                {
                    _id: utilisateur._id,
                    matricule,
                    nom,
                    prenom,
                    email,
                    genre,
                    role,
                    telephone,
                    dateNaissance,
                    lieuNaissance,
                    dateEntreeEnService,
                    photoDeProfil:"",
                    service,
                    categorieProfessionnelle:categorie,
                    posteDeTravail,
                    commune,
                    actif:true,
                }, lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        dispatch(updateUtilisateurSlice({
                            id: e.data._id,
                            utilisateurData: {
                                _id: e.data._id,
                                nom: e.data.nom,
                                genre: e.data.genre,
                                email: e.data.email,
                                photoDeProfil: e.data.photoDeProfil,
                                matricule: e.data.matricule,
                                telephone: e.data.telephone,
                                prenom: e.data.prenom,
                                dateNaissance: e.data.dateNaissance,
                                lieuNaissance: e.data.lieuNaissance,
                                dateEntreeEnService: e.data.dateEntreeEnService,
                                categorieProfessionnelle: categorie,
                                posteDeTravail: posteDeTravail,
                                service: service,
                                commune: commune,
                                role: e.data.role,
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
                handleConfirm={handleCreateUtilisateur}
            >
                <label>{t('label.matricule')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                />
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
                <label>{t('label.telephone')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={telephone}
                    onChange={(e) => { setTelephone(e.target.value) }}
                />
                <label>{t('label.email')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="e-mail"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorEmail(""); }}
                />
                {errorEmail && <p className="text-red-500">{errorEmail}</p>}
                
                <label>{t('label.role')}</label><label className="text-red-500"> *</label>
                <select
                    value={role? role : t('select_par_defaut.selectionnez') + t('select_par_defaut.role')}
                    onChange={handleRoleChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.role')}</option>
                    {roles.map((role, index) => (
                        <option key={index} value={role}>{role}</option>
                    ))}
                </select>
                {errorRole && <p className="text-red-500">{errorRole}</p>}

                <label>{t('label.structure')}</label>
                <select
                    value={structure ? (lang === 'fr' ? structure.nomFr : structure.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.structure')}
                    onChange={handleStructureChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.structure')}</option>
                    {structures.map(structure => (
                        <option key={structure._id} value={(lang === 'fr' ? structure.nomFr : structure.nomEn)}>{(lang === 'fr' ? structure.nomFr : structure.nomEn)}</option>
                    ))}
                </select>

                <label>{t('label.service')}</label>
                <select
                    value={service ? (lang === 'fr' ? service.nomFr : service.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.service')}
                    onChange={handleServiceChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.service')}</option>
                    {filteredServices.map(service => (
                        <option key={service._id} value={(lang === 'fr' ? service.nomFr : service.nomEn)}>{(lang === 'fr' ? service.nomFr : service.nomEn)}</option>
                    ))}
                </select>

                <label>{t('label.grade')}</label>
                <select
                    value={grade ? (lang === 'fr' ? grade.nomFr : grade.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.grade')}
                    onChange={handleGradeChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.grade')}</option>
                    {grades.map(grade => (
                        <option key={grade._id} value={(lang === 'fr' ? grade.nomFr : grade.nomEn)}>{(lang === 'fr' ? grade.nomFr : grade.nomEn)}</option>
                    ))}
                </select>

                <label>{t('label.categorie_professionnelle')}</label>
                <select
                    value={categorie ? (lang === 'fr' ? categorie.nomFr : categorie.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.categorie_professionnelle')}
                    onChange={handleCategorieChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.categorie_professionnelle')}</option>
                    {filteredCategorieProfessionnelles.map(categorie => (
                        <option key={categorie._id} value={(lang === 'fr' ? categorie.nomFr : categorie.nomEn)}>{(lang === 'fr' ? categorie.nomFr : categorie.nomEn)}</option>
                    ))}
                </select>

                <label>{t('label.famille_metier')}</label>
                <select
                    value={familleMetier ? (lang === 'fr' ? familleMetier.nomFr : familleMetier.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.famille_metier')}
                    onChange={handleFamilleMetierChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.famille_metier')}</option>
                    {familleMetiers.map(familleMetier => (
                        <option key={familleMetier._id} value={(lang === 'fr' ? familleMetier.nomFr : familleMetier.nomEn)}>{(lang === 'fr' ? familleMetier.nomFr : familleMetier.nomEn)}</option>
                    ))}
                </select>


                 <label>{t('label.poste_de_travail')}</label>
                <select
                    value={posteDeTravail ? (lang === 'fr' ? posteDeTravail.nomFr : posteDeTravail.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.posteDeTravail')}
                    onChange={handlePosteDeTavailChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.poste_de_travail')}</option>
                    {filteredPosteDeTravails.map(posteDeTravail => (
                        <option key={posteDeTravail._id} value={(lang === 'fr' ? posteDeTravail.nomFr : posteDeTravail.nomEn)}>{(lang === 'fr' ? posteDeTravail.nomFr : posteDeTravail.nomEn)}</option>
                    ))}
                </select>
                
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
                <label>{t('label.date_entree_service')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateEntreeEnService}
                    onChange={(e) => { setDateEntreeEnService(e.target.value) }}
                />
            </CustomDialogModal>

        </>
    );
}



export default FormCreateUpdate;

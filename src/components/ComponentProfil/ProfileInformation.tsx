import { ReactNode, useEffect, useState } from "react";
import { GoPerson } from "react-icons/go";
import { MdOutlinePhone } from "react-icons/md";
import { MdOutlineMail } from "react-icons/md";
import { RiMapPin2Fill } from "react-icons/ri";

import { FaBirthdayCake } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";
import CustomModal from "../Modals/CustomDialogModal";
import { formatDateForInput } from "../../fonctions/fonction";
import { getPosteDeTravailForDropDown } from "../../services/settings/posteDeTravailAPI";
import { getCategorieProfessionnellesForDropDown } from "../../services/settings/categorieProfessionnelleAPI";
import { getCommunesForDropDown } from "../../services/settings/communeAPI";
import { getDepartementsForDropDown } from "../../services/settings/departementAPI";
import { getServicesForDropDownByStructure } from "../../services/settings/serviceAPI";
import { updateUtilisateur } from "../../services/utilisateurs/utilisateurAPI";
import { updateUtilisateurSlice } from "../../_redux/features/utilisateurs/utilisateurSlice";

interface Props {
    icone: ReactNode; // Type de la variable icone
}

function IconeInput({ icone }: Props) {
    return (
        <div className="absolute left-4.5 top-4 text-[22px]">
            <div className="fill-current">
                {icone}
            </div>
        </div>
    );
}


interface LabelInputProps {
    title: string;
    required?: boolean;
}

function LabelInput({ title, required }: LabelInputProps) {
    return (
        <label
            className="mb-3 block text-sm font-medium text-black dark:text-white"
            htmlFor="fullName"
        >
            {title}{required ? <label className="text-red-500"> *</label> : ""}
        </label>
    );
}





function ProfileInformation({currentUser}:{currentUser:Utilisateur}) {

    const dataUserIsLoading = useSelector((state: RootState) => state.utilisateurSlice.utilisateur.nom);
    const [loading, setLoading] = useState<boolean>(false);
    const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
    // const currentUser: Utilisateur = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);
    const {data:{regions}} = useSelector((state: RootState) => state.regionSlice)
    const {data:{structures}} = useSelector((state: RootState) => state.structureSlice)
    const {data:{grades}}= useSelector((state: RootState) => state.gradeSlice)
    const {data:{familleMetiers}} = useSelector((state: RootState) => state.familleMetierSlice)
    
    const [filteredDepartements, setFilteredDepartements]=useState<Departement[]>([])
    const [filteredCommunes, setFilteredCommunes]=useState<Commune[]>([])
    const [filteredServices, setFilteredServices]=useState<Service[]>([])
    const [filteredPosteDeTravails, setFilteredPosteDeTravails]=useState<PosteDeTravail[]>([])
    const [filteredCategorieProfessionnelles, setFilteredCategorieProfessionnelles]=useState<CategorieProfessionnelle[]>([])

   
    const { t } = useTranslation();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const dispatch = useDispatch();
    

    // filtrer les donnee a partir de l'id de la region selectionner






    useEffect(() => {

        setNom(currentUser.nom);
        setPrenom(currentUser?.prenom || ""); 
        setGenre(currentUser.genre);
        setDateNaiss(formatDateForInput(currentUser.dateNaissance) || "");
        setLieuNaiss(currentUser.lieuNaissance || "");
        
        setEmail(currentUser.email);
        setMatricule(currentUser?.matricule || "");
        setTelephone(currentUser?.telephone || "");
        setGrade(currentUser?.grade || undefined);
        setCategorie(currentUser?.categorieProfessionnelle || undefined);
        setFamilleMetier(currentUser?.familleMetier || undefined);
        setPosteDeTravail(currentUser?.posteDeTravail || undefined);
        setStructure(currentUser?.service?.structure || undefined);
        setService(currentUser?.service || undefined);
        setRegion(currentUser?.commune?.departement?.region || undefined);
        setDepartement(currentUser?.commune?.departement || undefined);
        setCommune(currentUser?.commune || undefined);
        setDateEntreeAdmin(formatDateForInput(currentUser.dateEntreeEnService) || "");
                   
               
    }, [currentUser, lang]);
    const [matricule, setMatricule] = useState("");
    const [nationalite, setNationalite] = useState("");
    const [diplomeEntre, setDiplomeEntre] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [telephone, setTelephone] = useState("");
    const [genre, setGenre] = useState("");
    const [dateNaiss, setDateNaiss] = useState("");
    const [lieuNaiss, setLieuNaiss] = useState("");
     const [grade, setGrade] = useState<Grade>();
    const [categorie, setCategorie] = useState<CategorieProfessionnelle>();
    const [familleMetier, setFamilleMetier] = useState<FamilleMetier>();
    const [posteDeTravail, setPosteDeTravail] = useState<PosteDeTravail>();
    const [structure, setStructure] = useState<Structure>();
    const [service, setService] = useState<Service>();
    const [region, setRegion] = useState<Region>();
    const [departement, setDepartement] = useState<Departement>();
    const [commune, setCommune] = useState<Commune>();
    const [dateEntreeAdmin, setDateEntreeAdmin] = useState("");
    const [photoProfil, setPhotoProfil] = useState("");

    // erreur
    const [errorNom, setErrorNom] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorGenre, setErrorGenre] = useState("");



    



    const validateEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setErrorEmail(t('error.incorrect_email'));
            return false;
        }
        setErrorEmail("");
        return true;
    };

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

    

    const handleUpdateProfil = async () => {
        // Vérification des champs obligatoires
        if (!nom || !genre || !email) {
            if (!nom) {
                setErrorNom(t('error.nom'));
            } else {
                setErrorNom("");
            }
            if (!genre) {
                setErrorGenre(t('error.genre'));
            } else {
                setErrorGenre("");
            }

            if (!email) {
                setErrorEmail(t('error.email'));
            } else {
                setErrorEmail("");
            }

            return;
        }
        if (!validateEmail()) {
            return;
        }

        setLoading(true);
        await updateUtilisateur(
        {
            _id: currentUser._id,
            matricule,
            nom,
            prenom,
            email,
            genre,
            role:currentUser.role,
            telephone,
            dateNaissance:dateNaiss,
            lieuNaissance:lieuNaiss,
            dateEntreeEnService:dateEntreeAdmin,
            photoDeProfil:"",
            service,
            categorieProfessionnelle:categorie,
            posteDeTravail,
            grade,
            familleMetier,
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
                        grade:grade,
                        familleMetier:familleMetier,
                        role: e.data.role,
                        actif: e.data.actif
                    }

                }));


            } else {
                createToast(e.message, '', 2);

            }
        }).catch((e) => {
            createToast(e.response.data.message, '', 2);
        }).finally(()=>{
            setLoading(false)
        })
        



    }


    return (
        <div className="col-span-5 xl:col-span-3 ">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ">
                <div className="border-b border-stroke py-4 px-7 dark:border-strokedark felx">
                    <h3 className="font-medium text-black dark:text-white flex">
                        {t('label.info_pers')}
                        {/* <h1 className="text-bold text-meta-1 ml-10">{haveChanged ? 'true' : 'false'}</h1> */}
                    </h3>
                </div>
                <div className="px-7 py-7 lg:py-[30px] ">
                    {
                        dataUserIsLoading === '' ?
                            <div className="w-full flex justify-center my-10">
                                <div className=" my-10 h-10 w-10 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>
                            </div> :
                            <>
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                                    {/* matricule */}
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.matricule')} />

                                        <div className="relative">
                                            <input
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                type="text"
                                                value={matricule}
                                                onChange={(e) => setMatricule(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {/* Date entrée admin */}
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.date_entree_service')} />

                                        <div className="relative">
                                            <input
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                type="date"
                                                value={dateEntreeAdmin}
                                                onChange={(e) => { setDateEntreeAdmin(e.target.value) }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    {/* NOM */}
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.nom')} required={true} />

                                        <div className="relative">
                                            <IconeInput icone={<GoPerson />} />

                                            <input
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                type="text"
                                                value={nom}
                                                onChange={(e) => { setNom(e.target.value); setErrorNom("") }} // Suppression du setNom("") dans onChange
                                            />
                                        </div>
                                        {errorNom && <p className="text-red-500 pt-2 text-sm " >{errorNom}</p>}
                                    </div>



                                    {/* PRENOM */}
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.prenom')} />

                                        <div className="relative">
                                            <IconeInput icone={<GoPerson />} />

                                            <input
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                type="text"
                                                value={prenom}
                                                onChange={(e) => setPrenom(e.target.value)} // Suppression du setNom("") dans onChange
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    {/* Telephone */}
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.telephone')} />
                                        <div className="relative">
                                            <IconeInput icone={<MdOutlinePhone />} />
                                            <input
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                type="phone"
                                                value={telephone}
                                                onChange={(e) => { setTelephone(e.target.value); }}
                                            />
                                        </div>
                                    </div>



                                    {/* E-mail */}
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.email')} required={true} />

                                        <div className="relative">
                                            <IconeInput icone={<MdOutlineMail />} />

                                            <input
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                type="email"
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value); setErrorEmail("") }}
                                            />
                                        </div>
                                        {errorEmail && <p className="text-red-500 pt-2 text-sm " >{errorEmail}</p>}
                                    </div>
                                </div>

                                {/* genre */}
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.genre')} required={true} />

                                        <div className="relative">
                                            {/* <IconeInput icone={<MdOutlineMail />} /> */}
                                            <div className="">
                                                <input
                                                    className='radio-label-space'
                                                    type="radio"
                                                    id={t('label.homme')}
                                                    name="genre"
                                                    value={t('label.homme')}
                                                    checked={genre === "M"}
                                                    onChange={() => { setGenre("M"); setErrorGenre("") }}
                                                />
                                                <label htmlFor={t('label.homme')} className='radio-intern-space font-semibold'>{t('label.homme')}</label>

                                                <input
                                                    className='radio-label-space'
                                                    type="radio"
                                                    id={t('label.femme')}
                                                    name="genre"
                                                    value={t('label.femme')}
                                                    checked={genre === "F"}
                                                    onChange={() => { setGenre("F"); setErrorGenre("") }}
                                                />
                                                <label className="font-semibold" htmlFor={t('label.femme')}>{t('label.femme')}</label>
                                            </div>
                                        </div>
                                        {errorGenre && <p className="text-red-500 pt-2 text-sm " >{errorGenre}</p>}
                                    </div>
                                    {/* Date de naissance */}
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.date_naissance')} />

                                        <div className="relative">
                                            <IconeInput icone={<FaBirthdayCake />} />
                                            <  input
                                                className=" py-3 pl-13  w-full rounded border border-stroke bg-gray pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                type="date"
                                                value={dateNaiss}
                                                onChange={(e) => setDateNaiss(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    {/* lieu de naissance */}
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.lieu_naissance')} />

                                        <div className="relative">
                                            <IconeInput icone={<RiMapPin2Fill />} />

                                            <input
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                type="text"
                                                value={lieuNaiss}
                                                onChange={(e) => { setLieuNaiss(e.target.value); }}
                                            />
                                        </div>
                                    </div>
                                    
                                </div>
                                
                            </>
                    }                     
                            
                    <>
                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                            {/* Strucuture */}
                            <div className="w-full sm:w-1/2">
                                <LabelInput title={t('label.structure')} />

                                <div className="relative">
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
                                </div>
                            </div>
                            {/* Service */}
                            <div className="w-full sm:w-1/2">
                                <LabelInput title={t('label.service')} />

                                <div className="relative">
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
                                </div>
                            </div>
                        </div>
                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                            {/* Grade */}
                            <div className="w-full sm:w-1/2">
                                <LabelInput title={t('label.grade')} />

                                <div className="relative">
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
                                </div>
                            </div>
                            {/* Catégorie */}
                            <div className="w-full sm:w-1/2">
                                <LabelInput title={t('label.categorie_professionnelle')} />

                                <div className="relative">
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
                                </div>
                            </div>
                        </div>
                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">                            
                           
                            {/* famille metier */}
                            <div className="w-full sm:w-1/2">
                                <LabelInput title={t('label.famille_metier')} />

                                <div className="relative">
                                    <select
                                        value={familleMetier ? (lang === 'fr' ? familleMetier.nomFr : familleMetier.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.famille_metier')}
                                        onChange={handleServiceChange}
                                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    >
                                        <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.famille_metier')}</option>
                                        {familleMetiers.map(familleMetier => (
                                            <option key={familleMetier._id} value={(lang === 'fr' ? familleMetier.nomFr : familleMetier.nomEn)}>{(lang === 'fr' ? familleMetier.nomFr : familleMetier.nomEn)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="w-full sm:w-1/2">
                                <LabelInput title={t('label.poste_de_travail')} />

                                <div className="relative">
                                    <select
                                        value={posteDeTravail ? (lang === 'fr' ? posteDeTravail.nomFr : posteDeTravail.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.poste_de_travail')}
                                        onChange={handlePosteDeTavailChange}
                                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    >
                                        <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.poste_de_travail')}</option>
                                        {filteredPosteDeTravails.map(poste => (
                                            <option key={poste._id} value={(lang === 'fr' ? poste.nomFr : poste.nomEn)}>{(lang === 'fr' ? poste.nomFr : poste.nomEn)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                            {/* Région */}
                            <div className="w-full sm:w-1/3">
                                <LabelInput title={t('label.region')} />

                                <div className="relative">
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
                                </div>
                            </div>
                            {/* Département */}
                            <div className="w-full sm:w-1/3">
                                <LabelInput title={t('label.departement')} />

                                <div className="relative">
                                    <select
                                        value={departement ? (lang === 'fr' ? departement.nomFr : departement.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}
                                        onChange={handleDepartementChange}
                                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    >
                                        <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}</option>
                                        {filteredDepartements && filteredDepartements.map(departement => (
                                            <option key={departement._id} value={(lang === 'fr' ? departement.nomFr : departement.nomEn)}>{(lang === 'fr' ? departement.nomFr : departement.nomEn)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {/* Commune */}
                            <div className="w-full sm:w-1/3">
                                <LabelInput title={t('label.commune')} />

                                <div className="relative">
                                    <select
                                        value={commune ? (lang === 'fr' ? commune.nomFr : commune.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.commune')}
                                        onChange={handleCommuneChange}
                                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                    >
                                        <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.commune')}</option>
                                        {filteredCommunes && filteredCommunes.map(commune => (
                                            <option key={commune._id} value={(lang === 'fr' ? commune.nomFr : commune.nomEn)}>{(lang === 'fr' ? commune.nomFr : commune.nomEn)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>



                        
                    </>

                    

                    {/* bouton valider !! */}
                    <div className="flex justify-center pt-0 gap-2.5  ">
                        <button
                            className="text-sm mt-8 flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                            onClick={() => {setOpenModalConfirm(true) }
                            } >
                            {t('boutton.mettre_a_jour_info')}
                        </button>


                    </div>


                </div>
            </div>




            <CustomModal
                isLoading={loading}
                title={'Confirmation'}
                isModalOpen={openModalConfirm}
                isDelete={false}
                closeModal={() => { setOpenModalConfirm(false) }}
                handleConfirm={handleUpdateProfil}
            >
                <p>{lang === 'fr' ? 'Confirmer la modification' : 'Confirm the modification'}</p>
            </CustomModal>

        </div >
    )
}



export default ProfileInformation





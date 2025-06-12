import { ReactNode, useEffect, useState } from "react";
import { GoPerson } from "react-icons/go";
import { Commune } from "../../pages/Parametres/Communes";
import { MdOutlinePhone } from "react-icons/md";
import { MdOutlineMail } from "react-icons/md";
import { RiMapPin2Fill } from "react-icons/ri";

import { FaBirthdayCake } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import { setMinimumUser, setUser, updateUser } from "../../_redux/features/user_slice";
import createToast from "../../hooks/toastify";
import CustomModal from "../Modals/CustomDialogModal";
import { compareDates } from "../../fonctions/fonction";
import { config } from "../../config";

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





function ProfileInformation() {

    const settingIsLoading = useSelector((state: RootState) => state.dataSetting.loading);
    const dataUserIsLoading = useSelector((state: RootState) => state.user.nom);
    const roles = config.roles;
    const [haveChanged, setHaveChanged] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [openModalConfirm, setOpenModalConfirm] = useState<boolean>(false);
    const userState: Utilisateur = useSelector((state: RootState) => state.user);


    const regions: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.regions) ?? [];
    const departements: DepartementProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.departements) ?? [];
    const communes: CommuneProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.communes) ?? [];
    const grades: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.grades) ?? [];
    const fonctions: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.fonctions) ?? [];
    const categories: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.categories) ?? [];
    const services: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.services) ?? [];
    const specialites: CommonSettingProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.specialites) ?? [];
    const { t } = useTranslation();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const dispatch = useDispatch();
    const [filteredDepartement, setFilteredDepartement] = useState<DepartementProps[] | undefined>([]);
    const [filteredCommune, setFilteredCommune] = useState<CommuneProps[] | undefined>([]);

    // filtrer les donnee a partir de l'id de la region selectionner






    useEffect(() => {

        const currentCommune = communes.find(commune => commune._id === "" + userState.commune);
        const currentDepartement = currentCommune && departements.find(departement => departement._id === "" + currentCommune.departement);
        const currentRegion = currentDepartement && regions.find(region => region._id === "" + currentDepartement.region);
        currentRegion && filterDepartementByRegion(currentRegion._id);
        currentDepartement && filterCommuneByDepartement(currentDepartement._id)
        setNom(userState.nom);
        setPrenom(userState.prenom ? userState.prenom : ""); setGenre(userState.genre);
        setDateNaiss(userState.date_naiss ? userState.date_naiss.split("T")[0] : "");
        setLieuNaiss(userState.lieu_naiss ? userState.lieu_naiss : "");
        setGenre(userState.genre);
        setEmail(userState.email);
        setContact(userState.contact ? userState.contact : "");
        setMatricule(userState.matricule ? userState.matricule : "");
        setNationalite(userState.nationalite ? userState.nationalite : "");
        setDiplomeEntre(userState.diplomeEntre ? userState.diplomeEntre : "");
        setGrade(userState.grade ? grades.find(grade => grade._id === userState.grade) : undefined);
        setCategorie(userState.categorie ? categories.find(categorie => categorie._id === userState.categorie) : undefined);
        setFonction(userState.fonction ? fonctions.find(fonction => fonction._id === userState.fonction) : undefined);
        setService(userState.service ? services.find(service => service._id === userState.service) : undefined);
        setSpecialite(userState.specialite ? specialites.find(specialite => specialite._id === userState.specialite) : undefined);
        setRegion(currentRegion);
        setDepartement(currentDepartement);
        setCommune(currentCommune);
        setDateEntreeAdmin(userState.date_entree ? userState.date_entree : "");
        setPhotoProfil(userState.photo_profil ?? "");
    }, [userState, regions,
        departements,
        communes,
        grades,
        fonctions,
        categories,
        services]);
    const [matricule, setMatricule] = useState("");
    const [nationalite, setNationalite] = useState("");
    const [diplomeEntre, setDiplomeEntre] = useState("");
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [genre, setGenre] = useState("");
    const [dateNaiss, setDateNaiss] = useState("");
    const [lieuNaiss, setLieuNaiss] = useState("");
    const [grade, setGrade] = useState<CommonSettingProps>();
    const [service, setService] = useState<CommonSettingProps>();
    const [specialite, setSpecialite] = useState<CommonSettingProps>();
    const [fonction, setFonction] = useState<CommonSettingProps>();
    const [categorie, setCategorie] = useState<CommonSettingProps>();
    const [region, setRegion] = useState<CommonSettingProps>();
    const [departement, setDepartement] = useState<DepartementProps>();
    const [commune, setCommune] = useState<CommuneProps>();
    const [dateEntreeAdmin, setDateEntreeAdmin] = useState("");
    const [photoProfil, setPhotoProfil] = useState("");

    // erreur
    const [errorNom, setErrorNom] = useState("");
    const [errorEmail, setErrorEmail] = useState("");
    const [errorGenre, setErrorGenre] = useState("");



    // verifier que au moins un element de l'app a ete modifier avant de pouvoir faire un update
    // Vérifier si au moins un champ a été modifié avant de pouvoir effectuer une mise à jour
    useEffect(() => {
        const isDateEntree = userState.date_entree !== null && compareDates(userState.date_entree, dateEntreeAdmin);
        const isDateNaissModified = userState.date_naiss !== null && compareDates(userState.date_naiss, dateNaiss);

        const isModified =
            userState.matricule !== matricule ||
            userState.nationalite !== nationalite ||
            userState.diplomeEntre !== diplomeEntre ||
            !isDateEntree ||
            userState.nom !== nom ||
            userState.prenom !== prenom ||
            userState.contact !== contact ||
            userState.email !== email ||
            userState.genre !== genre ||
            userState.lieu_naiss !== lieuNaiss ||
            !isDateNaissModified ||
            userState.grade && userState.grade != grade?._id ||
            userState.categorie && userState.categorie != categorie?._id ||
            userState.fonction && userState.fonction != fonction?._id ||
            userState.service && userState.service != service?._id ||
            userState.specialite && userState.specialite != specialite?._id ||
            // userState.region && userState.region != region?._id ||
            // userState.departement && userState.departement != departement?._id ||
            userState.commune && userState.commune != commune?._id
            ;
        if (isModified) {
            setHaveChanged(true)
        }
        else {
            setHaveChanged(false);
        }
    }, [matricule, nationalite, diplomeEntre, specialite, dateEntreeAdmin, nom, prenom, email, contact, genre, dateNaiss, lieuNaiss,
        grade, categorie, fonction, service, region, departement, commune,

        regions,
        departements,
        communes,
        grades,
        fonctions,
        categories,
        services,
        specialites
    ]);



    const validateEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setErrorEmail(t('error.incorrect_email'));
            return false;
        }
        setErrorEmail("");
        return true;
    };

    const handleFonctionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFonctionLibelle = e.target.value;
        var selectedFonction = null;

        if (lang === 'fr') {
            selectedFonction = fonctions.find(fonction => fonction.libelleFr === selectedFonctionLibelle);

        }
        else {
            selectedFonction = fonctions.find(fonction => fonction.libelleEn === selectedFonctionLibelle);

        }


        if (selectedFonction) {
            setFonction(selectedFonction);
        }
    };

    const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedGradeLibelle = e.target.value;
        var selectedGrade = null;

        if (lang === 'fr') {
            selectedGrade = grades.find(grade => grade.libelleFr === selectedGradeLibelle);

        }
        else {
            selectedGrade = grades.find(grade => grade.libelleEn === selectedGradeLibelle);

        }


        if (selectedGrade) {
            setGrade(selectedGrade);
        }
    };

    const handleCategorieChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategorieLibelle = e.target.value;
        var selectedCategorie = null;

        if (lang === 'fr') {
            selectedCategorie = categories.find(categorie => categorie.libelleFr === selectedCategorieLibelle);

        }
        else {
            selectedCategorie = categories.find(categorie => categorie.libelleEn === selectedCategorieLibelle);

        }


        if (selectedCategorie) {
            setCategorie(selectedCategorie);
        }
    };

    const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedServiceLibelle = e.target.value;
        var selectedService = null;

        if (lang === 'fr') {
            selectedService = services.find(service => service.libelleFr === selectedServiceLibelle);

        }
        else {
            selectedService = services.find(service => service.libelleEn === selectedServiceLibelle);

        }


        if (selectedService) {
            setService(selectedService);
        }
    };

    const handleSpecialiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSpecialiteLibelle = e.target.value;
        var selectedSpecialite = null;
    
        if (lang === 'fr') {
            selectedSpecialite = specialites.find(specialite => specialite.libelleFr === selectedSpecialiteLibelle);
    
        }
        else {
            selectedSpecialite = specialites.find(specialite => specialite.libelleEn === selectedSpecialiteLibelle);
    
        }
    
    
        if (selectedSpecialite) {
            setSpecialite(selectedSpecialite);
        }
    };

    // filtrer les donnee a partir de l'id de la region selectionner
    const filterDepartementByRegion = (regionId: string | undefined) => {
        if (regionId && regionId !== '') {
            // Filtrer les departements en fonction de l'ID de la region
            const result: DepartementProps[] = departements.filter(departement => "" + departement.region === regionId);

            setFilteredDepartement(result);

        }
    };

    // filtrer les donnee a partir de l'id du departement selectionner
    const filterCommuneByDepartement = (departementId: string | undefined) => {
        if (departementId && departementId !== '') {
            // Filtrer les departements en fonction de l'ID de la departement
            const result: CommuneProps[] = communes.filter(commune => "" + commune.departement === departementId);

            setFilteredCommune(result);
        }
    };

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRegionLibelle = e.target.value;
        var selectedRegion = null;

        if (lang === 'fr') {
            selectedRegion = regions.find(region => region.libelleFr === selectedRegionLibelle);

        }
        else {
            selectedRegion = regions.find(region => region.libelleEn === selectedRegionLibelle);

        }


        if (selectedRegion) {
            setRegion(selectedRegion);
            filterDepartementByRegion(selectedRegion._id);
        }
    };
    const handleDepartementChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedDepartementLibelle = e.target.value;
        var selectedDepartement = null;

        if (lang === 'fr') {
            selectedDepartement = departements.find(departement => departement.libelleFr === selectedDepartementLibelle);

        }
        else {
            selectedDepartement = departements.find(departement => departement.libelleEn === selectedDepartementLibelle);
        }

        if (selectedDepartement) {
            setDepartement(selectedDepartement);
            filterCommuneByDepartement(selectedDepartement._id);
        }
    };
    const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCommuneLibelle = e.target.value;
        var selectedCommune = null;

        if (lang === 'fr') {
            selectedCommune = filteredCommune && filteredCommune.find(commune => commune.libelleFr === selectedCommuneLibelle);

        }
        else {
            selectedCommune = filteredCommune && filteredCommune.find(commune => commune.libelleEn === selectedCommuneLibelle);

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

        // await apiUpdateEtudiant(
        //     {
        //         _id: userState._id,
        //         nom,
        //         genre,
        //         email,
        //         photo_profil: photoProfil,
        //         contact,
        //         matricule,
        //         nationalite,
        //         diplomeEntre,
        //         prenom,
        //         date_naiss: dateNaiss,
        //         lieu_naiss: lieuNaiss,
        //         date_entree: dateEntreeAdmin,
        //         niveaux: userState.niveaux,
        //         specialite: specialite?._id || null,
        //         categorie: categorie?._id || null,
        //         fonction: fonction?._id || null,
        //         service: service?._id || null,
        //         commune: commune?._id || null
        //     }
        // ).then((e: ReponseApiPros) => {
        //     if (e.success) {
        //         createToast(e.message[lang as keyof typeof e.message], '', 0);
        //         const userData: UserState = e.data;
        //         dispatch(setUser({ ...userData }));
        //         setOpenModalConfirm(false);
        //         setLoading(false);
        //         setHaveChanged(false);

        //     } else {
        //         createToast(e.message[lang as keyof typeof e.message], '', 2);
        //         setLoading(false);

        //     }
        // }).catch((e) => {
        //     createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
        //     setLoading(false);
        // })




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
                                        <LabelInput title={t('label.date_entree_admin')} />

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
                                    {/* Contact */}
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.contact')} />
                                        <div className="relative">
                                            <IconeInput icone={<MdOutlinePhone />} />
                                            <input
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                type="phone"
                                                value={contact}
                                                onChange={(e) => { setContact(e.target.value); }}
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
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.nationalite')} />
                                        <div className="relative">
                                            <input
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                type="text"
                                                value={nationalite}
                                                onChange={(e) => setNationalite(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    {/* Date de naissance */}
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.date_naiss')} />

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



                                    {/* lieu de naissance */}
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.lieu_naiss')} />

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
                                {/* {(userState.role.toString()===roles.etudiant.toString() || userState.role.toString()===roles.delegue.toString()) && (<div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row"> */}
                                { (<div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                                    {/* diplome */}
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.diplome')} />

                                        <div className="relative">
                                            <input
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                                type="text"
                                                value={diplomeEntre}
                                                onChange={(e) => setDiplomeEntre(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    {/* Specialite */}
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.specialite')} />

                                        <div className="relative">
                                            <select
                                                value={specialite ? (lang === 'fr' ? specialite.libelleFr : specialite.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.specialite')}
                                                onChange={handleSpecialiteChange}
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                            >
                                                <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.specialite')}</option>
                                                {specialites.map(specialite => (
                                                    <option key={specialite._id} value={(lang === 'fr' ? specialite.libelleFr : specialite.libelleEn)}>{(lang === 'fr' ? specialite.libelleFr : specialite.libelleEn)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>)}
                            </>
                    }

                    {/* {(userState.role.toString()===roles.superAdmin.toString() || userState.role.toString()===roles.admin.toString() || userState.role.toString()===roles.enseignant.toString()) && ( */}
                     {(userState.role.toString()===roles.superAdmin.toString() || userState.role.toString()===roles.admin.toString()) && (
                        settingIsLoading ?
                            <div className="w-full flex justify-center my-10">
                                <div className=" my-10 h-10 w-10 animate-spin rounded-full border-2 border-solid border-primary border-t-transparent"></div>

                            </div>
                            :
                            <>
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                                    {/* Grade */}
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.grade')} />

                                        <div className="relative">
                                            <select
                                                value={grade ? (lang === 'fr' ? grade.libelleFr : grade.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.grade')}
                                                onChange={handleGradeChange}
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                            >
                                                <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.grade')}</option>
                                                {grades.map(grade => (
                                                    <option key={grade._id} value={(lang === 'fr' ? grade.libelleFr : grade.libelleEn)}>{(lang === 'fr' ? grade.libelleFr : grade.libelleEn)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {/* Catégorie */}
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.categorie')} />

                                        <div className="relative">
                                            <select
                                                value={categorie ? (lang === 'fr' ? categorie.libelleFr : categorie.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.categorie')}
                                                onChange={handleCategorieChange}
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                            >
                                                <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.categorie')}</option>
                                                {categories.map(categorie => (
                                                    <option key={categorie._id} value={(lang === 'fr' ? categorie.libelleFr : categorie.libelleEn)}>{(lang === 'fr' ? categorie.libelleFr : categorie.libelleEn)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">

                                    {/* Fonction */}
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.fonction')} />

                                        <div className="relative">
                                            <select
                                                value={fonction ? (lang === 'fr' ? fonction.libelleFr : fonction.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.fonction')}
                                                onChange={handleFonctionChange}
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                            >
                                                <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.fonction')}</option>
                                                {fonctions.map(fonction => (
                                                    <option key={fonction._id} value={(lang === 'fr' ? fonction.libelleFr : fonction.libelleEn)}>{(lang === 'fr' ? fonction.libelleFr : fonction.libelleEn)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {/* Service */}
                                    <div className="w-full sm:w-1/2">
                                        <LabelInput title={t('label.service')} />

                                        <div className="relative">
                                            <select
                                                value={service ? (lang === 'fr' ? service.libelleFr : service.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.service')}
                                                onChange={handleServiceChange}
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                            >
                                                <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.service')}</option>
                                                {services.map(service => (
                                                    <option key={service._id} value={(lang === 'fr' ? service.libelleFr : service.libelleEn)}>{(lang === 'fr' ? service.libelleFr : service.libelleEn)}</option>
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
                                                value={region ? (lang === 'fr' ? region.libelleFr : region.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.region')}
                                                onChange={handleRegionChange}
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                            >
                                                <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.region')}</option>
                                                {regions.map(region => (
                                                    <option key={region._id} value={(lang === 'fr' ? region.libelleFr : region.libelleEn)}>{(lang === 'fr' ? region.libelleFr : region.libelleEn)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {/* Département */}
                                    <div className="w-full sm:w-1/3">
                                        <LabelInput title={t('label.departement')} />

                                        <div className="relative">
                                            <select
                                                value={departement ? (lang === 'fr' ? departement.libelleFr : departement.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}
                                                onChange={handleDepartementChange}
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                            >
                                                <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.departement')}</option>
                                                {filteredDepartement && filteredDepartement.map(departement => (
                                                    <option key={departement._id} value={(lang === 'fr' ? departement.libelleFr : departement.libelleEn)}>{(lang === 'fr' ? departement.libelleFr : departement.libelleEn)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {/* Commune */}
                                    <div className="w-full sm:w-1/3">
                                        <LabelInput title={t('label.commune')} />

                                        <div className="relative">
                                            <select
                                                value={commune ? (lang === 'fr' ? commune.libelleFr : commune.libelleEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.commune')}
                                                onChange={handleCommuneChange}
                                                className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                            >
                                                <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.commune')}</option>
                                                {filteredCommune && filteredCommune.map(commune => (
                                                    <option key={commune._id} value={(lang === 'fr' ? commune.libelleFr : commune.libelleEn)}>{(lang === 'fr' ? commune.libelleFr : commune.libelleEn)}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>



                                
                            </>)

                    }

                    {/* bouton valider !! */}
                    <div className="flex justify-center pt-0 gap-2.5  ">
                        <button
                            className="text-sm mt-8 flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                            onClick={() => {
                                if (haveChanged) {
                                    setOpenModalConfirm(true)
                                } else {
                                    createToast(lang === 'fr' ? "Aucune information n'a changé." : "No information has changed.", '', 1);
                                }

                            }


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





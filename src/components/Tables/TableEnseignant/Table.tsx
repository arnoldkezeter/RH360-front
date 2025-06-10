import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { useEffect, useRef, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";

import { RootState } from "../../../_redux/store"
import { config } from "../../../config"
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import { setErrorPageEnseignant, setEnseignant, setEnseignantsLoading, setEnseignantsLoadingOnTable, setSelectedEnseignant, resetSelectedEnseignant } from "../../../_redux/features/enseignant_slice";
import createToast from "../../../hooks/toastify";
import Pagination from "../../Pagination/Pagination";
import { apiGetEnseignantsWithPagination, apiSearchEnseignant, generateListEnseignant } from "../../../services/other_users/api_enseignant";
import Bouton from "../../ui/Bouton";
import { createPDF } from "../../../fonctions/fonction";
import Download from "../common/Download";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import BodyTable from "./BodyTable";
import HeaderTable from "./HeaderTable";

interface TableEnseignantProps {
    data: EnseignantType[];
    onCreate: () => void;
    onEdit: (enseignant: EnseignantType) => void;
}

const Table = ({ data, onCreate, onEdit }: TableEnseignantProps) => {



    const { t } = useTranslation();
    const dispatch = useDispatch();
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const currentYear:number=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023; 
    const grades = useSelector((state: RootState) => state.dataSetting.dataSetting.grades) ?? [];
    const categories = useSelector((state: RootState) => state.dataSetting.dataSetting.categories) ?? [];
    const services = useSelector((state: RootState) => state.dataSetting.dataSetting.services) ?? [];
    const fonctions = useSelector((state: RootState) => state.dataSetting.dataSetting.fonctions) ?? [];
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageTeacherPermission = userPermissions.includes('gerer_enseignants');

    // state save
    const selectSave = useSelector((state: RootState) => state.enseignantSlice.selected);
    const [grade, setGrade] = useState<CommonSettingProps | undefined>(selectSave.grade);
    const [categorie, setCatgeorie] = useState<CategorieProps | undefined>(selectSave.categorie);
    const [service, setService] = useState<CommonSettingProps | undefined>(selectSave.service);
    const [fonction, setFonction] = useState<CommonSettingProps | undefined>(selectSave.fonction);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const [filteredCategorie, setFilteredCategorie] = useState<CategorieProps[]>([]);
    const [searchText, setSearchText] = useState<string>('');
    
    const filterCategorieByGrade = (gradeId: string | undefined) => {
        if (gradeId && gradeId !== '') {
            // Filtrer les départements en fonction de l'ID de la région
            const result: CategorieProps[] = categories.filter(categorie => categorie.grade === gradeId);
            if (result.length > 0) {
                // setSelectIdC(result[0]._id);
                // setCycle(cycles.find(cycle=>cycle._id ===result[0]._id))
                
            }else{
                // setSelectIdCycle(undefined);
                // setCycle(undefined);
            }
            setFilteredCategorie(result);
        }else{
            setFilteredCategorie([])
            // setSelectIdCycle(undefined);
            // setCycle(undefined);
        }
    };

    
    const handleDownloadSelect = async (selected: string) => {
        try{
            setIsDownload(true);
            let title = "liste_des_enseignants_"
            if (lang !== 'fr') {
                title = "teachers_list_"
            }
            let gradeId : string | undefined;
            let categorieId : string | undefined;
            let serviceId : string | undefined;
            let fonctionId : string | undefined;
            if (grade) {
                gradeId = grade._id;
            }
            if (categorie) {
                categorieId = categorie._id;
            }
            if (service) {
                serviceId = service._id;
            }
            if (fonction) {
                fonctionId = fonction._id;
            }
            if(selected === 'PDF'){   
                await generateListEnseignant({langue:lang, annee:currentYear, grade: gradeId, categorie: categorieId, service: serviceId, fonction: fonctionId, fileType:'pdf' }).then((blob)=>{
                    // Créer un objet URL pour le blob PDF
                    if(blob){
                        createPDF(blob, title);
                    }
                })
                
            }else{
                await generateListEnseignant({langue:lang, annee:currentYear, grade: gradeId, categorie: categorieId, service: serviceId, fonction: fonctionId, fileType: 'xlsx' }).then((blob)=>{
                    // Créer un objet URL pour le blob PDF
                    if(blob){
                        createPDF(blob, title, 'xlsx');
                    }
                })
            }
        } catch (error) {
            createToast(t('message.erreur'), "", 2);
        }finally {
            setIsDownload(false);
        }    

    };

   


    // recuperer l'id de la grade suite au click sur l'input select
    const handleGradeSelect = (selected: CommonSettingProps | undefined) => {
        if (selected?._id) {
            setGrade(selected);
            dispatch(setSelectedEnseignant({ key: "grade", value: selected }))
            setCatgeorie(undefined);
            setService(undefined);
            filterCategorieByGrade(selected._id);
            setFonction(undefined);
            setSearchText('');
        }
    };

    const handleCatgorieSelect = (selected: CategorieProps | undefined) => {
        if (selected?._id) {
            setGrade(undefined);
            setCatgeorie(selected);
            dispatch(setSelectedEnseignant({ key: "categorie", value: selected }))
            setService(undefined);
            setFonction(undefined);
            setSearchText('');
        }
    };

    const handleServiceSelect = (selected: CommonSettingProps | undefined) => {
        if (selected?._id) {
            setGrade(undefined);
            setCatgeorie(undefined);
            setService(selected);
            dispatch(setSelectedEnseignant({ key: "service", value: selected }))
            setFonction(undefined);
            setSearchText('');
        }
    };

    const handleFonctionSelect = (selected: CommonSettingProps | undefined) => {
        if (selected?._id) {
            setGrade(undefined);
            setCatgeorie(undefined);
            setService(undefined);
            setFonction(selected);
            dispatch(setSelectedEnseignant({ key: "fonction", value: selected }))
            setSearchText('');
        }
    };


    // variable pour la pagination
    const itemsPerPage =  useSelector((state: RootState) => state.enseignantSlice.data.pageSize); // nombre d'éléments maximum par page
    const count = useSelector((state: RootState) => state.enseignantSlice.data.totalItems);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
    
    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    // Render page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < Math.ceil(count / itemsPerPage);

    const startItem = indexOfFirstItem + 1;
    const endItem = Math.min(count, indexOfLastItem);
    //fournir initialement les données à la page
    // Effet pour filtrer les options des CustomDropDown

    // ceci c'est pour ne pas relancer un nouveau fetch de enseignants pourtant celui si a deja etait fait initialement sur la page plus haut
    const [isInitialMount, setIsInitialMount] = useState(true);

    const pageIsLoadingOnTable = useSelector((state: RootState) => state.enseignantSlice.pageIsLoadingOnTable);
    const [isDownload, setIsDownload]=useState(false);
    useEffect(() => {
        // if (isInitialMount) {
        //     setIsInitialMount(false);
        //     return;
        // }

        const fetchEnseignants = async () => {
            dispatch(setEnseignantsLoadingOnTable(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyEnseignants: EnseignantListGetType = {
                    enseignants: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                let gradeId : string | undefined;
                let categorieId : string | undefined;
                let serviceId : string | undefined;
                let fonctionId : string | undefined;
                if (grade) {
                    gradeId = grade._id;
                }
                if (categorie) {
                    categorieId = categorie._id;
                }
                if (service) {
                    serviceId = service._id;
                }
                if (fonction) {
                    fonctionId = fonction._id;
                }

                const fetchedEnseignants = await apiGetEnseignantsWithPagination({ page: currentPage, grade: gradeId, categorie: categorieId, service: serviceId, fonction: fonctionId });
                if (fetchedEnseignants) { // Vérifiez si fetchedEnseignants n'est pas faux, vide ou indéfini
                    dispatch(setEnseignant(fetchedEnseignants));
                } else {
                    dispatch(setEnseignant(emptyEnseignants));
                }

                // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPageEnseignant(t('message.erreur')));
            } finally {
                dispatch(setEnseignantsLoadingOnTable(false));
            }
        }

        fetchEnseignants();

    }, [dispatch, grade, categorie, service, fonction, currentPage, t]); // Déclencher l'effet

    // modifier les données de la page lors de la recherche ou de la sélection de la grade
    const [filteredData, setFilteredData] = useState<EnseignantType[]>(data);

    const latestQueryEnseignant = useRef('');
    useEffect(() => {
        
        dispatch(setEnseignantsLoading(true));
        latestQueryEnseignant.current = searchText;
        try{
            
            const filterEnseignantByContent = async () => {
                if (searchText === '') {
                    const result: EnseignantType[] = data;
                    setFilteredData(result); 
                }else{
                    let enseignantsResult : EnseignantType[] = [];
                    await apiSearchEnseignant({ searchString:searchText, limit:10 }).then(result=>{
                        if (latestQueryEnseignant.current === searchText) {
                            if(result){
                                enseignantsResult = result.enseignants;
                                setFilteredData(enseignantsResult);
                            }
                          }
                        
                    })
                }
        
                
            };
            filterEnseignantByContent();
        }catch(e){
            dispatch(setErrorPageEnseignant(t('message.erreur')));
        }finally{
            if (latestQueryEnseignant.current === searchText) {
                (setEnseignantsLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, data]);
    
    const handleRefreshFilters = () => {
        setGrade(undefined);
        setCatgeorie(undefined);
        setService(undefined);
        setFonction(undefined);
        dispatch(resetSelectedEnseignant(["grade", "categorie", "fonction", "service"]))
    };

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {hasManageTeacherPermission && (
                    <ButtonCreate onClick={() => { onCreate(); dispatch(setShowModal()); } } title={""} />)}
                <InputSearch hintText={t('recherche.rechercher') + t('recherche.enseignant')} value={searchText} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.enseignant')} <Bouton
                    iconeSmall={true}
                    circle={true}
                    typeRefresh={true}
                    // titreBouton={t('boutton.actualiser')}
                    onClick={handleRefreshFilters}
                /></h1>

                {/* version mobile */}
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]"> {t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.grade')}
                                selectedItem={grade}
                                items={grades}
                                defaultValue={grade} // ou spécifie une valeur par défaut
                                displayProperty={(grade: CommonSettingProps) => `${lang === 'fr' ? grade.libelleFr : grade.libelleEn}`}
                                onSelect={handleGradeSelect}
                            />
                            <CustomDropDown2<CategorieProps>
                                title={t('label.categorie')}
                                selectedItem={categorie}
                                items={filteredCategorie}
                                defaultValue={categorie} // ou spécifie une valeur par défaut
                                displayProperty={(categorie: CategorieProps) => `${lang === 'fr' ? categorie.libelleFr : categorie.libelleEn}`}
                                onSelect={handleCatgorieSelect}
                            />
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.service')}
                                selectedItem={service}
                                items={services}
                                defaultValue={service} // ou spécifie une valeur par défaut
                                displayProperty={(service: CommonSettingProps) => `${lang === 'fr' ? service.libelleFr : service.libelleEn}`}
                                onSelect={handleServiceSelect}
                            />
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.fonction')}
                                selectedItem={fonction}
                                items={fonctions}
                                defaultValue={fonction} // ou spécifie une valeur par défaut
                                displayProperty={(fonction: CommonSettingProps) => `${lang === 'fr' ? fonction.libelleFr : fonction.libelleEn}`}
                                onSelect={handleFonctionSelect}
                            />

                        </div>
                    )}
                </div>

                {/* version desktop */}
                <div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.grade')}
                                selectedItem={grade}
                                items={grades}
                                defaultValue={grade} // ou spécifie une valeur par défaut
                                displayProperty={(grade: CommonSettingProps) => `${lang === 'fr' ? grade.libelleFr : grade.libelleEn}`}
                                onSelect={handleGradeSelect}
                            />
                            <CustomDropDown2<CategorieProps>
                                title={t('label.categorie')}
                                selectedItem={categorie}
                                items={filteredCategorie}
                                defaultValue={categorie} // ou spécifie une valeur par défaut
                                displayProperty={(categorie: CategorieProps) => `${lang === 'fr' ? categorie.libelleFr : categorie.libelleEn}`}
                                onSelect={handleCatgorieSelect}
                            />
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.service')}
                                selectedItem={service}
                                items={services}
                                defaultValue={service} // ou spécifie une valeur par défaut
                                displayProperty={(service: CommonSettingProps) => `${lang === 'fr' ? service.libelleFr : service.libelleEn}`}
                                onSelect={handleServiceSelect}
                            />
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.fonction')}
                                selectedItem={fonction}
                                items={fonctions}
                                defaultValue={fonction} // ou spécifie une valeur par défaut
                                displayProperty={(fonction: CommonSettingProps) => `${lang === 'fr' ? fonction.libelleFr : fonction.libelleEn}`}
                                onSelect={handleFonctionSelect}
                            />

                        </div>
                    </div>
                </div>




                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}

                        {
                            pageIsLoadingOnTable ?
                                <LoadingTable />
                                : filteredData.length === 0 ?
                                    <NoDataTable /> :
                                    <HeaderTable />
                        }
                        


                        {/* corp du tableau*/}
                        {
                            
                            <BodyTable data={filteredData} onEdit={onEdit} />
                        }






                    </table>
                </div>

                {/* Pagination */}

                {(searchText==='' && filteredData && filteredData.length>0) && <Pagination
                    count={count}
                    itemsPerPage={itemsPerPage}
                    startItem={startItem}
                    endItem={endItem}
                    hasPrevious={hasPrevious}
                    hasNext={hasNext}
                    currentPage={currentPage}
                    pageNumbers={pageNumbers}
                    handlePageClick={handlePageClick}

                />}

            </div>

            {/* bouton downlod Download */}
            <div className="mt-7 mb-10">
                {isDownload?<Download/>:<CustomButtonDownload items={['PDF', 'XLSX']} defaultValue="" onClick={handleDownloadSelect} />}
            </div>

        </div>
    );
};


export default Table;

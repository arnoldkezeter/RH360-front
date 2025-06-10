import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { useEffect, useState } from "react";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";

interface TableCommuneProps {
    data: CommuneProps[];
    onCreate: () => void;
    onEdit: (commune: CommuneProps) => void;
}


const Table = ({ data, onCreate, onEdit }: TableCommuneProps) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const departements: DepartementProps[] = useSelector((state: RootState) => state.dataSetting.dataSetting.departements) ?? [];
    const regions = useSelector((state: RootState) => state.dataSetting.dataSetting.regions) ?? [];
    const [region, setRegion] = useState<CommonSettingProps>();
    const [departement, setDepartement] = useState<DepartementProps>();

    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    // fournira les donnees a la page
    const [filteredCommune, setFilteredCommune] = useState<CommuneProps[]>([]);
    // État du texte de recherche
    const [searchText, setSearchText] = useState<string>('');

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };


    // valeur de la l'id de la region selectionner
    const [selectRegionId, setSelectIdRegion] = useState<string | undefined>('');

    // recuperer l'id de la region suite au click sur l'input select

    const handleRegionSelect = (selected: CommonSettingProps | undefined) => {
        if (selected?._id) {
            setSelectIdRegion(selected._id);
            filterDepartementByRegion(selected._id);
            setRegion(selected);
        }
    };    


    // valeur de la l'id du departement selectionner
    const [selectDepartementId, setSelectIdDepartement] = useState<string | undefined>('');
    const handleDepartementSelect = (selected: DepartementProps | undefined) => {
        if (selected?._id) {
            setSelectIdDepartement(selected._id);
            filterCommunexByDepartement(selected._id);
            setDepartement(selected);
        }
    };

    
    // Filtrer les communex en fonction de la langue
    const filterCommunexByContenet = (communex: CommuneProps[]) => {
        if (searchText === '' && filteredDepartement && filteredDepartement.length > 0) {
            const result: CommuneProps[] = data.filter(commune => commune.departement === filteredDepartement[0]?._id);
            return result;
        }

        return communex.filter(commune => {
            const libelle = lang === 'fr' ? commune.libelleFr : commune.libelleEn;
            // Vérifie si le code ou le libellé contient le texte de recherche
            return commune.code.toLowerCase().includes(searchText.toLowerCase()) || libelle.toLowerCase().includes(searchText.toLowerCase());
        });
    };

    // fournira les donnees a la page
    const [filteredDepartement, setFilteredDepartement] = useState<DepartementProps[]>([]);

    // filtrer les donnee a partir de l'id de la region selectionner
    const filterDepartementByRegion = (regionId: string | undefined) => {
        if (regionId && regionId !== '') {
            // Filtrer les départements en fonction de l'ID de la région
            const result: DepartementProps[] = departements.filter(departement => departement.region === regionId);
            if (result.length > 0) {
                setSelectIdDepartement(result[0]._id);
                setDepartement(departements.find(departement=>departement._id ===result[0]._id))
            }else{
                setSelectIdDepartement(undefined);
                setDepartement(undefined);
            }
            setFilteredDepartement(result);
          
        }
    };

    // filtrer les donnee a partir de l'id du departement selectionner

    const filterCommunexByDepartement = (departementId: string | undefined) => {
        
        if (departementId && departementId !== '') {
            // Filtrer les départements en fonction de l'ID de la région
            const result: CommuneProps[] = data.filter(commune => commune.departement === departementId);
            setFilteredCommune(result);
        }else{
            setFilteredCommune([]);
        }
    };

    // variable pour la pagination
    //
    const itemsPerPage = 10; // nombre delements maximum par page
    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    //fournir initialement les données à la page
    useEffect(() => {
        if(!selectRegionId){
            if (regions && regions.length > 0) {
                filterDepartementByRegion(regions[0]._id);
            }
        }else{
            setFilteredDepartement([]);
            filterDepartementByRegion(selectRegionId);
        }
        
        
    }, [regions, selectRegionId]);

    useEffect(() => {
        if (filteredDepartement && filteredDepartement.length > 0) {
            if(!selectDepartementId){
                filterCommunexByDepartement(filteredDepartement[0]?._id);
            }else{
                filterCommunexByDepartement(selectDepartementId);
            }
                
        } else{
            setFilteredCommune([]);
        }      
    }, [filteredDepartement, data]);



    // modifier les donner de la page lors de la recherche
    useEffect(() => {
        const result = filterCommunexByContenet(data);
        setFilteredCommune(result);
    }, [searchText]);
    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <ButtonCreate
                    title={t('boutton.nouvelle_commune')}
                    onClick={() => { onCreate(); dispatch(setShowModal()) }}
                />
                <InputSearch hintText={t('recherche.rechercher') + t('recherche.commune')} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.commune')} </h1>
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]"> {t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.region')}
                                selectedItem={region}
                                items={regions}
                                defaultValue={regions[0]} // ou spécifie une valeur par défaut
                                displayProperty={(region: CommonSettingProps) => `${lang === 'fr' ? region.libelleFr : region.libelleEn}`}
                                onSelect={handleRegionSelect}
                            />
                            <CustomDropDown2<DepartementProps>
                                title={t('label.departement')}
                                selectedItem={departement}
                                items={filteredDepartement}
                                defaultValue={filteredDepartement[0]} // ou spécifie une valeur par défaut
                                displayProperty={(departement: CommonSettingProps) => `${lang === 'fr' ? departement.libelleFr : departement.libelleEn}`}
                                onSelect={handleDepartementSelect}
                            />
                            {/* <CustomDropDown title="Région" items={regions} defaultValue={regions[0]} displayProperty={(region: Region) => `${region.libelle}`} onSelect={handleRegionSelect} />
                            <CustomDropDown title="Département" items={departements} defaultValue={departements[0]} displayProperty={(departement: Departement) => `${departement.libelle}`} onSelect={handleDepartementSelect} /> */}
                            {/* <CustomDropDown title="Commune" items={['1ère année', '2ème année']} defaultValue="1ère année" onSelect={handleCommunexelect} /> */}
                        </div>
                    )}
                </div>

                <div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.region')}
                                selectedItem={region}
                                items={regions}
                                defaultValue={regions[0]} // ou spécifie une valeur par défaut
                                displayProperty={(region: CommonSettingProps) => `${lang === 'fr' ? region.libelleFr : region.libelleEn}`}
                                onSelect={handleRegionSelect}
                            />
                            <CustomDropDown2<DepartementProps>
                                title={t('label.departement')}
                                selectedItem={departement}
                                items={filteredDepartement}
                                defaultValue={filteredDepartement[0]} // ou spécifie une valeur par défaut
                                displayProperty={(departement: CommonSettingProps) => `${lang === 'fr' ? departement.libelleFr : departement.libelleEn}`}
                                onSelect={handleDepartementSelect}
                            />
                            {/* <CustomDropDown title="Région" items={regions} defaultValue={regions[0]} displayProperty={(region: Region) => `${region.libelle}`} onSelect={handleRegionSelect} />
                            <CustomDropDown title="Département" items={departements} defaultValue={departements[0]} displayProperty={(departement: Departement) => `${departement.libelle}`} onSelect={handleDepartementSelect} /> */}
                        </div>
                    </div>
                </div>




                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        <HeaderTable />


                        {/* corp du tableau*/}
                        <BodyTable data={filteredCommune} onEdit={onEdit} />





                    </table>
                </div>

                {/* Pagination */}

                {/* <h1>Pagination ici</h1> */}

            </div>

            {/* bouton downlod Download */}
            {/* <div className="mt-7 mb-10">
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div> */}

        </div>
    );
};


export default Table;
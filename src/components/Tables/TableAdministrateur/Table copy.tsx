import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { CustomDropDown } from "../../DropDown/CustomDropDown";
import { useEffect, useState } from "react";
import { FaFilter, FaSort } from "react-icons/fa6";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { Cycle, cycles } from "../../../pages/Admin/Cycles";
import { Niveau, niveaux } from "../../../pages/Admin/Niveaux";
import CustomDropDown2 from "../../DropDown/CustomDropDown2";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";

interface TableAdministrateurProps {
    data: AdminType[];
    onCreate: () => void;
    onEdit: (administrateur: AdminType) => void;
}



const Table = ({ data, onCreate, onEdit }: TableAdministrateurProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();




    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    const [filtreAnnee, setFiltreAnnee] = useState(""); // contient la valeur qui a ete selectionner sur le bouton filtre annee
    const [filtreSection, setFiltreSection] = useState("");
    const [filtreCycle, setFiltreCycle] = useState("");
    const [filtreNiveau, setFiltreNiveau] = useState("");
    const [formatToDownload, setFormatToDownload] = useState("");

    const handleAnneeSelect = (selected: String | undefined) => {
        // setFiltreAnnee(selected);
        console.log(selected)
    };

    // const handleSectionSelect = (selected: Section | undefined) => {
    //     // setFiltreSection(selected);
    //     console.log(selected);
    // };

    const handleCycleSelect = (selected: Cycle | undefined) => {
        // setFiltreCycle(selected);
        console.log(selected);
    };

    const handleNiveauSelect = (selectedNiveau: Niveau | undefined) => {
        // Logique à exécuter lorsque le niveau est sélectionné
        // console.log("Niveau sélectionné :", selectedNiveau);
    };

    const handleDownloadSelect = (selected: string) => {
        setFormatToDownload(selected);
        console.log(selected);
        // methode pour download
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

    const [searchText, setSearchText] = useState<string>('');
    const [listFilterAdmin, setListFilterAdmin] = useState<AdminType[]>([]);

    const filtrerSearchAdmin = (administrateurs: AdminType[]) => {
        return administrateurs.filter(admin => {
            const libelle = admin.nom.toLowerCase() + ' ' + (admin.prenom || '').toLowerCase() + ' ' + (admin.matricule || '').toLowerCase();
            // Vérifie si le nom ou le prénom contient le texte de recherche
            return libelle.includes(searchText.toLowerCase());
        });
    };

    // Modifier les données de la page lors de la recherche
    useEffect(() => {
        const result = filtrerSearchAdmin(data);
        setListFilterAdmin(result);
    }, [searchText]);



    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <ButtonCreate
                    title={t('boutton.nouvel_admin')}
                    onClick={() => { onCreate(); dispatch(setShowModal()) }}
                />
                <InputSearch
                    hintText={t('recherche.rechercher') + t('recherche.administrateur')}
                    onSubmit={(text) => setSearchText(text)}
                />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                {/* <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>Filtrer la liste des administrateurs suivant : </h1> */}
                {/* version mobile */}
                {/* <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]"> Filtrer</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<String>
                                title="Année"
                                items={['2023-2024', '2022-2023', '2021-2022']}
                                defaultValue={'2023-2024'} // ou spécifie une valeur par défaut
                                
                                onSelect={handleAnneeSelect}
                            />
                            <CustomDropDown2<Section>
                                title="Section"
                                items={sections}
                                defaultValue={sections[0]} // ou spécifie une valeur par défaut
                                displayProperty={(section: Section) => `${section.libelle}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<Cycle>
                                title="Cycle"
                                items={cycles}
                                defaultValue={cycles[0]} // ou spécifie une valeur par défaut
                                displayProperty={(cycle: Cycle) => `${cycle.libelle}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<Niveau>
                                title="Niveau"
                                items={niveaux}
                                defaultValue={niveaux[0]} // ou spécifie une valeur par défaut
                                displayProperty={(niveau: Niveau) => `${niveau.libelle}`}
                                onSelect={handleNiveauSelect}
                            />
        
                        </div>
                    )}
                </div> */}

                {/* version desktop */}
                {/* <div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">
                            <CustomDropDown2<String>
                                title="Année"
                                items={['2023-2024', '2022-2023', '2021-2022']}
                                defaultValue={'2023-2024'} // ou spécifie une valeur par défaut
                                
                                onSelect={handleAnneeSelect}
                            />
                            <CustomDropDown2<Section>
                                title="Section"
                                items={sections}
                                defaultValue={sections[0]} // ou spécifie une valeur par défaut
                                displayProperty={(section: Section) => `${section.libelle}`}
                                onSelect={handleSectionSelect}
                            />
                            <CustomDropDown2<Cycle>
                                title="Cycle"
                                items={cycles}
                                defaultValue={cycles[0]} // ou spécifie une valeur par défaut
                                displayProperty={(cycle: Cycle) => `${cycle.libelle}`}
                                onSelect={handleCycleSelect}
                            />
                            <CustomDropDown2<Niveau>
                                title="Niveau"
                                items={niveaux}
                                defaultValue={niveaux[0]} // ou spécifie une valeur par défaut
                                displayProperty={(niveau: Niveau) => `${niveau.libelle}`}
                                onSelect={handleNiveauSelect}
                            />
                            
                        </div>
                    </div>
                </div> */}




                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        <HeaderTable />

                        {/* body */}
                        <BodyTable data={listFilterAdmin} onEdit={onEdit} />


                    </table>
                </div>

                {/* Pagination */}

                <h1>Pagination ici</h1>
                

            </div>

            {/* bouton downlod Download */}
            <div className="mt-7 mb-10">
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div>

        </div>
    );
};


export default Table;
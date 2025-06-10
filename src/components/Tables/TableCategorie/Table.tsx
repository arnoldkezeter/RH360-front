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


interface TableCategorieProps {
    data: CategorieProps[];
    onCreate: () => void;
    onEdit: (categorie: CategorieProps) => void;
}

const Table = ({ data, onCreate, onEdit }: TableCategorieProps) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    // Fonction pour basculer la visibilité des CustomDropDown
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };
    // fournira les donnees a la page
    const [filteredCategorie, setFilteredCategorie] = useState<CategorieProps[]>([]);

    // valeur de la l'id de la grade selectionnée
    const [selectGradeId, setSelectIdGrade] = useState<string>('');

    // État du texte de recherche
    const [searchText, setSearchText] = useState<string>('');

    const grades = useSelector((state: RootState) => state.dataSetting.dataSetting.grades) ?? [];
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [grade, setGrade] = useState<CommonSettingProps>();
    const [categorie, setCategorie] = useState<CategorieProps>();

    // recuperer l'id de la grade suite au click sur l'input select
    const handleGradeSelect = (selected: CommonSettingProps | undefined) => {
        if (selected?._id) {
            setSelectIdGrade(selected._id);
            setGrade(selected);
        }
    };


    // Filtrer les categories en fonction de la langue
    const filterCategorieByContent = (categories: CategorieProps[]) => {
        if (searchText === '' && grades && grades.length > 0) {
            const result: CategorieProps[] = data.filter(categorie => categorie.grade === grades[0]?._id);
            return result;
        }
        return categories.filter(categorie => {
            const libelle = lang === 'fr' ? categorie.libelleFr : categorie.libelleEn;
            // Vérifie si le code ou le libellé contient le texte de recherche
            return categorie.code.toLowerCase().includes(searchText.toLowerCase()) || libelle.toLowerCase().includes(searchText.toLowerCase());
        });
    };

    // filtrer les donnee a partir de l'id de la grade selectionner
    const filterCategorieByGrade = (gradeId: string | undefined) => {
        if (gradeId && gradeId !== '') {
            // Filtrer les départements en fonction de l'ID de la région
            const result: CategorieProps[] = data.filter(categorie => categorie.grade === gradeId);

            setFilteredCategorie(result)
        }
    };
   

    // fournir initialement les donnee a la page
    useEffect(() => {
        if(!selectGradeId){
            if (grades && grades.length > 0) {
                filterCategorieByGrade(grades[0]._id);
            }
        }else{
            setFilteredCategorie([]);
            filterCategorieByGrade(selectGradeId);
        }
        
        
    }, [grades, selectGradeId, data]);

    // modifier les données de la page lors de la recherche ou de la sélection de la grade
    useEffect(() => {
        const result = filterCategorieByContent(data);
        setFilteredCategorie(result);
    }, [searchText]);

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

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <ButtonCreate
                    title={t('boutton.nouveau_categorie')}
                    onClick={() => { onCreate(); dispatch(setShowModal()) }}
                />
                <InputSearch hintText={t('recherche.rechercher') + t('recherche.categorie')} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h1 className="text-[12px] lg:text-[15px] mt-3 lg:mt-5 font-medium flex justify-start items-center gap-x-2"><div className="hidden lg:block"><FaFilter /></div>{t('filtre.categorie')} </h1>
                <div className="block lg:hidden">
                    <button className="px-2.5  py-1 border border-gray text-[12px] mb-2 flex  justify-center items-center gap-x-2" onClick={toggleDropdownVisibility}> <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort /> </button>
                    {isDropdownVisible && (
                        <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 h-[200px] gap-x-2 ">
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.grade')}
                                selectedItem={grade}
                                items={grades}
                                defaultValue={grades[0]} // ou spécifie une valeur par défaut
                                displayProperty={(grade: CommonSettingProps) => `${lang === 'fr' ? grade.libelleFr : grade.libelleEn}`}
                                onSelect={handleGradeSelect}
                            />
                        </div>
                    )}
                </div>

                <div className="hidden lg:block">
                    <div className="flex  justify-start items-center  flex-col lg:flex-row    mb-5  mt-1 gap-x-4 verflow-x-auto ">
                        <div className="flex flex-wrap  w-full lg:w-auto gap-x-6">
                            <CustomDropDown2<CommonSettingProps>
                                title={t('label.grade')}
                                selectedItem={grade}
                                items={grades}
                                defaultValue={grades[0]} // ou spécifie une valeur par défaut
                                displayProperty={(grade: CommonSettingProps) => `${lang === 'fr' ? grade.libelleFr : grade.libelleEn}`}
                                onSelect={handleGradeSelect}
                            />
                        </div>
                    </div>
                </div>




                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        <HeaderTable />


                        {/* corp du tableau*/}
                        <BodyTable data={filteredCategorie} onEdit={onEdit} />





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
import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { useState } from "react";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";

interface TableGradeProps {
    data: CommonSettingProps[];
    onCreate: () => void;
    onEdit: (grade: CommonSettingProps | null) => void;
}


const Table = ({ data, onCreate, onEdit }: TableGradeProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en

    // Filtrer les régions en fonction de la langue
    const filterGrades = (grades: CommonSettingProps[]) => {
        return grades.filter(grade => {
            const libelle = lang === 'fr' ? grade.libelleFr : grade.libelleEn;
            // Vérifie si le code ou le libellé contient le texte de recherche
            return grade.code.toLowerCase().includes(searchText.toLowerCase()) || libelle.toLowerCase().includes(searchText.toLowerCase());
        });
    };

    // État du texte de recherche
    const [searchText, setSearchText] = useState<string>('');

    // Régions filtrées en fonction du texte de recherche
    const filteredGrades = filterGrades(data);

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
                    title={t('boutton.nouveau_grade')}
                    onClick={() => { onCreate(); dispatch(setShowModal()) }}
                />
                <InputSearch hintText={t('recherche.rechercher') + t('recherche.grade')} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">


                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        <HeaderTable />

                        {/* corp du tableau*/}

                        <BodyTable data={filteredGrades} onEdit={onEdit} />





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
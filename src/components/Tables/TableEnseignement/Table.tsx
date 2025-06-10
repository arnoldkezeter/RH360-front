import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { useEffect, useState } from "react";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";

interface TableEnseignementProps {
    data?: MatiereEnseignement[];
    onCreate:()=>void;
    onEdit: (enseignement:MatiereEnseignement) => void;
}


const Table = ({ data, onCreate, onEdit}: TableEnseignementProps) => {
    const {t}=useTranslation();
    const pageIsLoading = false;
    const dispatch = useDispatch();
    const itemsPerPage = 10; // nombre delements maximum par page
    const [currentPage, setCurrentPage] = useState<number>(1);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const selectedPeriode = useSelector((state: RootState) => state.periodeEnseignementSlice.selectedPeriode);
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageSubjectTeachingPeriodPermission = userPermissions.includes('gerer_matiere_periode_enseignement');

    const [searchText, setSearchText] = useState<string>('');
    const [filteredData, setFilteredData] = useState<MatiereEnseignement[] | undefined>(data);
    // Filtrer les matières en fonction de la langue
    const filterEnseignementByContent = (enseignements: MatiereEnseignement[] | undefined) => {
        if(enseignements){
            
            if (searchText === '') {
                const result: MatiereEnseignement[] = enseignements;
                return result;
            }
            return enseignements.filter(enseignement => {
                const libelle = lang === 'fr' ? enseignement.matiere.libelleFr : enseignement.matiere.libelleEn;
                // Vérifie si le code ou le libellé contient le texte de recherche
                return enseignement.matiere.code.toLowerCase().includes(searchText.toLowerCase()) || libelle.toLowerCase().includes(searchText.toLowerCase());
            });
        }
       return [];
    };

    // const { data: { periodes } } = useSelector((state: RootState) => state.periodeEnseignementSlice);
    // useEffect(() => {
    //     const per = periodes.find(p=>p._id===periodeEnseignement?._id);
    //     if(per){
    //         onEditPeriode(per)
    //     }
    //     setFilteredData(per?.enseignements);
    // },[periodes]);

    useEffect(() => {
        const result = filterEnseignementByContent(data);
        setFilteredData(result);
    }, [searchText, data]);

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {hasManageSubjectTeachingPeriodPermission && <ButtonCreate
                    title={t('boutton.nouveau_enseignement')}
                    onClick={() => { onCreate();dispatch(setShowModal()) }}
                />}
                <InputSearch hintText={t('recherche.rechercher')+t(t('recherche.enseignement'))} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                
                {selectedPeriode && (<div>
                    {lang === 'fr' ? selectedPeriode.periodeFr : selectedPeriode.periodeEn}
                </div>)}

                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            pageIsLoading ?
                                <LoadingTable />
                                : filteredData?.length === 0 ?
                                    <NoDataTable /> :
                                    <HeaderTable />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={filteredData} onEdit={onEdit}/>
                        }




                    </table>
                </div>

                {/* Pagination */}


            </div>

            {/* bouton downlod Download */}
            {/* <div className="mt-7 mb-10">
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div> */}

        </div>
    );
};


export default Table;
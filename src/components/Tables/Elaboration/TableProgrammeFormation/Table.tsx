import { useSelector } from "react-redux";
import NoDataTable from "../../common/NoDataTable";
import { useEffect, useState } from "react";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../_redux/store";
import Pagination from "../../../Pagination/Pagination";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { CardStat } from "../../../ui/Card";
import { BarChart3, CheckCircle } from "lucide-react";
import { ProgressBar } from "../../../ui/Progress";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { NoData } from "../../../NoData";


interface TableprogrammeFormationProps {
    data: ProgrammeFormation[];
    repartitions:RepartitionProgramme[];
    programmeActif:number;
    pourcentageExecution:number;
    isLoading:boolean;
    currentPage: number;
    onPageChange: (page: number) => void;
    onCreate:()=>void;
    onEdit: (programmeFormation:ProgrammeFormation) => void;
}

const Table = ({data, currentPage, onPageChange,repartitions, programmeActif, pourcentageExecution, isLoading, onEdit}: TableprogrammeFormationProps) => {
    const {t}=useTranslation();
    const pageIsLoading = isLoading;
   // variable pour la pagination
   
   const itemsPerPage =  useSelector((state: RootState) => state.programmeFormationSlice.data.pageSize); // nombre d'éléments maximum par page
   const count = useSelector((state: RootState) => state.programmeFormationSlice.data.totalItems)
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
   
   // Render page numbers
   const pageNumbers :number[]= [];
   for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
       pageNumbers.push(i);
   }

   const hasPrevious = currentPage > 1;
   const hasNext = currentPage < Math.ceil(count / itemsPerPage);

   const startItem = indexOfFirstItem + 1;
   const endItem = Math.min(count, indexOfLastItem);

   
    // modifier les données de la page lors de la recherche ou de la sélection de la section
    const [filteredData, setFilteredData] = useState<ProgrammeFormation[]>(data);    
   

    return (
        <div className="px-4 py-4 bg-white mt-3">
            
            {/* Cartes statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <CardStat
                    title={t('label.programme_actif')}
                    value={programmeActif}
                    icon={<BarChart3 className="w-6 h-6 text-[#2563EB]" />}
                    color="bg-[#D1FAE5]"
                    isLoading={pageIsLoading}
                />

                <CardStat
                    title={t('label.taux_execution')}
                    value={pourcentageExecution+" %"}
                    icon={<CheckCircle className="w-6 h-6 text-[#16A34A]" />}
                    color="bg-[#D1FAE5]"
                    footer={<ProgressBar value={pourcentageExecution} />}
                    isLoading={pageIsLoading}
                />
            </div>

            {/* Diagramme à barres */}
            <div className="w-full h-[350px] bg-white dark:bg-boxdark rounded-2xl p-4 shadow-md mb-6">
                {pageIsLoading?<Skeleton count={10}/>:(<><h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    {t('label.repartition_formation')}
                </h2>
                {repartitions.length ===0?
                <NoData />
                :(<ResponsiveContainer width="100%" height="100%">
                        <BarChart data={repartitions} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <XAxis dataKey="annee" stroke="#8884d8" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="nombreFormationPrevue" fill="#8884d8" name={t('label.formations_prevues')}/>
                            <Bar dataKey="nombreFormationExecutee" fill="#82ca9d" name={t('label.formations_executees')} />
                        </BarChart>
                    </ResponsiveContainer>)}</>)}
            </div>

            {/* Tableau existant */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-3">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                    {t('label.liste_programme')}
                </h2>
                {/* DEBUT DU TABLEAU */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                <table className="w-full table-auto">
                    {
                    pageIsLoading ? (
                        <Skeleton count={10}/>
                    ) : data?.length === 0 ? (
                        <NoData />
                    ) : (
                        <HeaderTable />
                    )
                    }
                    {
                    !pageIsLoading && <BodyTable data={data} onEdit={onEdit} />
                    }
                </table>
                </div>

                {/* Pagination */}
                {data && data.length > 0 && (
                <Pagination
                    count={count}
                    itemsPerPage={itemsPerPage}
                    startItem={startItem}
                    endItem={endItem}
                    hasPrevious={hasPrevious}
                    hasNext={hasNext}
                    currentPage={currentPage}
                    pageNumbers={pageNumbers}
                    handlePageClick={onPageChange}
                />
                )}
            </div>
        </div>
    );
}



export default Table;
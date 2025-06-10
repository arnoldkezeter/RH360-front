import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import { setShowModal } from "../../../_redux/features/setting";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";

interface TableEnseignementProps {
    data?: string[];
    onCreate:()=>void;
    onEdit: (enseignement:string) => void;
}


const Table = ({ data, onCreate, onEdit }: TableEnseignementProps) => {
    const {t}=useTranslation();
    const pageIsLoading = false;
    const dispatch = useDispatch();
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const selectedMatiere = useSelector((state: RootState) => state.matiereSlice.selectedMatiere);

    
    // Filtrer les matières en fonction de la langue
    // const filterEnseignementByContent = (enseignements: EnseignementType[] | undefined) => {
    //     if(enseignements){
    //         if (searchText === '') {
    //             const result: EnseignementType[] = enseignements;
    //             return result;
    //         }
    //         return enseignements.filter(enseignement => {
    //             const libelle = lang === 'fr' ? enseignement. : enseignement.libelleEn;
    //             // Vérifie si le code ou le libellé contient le texte de recherche
    //             return enseignement.code.toLowerCase().includes(searchText.toLowerCase()) || libelle.toLowerCase().includes(searchText.toLowerCase());
    //         });
    //     }
    //    return [];
    // };
    // const { data: { matieres } } = useSelector((state: RootState) => state.matiereSlice);
    // useEffect(() => {
    //     console.log(matieres)
    //     const mat = matieres.find(m=>m._id===matiere?._id);
    //     if(mat){
    //         onEditMatiere(mat)
    //     }
    //     setFilteredData(mat?.typesEnseignement);
    // },[matieres]);
    // useEffect(() => {
    //     setFilteredData(data);
    // }, [dispatch]);

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <ButtonCreate
                    title={t('boutton.nouvelle_enseignement')}
                    onClick={() => { onCreate();dispatch(setShowModal()) }}
                />
                {/* <InputSearch hintText={t('recherche.rechercher')+t(t('recherche.enseignement'))} onSubmit={(text) => setSearchText(text)} /> */}
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                
                {selectedMatiere && (<div>
                    {lang === 'fr' ? selectedMatiere.libelleFr : selectedMatiere.libelleEn}
                </div>)}

                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            pageIsLoading ?
                                <LoadingTable />
                                : data?.length === 0 ?
                                    <NoDataTable /> :
                                    <HeaderTable />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={data} onEdit={onEdit}/>
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
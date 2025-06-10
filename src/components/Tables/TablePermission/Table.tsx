import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import LoadingTable from "../common/LoadingTable";
import NoDataTable from "../common/NoDataTable";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { useEffect, useRef, useState } from "react";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";
import { setErrorPagePermission, setPermissionLoading, setPermissions } from "../../../_redux/features/permission_slice";
import createToast from "../../../hooks/toastify";
import { apiSearchPermission, getPermissionsWithPagination } from "../../../api/api_permission";
import Pagination from "../../Pagination/Pagination";
import { config } from "../../../config";

interface TablePermissionProps {
    data: PermissionType[];
    onCreate:()=>void;
    onEdit: (permission:PermissionType) => void;
}

const Table = ({ data, onCreate, onEdit}: TablePermissionProps) => {
    const {t}=useTranslation();
    const pageIsLoading = useSelector((state: RootState) => state.permissionSlice.pageIsLoading);
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    
    const dispatch = useDispatch();

    
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const toggleDropdownVisibility = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };
   // variable pour la pagination
   
   const itemsPerPage =  useSelector((state: RootState) => state.permissionSlice.data.pageSize); // nombre d'éléments maximum par page
   const count = useSelector((state: RootState) => state.permissionSlice.data.totalItems);
   const [currentPage, setCurrentPage] = useState<number>(1);
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = (currentPage - 1) * itemsPerPage;
   
   const handlePageClick = (pageNumber: number) => {
       setCurrentPage(pageNumber);
   };

   // Render page numbers
   const pageNumbers :number[]= [];
   for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
       pageNumbers.push(i);
   }

   const hasPrevious = currentPage > 1;
   const hasNext = currentPage < Math.ceil(count / itemsPerPage);

   const startItem = indexOfFirstItem + 1;
   const endItem = Math.min(count, indexOfLastItem);
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const selectedMatiere = useSelector((state: RootState) => state.matiereSlice.selectedMatiere);

    const [searchText, setSearchText] = useState<string>('');
    const [isSearch, setIsSearch] = useState<boolean>(false);

    useEffect(() => {

        const fetchPermissions = async () => {
            dispatch(setPermissionLoading(true)); // Définissez le loading à true avant le chargement
            try {
                const emptyPermissions: PermissionReturnGetType = {
                    permissions: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0
                }
                
                const fetchedPermissions = await getPermissionsWithPagination({page:currentPage, langue:lang });
                if (fetchedPermissions) { // Vérifiez si fetchedPermissions n'est pas faux, vide ou indéfini
                    dispatch(setPermissions(fetchedPermissions));
                } else {
                    dispatch(setPermissions(emptyPermissions));
                }
                
                
                // Réinitialisez les erreurs s'il y en a
            } catch (error) {
                dispatch(setErrorPagePermission(t('message.erreur')));
                createToast(t('message.erreur'), "", 2)
            } finally {
                dispatch(setPermissionLoading(false)); // Définissez le loading à false après le chargement
            }
        }
        fetchPermissions();
    }, [dispatch, currentPage, t]); // Déclencher l'effet lorsque currentPage change
    
    // modifier les données de la page lors de la recherche ou de la sélection de la section
    const [filteredData, setFilteredData] = useState<PermissionType[]>(data);


    // useEffect(() => {
    //     const result = filterPermissionByContent(data);
    //     setFilteredData(result);
    // }, [searchText, data]);
    useEffect(() => {
       if(searchText!==''){
            setIsSearch(true);
       }else{
            setIsSearch(false);
       }
    }, [searchText]);
    const latestQueryPermission = useRef('');
    useEffect(() => {
        dispatch(setPermissionLoading(true));
        latestQueryPermission.current = searchText;
        
        try{
            
            const filterPermissionByContent = async () => {
                if (searchText === '') {
                   
                    const result: PermissionType[] = data;
                    setFilteredData(result); 
                }else{
                    let permissionsResult : PermissionType[] = [];
                  
                    await apiSearchPermission({ searchString:searchText, limit:10, langue:lang}).then(result=>{
                        if (latestQueryPermission.current === searchText) {
                            if(result){
                                permissionsResult = result.permissions;
                                setFilteredData(permissionsResult);
                            }
                        }
                        
                    })
                    
                }
        
                
            };
            filterPermissionByContent();
        }catch(e){
            dispatch(setErrorPagePermission(t('message.erreur')));
        }finally{
            if (latestQueryPermission.current === searchText) {
                dispatch(setPermissionLoading(false)); // Définissez le loading à false après le chargement
            }
        }
    }, [searchText, isSearch, data]);

   

    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                {(roles.admin === userRole || roles.superAdmin === userRole || roles.enseignant === userRole) && <ButtonCreate
                    title={t('boutton.nouvel_permission')}
                    onClick={() => { onCreate();dispatch(setShowModal()) }}
                />}
                <InputSearch hintText={t('recherche.rechercher')+t(t('recherche.permission'))} value={searchText} onSubmit={(text) => setSearchText(text)} />
            </div>
            {/*! bouton creer ajouter un nouvel ... et search bar */}


            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">                

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

                {searchText==='' && filteredData && filteredData.length>0 && <Pagination
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
            {/* <div className="mt-7 mb-10">
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div> */}

        </div>
    );
};

export default Table;
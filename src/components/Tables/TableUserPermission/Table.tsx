import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";
import createToast from "../../../hooks/toastify";
import LoadingTable from "../common/LoadingTable";
import { config } from "../../../config";
import Download from "../common/Download";
import NoDataTable from "../common/NoDataTable";
import Pagination from "../../Pagination/Pagination";
import { setErrorPagePermission, setPermissionLoading, setPermissions } from "../../../_redux/features/permission_slice";
import { apiGetUserPermissions, getPermissionsWithPagination } from "../../../services/api_permission";
import { setUserPermission } from "../../../_redux/features/setting";
import { createFinalPermissionList } from "../../../fonctions/fonction";

const Table = ({ data }: { data: PermissionType[]}) => {
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const selectedUserPermission = useSelector((state: RootState) => state.setting.selectedUserPermission);

    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    

    // Fonction pour basculer la visibilité des CustomDropDown

    

    // let matiere:Matiere=listMatieres[0];
    
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
   
    const pageIsLoading = useSelector((state: RootState) => state.permissionSlice.pageIsLoading);
    const [isDownload, setIsDownload]=useState(false);
    
    

   
    

    
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
    


    

    
    const handleDownloadSelect = async (selected: string) => {

        try{
            setIsDownload(true);
            let title = "permissions_utilisateur";
            if(lang !== 'fr'){
                title = "user_permissions";
            }
            if(selected === 'PDF'){
                
            }else if (selected === 'XLSX'){
                
            }
            
        } catch (error) {
            createToast(t('message.erreur'), "", 2);
        }finally {
            setIsDownload(false);
        }
        
    };

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
                
                const fetchedPermissions = await getPermissionsWithPagination({ page: currentPage, langue:lang });
                    
                if (fetchedPermissions) { // Vérifiez si fetchedPermissions n'est pas faux, vide ou indéfini
                    dispatch(setPermissions(fetchedPermissions));
                    // setFilteredData(fetchedPermissions.permissions);
                } else {
                    dispatch(setPermissions(emptyPermissions));
                    // setFilteredData(emptyPermissions.permissions)
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
    }, [currentPage]); // Déclencher l'effet lorsque currentPage change

    useEffect(() => {
        
        if(selectedUserPermission){
            const userId = selectedUserPermission._id;
            const role = selectedUserPermission.role;
            const fetchPermissions = async () => {
                await apiGetUserPermissions({ userId: userId }).then((e: ReponseApiPros) => {
                    if(e.success){
                        createFinalPermissionList(e.data, role, lang).then(finalPermissions => {
                            dispatch(setUserPermission(finalPermissions));
                        });
                        
                    }else{
                        createToast(e.message[lang as keyof typeof e.message], '', 2);
                    }
                    }).catch((e) => {
                    
                        createToast(t('message.erreur'), "", 2);
                    })
            }
            fetchPermissions();
        }
        
    }, [dispatch, selectedUserPermission, t])


    return (
        <div>
            
            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
               


                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        {
                            pageIsLoading ?
                                <LoadingTable />:
                                 data.length==0?
                                    <NoDataTable/> :
                                    <HeaderTable />
                        }

                        {/* corp du tableau*/}

                        {
                            !pageIsLoading && <BodyTable data={data} />
                        }




                    </table>
                </div>

                {/* Pagination */}
                {data && data.length>0 && <Pagination 
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
            {/*<div className="mt-7 mb-10">
                {isDownload?<Download/>:<CustomButtonDownload items={['PDF', 'XLSX']} defaultValue="" onClick={handleDownloadSelect} />}

            </div>*/}

        </div>
    );
};


export default Table;
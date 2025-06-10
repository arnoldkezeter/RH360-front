import { useDispatch, useSelector } from "react-redux";
import ButtonCreate from "../common/ButtonCreate";
import InputSearch from "../common/SearchTable";
import { setShowModal } from "../../../_redux/features/setting";
import { useEffect, useState } from "react";
import CustomButtonDownload from "../common/CustomButtomDownload";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../_redux/store";
import Pagination from "../../Pagination/Pagination";
import { setAdmin, setAdminsLoading, setErrorPageAdmin } from "../../../_redux/features/admin_slice";
import { apiGetAdministrateurs } from "../../../services/other_users/api_administrateur";

interface TableAdministrateurProps {
    data: AdminType[];
    onCreate: () => void;
    onEdit: (administrateur: AdminType) => void;
}



const Table = ({ data, onCreate, onEdit }: TableAdministrateurProps) => {

    const adminState = useSelector((state: RootState) => state.admin.data);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    // Fonction pour basculer la visibilité des CustomDropDown

    const [formatToDownload, setFormatToDownload] = useState("");


    const handleDownloadSelect = (selected: string) => {
        setFormatToDownload(selected);
        console.log(selected);
        // methode pour download
    };


    // 
    //
    // filtrage
    const [searchText, setSearchText] = useState<string>('');
    const [listFilterAdmin, setListFilterAdmin] = useState<AdminType[]>([]);

    const filtrerSearchAdmin = (administrateurs: AdminType[]) => {
        return administrateurs.filter(admin => {
            const libelle = admin.nom.toLowerCase() + ' ' + (admin.prenom || '').toLowerCase() + ' ' + (admin.matricule || '').toLowerCase();
            // Vérifie si le nom ou le prénom contient le texte de recherche
            return libelle.includes(searchText.toLowerCase());
        });
    };


    // initialisation des donnees de la liste
    // Modifier les données de la page lors de la recherche
    useEffect(() => {
        const result = filtrerSearchAdmin(data);
        setListFilterAdmin(result);

    }, [searchText, data]);


    // start pagination
    // Récupération du nombre total d'éléments et du nombre d'éléments par page
    const count: number = useSelector((state: RootState) => state.admin.data.totalItems);
    const itemsPerPage = useSelector((state: RootState) => state.admin.data.pageSize); // nombre maximum d'éléments par page

    // État pour suivre la page actuelle
    const [currentPage, setCurrentPage] = useState<number>(1);

    // Calcul des index du premier et du dernier élément affiché sur la page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = Math.max(0, indexOfLastItem - itemsPerPage);

    // Calcul de l'élément de départ et de fin affiché sur la page
    const startItem = currentPage === 1 ? 1 : indexOfFirstItem + 1;
    const endItem = currentPage === Math.ceil(count / itemsPerPage) ? count : indexOfLastItem;

    // Vérification de la présence d'une page précédente et suivante
    const hasPrevious = currentPage > 1;
    const hasNext = currentPage < Math.ceil(count / itemsPerPage);

    // Génération des numéros de page
    const pageNumbers :number[]= [];
    for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    const handlePageClick = async (pageNumber: number) => {
        setCurrentPage(pageNumber);
        await fetchList({ page: pageNumber })
        setCurrentPage(pageNumber);

    };
    // end --------- pagination

    const fetchList = async ({ page }: { page: number }) => {
        dispatch(setAdminsLoading(true));
        try {
            const fetchResult = await apiGetAdministrateurs({ page: page });

            if (fetchResult) { // Vérifiez si fetchedMatieres n'est pas faux, vide ou indéfini
                dispatch(setAdmin(fetchResult));
                dispatch(setErrorPageAdmin(null));
            } else {
                dispatch(setErrorPageAdmin(t('message.erreur')));
            }
        } catch (error) {
            dispatch(setErrorPageAdmin(t('message.erreur')));
        } finally {
            dispatch(setAdminsLoading(false)); // Définissez le loading à false après le chargement
        }
    };


    return (
        <div>
            {/* bouton creer ajouter un nouvel ... et search bar */}
            <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 -mt-3 md:mt-0">
                <ButtonCreate
                    onClick={() => { onCreate(); dispatch(setShowModal()); } } title={""}                />
                <InputSearch
                    hintText={t('recherche.rechercher') + t('recherche.administrateur')}
                    onSubmit={(text) => setSearchText(text)}
                />
            </div>

            {/*  */}
            <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

                {/* DEBUT DU TABLE */}
                <div className="max-w-full overflow-x-auto mt-2 lg:mt-8 mb-4">
                    <table className="w-full table-auto">
                        {/* en tete du tableau */}
                        <HeaderTable />

                        {/* body */}
                        <BodyTable data={listFilterAdmin} onEdit={onEdit} />

                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    count={adminState.totalItems}
                    itemsPerPage={adminState.pageSize}
                    startItem={startItem}
                    endItem={endItem}
                    hasPrevious={hasPrevious}
                    hasNext={hasNext}
                    currentPage={currentPage}
                    pageNumbers={pageNumbers}
                    handlePageClick={handlePageClick}
                />

            </div>

            {/* bouton downlod Download */}
            {/* <div className="mt-7 mb-10">
                <CustomButtonDownload items={['PDF', 'XLSX', 'CSV']} defaultValue="" onClick={handleDownloadSelect} />

            </div> */}

        </div>
    );
};


export default Table;
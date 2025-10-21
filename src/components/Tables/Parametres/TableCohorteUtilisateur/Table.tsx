import { useDispatch, useSelector } from "react-redux";
import InputSearch from "../../common/SearchTable";
import { useCallback, useEffect, useRef, useState } from "react";
import HeaderTable from "./HeaderTable";
import BodyTable from "./BodyTable";
import { useTranslation } from "react-i18next";
import { RootState } from "../../../../_redux/store";
import Pagination from "../../../Pagination/Pagination";
import {
  setErrorPageCohorteUtilisateur,
  setCohorteUtilisateurLoading,
  createCohorteUtilisateurSlice,
} from "../../../../_redux/features/parametres/cohorteUtilisateurSlice";
import { NoData } from "../../../NoData";
import Skeleton from "react-loading-skeleton";
import {
  addUserToCohorte,
  getUsersByCohorteByPage,
} from "../../../../services/settings/cohorteUtilisateurAPI";
import createToast from "../../../../hooks/toastify";
import { searchUtilisateur } from "../../../../services/utilisateurs/utilisateurAPI";

interface TableCohorteUtilisateurProps {
  data: CohorteUtilisateur[];
  currentPage: number;
  cohorteId: string;
  onPageChange: (page: number) => void;
  onEdit: (cohorteUtilisateur: CohorteUtilisateur) => void;
}

const Table = ({
  data,
  currentPage,
  cohorteId,
  onPageChange,
  onEdit,
}: TableCohorteUtilisateurProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // 🧩 États locaux
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<CohorteUtilisateur[]>(data);

  const [searchTextAdd, setSearchTextAdd] = useState("");
  const [searchResults, setSearchResults] = useState<Utilisateur[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const lang = useSelector((state: RootState) => state.setting.language);
  const pageIsLoading = useSelector(
    (state: RootState) => state.cohorteUtilisateurSlice.pageIsLoading
  );

  // 📊 Pagination
  const itemsPerPage = useSelector(
    (state: RootState) => state.cohorteUtilisateurSlice.data.pageSize
  );
  const count = useSelector(
    (state: RootState) => state.cohorteUtilisateurSlice.data.totalItems
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  const pageNumbers: number[] = [];
  for (let i = 1; i <= Math.ceil(count / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < Math.ceil(count / itemsPerPage);
  const startItem = indexOfFirstItem + 1;
  const endItem = Math.min(count, indexOfLastItem);

  const latestQueryCohorteUtilisateur = useRef("");

  // 🔍 Filtrage des membres existants
  useEffect(() => {
    const fetchFilteredData = async () => {
      try {
        dispatch(setCohorteUtilisateurLoading(true));
        latestQueryCohorteUtilisateur.current = searchText;

        if (!searchText) {
          setFilteredData(data);
        } else {
          const result = await getUsersByCohorteByPage({
            cohorteId,
            lang,
            page: 1,
            search: searchText,
          });

          if (latestQueryCohorteUtilisateur.current === searchText && result) {
            setFilteredData(result.participants || []);
          }
        }
      } catch (e) {
        dispatch(setErrorPageCohorteUtilisateur(t("message.erreur")));
      } finally {
        if (latestQueryCohorteUtilisateur.current === searchText) {
          dispatch(setCohorteUtilisateurLoading(false));
        }
      }
    };

    fetchFilteredData();
  }, [searchText, data, dispatch, lang, t, cohorteId]);

  // 🔎 Recherche d’un utilisateur pour ajout
  const handleSearch = useCallback(
    async (text: string) => {
      setSearchTextAdd(text);
      if (text.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const res = await searchUtilisateur({ searchString: text, lang });
        setSearchResults(res.utilisateurs || []);
      } catch {
        createToast(t("message.erreur_recherche"), "", 2);
      } finally {
        setIsSearching(false);
      }
    },
    [lang, t]
  );

  // ➕ Ajout d’un utilisateur à la cohorte
  const handleAddUser = async (user: Utilisateur) => {
    if (!user || !cohorteId) return;

    setIsLoading(true);
    try {
      const e = await addUserToCohorte({
        utilisateurId: user._id||"",
        cohorteId,
        lang,
      });

      if (e.success) {
        createToast(e.message, "", 0);

        dispatch(
          createCohorteUtilisateurSlice({
            participant: {
              _id: e.data._id,
              utilisateur: e.data.utilisateur,
              dateAjout: e.data.dateAjout,
              cohorte: e.data.cohorte,
            },
          })
        );
      } else {
        createToast(e.message, "", 2);
      }
    } catch (err: any) {
      createToast(err?.response?.data?.message || t("message.erreur"), "", 2);
    } finally {
      setIsLoading(false);
      setSearchTextAdd("")
    }
  };

  return (
    <div>
      

        {/* 🔹 Zone d’ajout de nouveaux membres */}
        <div className="mt-4 mb-6">
            <label className="block text-sm font-semibold text-[#1F2937] dark:text-[#F3F4F6] mb-2">
            {t("label.ajouter_utilisateur")}
            </label>

            <div className="relative">
            <input
                type="text"
                placeholder={t("label.recherche_utilisateur")}
                className="w-full p-3 border border-[#D1D5DB] dark:border-[#4B5563] rounded-lg 
                            focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent 
                            dark:bg-[#1F2937] dark:text-[#F3F4F6] transition duration-150"
                value={searchTextAdd}
                onChange={(e) => handleSearch(e.target.value)}
            />
            {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-r-2 border-[#3B82F6]"></div>
                </div>
            )}
            </div>

            {/* Résultats de recherche */}
            {searchResults.length > 0 && searchTextAdd.length >= 2 && (
            <div className="mt-2 border border-[#E5E7EB] dark:border-[#4B5563] rounded-lg max-h-40 overflow-y-auto bg-white dark:bg-[#111827] shadow-lg">
                {searchResults.map((user) => (
                <div
                    key={user._id}
                    className="p-3 hover:bg-[#F9FAFB] dark:hover:bg-[#374151] flex justify-between items-center border-b border-[#E5E7EB] dark:border-[#4B5563] last:border-b-0"
                >
                    <span className="text-[#1F2937] dark:text-[#F3F4F6] text-sm truncate">
                    {user.nom} {user.prenom} ({user.email})
                    </span>
                    <button
                    disabled={isLoading}
                    onClick={() => handleAddUser(user)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors shadow-md ${
                        isLoading
                        ? "bg-[#9CA3AF] cursor-not-allowed"
                        : "bg-[#3B82F6] text-white hover:bg-[#2563EB]"
                    }`}
                    >
                    {t("button.ajouter")}
                    </button>
                </div>
                ))}
            </div>
            )}
        </div>
        {/* 🔹 Barre de recherche des membres existants */}
        <div className="flex justify-between items-center gap-x-1 lg:gap-x-2 mb-1 md:mt-3">
            <InputSearch
            hintText={`${t("recherche.rechercher")} ${t("recherche.membre")}`}
            value={searchText}
            onSubmit={(text) => setSearchText(text)}
            />
        </div>  
        {/* 🔹 Tableau des membres de la cohorte */}
        <div className="rounded-sm border border-stroke bg-white px-3 lg:px-5 pt-0 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto mt-2 lg:mt-8">
            <table className="w-full table-auto">
                {pageIsLoading ? (
                <Skeleton count={15} />
                ) : filteredData.length === 0 ? (
                <NoData />
                ) : (
                <>
                    <HeaderTable />
                    <BodyTable data={filteredData} onEdit={onEdit} />
                </>
                )}
            </table>
            </div>

            {/* Pagination */}
            {searchText === "" && filteredData.length > 0 && (
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
};

export default Table;

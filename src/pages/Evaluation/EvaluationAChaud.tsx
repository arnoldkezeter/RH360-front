import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../_redux/store';
import { useTranslation } from 'react-i18next';
import { useFetchData } from '../../hooks/fechDataOptions';
import { setErrorPageEvaluationAChaudReponse, setEvaluationAChaudReponseLoading, setEvaluationAChaudReponses, setEvaluationSelected } from '../../_redux/features/evaluations/evaluationChaudReponseSlice';
import { getUserEvaluations } from '../../services/evaluations/evaluationChaudReponseAPI';
import BreadcrumbPageDescription from '../../components/BreadcrumbPageDescription';
import { FaFilter, FaSort } from 'react-icons/fa';
import InputSearch from '../../components/Tables/common/SearchTable';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';
import { NoData } from '../../components/NoData';



const EvaluationAChaud = () => {
  
  const { data: { evaluationChauds } } = useSelector((state: RootState) => state.evaluationAChaudReponseSlice);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lang = useSelector((state: RootState) => state.setting.language);
  const user = useSelector((state: RootState) => state.utilisateurSlice.utilisateur);
   const fetchData = useFetchData();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const loading = useSelector((state: RootState) => state.evaluationAChaudReponseSlice.pageIsLoading);
  const [searchText, setSearchText] = useState<string>('');
  const [isSearch, setIsSearch] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const toggleDropdownVisibility = () => {
      setIsDropdownVisible(!isDropdownVisible);
  };

  useEffect(() => {
      dispatch(setEvaluationAChaudReponseLoading(true));      
      
      const filterEvaluationChaudByContent = async () => {
        if(!user || !user._id){
          return
        }
        try {                
          fetchData({
            apiFunction: getUserEvaluations,
            params: {
              lang,
              page: currentPage,
              userId:user._id
            },
            onSuccess: (data) => {
              
              dispatch(setEvaluationAChaudReponses(data || {
                evaluationChauds:[],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0,
              }));
            },
            onError: () => {
              dispatch(setErrorPageEvaluationAChaudReponse(t('message.erreur')));
            },
            onLoading: (isLoading) => {
              dispatch(setEvaluationAChaudReponseLoading(isLoading));
            },
          });
        } catch(e) {
          dispatch(setErrorPageEvaluationAChaudReponse(t('message.erreur')));
        }
      };
      
      filterEvaluationChaudByContent();
  }, [currentPage, lang, user, dispatch]);
  
  const latestQueryEvaluationChaud = useRef('');
  
  useEffect(() => {
    if(!isSearch) return;
    
    dispatch(setEvaluationAChaudReponseLoading(true));
    latestQueryEvaluationChaud.current = searchText;
    
    const filterEvaluationChaudByContent = async () => {
      try {
        if (searchText === '') {    
          if(!user || !user._id) return
          // Recharger les données depuis l'API au lieu d'utiliser l'ancien état local
          fetchData({
            apiFunction: getUserEvaluations,
            params: {
              lang,
              page: 1,
              userId:user._id,
            },
            onSuccess: (data) => {
              dispatch(setEvaluationAChaudReponses(data || {
                evaluationChauds:[],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0,
              }));
            },
            onError: () => {
              dispatch(setErrorPageEvaluationAChaudReponse(t('message.erreur')));
            },
            onLoading: (isLoading) => {
              if (latestQueryEvaluationChaud.current === searchText) {
                dispatch(setEvaluationAChaudReponseLoading(isLoading));
              }
            },
          });
        } else {  
          if(!user || !user._id) return
          fetchData({
            apiFunction: getUserEvaluations,
            params: {
              lang,
              page: 1,
              userId:user._id,
              search: searchText
            },
            onSuccess: (data) => {
              dispatch(setEvaluationAChaudReponses(data || {
                evaluationChauds:[],
                currentPage: 0,
                totalItems: 0,
                totalPages: 0,
                pageSize: 0,
              }));
            },
            onError: () => {
              dispatch(setErrorPageEvaluationAChaudReponse(t('message.erreur')));
            },
            onLoading: (isLoading) => {
              if (latestQueryEvaluationChaud.current === searchText) {
                dispatch(setEvaluationAChaudReponseLoading(isLoading));
              }
            },
          });
        }
      } catch(e) {
        dispatch(setErrorPageEvaluationAChaudReponse(t('message.erreur')));
      } finally {
        if (latestQueryEvaluationChaud.current === searchText) {
          dispatch(setEvaluationAChaudReponseLoading(false));
        }
      }
    };
    
    filterEvaluationChaudByContent();
  }, [searchText, isSearch, lang, dispatch]);

  return (
    <>
      <BreadcrumbPageDescription 
          pageDescription={t('page_description.evaluation_a_chaud_evaluer')} 
          titleColor="text-[#1e3a8a]" 
          pageName={t('sub_menu.evaluation_a_chaud')} 
      />
      <div className="p-6 bg-[#F8FAFC] min-h-screen mt-3">
        {/* version mobile */}
        <div className="block lg:hidden">
            <button className="px-2.5 py-1 border border-gray text-[12px] mb-2 flex justify-center items-center gap-x-2 mt-3" onClick={toggleDropdownVisibility}>
                <FaFilter /><p className="text-[12px]">{t('filtre.filtrer')}</p><FaSort />
            </button>
            {isDropdownVisible && (
                <div className="flex flex-col justify-start items-start overflow-y-scroll pb-2 gap-y-3">

                    {/* InputSearch pour mobile */}
                    <div className="w-full">
                        <InputSearch 
                            hintText={t('recherche.rechercher')+t('recherche.evaluation_a_chaud')} 
                            value={searchText} 
                            onSubmit={(text) => {setIsSearch(true); setSearchText(text)}} 
                        />
                    </div>
                </div>
            )}
        </div>

        {/* version desktop */}
        <div className="hidden lg:block">
            
            <div className="w-full mb-4 mt-4">
                <InputSearch 
                    hintText={t('recherche.rechercher')+t('recherche.evaluation_a_chaud')} 
                    value={searchText} 
                    onSubmit={(text) => {setIsSearch(true); setSearchText(text)}} 
                />
            </div>
        </div>

        {loading ? (
          <Skeleton height={350}/>
        ) : evaluationChauds && evaluationChauds.length>0
        ?(
          <div className="grid gap-6">
            {evaluationChauds.map((evalItem) => (
              <div
                key={evalItem._id}
                className="rounded-xl shadow-md bg-white p-5 flex flex-col md:flex-row items-start md:items-center justify-between border border-[#E2E8F0]"
              >
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-[#1E293B]">
                    {lang === 'fr' ? evalItem?.titreFr || "" : evalItem?.titreEn || ""}
                  </h2>
                  <p className="text-sm text-[#64748B]">
                    {lang === 'fr' ? evalItem?.theme?.titreFr||"" : evalItem?.theme?.titreEn || ""}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
                  <div className="w-full md:w-48">
                    <div className="h-3 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#10B981] transition-all"
                        style={{ width: `${evalItem.progression}%` }}
                      />
                    </div>
                    <p className="text-sm text-center text-[#475569] mt-1">
                      {evalItem.progression}% {t('label.complete')}
                    </p>
                  </div>

                  {/* <button
                    className="bg-[#3B82F6] text-white px-4 py-2 rounded-lg hover:bg-[#2563EB] transition"
                    onClick={() => window.location.href = `/evaluations/effectue-evaluation-a-chaud/effectuer`}
                  >
                    {t('button.evaluer')}
                  </button> */}
                  <button
                    className="bg-[#3B82F6] text-white px-4 py-2 rounded-lg hover:bg-[#2563EB] transition"
                    onClick={() => {dispatch(setEvaluationSelected(evalItem));navigate(`/evaluations/evaluation-a-chaud/effectuer`)}}
                  >
                    {t('button.evaluer')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ):<NoData/>}

        
      </div>
    </>
  );
};

export default EvaluationAChaud;

import { useEffect, useState } from "react";
import Breadcrumb from "../../components/Breadcrumb";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../_redux/store";
import createToast from "../../hooks/toastify";

import Table from "../../components/Tables/Parametres/TableBesoinFormationPredefini/Table";
import FormCreateUpdate from "../../components/Modals/Parametres/ModalBesoinFormationPredefini/FormCreateUpdate";
import FormDelete from "../../components/Modals/Parametres/ModalBesoinFormationPredefini/FormDelete";
import { setBesoinFormationPredefiniLoading, setBesoinFormationPredefinis, setErrorPageBesoinFormationPredefini } from "../../_redux/features/parametres/besoinFormationPredefini";
import { getBesoinFormationPredefinis } from "../../services/settings/besoinFormationPredefiniAPI";
import { useHeader } from "../../components/Context/HeaderConfig";
import { useFetchData } from "../../hooks/fechDataOptions";
import { getPosteDeTravailForDropDown } from "../../services/settings/posteDeTravailAPI";
import { setErrorPagePosteDeTravail, setPosteDeTravails } from "../../_redux/features/parametres/posteDeTravailSlice";




const BesoinFormationPredefinis = () => {
    const [selectedBesoinFormationPredefini, setSelectedBesoinFormationPredefini] = useState<BesoinFormationPredefini | null>(null);

    
    const { data: { familleMetiers } } = useSelector((state: RootState) => state.familleMetierSlice);
    const { data: { posteDeTravails } } = useSelector((state: RootState) => state.posteDeTavailSlice);
    const { data: { besoinsFormationPredefinis } } = useSelector((state: RootState) => state.besoinFormationPredefiniSlice);
    
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentFamille, setCurrentFamille] = useState<FamilleMetier | undefined>()
    const [currentPoste, setCurrentPoste]=useState<PosteDeTravail | undefined>()
    const fetchData = useFetchData();
    const dispatch = useDispatch();
    const {t}=useTranslation();
    const { setHeaderConfig } = useHeader();
    useEffect(() => {
        setHeaderConfig({
        title: undefined,
        showAddButton: false,
        exportOptions: [],
        importOptions: [],
        });
    }, []);


    
    
    useEffect(() => {
        if (!currentFamille && familleMetiers.length > 0) {
            setCurrentFamille(familleMetiers[0]);
        }
    }, [familleMetiers]);

    useEffect(() => {
            if (!currentFamille || !currentFamille._id) return;
    
            fetchData({
                apiFunction: getPosteDeTravailForDropDown,
                params: { lang, familleMetierId: currentFamille._id },
                onSuccess: (data) => {
                    dispatch(setPosteDeTravails(data));
                    // Définir le premier formation comme formation courant
                    if (data.posteDeTravails?.length > 0) {
                        setCurrentPoste(data.posteDeTravails[0]);
                    } else {
                        setCurrentPoste(undefined);
                    }
                    
                },
                onError: () => {
                    dispatch(setErrorPagePosteDeTravail(t('message.erreur')));
                },
            });
    }, [fetchData, currentFamille, lang, dispatch]);


    useEffect(() => {
        
        const fetchBesoinFormationPredefinis = async () => {
            if(!currentPoste || !currentPoste._id){
                dispatch(setBesoinFormationPredefinis({
                    besoinsFormationPredefinis: [],
                    currentPage: 0,
                    totalItems: 0,
                    totalPages: 0,
                    pageSize: 0,
                }));
                return
            };
            
            dispatch(setBesoinFormationPredefiniLoading(true));
            try {
                const fetchedBesoinFormationPredefinis = await getBesoinFormationPredefinis({ page: currentPage, lang, posteId:currentPoste?._id});
                if (fetchedBesoinFormationPredefinis) {
                   
                    dispatch(setBesoinFormationPredefinis(fetchedBesoinFormationPredefinis));
                } else {
                    dispatch(setBesoinFormationPredefinis({
                        besoinsFormationPredefinis: [],
                        currentPage: 0,
                        totalItems: 0,
                        totalPages: 0,
                        pageSize: 0,
                    }));
                }
            } catch (error) {
                dispatch(setErrorPageBesoinFormationPredefini(t('message.erreur')));
                createToast(t('message.erreur'), "", 2);
            } finally {
                dispatch(setBesoinFormationPredefiniLoading(false));
            }
        };
        fetchBesoinFormationPredefinis();
    }, [currentPage, currentPoste, dispatch, lang]); // Déclencher l'effet lorsque currentPage change
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleFamilleChange = (famille: FamilleMetier) => {
        setCurrentFamille(famille);
        setCurrentPage(1)
    };

    const handlePosteChange = (poste: PosteDeTravail) => {
        setCurrentPoste(poste);
        setCurrentPage(1)
    };

    return (
        <>
            
            <Breadcrumb pageName={t('sub_menu.cree_besoin_formation')}/>
            <Table
                data={besoinsFormationPredefinis}
                currentPage={currentPage}
                famillesMetier={familleMetiers}
                postesDeTravail={posteDeTravails} 
                currentFamille={currentFamille} 
                currentPoste={currentPoste} 
                onFamilleChange={handleFamilleChange} 
                onPosteChange={handlePosteChange}            
                onPageChange={handlePageChange}
                onCreate={() => setSelectedBesoinFormationPredefini(null)}
                onEdit={setSelectedBesoinFormationPredefini} 
            />

            <FormCreateUpdate besoinFormationPredefini={selectedBesoinFormationPredefini} />
            <FormDelete besoinFormationPredefini={selectedBesoinFormationPredefini} />

        </>
    );
};


export default BesoinFormationPredefinis;

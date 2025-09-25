import { useDispatch, useSelector } from 'react-redux';
import { setShowModal, setShowModalCompetence } from '../../../../../_redux/features/setting';
import { RootState } from '../../../../../_redux/store';
import CustomDialogModal from '../../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../../hooks/toastify';
import { STATUT_BESOIN } from '../../../../../config';


function FormCreateUpdate({ groupedCompetence, besoinId }: { groupedCompetence: GroupedCompetence | undefined, besoinId:string }) {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [titre, setTitre] = useState<string>('');
    
    const [pointsAAmeliorer, setPointsAAmeliorer] = useState<string>('');
    
    const [commentaireAdminFr, setCommentaireAdminFr] = useState<string>('');
    const [commentaireAdminEn, setCommentaireAdminEn] = useState<string>('');
    const [statut, setStatut] = useState<StatutBesoin>();
    const statuts = Object.values(STATUT_BESOIN)


    

    const [errorStatut, setErrorStatut] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.openCompetence);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (groupedCompetence) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.competence'));
            const besoin = groupedCompetence?.besoins.find(gb=>gb.besoinId===besoinId)
            setTitre(besoin?.titre||"")
            
            setPointsAAmeliorer(besoin?.pointsAAmeliorer || "")
            setCommentaireAdminEn(besoin?.commentaireAdminEn || "")
            setCommentaireAdminFr(besoin?.commentaireAdminFr||"")
            const sta = statuts.find(st=>st.key === besoin?.statut)
            setStatut(sta)

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.competence'));
            setTitre("")
            setCommentaireAdminFr("")
            setPointsAAmeliorer("")
            setCommentaireAdminEn("")
            setStatut(undefined)
        }


        if (isFirstRender) {
            setErrorStatut("");
            setIsFirstRender(false);
        }
    }, [groupedCompetence, isFirstRender, t]);

    const closeModal = () => {
        setErrorStatut("");
        setIsFirstRender(true);
        dispatch(setShowModalCompetence());
    };

   const handleStatutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatutNom = e.target.value;
        var selected=null;

        if (lang === 'fr') {
            selected = statuts.find(s => s.nomFr === selectedStatutNom);
        }
        else {
            selected = statuts.find(s => s.nomEn === selectedStatutNom);
        }
        
        if(selected){
            setStatut(selected)
        }
        setErrorStatut("")
    }
    const handleCreateUpdate = async () => {
        // if((!titre && !commentaireAdminFr) || (!pointsAAmeliorer && !pointsAAmeliorerEn)){
           
        //     if (!titre && !commentaireAdminFr) {
        //         setErrorStatut(t('error.competences'))
        //     }

        //     if (!pointsAAmeliorer && !pointsAAmeliorerEn) {
        //         setErrorPointAAmeliorer(t('error.points_a_ameliorer'))
        //     }
        //     return;
        // }
        // // create
        // if (!groupedCompetence) {
            
        //     await createBesoinAjoute(
        //         {
        //             utilisateur:besoinid._id||"",
        //             titre,
        //             commentaireAdminFr,
        //             pointsAAmeliorer,
        //             pointsAAmeliorerEn
        //         },
        //         lang
        //     ).then((e: ReponseApiPros) => {
        //         if (e.success) {
        //             createToast(e.message, '', 0);
        //             dispatch(createGroupedCompetenceSlice({
        //                 groupedCompetence:{
        //                     _id: e.data._id,
        //                     utilisateur: e.data.utilisateur,
        //                     titre: e.data.titre,
        //                     commentaireAdminFr: e.data.commentaireAdminFr,
        //                     pointsAAmeliorer: e.data.pointsAAmeliorer,
        //                     pointsAAmeliorerEn: e.data.pointsAAmeliorerEn,
        //                     commentaireAdminFr: e.data.commentaireAdminFr,
        //                     commentaireAdminEnEn: e.data.commentaireAdminEnEn,
        //                     statut: e.data.statut
        //                 }
        //             }));

        //             closeModal();

        //         } else {
        //             createToast(e.message, '', 2);

        //         }
        //     }).catch((e) => {
        //         createToast(e.response.data.message, '', 2);
        //     })
                

            
        // }else {

        
        //     await updateBesoinAjoute(
        //         {
        //             _id: groupedCompetence?._id || "",
        //             titre,
        //             commentaireAdminFr,
        //             pointsAAmeliorer,
        //             pointsAAmeliorerEn  
        //         },
        //         lang
        //     ).then((e: ReponseApiPros) => {
        //         if (e.success) {
        //             createToast(e.message, '', 0);
        //             dispatch(updateGroupedCompetenceSlice({
        //                 id: e.data._id,
        //                 groupedCompetenceData : {
        //                      _id: e.data._id,
        //                     utilisateur: e.data.utilisateur,
        //                     titre: e.data.titre,
        //                     commentaireAdminFr: e.data.commentaireAdminFr,
        //                     pointsAAmeliorer: e.data.pointsAAmeliorer,
        //                     pointsAAmeliorerEn: e.data.pointsAAmeliorerEn,
        //                     commentaireAdminFr: e.data.commentaireAdminFr,
        //                     commentaireAdminEnEn: e.data.commentaireAdminEnEn,
        //                     statut: e.data.statut
        //                 }
        //             }));

        //             closeModal();

        //         } else {
        //             createToast(e.message, '', 2);
        //         }
        //     }).catch((e) => {
        //         createToast(e.response.data.message, '', 2);
        //     })
                
            
        // }


    }


    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
            >                

                <label>{t('label.competence')}</label>
                <input
                    value={titre}
                    onChange={(e) => {setTitre(e.target.value)}}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    disabled
                />
                
                
                <label>{t('label.points_a_ameliorer')}</label>
                <textarea
                    rows={3}
                    value={pointsAAmeliorer}
                    onChange={(e) => {setPointsAAmeliorer(e.target.value)}}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    placeholder={t('label.formulez_points_a_ameliorer')}
                    disabled
                />
                
                
                <label>{t('label.statut')}</label>
                <select
                    value={statut?(lang==='fr'?statut.nomFr:statut.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.statut')}
                    onChange={handleStatutChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.niveau_statut')}</option>
                    {statuts.map((s) => (
                        <option key={s.key} value={lang==='fr'?s.nomFr:s.nomEn}>
                            {lang==='fr'?s.nomFr:s.nomEn}
                        </option>
                    ))}
                </select>
                {errorStatut && <p className="text-red-500" >{errorStatut}</p>}
                <label>{t('label.commentaire_admin_fr')}</label>
                    <textarea
                    rows={3}
                    value={commentaireAdminFr}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    onChange={(e) => {setCommentaireAdminFr(e.target.value)}}
                />
                <label>{t('label.commentaire_admin_en')}</label>
                    <textarea
                    rows={3}
                    value={commentaireAdminEn}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    onChange={(e) => {setCommentaireAdminEn(e.target.value)}}
                />
                    


            </CustomDialogModal>

        </>
    );
}

export default FormCreateUpdate;

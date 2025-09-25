import { useDispatch, useSelector } from 'react-redux';
import { setShowModal, setShowModalEvaluation } from '../../../../../_redux/features/setting';
import { RootState } from '../../../../../_redux/store';
import CustomDialogModal from '../../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../../hooks/toastify';
import { NIVEAU_AUTO_EVALUATION, STATUT_BESOIN } from '../../../../../config';


function FormCreateUpdateEvaluation({ groupedBesoin, userId }: { groupedBesoin: GroupedBesoin | undefined, userId:string }) {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [niveau, setNiveau] = useState<NiveauAutoEvaluation | undefined>(undefined);
    const [insuffisances, setInsuffisances] = useState<string>('');
    const [formulationBesoins, setFormulationBesoins] = useState<string>('');
    const [commentaireAdminFr, setCommentaireAdminFr] = useState<string>('');
    const [commentaireAdminEn, setCommentaireAdminEn] = useState<string>('');
    const [statut, setStatut] = useState<StatutBesoin>();
    const statuts = Object.values(STATUT_BESOIN)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const niveauxGroupedBesoin = Object.values(NIVEAU_AUTO_EVALUATION)

    

    const [errorStatut, setErrorStatut] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.openEvaluation);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (groupedBesoin && groupedBesoin.niveau!==0) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.auto_evaluation'));
            const niv = niveauxGroupedBesoin.find(n=>n.niveau === groupedBesoin.niveau);
            const evaluation = groupedBesoin?.evaluations.find(ev=>ev.utilisateurId===userId)
            setNiveau(niv)
            setInsuffisances(evaluation?.insuffisances || "")
            setFormulationBesoins(evaluation?.formulationBesoins||"")
            setCommentaireAdminFr(evaluation?.commentaireAdminFr||"")
            setCommentaireAdminEn(evaluation?.commentaireAdminEn || "")
            const sta = statuts.find(st=>st.key === evaluation?.statut)
            setStatut(sta)

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.auto_evaluation'));
            setNiveau(undefined)
            setInsuffisances("")
            setFormulationBesoins("")
            setCommentaireAdminFr("")
            setCommentaireAdminEn("")
            setStatut(undefined)
        }


        if (isFirstRender) {
            setErrorStatut("");
            setIsFirstRender(false);
        }
    }, [groupedBesoin, isFirstRender, t]);

    const closeModal = () => {
        setErrorStatut("");
        setIsFirstRender(true);
        dispatch(setShowModalEvaluation());
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
       
        // // create
        // if (!groupedBesoin || groupedBesoin.niveau === 0) {
            
        //     await createGroupedBesoin(
        //         {
        //             utilisateur:user._id||"",
        //             besoin:groupedBesoin?.besoin?._id||"",
        //             niveau:niveau.niveau,
        //             insuffisances,
        //             insuffisancesEn,
        //             formulationBesoins,
        //             commentaireAdminFr
        //         },
        //         lang
        //     ).then((e: ReponseApiPros) => {
        //         if (e.success) {
        //             createToast(e.message, '', 0);
        //             dispatch(createGroupedBesoinBesoinSlice({
        //                 groupedBesoinBesoin:{
        //                     _id: e.data._id,
        //                     utilisateur: e.data.utilisateur,
        //                     besoin: e.data.besoin,
        //                     niveau: e.data.niveau,
        //                     insuffisances: e.data.insuffisances,
        //                     insuffisancesEn: e.data.insuffisancesEn,
        //                     formulationBesoins: e.data.formulationBesoins,
        //                     commentaireAdminFr: e.data.commentaireAdminFr,
        //                     commentaireAdminEnFr: e.data.commentaireAdminEnFr,
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

        
        //     await updateGroupedBesoin(
        //         {
        //             _id: groupedBesoin?._id || "",
        //             niveau:niveau.niveau,
        //             insuffisances,
        //             insuffisancesEn,
        //             formulationBesoins,
        //             commentaireAdminFr  
        //         },
        //         lang
        //     ).then((e: ReponseApiPros) => {
        //         if (e.success) {
        //             createToast(e.message, '', 0);
        //             dispatch(updateGroupedBesoinBesoinSlice({
        //                 id: e.data._id,
        //                 groupedBesoinBesoinData : {
        //                      _id: e.data._id,
        //                     utilisateur: e.data.utilisateur,
        //                     besoin: e.data.besoin,
        //                     niveau: e.data.niveau,
        //                     insuffisances: e.data.insuffisances,
        //                     insuffisancesEn: e.data.insuffisancesEn,
        //                     formulationBesoins: e.data.formulationBesoins,
        //                     commentaireAdminFr: e.data.commentaireAdminFr,
        //                     commentaireAdminEnFr: e.data.commentaireAdminEnFr,
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

                <h2 className="text-xl font-semibold">{lang === 'fr' ? groupedBesoin?.titreFr||"" : groupedBesoin?.titreEn||""}</h2>
                <label>{t('label.niveau_auto_evaluation')}</label><label className="text-red-500"> *</label>
                <input
                    value={lang === 'fr' ? niveau?.nomFr || '' : niveau?.nomEn || ''}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    disabled
                />

                <label>{t('label.insuffisances')}</label>
                <textarea
                    rows={3}
                    value={insuffisances}
                    onChange={(e) => {setInsuffisances(e.target.value)}}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    placeholder={t('label.decrivez_insuffisances')}
                    disabled
                />
                
                <label>{t('label.besoins_en_renforcement')}</label>
                <textarea
                    rows={3}
                    value={formulationBesoins}
                    onChange={(e) => {setFormulationBesoins(e.target.value)}}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    placeholder={t('label.formulez_besoins')}
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

export default FormCreateUpdateEvaluation;

import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../../_redux/features/setting';
import { RootState } from '../../../../../_redux/store';
import CustomDialogModal from '../../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../../hooks/toastify';
import { createAutoEvaluation, updateAutoEvaluation } from '../../../../../services/elaborations/autoEvaluationBesoinAPI';
import { createAutoEvaluationBesoinSlice, updateAutoEvaluationBesoinSlice } from '../../../../../_redux/features/elaborations/autoEvaluationBesoinSlice';
import { NIVEAU_AUTO_EVALUATION, STATUT_BESOIN } from '../../../../../config';


function FormCreateUpdate({ autoEvaluation, user }: { autoEvaluation: AutoEvaluationBesoin | null, user:Utilisateur }) {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [niveau, setNiveau] = useState<NiveauAutoEvaluation | undefined>(undefined);
    const [insuffisancesFr, setInsuffisancesFr] = useState<string>('');
    const [insuffisancesEn, setInsuffisancesEn] = useState<string>('');
    const [formulationBesoinsFr, setFormulationBesoinsFr] = useState<string>('');
    const [formulationBesoinsEn, setFormulationBesoinsEn] = useState<string>('');
    const [commentaireAdmin, setCommentaireAdmin] = useState<string>('');
    const [statut, setStatut] = useState<StatutBesoin>();
    const statuts = Object.values(STATUT_BESOIN)

    const niveauxAutoEvaluation = Object.values(NIVEAU_AUTO_EVALUATION)

    

    const [errorNiveau, setErrorNiveau] = useState("");
    const [errorInsuffisance, setErrorInsuffisance] = useState("");
    const [errorFormulation, setErrorFormulation] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (autoEvaluation && autoEvaluation.niveau!==0) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.auto_evaluation'));
            const niv = niveauxAutoEvaluation.find(n=>n.niveau === autoEvaluation.niveau);
            setNiveau(niv)
            setInsuffisancesFr(autoEvaluation?.insuffisancesFr||"")
            setInsuffisancesEn(autoEvaluation?.insuffisancesEn||"")
            setFormulationBesoinsFr(autoEvaluation?.formulationBesoinsFr||"")
            setFormulationBesoinsEn(autoEvaluation?.formulationBesoinsEn||"")
            const commentaire = lang==='fr'?autoEvaluation.commentaireAdminFr:autoEvaluation.commentaireAdminEn
            setCommentaireAdmin(commentaire || "")
            const sta = statuts.find(st=>st.key === autoEvaluation.statut)
            setStatut(sta)

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.auto_evaluation'));
            setNiveau(undefined)
            setInsuffisancesFr("")
            setInsuffisancesEn("")
            setFormulationBesoinsFr("")
            setFormulationBesoinsEn("")
            setCommentaireAdmin("")
            setStatut(undefined)
        }


        if (isFirstRender) {
            setErrorInsuffisance("");
            setErrorNiveau("");
            setErrorFormulation("")
            setIsFirstRender(false);
        }
    }, [autoEvaluation, isFirstRender, t]);

    const closeModal = () => {
        setErrorNiveau("");
        setErrorInsuffisance("");
        setErrorFormulation("")
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

    const handleNiveauChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedNiveauNom = e.target.value;
        var selected=null;

        if (lang === 'fr') {
            selected = niveauxAutoEvaluation.find(na => na.nomFr === selectedNiveauNom);
        }
        else {
            selected = niveauxAutoEvaluation.find(na => na.nomEn === selectedNiveauNom);
        }
        
        if(selected){
            setNiveau(selected)
        }
        setErrorNiveau("")
    }

    const handleCreateUpdate = async () => {
        // if(!niveau || (!insuffisancesFr && !insuffisancesEn) || (!formulationBesoinsFr && !formulationBesoinsEn)){
        if(!niveau){
            if (!niveau) {
                setErrorNiveau(t('error.niveau'));
            }
            // if (!insuffisancesFr && !insuffisancesEn) {
            //     setErrorInsuffisance(t('error.insuffisances'))
            // }

            // if (!formulationBesoinsFr && !formulationBesoinsEn) {
            //     setErrorFormulation(t('error.formulation_besoins'))
            // }
            return;
        }
        // create
        if (!autoEvaluation || autoEvaluation.niveau === 0) {
            
            await createAutoEvaluation(
                {
                    utilisateur:user._id||"",
                    besoin:autoEvaluation?.besoin?._id||"",
                    niveau:niveau.niveau,
                    insuffisancesFr,
                    insuffisancesEn,
                    formulationBesoinsFr,
                    formulationBesoinsEn
                },
                lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createAutoEvaluationBesoinSlice({
                        autoEvaluationBesoin:{
                            _id: e.data._id,
                            utilisateur: e.data.utilisateur,
                            besoin: e.data.besoin,
                            niveau: e.data.niveau,
                            insuffisancesFr: e.data.insuffisancesFr,
                            insuffisancesEn: e.data.insuffisancesEn,
                            formulationBesoinsFr: e.data.formulationBesoinsFr,
                            formulationBesoinsEn: e.data.formulationBesoinsEn,
                            commentaireAdminFr: e.data.commentaireAdminFr,
                            commentaireAdminEn: e.data.commentaireAdminEn,
                            statut: e.data.statut
                        }
                    }));

                    closeModal();

                } else {
                    createToast(e.message, '', 2);

                }
            }).catch((e) => {
                createToast(e.response.data.message, '', 2);
            })
                

            
        }else {

        
            await updateAutoEvaluation(
                {
                    _id: autoEvaluation?._id || "",
                    niveau:niveau.niveau,
                    insuffisancesFr,
                    insuffisancesEn,
                    formulationBesoinsFr,
                    formulationBesoinsEn  
                },
                lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(updateAutoEvaluationBesoinSlice({
                        id: e.data._id,
                        autoEvaluationBesoinData : {
                             _id: e.data._id,
                            utilisateur: e.data.utilisateur,
                            besoin: e.data.besoin,
                            niveau: e.data.niveau,
                            insuffisancesFr: e.data.insuffisancesFr,
                            insuffisancesEn: e.data.insuffisancesEn,
                            formulationBesoinsFr: e.data.formulationBesoinsFr,
                            formulationBesoinsEn: e.data.formulationBesoinsEn,
                            commentaireAdminFr: e.data.commentaireAdminFr,
                            commentaireAdminEn: e.data.commentaireAdminEn,
                            statut: e.data.statut
                            
                        }
                    }));

                    closeModal();

                } else {
                    createToast(e.message, '', 2);
                }
            }).catch((e) => {
                createToast(e.response.data.message, '', 2);
            })
                
            
        }


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

                <h2 className="text-xl font-semibold">{lang === 'fr' ? autoEvaluation?.besoin?.titreFr||"" : autoEvaluation?.besoin?.titreEn||""}</h2>
                <label>{t('label.niveau_auto_evaluation')}</label><label className="text-red-500"> *</label>
                    <select
                        value={niveau?(lang==='fr'?niveau.nomFr:niveau.nomEn) : t('select_par_defaut.selectionnez') + t('select_par_defaut.niveau_evaluation')}
                        onChange={handleNiveauChange}
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    >
                        <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.niveau_evaluation')}</option>
                        {niveauxAutoEvaluation.map((na) => (
                            <option key={na.niveau} value={lang==='fr'?na.nomFr:na.nomEn}>
                                {lang==='fr'?na.nomFr:na.nomEn}
                            </option>
                        ))}
                    </select>
                {errorNiveau && <p className="text-red-500" >{errorNiveau}</p>}

                <label>{t('label.insuffisances_fr')}</label>
                <textarea
                    rows={3}
                    value={insuffisancesFr}
                    onChange={(e) => {setInsuffisancesFr(e.target.value); setErrorInsuffisance("")}}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    placeholder={t('label.decrivez_insuffisances')}
                />
                {errorInsuffisance && <p className="text-red-500" >{errorInsuffisance}</p>}
                <label>{t('label.insuffisances_en')}</label>
                <textarea
                    rows={3}
                    value={insuffisancesEn}
                    onChange={(e) => {setInsuffisancesEn(e.target.value); setErrorInsuffisance("")}}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    placeholder={t('label.decrivez_insuffisances')}
                />
                {errorInsuffisance && <p className="text-red-500" >{errorInsuffisance}</p>}
                <label>{t('label.besoins_en_renforcement_fr')}</label>
                <textarea
                    rows={3}
                    value={formulationBesoinsFr}
                    onChange={(e) => {setFormulationBesoinsFr(e.target.value); setErrorFormulation("")}}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    placeholder={t('label.formulez_besoins')}
                />
                {errorFormulation && <p className="text-red-500" >{errorFormulation}</p>}
                <label>{t('label.besoins_en_renforcement_en')}</label>
                <textarea
                    rows={3}
                    value={formulationBesoinsEn}
                    onChange={(e) => {setFormulationBesoinsEn(e.target.value); setErrorFormulation("")}}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    placeholder={t('label.formulez_besoins')}
                />
                {errorFormulation && <p className="text-red-500" >{errorFormulation}</p>}
                {(statut && statut?.key !== 'EN_ATTENTE' && statut?.key !== 'NON_EVALUE') && (
                    <>
                        <label>{t('label.statut')}</label>
                        <input
                        value={lang === 'fr' ? statut?.nomFr || '' : statut?.nomEn || ''}
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        disabled
                        />
                        
                        <label>{t('label.commentaire_admin')}</label>
                        <textarea
                        rows={3}
                        value={commentaireAdmin}
                        className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        disabled
                        />
                    </>
                )}

            </CustomDialogModal>

        </>
    );
}

export default FormCreateUpdate;

import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../../_redux/features/setting';
import { RootState } from '../../../../../_redux/store';
import CustomDialogModal from '../../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../../hooks/toastify';
import {createBesoinAjoute, updateBesoinAjoute } from '../../../../../services/elaborations/besoinAjouteUtilisateurAPI';
import { createBesoinAjouteUtilisateurSlice, updateBesoinAjouteUtilisateurSlice } from '../../../../../_redux/features/elaborations/besoinAjouteUtilisateurSlice';
import { STATUT_BESOIN } from '../../../../../config';


function FormCreateUpdate({ besoinAjouteUtilisateur, user }: { besoinAjouteUtilisateur: BesoinAjouteUtilisateur | null, user:Utilisateur }) {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [titreFr, setTitreFr] = useState<string>('');
    const [titreEn, setTitreEn] = useState<string>('');
    const [pointsAAmeliorerFr, setPointsAAmeliorerFr] = useState<string>('');
    const [pointsAAmeliorerEn, setPointsAAmeliorerEn] = useState<string>('');
    const [commentaireAdmin, setCommentaireAdmin] = useState<string>('');
    const [statut, setStatut] = useState<StatutBesoin>();
    const statuts = Object.values(STATUT_BESOIN)


    

    const [errorCompetence, setErrorCompetence] = useState("");
    const [errorPointAAmeliorer, setErrorPointAAmeliorer] = useState("");

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {
        if (besoinAjouteUtilisateur) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.competence'));
           
            setTitreFr(besoinAjouteUtilisateur?.titreFr||"")
            setTitreEn(besoinAjouteUtilisateur?.titreEn||"")
            setPointsAAmeliorerFr(besoinAjouteUtilisateur?.pointsAAmeliorerFr||"")
            setPointsAAmeliorerEn(besoinAjouteUtilisateur?.pointsAAmeliorerEn||"")
            const commentaire = lang==='fr'?besoinAjouteUtilisateur.commentaireAdminFr:besoinAjouteUtilisateur.commentaireAdminEn
            setCommentaireAdmin(commentaire || "")
            const sta = statuts.find(st=>st.key === besoinAjouteUtilisateur.statut)
            setStatut(sta)

        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.competence'));
            setTitreFr("")
            setTitreEn("")
            setPointsAAmeliorerFr("")
            setPointsAAmeliorerEn("")
            setCommentaireAdmin("")
            setStatut(undefined)
        }


        if (isFirstRender) {
            setErrorCompetence("");
            setErrorPointAAmeliorer("")
            setIsFirstRender(false);
        }
    }, [besoinAjouteUtilisateur, isFirstRender, t]);

    const closeModal = () => {
        setErrorCompetence("");
        setErrorPointAAmeliorer("")
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

   
    const handleCreateUpdate = async () => {
        if((!titreFr && !titreEn) || (!pointsAAmeliorerFr && !pointsAAmeliorerEn)){
           
            if (!titreFr && !titreEn) {
                setErrorCompetence(t('error.competences'))
            }

            if (!pointsAAmeliorerFr && !pointsAAmeliorerEn) {
                setErrorPointAAmeliorer(t('error.points_a_ameliorer'))
            }
            return;
        }
        // create
        if (!besoinAjouteUtilisateur) {
            
            await createBesoinAjoute(
                {
                    utilisateur:user._id||"",
                    titreFr,
                    titreEn,
                    pointsAAmeliorerFr,
                    pointsAAmeliorerEn
                },
                lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createBesoinAjouteUtilisateurSlice({
                        besoinAjouteUtilisateur:{
                            _id: e.data._id,
                            utilisateur: e.data.utilisateur,
                            titreFr: e.data.titreFr,
                            titreEn: e.data.titreEn,
                            pointsAAmeliorerFr: e.data.pointsAAmeliorerFr,
                            pointsAAmeliorerEn: e.data.pointsAAmeliorerEn,
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

        
            await updateBesoinAjoute(
                {
                    _id: besoinAjouteUtilisateur?._id || "",
                    titreFr,
                    titreEn,
                    pointsAAmeliorerFr,
                    pointsAAmeliorerEn  
                },
                lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(updateBesoinAjouteUtilisateurSlice({
                        id: e.data._id,
                        besoinAjouteUtilisateurData : {
                             _id: e.data._id,
                            utilisateur: e.data.utilisateur,
                            titreFr: e.data.titreFr,
                            titreEn: e.data.titreEn,
                            pointsAAmeliorerFr: e.data.pointsAAmeliorerFr,
                            pointsAAmeliorerEn: e.data.pointsAAmeliorerEn,
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

                <label>{t('label.competence_fr')}</label>
                <input
                    value={titreFr}
                    onChange={(e) => {setTitreFr(e.target.value); setErrorCompetence("")}}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                />
                {errorCompetence && <p className="text-red-500" >{errorCompetence}</p>}
                <label>{t('label.competence_en')}</label>
                <input
                    value={titreEn}
                    onChange={(e) => {setTitreEn(e.target.value); setErrorCompetence("")}}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                />
                {errorCompetence && <p className="text-red-500" >{errorCompetence}</p>}
                <label>{t('label.points_a_ameliorer_fr')}</label>
                <textarea
                    rows={3}
                    value={pointsAAmeliorerFr}
                    onChange={(e) => {setPointsAAmeliorerFr(e.target.value); setErrorPointAAmeliorer("")}}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    placeholder={t('label.formulez_points_a_ameliorer')}
                />
                {errorPointAAmeliorer && <p className="text-red-500" >{errorPointAAmeliorer}</p>}
                <label>{t('label.points_a_ameliorer_en')}</label>
                <textarea
                    rows={3}
                    value={pointsAAmeliorerEn}
                    onChange={(e) => {setPointsAAmeliorerEn(e.target.value); setErrorPointAAmeliorer("")}}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    placeholder={t('label.formulez_points_a_ameliorer')}
                />
                {errorPointAAmeliorer && <p className="text-red-500" >{errorPointAAmeliorer}</p>}
                {(statut && statut?.key !== 'EN_ATTENTE') && (
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

import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../../_redux/features/setting';
import { RootState } from '../../../../_redux/store';
import CustomDialogModal from '../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../hooks/toastify';
import { createTacheStagiaireSlice, updateTacheStagiaireSlice } from '../../../../_redux/features/stagiaire/tacheStagiaireSlice';
import { STATUT_TACHE_STAGIAIRE } from '../../../../config';
import { createTacheStagiaire, updateTacheStagiaire } from '../../../../services/stagiaires/tacheStagiaireAPI';
import { formatDateForInput } from '../../../../fonctions/fonction';


function FormCreateUpdate({ tacheStagiaire, onAdd, onUpdate }: { tacheStagiaire: TacheStagiaire | null, onAdd: (depense: Depense) => void; onUpdate: (depense: Depense) => void; }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { t } = useTranslation();
    const selectedStagiaire = useSelector((state: RootState) => state.stagiaireSlice.selectedStagiaire);

    const statuts = Object.values(STATUT_TACHE_STAGIAIRE)
    const dispatch = useDispatch();
    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [date, setDate] = useState("");
    const [statut, setStatut] = useState<StatutTacheStagiaire | undefined>(statuts[0] || undefined);
    
    

    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");
    const [errorDate, setErrorDate] = useState("");
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        
        if (tacheStagiaire) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.tache_stagiaire'));
            
            setNomFr(tacheStagiaire.nomFr);
            setNomEn(tacheStagiaire.nomEn)
            setDescriptionFr(tacheStagiaire.descriptionFr || "")
            setDescriptionEn(tacheStagiaire.descriptionEn || "")
            setDate(formatDateForInput(tacheStagiaire.date) || "")
            const statut = statuts.find(sta => sta.key === tacheStagiaire.status);
            setStatut(statut)
            
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.tache_stagiaire'));
            
            setNomFr("");
            setNomEn("");
            setDescriptionFr("")
            setDescriptionEn("")
            setStatut(statuts[0] || undefined)
            setDate("")
            
        }


        if (isFirstRender) {
            setErrorNomFr("");
            setErrorNomEn("")
            setErrorDate("")
            
            setIsFirstRender(false);
        }
    }, [tacheStagiaire, isFirstRender, t]);

    const closeModal = () => {
        setErrorNomFr("");
        setErrorNomEn("");
        setErrorDate("")
        setIsFirstRender(true);
        dispatch(setShowModal());
    };


   const handleStatutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRoleNom = e.target.value;
        var selected=null;

        if (lang === 'fr') {
            selected = statuts.find(statut => statut.nomFr === selectedRoleNom);
        }
        else {
            selected = statuts.find(statut => statut.nomEn === selectedRoleNom);
        }
        
        if(selected){
            setStatut(selected)
        }
    }


    const handleCreateTacheStagiaire = async () => {
        if (!nomFr || !nomEn || !date) {
            if (!nomFr) {
                setErrorNomFr(t('error.nom_fr'));
            }

            if(!nomEn){
                setErrorNomEn(t("error.nom_en"))
            }

            if(!date){
                setErrorDate(t("error.date"))
            }

            return;
        }

        if (!tacheStagiaire ) {
            await createTacheStagiaire(
                {
                    nomFr,
                    nomEn,
                    descriptionFr,
                    descriptionEn,
                    status: statut?.key || "",
                    date
                }, selectedStagiaire?._id||"",lang
            ).then((e: ReponseApiPros) => {
                
                if (e.success) {
                    createToast(e.message, '', 0);
                    onAdd(e.data);
                    dispatch(createTacheStagiaireSlice({

                        tacheStagiaire: {
                            _id: e.data._id,
                            nomFr: e.data.nomFr,
                            nomEn: e.data.nomEn,
                            descriptionFr:e.data.descriptionFr,
                            descriptionEn:e.data.descriptionEn,
                            status: e.data.status,
                            date:e.data.date
                        }

                    }));

                    closeModal();

                } else {
                    createToast(e.message, '', 2);

                }
            }).catch((e) => {
                console.log(e);
                createToast(e.response.data.message, '', 2);
            })
        } else {
            await updateTacheStagiaire(
                tacheStagiaire._id||"",
                {
                    _id: tacheStagiaire._id,
                    nomFr,
                    nomEn,
                    descriptionFr,
                    descriptionEn,
                    status: statut?.key || "",
                    date
                }, lang).then((e: ReponseApiPros) => {
                    if (e.success) {
                        createToast(e.message, '', 0);
                        onUpdate(e.data);
                        dispatch(updateTacheStagiaireSlice({
                            id: e.data._id,
                            tacheStagiaireData: {
                                _id: e.data._id,
                                nomFr: e.data.nomFr,
                                nomEn: e.data.nomEn,
                                descriptionFr:e.data.descriptionFr,
                                descriptionEn:e.data.descriptionEn,
                                status: e.data.status,
                                date:e.data.date
                            }

                        }));

                        closeModal();

                    } else {
                        createToast(e.message, '', 2);

                    }
                }).catch((e) => {
                    console.log(e);
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
                handleConfirm={handleCreateTacheStagiaire}
            >
                
                <label>{t('label.nom_chose_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={nomFr}
                    onChange={(e) => { setNomFr(e.target.value); setErrorNomFr("") }}
                />
                {errorNomFr && <p className="text-red-500" >{errorNomFr}</p>}
                
                <label>{t('label.nom_chose_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={nomEn}
                    onChange={(e) => { setNomEn(e.target.value); setErrorNomEn("") }}
                />
                {errorNomEn && <p className="text-red-500" >{errorNomEn}</p>}
                <label>{t('label.descrip_fr')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={descriptionFr}
                    onChange={(e) => { setDescriptionFr(e.target.value) }}
                />
                <label>{t('label.descrip_en')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={descriptionEn}
                    onChange={(e) => { setDescriptionEn(e.target.value) }}
                />
                <label>{t('label.date')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={date}
                    onChange={(e) => { setDate(e.target.value); setErrorDate("") }}
                />
                {errorDate && <p className="text-red-500" >{errorDate}</p>}
                <label>{t('label.statut')}</label>
                <select
                    value={statut? (lang === 'fr' ? statut.nomFr : statut.nomEn) : (statuts.length>0? (lang === 'fr' ? statuts[0].nomFr : statuts[0].nomEn):t('select_par_defaut.selectionnez') + t('select_par_defaut.type_depense'))}
                    onChange={handleStatutChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    {statuts.map(statut => (
                        <option key={statut.key} value={(lang === 'fr' ? statut.nomFr : statut.nomEn)}>{(lang === 'fr' ? statut.nomFr : statut.nomEn)}</option>
                    ))}
                </select>
            </CustomDialogModal>

        </>
    );
}



export default FormCreateUpdate;

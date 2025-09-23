import { useDispatch, useSelector } from 'react-redux';
import { setShowModal, setShowModalDatesEffectives } from '../../../../../_redux/features/setting';
import { RootState } from '../../../../../_redux/store';
import CustomDialogModal from '../../../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import createToast from '../../../../../hooks/toastify';
import { updateLieuFormation } from '../../../../../services/elaborations/lieuFormationAPI';
import { updateLieuFormationSlice } from '../../../../../_redux/features/elaborations/lieuFormationSlice';
import { formatDateForInput } from '../../../../../fonctions/fonction';


function FormUpdateDatesEffectives({ lieuFormation, themeId }: { lieuFormation: LieuFormation | null, themeId:string }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const { t } = useTranslation();

    const dispatch = useDispatch();
   
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    
    

    const [errorDateDebut, setErrorDateDebut] = useState("");
    
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.openDatesEffectives);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        
        if (lieuFormation) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.dates_effective_lieu_formation'));
            
         
            setDateDebut(formatDateForInput(lieuFormation.dateDebutEffective) || "");
            setDateFin(formatDateForInput(lieuFormation.dateFinEffective) || "");
            
        } 


        if (isFirstRender) {
            setErrorDateDebut("")
            
            setIsFirstRender(false);
        }
    }, [lieuFormation, isFirstRender, t]);

    const closeModal = () => {
        setErrorDateDebut("")
        setIsFirstRender(true);
        dispatch(setShowModalDatesEffectives());
    };





    const handleUpdateDateEffective = async () => {
        if (!dateDebut || (dateFin && !dateDebut) || !lieuFormation) {
            
            if (!dateDebut) {
                setErrorDateDebut(t('error.date_debut'));
            }

            if ((dateFin && !dateDebut)) {
                setErrorDateDebut(t('error.date_debut'));
            }

            return;
        }

        
        await updateLieuFormation(
            {
                _id: lieuFormation._id,
                lieu:lieuFormation.lieu,
                cohortes:lieuFormation.cohortes,
                participants:lieuFormation.participants,
                dateDebut:lieuFormation.dateDebut,
                dateFin:lieuFormation.dateFin,
                dateDebutEffective:dateDebut,
                dateFinEffective:dateFin

        }, themeId,lang).then((e: ReponseApiPros) => {
            if (e.success) {
                createToast(e.message, '', 0);
                dispatch(updateLieuFormationSlice({
                    id: e.data._id,
                    lieuFormationData: {
                        _id: e.data._id,
                        lieu: e.data.lieu,
                        cohortes: e.data.cohortes,
                        participants:e.data.participants,
                        dateDebut:e.data.dateDebut,
                        dateFin:e.data.dateFin,
                        dateDebutEffective:e.data.dateDebutEffective,
                        dateFinEffective:e.data.dateFinEffective
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


    
    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleUpdateDateEffective}
            >
                
                 <label>{t('label.date_debut_effective')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateDebut}
                    onChange={(e) => {setDateDebut(e.target.value); setErrorDateDebut("")}}
                />
                {errorDateDebut && <p className="text-red-500" >{errorDateDebut}</p>}
                 <label>{t('label.date_fin_effective')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="date"
                    value={dateFin}
                    onChange={(e) => {setDateFin(e.target.value)}}
                />
            </CustomDialogModal>

        </>
    );
}



export default FormUpdateDatesEffectives;

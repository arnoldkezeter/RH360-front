import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../_redux/store';
import CustomDialogModal from '../CustomDialogModal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { setShowModal } from '../../../_redux/features/setting';
import createToast from '../../../hooks/toastify';
import { setAnneeCourante, setSemestreCourant } from '../../../_redux/features/data_setting_slice';
import { extractYear, formatYear, generateYearRange2 } from '../../../fonctions/fonction';
import { semestres } from '../../../pages/CommonPage/EmploiDeTemp';
import { apiUpdateAnneeCourante, apiUpdateSemestreCourant } from '../../../api/settings/api_data_setting';


function ModalCreateUpdate() {
    const { t } = useTranslation();

    const dispatch = useDispatch();
    

    const currentYear=useSelector((state: RootState) => state.dataSetting.dataSetting.anneeCourante) ?? 2023; 
    const firstYear=useSelector((state: RootState) => state.dataSetting.dataSetting.premiereAnnee) ?? 2023; 
    const currentSemester=useSelector((state: RootState) => state.dataSetting.dataSetting.semestreCourant) ?? 1;

    const [semestre, setSemestre] = useState(currentSemester);
    const [annee, setAnnee] = useState(currentYear);

    const [isFirstRender, setIsFirstRender] = useState(true);


    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal
    const lang = useSelector((state: RootState) => state.setting.language);

    useEffect(() => {  
        setModalTitle(t('form_update.annee_semestre'));
        setAnnee(currentYear);
        setSemestre(currentSemester);

        if (isFirstRender) {
            setIsFirstRender(false);
        }
    }, [isFirstRender, t, currentYear, currentSemester]);

    const closeModal = () => {
       
        setIsFirstRender(true);
        dispatch(setShowModal());
    };


    const handleCreateUpdate = async () => {
        
        // creation
        if(annee!=currentYear){
            
            await apiUpdateAnneeCourante(
                {annee}
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    const resp=e.data;
                    dispatch(setAnneeCourante(resp));
                    closeModal();
    
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
    
                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
            })
        }
        // console.log(semestre+" != "+currentSemester)
        if(semestre!=currentSemester){
            await apiUpdateSemestreCourant(
                {semestre}
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    dispatch(setSemestreCourant(e.data));
                    closeModal();
    
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
    
                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
            })
        }
        
        if(annee==currentYear && semestre==currentSemester){
            closeModal();
        }
        

    }

    const handleSemestreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSemestre(parseInt(event.target.value));
    };

    const handleAnneeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        
        setAnnee(extractYear(event.target.value));
        
    };

    return (
        <>
            <CustomDialogModal
                title={modalTitle} // Utilisation du titre dynamique
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
            >
                <label>{t('label.annee')}</label><label className="text-red-500"> *</label>
                <select
                    value={formatYear(annee)}
                    onChange={handleAnneeChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    {/* <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.semestre')}</option> */}
                    {generateYearRange2(annee, firstYear).map((semestre, index) => (
                        <option key={index} value={semestre}>{semestre}</option>
                    ))}

                </select>
                <label>{t('label.semestre')}</label><label className="text-red-500"> *</label>
                <select
                    value={semestre}
                    onChange={handleSemestreChange}
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                >
                    {/* <option value="">{t('select_par_defaut.selectionnez') + t('select_par_defaut.semestre')}</option> */}
                    {semestres.map((semestre, index) => (
                        <option key={index} value={semestre}>{semestre}</option>
                    ))}

                </select>

            </CustomDialogModal>

        </>
    );
}

export default ModalCreateUpdate;


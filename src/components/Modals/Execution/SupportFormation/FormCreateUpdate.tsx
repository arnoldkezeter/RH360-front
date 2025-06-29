import { useDispatch, useSelector } from 'react-redux';
import CustomDialogModal from '../../CustomDialogModal';
import { RootState } from '../../../../_redux/store';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MAX_FILE_SIZE } from '../../../../config';
import { setShowModal } from '../../../../_redux/features/setting';
import createToast from '../../../../hooks/toastify';
import { createSupportFormation, updateSupportFormation } from '../../../../services/executions/supportFormationAPI';
import { createSupportFormationSlice, updateSupportFormationSlice } from '../../../../_redux/features/execution/supportFormationSlice';


function FormCreateUpdate({ supportFormation, theme }: { supportFormation: SupportFormation | null, theme:ThemeFormation|undefined }) {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    
    
    
    

    const { t } = useTranslation();

    const dispatch = useDispatch();
    const [nomFr, setNomFr] = useState("");
    const [nomEn, setNomEn] = useState("");
    const [descriptionFr, setDescriptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
    const [fichier, setFile] = useState<File | null>(null);
   

    const [errorNomFr, setErrorNomFr] = useState("");
    const [errorNomEn, setErrorNomEn] = useState("");
    const [errorFichier, setErrorFichier] = useState("");
 
    const [isFirstRender, setIsFirstRender] = useState(true);

    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState(""); // Ajout du titre du modal

    useEffect(() => {
        if (supportFormation) {
            setModalTitle(t('form_update.enregistrer') + t('form_update.support_formation'));
            
           
            setNomFr(supportFormation.nomFr);
            setNomEn(supportFormation.nomEn); 
            setDescriptionEn(supportFormation?.descriptionEn || "");
            setDescriptionFr(supportFormation?.descriptionFr|| "");
            
            
           
        } else {
            setModalTitle(t('form_save.enregistrer') + t('form_save.support_formation'));
            setNomFr("");
            setNomEn("");
            
            setDescriptionFr("");
            setDescriptionEn("");
           
            setFile(null)
           
           
        }


        if (isFirstRender) {
            setErrorNomFr("");
            setErrorNomEn("");
            setErrorFichier("");
            setIsFirstRender(false);
        }
    }, [supportFormation, isFirstRender, t]);

    const closeModal = () => {
        setErrorNomFr("");
        setErrorNomEn("");
        setErrorFichier("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

   
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          const selectedFile = e.target.files[0];
          if (selectedFile.size > MAX_FILE_SIZE) {
            const msg = t('error.telecharger_doc');
            createToast(msg, '', 2);
            // setErrorFichier(msg);
            setFile(null); // Clear the fichier
          } else {
            setFile(selectedFile);
            setErrorFichier('');
          }
        }
      };





    const handleCreateSupportFormation = async () => {
        if (!nomFr || !nomEn ||  (!supportFormation && !fichier) || !theme) {
            if (!nomFr) {
                setErrorNomFr(t('error.nom_fr'));
            }
            if (!nomEn) {
                setErrorNomEn(t('error.nom_en'));
            }


            if(!supportFormation && !fichier){
                setErrorFichier(t('error.fichier'));
            }

           
            return;
        }
        

        if (!supportFormation) {  
            
            await createSupportFormation(
                {
                    nomFr,
                    nomEn,
                    descriptionFr,
                    descriptionEn,
                    theme
                },fichier, lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(createSupportFormationSlice({
                        
                        supportFormation: {
                            _id: e.data._id,
                            nomFr: e.data.nomFr,
                            nomEn: e.data.nomEn,
                            descriptionFr: e.data.descriptionFr,
                            descriptionEn: e.data.descriptionEn,
                            fichier: e.data.fichier,
                            theme:e.data.theme
                        }
                        
                    }));

                    closeModal();

                } else {
                    createToast(e.message, '', 2);

                }
            }).catch((e) => {
                createToast(e.response.data.message, '', 2);
            })
        } else {
            
            await updateSupportFormation(
                {
                    nomFr,
                    nomEn,
                    descriptionFr,
                    descriptionEn,
                    theme
                }, fichier, lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    dispatch(updateSupportFormationSlice({
                        id:e.data._id,
                        supportFormationData: {
                            _id: e.data._id,
                            nomFr: e.data.nomFr,
                            nomEn: e.data.nomEn,
                            descriptionFr: e.data.descriptionFr,
                            descriptionEn: e.data.descriptionEn,
                            fichier: e.data.fichier,
                            theme:e.data.theme
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
                handleConfirm={handleCreateSupportFormation}
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
                    onChange={(e) => setNomEn(e.target.value)}
                />
                {errorNomEn && <p className="text-red-500" >{errorNomEn}</p>}
                <label>{t('label.descrip_fr')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={descriptionFr}
                    onChange={(e) => setDescriptionFr(e.target.value)}
                />
                <label>{t('label.descrip_en')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={descriptionEn}
                    onChange={(e) => { setDescriptionEn(e.target.value) }}
                />
               
                <label>{t('label.support_formation')}</label>{!supportFormation && <label className="text-red-500"> *</label>}
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="file"
                    onChange={handleFileChange}
                />
                {!supportFormation  && errorFichier && <p className="text-red-500">{errorFichier}</p>}
                
            </CustomDialogModal>

        </>
    );
}



export default FormCreateUpdate;

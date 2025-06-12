import { useDispatch, useSelector } from 'react-redux';
import { setShowModal } from '../../../_redux/features/setting';
import { RootState } from '../../../_redux/store';
import { useEffect, useState } from 'react';
import CustomDialogModal from '../CustomDialogModal';
import { useTranslation } from 'react-i18next';
import createToast from '../../../hooks/toastify';
import { apiCreatePermission, apiUpdatePermission } from '../../../services/api_permission';
import { createPermission, updatePermission } from '../../../_redux/features/permission_slice';



function ModalCreateUpdate({ permission  }: { permission: PermissionType | null }) {
    const lang:string = useSelector((state: RootState) => state.setting.language); // fr ou en
    const {t}=useTranslation();
    

    const dispatch = useDispatch();
    const [nom, setNom] = useState("");
    const [libelleFr, setLibelleFr] = useState("");
    const [libelleEn, setLibelleEn] = useState("");
    const [descriptionFr, setDesctiptionFr] = useState("");
    const [descriptionEn, setDescriptionEn] = useState("");
   
    
    const [errorNom, setErrorNom] = useState("");
    const [errorLibelleFr, setErrorLibelleFr] = useState("");
    const [errorLibelleEn, setErrorLibelleEn] = useState("");
   
    const [isFirstRender, setIsFirstRender] = useState(true);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.open);
    const [modalTitle, setModalTitle] = useState("");
    const currentUser: Utilisateur = useSelector((state: RootState) => state.user);

    
   
    useEffect(() => {
        
        if (permission) {
            setModalTitle(t('form_update.enregistrer')+t('form_update.permission'));
            
            setNom(permission.nom);
            setLibelleFr(permission.libelleFr);
            setLibelleEn(permission.libelleEn);
            setDesctiptionFr(permission.descriptionFr);
            setDescriptionEn(permission.descriptionEn);
            
            
        }else{
            setModalTitle(t('form_save.enregistrer')+t('form_save.permission'));
            
            setNom("");
            setLibelleFr("");
            setLibelleEn("");
            setDesctiptionFr("");
            setDescriptionEn("")
        }
        if (isFirstRender) {
            setErrorNom("");
            setErrorLibelleFr("");
            setErrorLibelleEn("");
            setDesctiptionFr("");
            setDescriptionEn("");
            setIsFirstRender(false);
        }
    }, [permission,  isFirstRender, t]);

    const closeModal = () => {
        setErrorNom("");
        setErrorLibelleFr("");
        setErrorLibelleEn("");
        setIsFirstRender(true);
        dispatch(setShowModal());
    };

   

    const handleCreateUpdate = async () => {
        // Vérifier si tous les champs requis sont remplis
        if (!nom || !libelleFr || !libelleEn) {
            if (!nom) {
                setErrorNom(t('error.code'));
            }

            if (!libelleFr) {
                setErrorLibelleFr(t('error.libelle_fr'));
            }
            if (!libelleEn) {
                setErrorLibelleEn(t('error.libelle_en'));
            }
            
            return;
        }
       
        if (!permission) {
           
            
            await apiCreatePermission(
                {
                    nom:nom, 
                    libelleFr:libelleFr, 
                    libelleEn:libelleEn, 
                    descriptionFr:descriptionFr,
                    descriptionEn:descriptionEn
                    
                }
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    dispatch(createPermission({
                        
                        permission: {
                            _id: e.data._id,
                            nom: e.data.nom,
                            libelleFr: e.data.libelleFr,
                            libelleEn: e.data.libelleEn,
                            descriptionFr : e.data.descriptionFr,
                            descriptionEn : e.data.descriptionEn
                        }
                        
                    }));
                    // dispatch(ajouterPermission({...e.data}))
                    closeModal();

                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);

                }
            }).catch((e) => {
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
            })
        
            
        }else{
            
            await apiUpdatePermission(
                {
                    _id:permission._id, 
                    nom:nom, 
                    libelleFr:libelleFr, 
                    libelleEn:libelleEn, 
                    descriptionFr:descriptionFr,
                    descriptionEn:descriptionEn
                    
                }
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    
                    // dispatch(modifierPermission({...e.data}))
                    dispatch(
                        updatePermission({
                            id: e.data._id,
                            permissionData: {
                                _id: e.data._id,
                                nom: e.data.nom,
                                libelleFr: e.data.libelleFr,
                                libelleEn: e.data.libelleEn,
                                descriptionFr : e.data.descriptionFr,
                                descriptionEn : e.data.descriptionEn
                            }
                        }));
                    createToast(e.message[lang as keyof typeof e.message], '', 0);
                    closeModal();
                } else {
                    createToast(e.message[lang as keyof typeof e.message], '', 2);
                }
            }).catch((e) => {
                createToast(e.responsmatiere.message[lang as keyof typeof e.responsmatiere.message], '', 2);
            })
            
        }
    };

    return (
        <>
            <CustomDialogModal
                title={modalTitle}
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleCreateUpdate}
            >                
                <label>{t('label.code')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={nom}
                    onChange={(e) => { setNom(e.target.value); setErrorNom("") }}
                />
                {errorNom && <p className="text-red-500">{errorNom}</p>} 
                <label>{t('label.libelle_fr')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelleFr}
                    onChange={(e) => { setLibelleFr(e.target.value); setErrorLibelleFr("") }}
                />
                {errorLibelleFr && <p className="text-red-500">{errorLibelleFr}</p>}
                <label>{t('label.libelle_en')}</label><label className="text-red-500"> *</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={libelleEn}
                    onChange={(e) => { setLibelleEn(e.target.value); setErrorLibelleEn("") }}
                />
                {errorLibelleEn && <p className="text-red-500">{errorLibelleEn}</p>}
                <label>{t('label.descrip_fr')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={descriptionFr}
                    onChange={(e) => { setDesctiptionFr(e.target.value); }}
                />
                <label>{t('label.descrip_en')}</label>
                <input
                    className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                    type="text"
                    value={descriptionEn}
                    onChange={(e) => { setDescriptionEn(e.target.value); }}
                />
            </CustomDialogModal>
        </>
    );
}

export default ModalCreateUpdate;



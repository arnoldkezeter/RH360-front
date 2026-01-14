import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ChangeEvent, useEffect, useState } from 'react';
import { RootState } from '../../../../_redux/store';
import { setShowRoleModal } from '../../../../_redux/features/setting';
import { config } from '../../../../config';
import { updateUtilisateur } from '../../../../services/utilisateurs/utilisateurAPI';
import createToast from '../../../../hooks/toastify';
import { updateUtilisateurSlice } from '../../../../_redux/features/utilisateurs/utilisateurSlice';
import CustomDialogModal from '../../CustomDialogModal';

function FormRoles({ utilisateur }: { utilisateur: Utilisateur | null }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isModalOpen = useSelector((state: RootState) => state.setting.showModal.addRole);
    const closeModal = () => { dispatch(setShowRoleModal()); setRolesData(utilisateur?.roles)};
    const lang = useSelector((state: RootState) => state.setting.language);
    const roles = config.manager_roles;
    const [rolesData, setRolesData] = useState<string[]|undefined>(); // État de la matière

    const handleUpdateRole = async () => {
        setIsLoading(true);
        if(utilisateur){await updateUtilisateur({
                    ...utilisateur,
                    roles:rolesData
                }, lang
            ).then((e: ReponseApiPros) => {
                if (e.success) {
                    createToast(e.message, '', 0);
                    if(utilisateur._id){
                        dispatch(updateUtilisateurSlice({
                            id: e.data._id,
                            utilisateurData: e.data
                        }));
                    }
                        
                    closeModal();

                } else {
                    createToast(e.message, '', 2);

                }
            }).catch((e) => {
                console.log(e);
                createToast(e.response.data.message[lang as keyof typeof e.response.data.message], '', 2);
            }).finally(() => {
                setIsLoading(false);
            })
        }
    }
    useEffect(()=>{
        setRolesData(utilisateur?.roles);
    },[utilisateur])
    const displayRole = (roleName: string) => {
        if (roleName === roles.admin) {
            return lang === 'fr' ? 'Administrateur' : 'Administrator';
        }
        if (roleName === roles.gestionnaire) {
            return lang === 'fr' ? 'Gestionnaire' : 'Manager';
        }
        if (roleName === roles.responsable) {
            return lang === 'fr' ? 'Responsable Formation' : 'Training Manager';
        }
        if (roleName === roles.utilisateur) {
            return lang === 'fr' ? 'Utilisateur' : 'User';
        }
    }

    const handleRoleChange = (e: ChangeEvent<HTMLInputElement>, roleName: string) => {
        const isChecked = e.target.checked;
        let updatedRoles: string[] = [];
        
        if (utilisateur && utilisateur._id) {
            if (isChecked) {
                updatedRoles = [...(rolesData || []), roleName];                 
            } else {
                updatedRoles = (rolesData || []).filter(r => r !== roleName);
            }
            
            if(roleName!==roles.utilisateur){
                setRolesData(updatedRoles);
            }   
           
        }
    };

    return (
        <>
            <CustomDialogModal
                title={t('form_update.roles')}
                isModalOpen={isModalOpen}
                isDelete={false}
                closeModal={closeModal}
                handleConfirm={handleUpdateRole}
                isLoading={isLoading}
            >
                <h1>{t('label.nom_chose')+ " : "+utilisateur?.nom+" "+utilisateur?.prenom||""}</h1>
                {Object.entries(roles).map(([roleKey, roleName]) => (
                    (roleName !== roles.superAdmin) && (
                        <div key={roleKey}>
                            <input type="checkbox"
                                checked={rolesData?.includes(roleName)}
                                onChange={(e) => handleRoleChange(e, roleName)}
                            />

                            {displayRole(roleName)}
                        </div>
                    )
                ))}
            </CustomDialogModal>
        </>
    );
}

export default FormRoles;

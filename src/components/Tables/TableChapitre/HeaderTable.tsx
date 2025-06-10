import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { useEffect, useState } from "react";
import { config } from "../../../config";
interface HeaderChapitreProps {
    matiere:MatiereType | undefined | null
    
}

const HeaderTable = ({ matiere }: HeaderChapitreProps) => {
    const {t}=useTranslation();
    const typesEnseignement=useSelector((state: RootState) => state.dataSetting.dataSetting.typesEnseignement); 
    const [typesEnseignementMat, setTypesEnseignementMat] = useState<CommonSettingProps[]>([]);
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    useEffect(() => {
        if (matiere && matiere.typesEnseignement) {
            const listeTypesEnseignementDeMatiere = matiere.typesEnseignement
                // .map(type => type)
                .map(objectId => typesEnseignement.find(type => type._id === objectId))
                .filter(type => type !== undefined) as CommonSettingProps[];
            setTypesEnseignementMat(listeTypesEnseignementDeMatiere);
        }
    }, [matiere, typesEnseignement]);
    return (

        <thead className=''>
            <tr className="bg-graydark text-left dark:bg-bodydark text-[12px] md:text-[13px]">
                {/* #  */}
                <th className="min-w-[50px] pl-4 md:pl-5 lg:pl-6 xl:pl-5 font-medium text-gray-2 dark:text-white  border-r border-gray-3 dark:border-black hidden md:table-cell">
                    #
                </th>

                {/* matricule */}
                <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black hidden md:table-cell">
                    {t('label.code')}
                </th>

                {/* libelle */}
                <th className="min-w-[120px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    {t('label.libelle')}
                </th>

                {(roles.admin === userRole || roles.superAdmin === userRole || roles.enseignant === userRole) && <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black ">
                    {t('label.statut')} 
                </th>}
                
                <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black ">
                    CM
                </th>
                <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    TD
                </th>
                <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    TP
                </th>
                {/* <th className="min-w-[120px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black hidden md:table-cell">
                    Objectifs
                </th>
                <th className="min-w-[120px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black hidden md:table-cell">
                    Compétences
                </th> */}
        
                {/* Actions  */}
                {(roles.admin === userRole || roles.superAdmin === userRole || roles.enseignant === userRole) && <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white">
                    {t('label.actions')}
                </th>}
            </tr>
        </thead>
    )
}

export default HeaderTable
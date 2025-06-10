import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";

const HeaderTable = () => {
    const {t}=useTranslation();
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageHomeworkPermission = userPermissions.includes('gerer_cahiers_exercices');
    const hasSeeHomeworkPermission = userPermissions.includes('consulter_cahiers_exercices');
    const hasManageQuestionPermission = userPermissions.includes('gerer_questions');
    const hasSeeStatPermission = userPermissions.includes('consulter_statistiques');
    const hasCompleteAssPermission = userPermissions.includes('effectuer_devoir');
    return (

        <thead className=''>
            <tr className="bg-graydark text-left dark:bg-bodydark text-[12px] md:text-[13px]">
                {/* #  */}
                <th className="min-w-[50px] pl-4 md:pl-5 lg:pl-6 xl:pl-5 font-medium text-gray-2 dark:text-white  border-r border-gray-3 dark:border-black hidden md:table-cell">
                    #
                </th>

                {/* Titre */}
                <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    {t('label.titre')}
                </th>

                {/* Enseignant */}
                <th className="min-w-[120px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    {t('label.enseignant')}
                </th>
                

                {/* Nombre de question */}
                <th className="min-w-[120px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    {t('label.nombre_question')}
                </th>
            
                {/* Volume horaire  */}
                <th className="min-w-[100px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black ">
                    {t('label.deadline')}
                </th>

                {/* Actions  */}
                {(hasManageHomeworkPermission || hasSeeHomeworkPermission || hasManageQuestionPermission
                    || hasSeeStatPermission || hasCompleteAssPermission) &&  <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white">
                    {t('label.actions')}
                </th>}
            </tr>
        </thead>
    )
}

export default HeaderTable
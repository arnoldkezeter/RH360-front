import { useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";
import { useTranslation } from "react-i18next";

const HeaderTable = () => {
    const {t}=useTranslation();
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageCalendarPermission = userPermissions.includes('gerer_calendrier_academique');
    return (

        <thead className=''>
            <tr className="bg-graydark text-left dark:bg-bodydark text-[12px] md:text-[13px]">
                {/* #  */}
                {/* <th className="min-w-[50px] pl-4 md:pl-5 lg:pl-6 xl:pl-5 font-medium text-gray-2 dark:text-white  border-r border-gray-3 dark:border-black hidden md:table-cell">
                    #
                </th> */}

                {/* numéro Evènement */}
                <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black hidden md:table-cell">
                    {t('label.n_evenement')}
                </th>

                {/* Libellé */}
                <th className="min-w-[120px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    {t('label.phase_activite')}
                </th>
                

                {/* Période */}
                <th className="min-w-[120px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    {t('label.periode')}
                </th>
            
                {/* Personnel  */}
                <th className="min-w-[100px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black hidden md:table-cell">
                    {t('label.personnel')}
                </th>

                {/* Description/obsercation */}
                <th className="min-w-[120px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black hidden md:table-cell">
                    {t('label.description')}
                </th>

                {/* Etat */}
                <th className="min-w-[120px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black ">
                    {t('label.etat')}
                </th>

                {/* Actions  */}
                {hasManageCalendarPermission && (<th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white">
                    {t('label.actions')}
                </th>)}
            </tr>
        </thead>
    )
}

export default HeaderTable
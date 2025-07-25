import { useTranslation } from "react-i18next"


const HeaderTable = () => {
    const {t}=useTranslation();
    return (

        <thead >
            <tr className="bg-graydark text-left dark:bg-bodydark text-[12px] md:text-[13px]">
                {/* #  */}
                <th className="min-w-[50px] pl-4 md:pl-5 lg:pl-6 xl:pl-5 font-medium text-gray-2 dark:text-white  border-r border-gray-3 dark:border-black hidden md:table-cell">
                    #
                </th>


                {/* competence */}
                <th className="min-w-[120px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    {t('label.competence')}
                </th>
                

                {/* note */}
                <th className="min-w-[120px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    {t('label.points_a_ameliorer')}
                </th>
            
                {/* statut  */}
                <th className="min-w-[100px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black hidden md:table-cell">
                    {t('label.statut')}
                </th>
               
                {/* Actions  */}
                {<th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white">
                    {t('label.actions')}
                </th>}
            </tr>
        </thead>
    )
}

export default HeaderTable
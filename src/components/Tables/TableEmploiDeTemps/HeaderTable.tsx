import { useTranslation } from "react-i18next"

const HeaderTable = () => {
    const {t}=useTranslation();
    return (

        <thead className=''>
            <tr className="bg-graydark text-left dark:bg-bodydark text-[12px] md:text-[13px]">
                {/* Horaire */}
                <th className="min-w-[60px] pl-4 md:pl-5 lg:pl-6 xl:pl-5 font-medium text-gray-2 dark:text-white  border-r border-gray-3 dark:border-black">
                    {t('label.horaire')}
                </th>
                
                {/* lundi */}
                <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    {t('label.lundi')}
                </th>

                {/*mardi */}
                <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    {t('label.mardi')}
                </th>
                

                {/* mercredi */}
                <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    {t('label.mercredi')}
                </th>

                {/* Jeudi  */}
                <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    {t('label.jeudi')}
                </th>

                {/* Vendredi */}
                <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    {t('label.vendredi')}
                </th>

                {/* Samedi */}
                <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white xl:pl-4  border-r border-gray-3 dark:border-black">
                    {t('label.samedi')}
                </th>


                {/* Dimanche */}
                <th className="min-w-[60px] py-2 px-4 font-medium text-gray-2 dark:text-white">
                    {t('label.dimanche')}
                </th>
            </tr>
        </thead>
    )
}

export default HeaderTable
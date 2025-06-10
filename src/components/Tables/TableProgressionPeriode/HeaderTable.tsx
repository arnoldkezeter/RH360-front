import { useTranslation } from "react-i18next"

const HeaderTable = () => {
    const {t}=useTranslation();
    return (

        <thead className=''>
            <tr className="bg-graydark text-left dark:bg-bodydark text-[12px] md:text-[13px]">
                {/* #  */}
                <th className="min-w-[50px] pl-4 md:pl-5 lg:pl-6 xl:pl-5 font-medium text-gray-2 dark:text-white  border-r border-gray-3 dark:border-black text-center" colSpan={4}>
                    {t('label.title_progression')}
                </th>
            </tr>
        </thead>
    )
}

export default HeaderTable
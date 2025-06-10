import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";

const HeaderTable = () => {
    const {t}=useTranslation();
    const selectedUserPermission = useSelector((state: RootState) => state.setting.selectedUserPermission);
    return (

        <thead className=''>
            <tr className="bg-graydark text-left dark:bg-bodydark text-[12px] md:text-[13px]">
                {/* #  */}
                <th  className="min-w-[50px] pl-4 md:pl-5 lg:pl-6 xl:pl-5 font-medium text-gray-2 dark:text-white  border-r border-gray-3 dark:border-black " colSpan={3}>
                    {`${t('label.permissions')}${selectedUserPermission?" : "+selectedUserPermission.nom+" "+selectedUserPermission?.prenom || "" :""}`}
                </th>
                
            </tr>
        </thead>
    )
}

export default HeaderTable
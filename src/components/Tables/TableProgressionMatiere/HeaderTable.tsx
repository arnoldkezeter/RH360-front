import { useSelector } from "react-redux";
import { RootState } from "../../../_redux/store";

const HeaderTable = ({matiere}:{matiere:MatiereType | undefined}) => {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    return (

        <thead className=''>
            <tr className="bg-graydark text-left dark:bg-bodydark text-[12px] md:text-[13px]">
                {/* #  */}
                <th  className="min-w-[50px] pl-4 md:pl-5 lg:pl-6 xl:pl-5 font-medium text-gray-2 dark:text-white  border-r border-gray-3 dark:border-black " colSpan={3}>
                    {matiere?lang==='fr'?matiere.libelleFr:matiere.libelleEn:""}
                </th>
                
            </tr>
        </thead>
    )
}

export default HeaderTable
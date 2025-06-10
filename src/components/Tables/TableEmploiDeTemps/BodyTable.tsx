import { useDispatch } from "react-redux"
import { capitalizeFirstLetter } from "../../../fonctions/fonction"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setShowModalUpdate } from "../../../_redux/features/setting"


const BodyTable = ({ data }: { data: PeriodeType[] }) => {

    const dispatch = useDispatch();

    return <tbody>
        {data.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* horaires de cours */}
                <td className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5> </h5>
                </td>

                {/* cours de lundi */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5> </h5>
                </td>

                {/*cours de mardi*/}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5> </h5>
                </td>

                {/* cours de mercredi */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5> </h5>
                </td>


                {/* cours de jeudi */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5> </h5>
                </td>

                {/* cours de vendredi */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                    <h5> </h5>
                </td>

                {/* cours de samedi */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5> </h5>
                </td>

                {/* cours de dimanche */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                    <h5> </h5>
                </td>

            </tr>
        ))}
    </tbody>
}

export default BodyTable
import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setShowModal, setShowModalDelete, setShowModalUpdate } from "../../../_redux/features/setting"
import { RootState } from "../../../_redux/store";

const BodyTable = ({ data, onEdit }: { data: SalleDeCoursProps[], onEdit: (salleCours: SalleDeCoursProps) => void }) => {
    const lang = useSelector((state: RootState) => state.setting.language);
    const dispatch = useDispatch();

    return <tbody>
        {data.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5 className="">{index + 1}</h5>
                </td>

                {/* matricule */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                    <h5>{item.code}</h5>
                </td>

                {/* nom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{lang == 'fr' ? item.libelleFr : item.libelleEn}</h5>   
                </td>

                {/* Nombre de place */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{""+item.nbPlace}</h5>
                </td>

                {/* classes
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{item.classe}</h5>
                </td> */}

                {/* email */}
                {/* <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5>{item.volumeHoraire}</h5>
                </td> */}

                {/* contact */}
                {/* <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">                    
                    <h5>{capitalizeFirstLetter(item.contact)}</h5>
                </td> */}
                

                {/* Action  bouton pour edit*/}
                <td className="border-b border-[#eee] py-0 px-0 dark:border-strokedark">
                    <ButtonCrudTable
                        onClickEdit={() => {
                            onEdit(item);
                            dispatch(setShowModal())
                        }}
                        onClickDelete={() => {
                            onEdit(item);
                            dispatch(setShowModalDelete())
                        }}
                    />
                </td>
            </tr>
        ))}
    </tbody>
}

export default BodyTable
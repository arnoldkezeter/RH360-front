import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../../common/ButtonActionTable"
import { setShowModal, setShowModalDelete } from "../../../../_redux/features/setting"
import { RootState } from "../../../../_redux/store";
import { METHODES_VALIDATIONS } from "../../../../config";

const BodyTable = ({ data, onEdit }: { data?: TacheGenerique[], onEdit: (structure: TacheGenerique) => void }) => {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const dispatch = useDispatch();
    const methodesValidations = Object.values(METHODES_VALIDATIONS)
    return <tbody>
        {data?.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark hidden md:table-cell">
                    <h5 className="">{index + 1}</h5>
                </td>
                
                {/* nom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{lang === 'fr' ? item.nomFr : item.nomEn}</h5>
                </td>

                {/*description*/}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                    <h5>{lang === 'fr' ? item.descriptionFr : item.descriptionEn}</h5>
                </td>

                 {/* methode validation */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{lang==="fr"?methodesValidations.find(methode=>methode.key === item?.methodeValidation)?.nomFr || "":methodesValidations.find(methode=>methode.key === item.methodeValidation)?.nomEn || ""}</h5>
                </td>
                

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
import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../../common/ButtonActionTable"
import { setShowModal, setShowModalDelete } from "../../../../_redux/features/setting"
import { RootState } from "../../../../_redux/store";


const BodyTable = ({ data, onEdit }: { data: Region[], onEdit: (region: Region) => void }) => {
    const lang = useSelector((state: RootState) => state.setting.language);

    const dispatch = useDispatch();


    return <tbody>
        {data.map((item, index) => (
            <tr key={item._id} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5 className="">{index + 1}</h5>
                </td>

                {/* matricule */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                    <h5>{item.code}</h5>
                </td>

                {/* libelle */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{lang == 'fr' ? item.nomFr : item.nomEn}</h5>
                </td>

                {/* Action  bouton pour edit*/}
                <td className="border-b border-[#eee] py-0 px-0 dark:border-strokedark">
                    <ButtonCrudTable
                        onClickEdit={() => {
                            onEdit(item);
                            dispatch(setShowModal())
                        }}
                        onClickDelete={async () => {
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
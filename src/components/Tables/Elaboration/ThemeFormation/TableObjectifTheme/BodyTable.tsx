import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../../../common/ButtonActionTable"
import { setShowModal, setShowModalDelete } from "../../../../../_redux/features/setting"
import { RootState } from "../../../../../_redux/store";

const BodyTable = ({ data, onEdit}: { data: ObjectifTheme[], onEdit: (objectifTheme: ObjectifTheme) => void }) => {
    const lang = useSelector((state: RootState) => state.setting.language); 
    const dispatch = useDispatch();
    
    return <tbody>
        {data && data.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-2 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark  hidden md:table-cell align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5 className="">{index + 1}</h5>
                    </div>
                </td>

                {/* titre */}
                <td className="border-b border-[#eee] py-2 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{lang==='fr'?item.nomFr:item.nomEn}</h5>
                    </div>
                </td>

                


                {/* Action bouton pour edit */}
                <td className="border-b border-[#eee] py-2 lg:py-4 px-2 dark:border-strokedark align-top">
                    <div className="min-h-[40px] flex items-center justify-center gap-1">
                        <ButtonCrudTable
                            onClickEdit={() => {
                                onEdit(item);
                                dispatch(setShowModal());
                            }}
                            onClickDelete={() => {
                                onEdit(item);
                                dispatch(setShowModalDelete())
                            }}
                        />
                        
                    </div>
                </td>
            </tr>
        ))}
    </tbody>
}

export default BodyTable
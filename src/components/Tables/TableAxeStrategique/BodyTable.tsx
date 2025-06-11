import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setShowModal, setShowModalDelete } from "../../../_redux/features/setting"
import { RootState } from "../../../_redux/store";
import { useTranslation } from "react-i18next";
import { config } from "../../../config";

const BodyTable = ({ data, onEdit }: { data?: Structure[], onEdit: (structure: Structure) => void }) => {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const dispatch = useDispatch();
    const {t}=useTranslation();
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    return <tbody>
        {data?.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
               
                {/* nom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{lang === 'fr' ? item.nomFr : item.nomEn}</h5>
                </td>

                {/*description*/}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{lang === 'fr' ? item.descriptionFr : item.descriptionEn}</h5>
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
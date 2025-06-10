import { useDispatch } from "react-redux"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setSelectedUserPermission, setSelectedUserRole, setShowModal, setShowModalDelete } from "../../../_redux/features/setting"
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { config } from "../../../config";
import { SelectButton } from "../common/composants/SelectButton";

const BodyTable = ({ data, onEdit }: { data: AdminType[], onEdit: (admin: AdminType) => void }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    return <tbody>
        {data.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5 className="">{index + 1}</h5>
                </td>

                {/* matricule */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                    <h5>{item.matricule ? item.matricule : ""}</h5>
                </td>

                {/* nom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{item.nom}</h5>
                </td>

                {/* prenom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{item.prenom ? item.prenom : ""}</h5>
                </td>

                {/* classes
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{item.classe}</h5>
                </td> */}

                {/* email */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5>{item.email}</h5>
                </td>

                {/* contact */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                    <h5>{item.contact ? item.contact : ""}</h5>
                </td>


                {/* Action  bouton pour edit*/}
                <td className="border-b border-[#eee] py-1 px-0 dark:border-strokedark flex justify-center items-center">
                    <SelectButton
                        listPage={[
                            {
                                "name": t('label.permissions'),
                                "handleClick": () => {dispatch(setSelectedUserRole(config.roles.admin));dispatch(setSelectedUserPermission(item)); navigate('/user/permissions')}
                            },
                        ]}
                    />
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
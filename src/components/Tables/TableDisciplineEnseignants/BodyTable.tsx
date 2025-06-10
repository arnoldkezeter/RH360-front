import { useDispatch, useSelector } from "react-redux"
import { nbTotalAbsences, nbTotalAbsencesJustifier, nbTotalAbsencesNonJustifier } from "../../../fonctions/fonction"
import { useNavigate } from "react-router-dom"
import { setEnseignantSelected } from "../../../_redux/features/absence/discipline_enseignant_slice"
import { MdOutlineManageAccounts } from "react-icons/md";
import ButtonCrudTable from "../common/ButtonActionTable";
import { RootState } from "../../../_redux/store";
import { config } from "../../../config";


const BodyTable = ({ data, onEdit}: { data: UserDiscipline[], onEdit: (enseignant : UserDiscipline) => void }) => {

    const dispatch = useDispatch();

    const navigate = useNavigate();
    const currentUser:UserState = useSelector((state: RootState) => state.user);
    const roles = config.roles;
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageTeacherDisciplinePermission = userPermissions.includes('consulter_liste_enseignant');
    const hasJustifyTeacherAbsencePermission = userPermissions.includes('justifier_absences_enseignant');
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

                {/* nombre d'heure d'absence */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-5 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{nbTotalAbsences(item.absences)}</h5>
                </td>

                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{nbTotalAbsencesJustifier(item.absences)}</h5>
                </td>
                <td className="border-b border-[#eee] py-0 lg:py-4 px-5 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{nbTotalAbsencesNonJustifier(item.absences)}</h5>
                </td>

                {/* Action  bouton pour edit*/}
                {hasManageTeacherDisciplinePermission && <td className="border-b border-[#eee] py-0 px-0 dark:border-strokedark flex justify-center items-center">
                    <ButtonCrudTable
                        onClickAddHour={() => {
                            onEdit(item);
                        }}
                    />

                    {hasJustifyTeacherAbsencePermission && (<button
                        className="bg-primary text-white px-6 py-2 mx-4 rounded-lg hover:bg-opacity-75"
                        onClick={() => {
                            dispatch(setEnseignantSelected(item))
                            navigate('/teachers/disciplines/manage')

                        }}>
                        <MdOutlineManageAccounts className="text-lg" />
                    </button>)}

                </td>}
            </tr>
        ))}
    </tbody>
}

export default BodyTable
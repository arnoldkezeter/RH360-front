import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setShowModal, setShowModalDelete } from "../../../_redux/features/setting"
import { RootState } from "../../../_redux/store"
import { config } from "../../../config"
import { useNavigate } from "react-router-dom"
import { SelectButton } from "../common/composants/SelectButton"
import { useTranslation } from "react-i18next"
import { setPeriodeSelected } from "../../../_redux/features/periode_enseignement_slice"
import { formatDateWithLang } from "../../../fonctions/fonction"

interface BodyPeriodeEnseignementProps {
    data: PeriodeEnseignementType[];
    onEdit: (matiere : PeriodeEnseignementType) => void;
}

const BodyTable = ({ data, onEdit }: BodyPeriodeEnseignementProps) => {
    const navigate = useNavigate();
    const lang = useSelector((state: RootState) => state.setting.language);
    
    const {t}=useTranslation();
    const dispatch = useDispatch();
    const userRole = useSelector((state: RootState) => state.user.role);
    const roles = config.roles;
    const userPermissions = useSelector((state: RootState) => state.setting.userPermissions) ?? [];
    const hasManageTeachingPeriodPermission = userPermissions.includes('gerer_periodes_enseignements');
    const hasManageSubjectTeachingPeriodPermission = userPermissions.includes('gerer_matiere_periode_enseignement');

    return <tbody>
        {data && data.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5 className="">{index + 1}</h5>
                </td>

                {/* periode */}
                <td className="border-b border-[#eee] py-0 px-4 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5> {lang === 'fr' ? item.periodeFr : item.periodeEn}</h5>
                </td>

                {/* date début */}
                <td className="border-b border-[#eee] py-0 px-4 dark:border-strokedark">
                    <h5>{formatDateWithLang(item.dateDebut, lang)}</h5>
                </td>

                {/* date fin */}
                <td className="border-b border-[#eee] py-0 px-4 dark:border-strokedark bg-gray-2 dark:bg-black ">
                    <h5>{formatDateWithLang(item.dateFin, lang)}</h5>
                </td>

                {/* Action  bouton pour edit*/}
                {hasManageTeachingPeriodPermission && <td className="border-b border-[#eee] py-0 px-0 dark:border-strokedark flex justify-center items-center">
                    {hasManageSubjectTeachingPeriodPermission && <SelectButton
                        listPage={[
                           {
                                "name": t('label.enseignements'),
                                "handleClick": () => {dispatch(setPeriodeSelected(item));navigate('/subjects/periodes_enseignement/enseignements/manage')}
                            }
                        ]}
                    />}
                    <ButtonCrudTable
                        onClickEdit={() => {
                            onEdit(item);
                            dispatch(setShowModal())
                        }}
                        onClickDelete={roles.admin === userRole || roles.superAdmin === userRole ?() => {
                            onEdit(item);
                            dispatch(setShowModalDelete())
                        }:undefined}
                        
                        // onClickOpenChapitres={() => onAddEnseignement(item)} 
                    />
                    
                </td>}
            </tr>
        ))}
    </tbody>
}

export default BodyTable
import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../../common/ButtonActionTable"
import { setShowModal, setShowModalDelete } from "../../../../_redux/features/setting"
import { RootState } from "../../../../_redux/store";
import { SelectButton } from "../../common/composants/SelectButton";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const BodyTable = ({ data, onEdit, openUserCohorteManage }: { data?: Cohorte[], onEdit: (cohorte: Cohorte) => void, openUserCohorteManage:()=>void }) => {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const dispatch = useDispatch();
    const {t} = useTranslation();
    const navigate = useNavigate();
    
    return <tbody>
        {data?.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-2 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5 className="">{index + 1}</h5>
                    </div>
                </td>
                
                {/* nom */}
                <td className="border-b border-[#eee] py-2 lg:py-4 px-4 dark:border-strokedark align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{lang === 'fr' ? item.nomFr : item.nomEn}</h5>
                    </div>
                </td>

                {/*description*/}
                <td className="border-b border-[#eee] py-2 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{lang === 'fr' ? item.descriptionFr : item.descriptionEn}</h5>
                    </div>
                </td>

                <td className="border-b border-[#eee] py-2 lg:py-4 px-4 dark:border-strokedark align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{item.participants?.length || 0}</h5>
                    </div>
                </td>
                

                {/* Action  bouton pour edit*/}
                <td className="border-b border-[#eee] py-2 lg:py-4 px-2 dark:border-strokedark align-top">
                    <div className="min-h-[40px] flex items-center justify-center gap-1">
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

                        { (() => {
                            // Construire dynamiquement la liste des pages en fonction des permissions
                            const listPage = [];

                            
                            listPage.push({
                                name: t('label.gerer_utilisateur'),
                                handleClick: () => {
                                    // dispatch(setMatiereSelected(item));
                                    // navigate('/parametres/cohorte/utilisateur');
                                    onEdit(item);
                                    openUserCohorteManage()
                                },
                            });
                            

                            return listPage.length > 0 ? (
                                <SelectButton listPage={listPage} />
                            ) : null;
                        })()}
                    </div>
                </td>
            </tr>
        ))}
    </tbody>
}

export default BodyTable
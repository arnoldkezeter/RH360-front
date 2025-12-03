import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../../../common/ButtonActionTable"
import { setShowModal, setShowModalDelete } from "../../../../../_redux/features/setting"
import { SelectButton } from "../../../common/composants/SelectButton";
import { RootState } from "../../../../../_redux/store";
import { formatDateWithLang } from "../../../../../fonctions/fonction";
import { useTranslation } from "react-i18next";
import { setThemeFormationSelected } from "../../../../../_redux/features/elaborations/themeFormationSlice";
import { useNavigate } from "react-router-dom";

const BodyTable = ({ data, onEdit}: { data: ThemeFormation[], onEdit: (themeFormation: ThemeFormation) => void }) => {
    const lang = useSelector((state: RootState) => state.setting.language); 
    const dispatch = useDispatch();
    const {t}=useTranslation()
    const navigate = useNavigate();
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
                        <h5>{lang === 'fr' ? item.titreFr : item.titreEn}</h5>
                    </div>
                </td>

                {/* période */}
                <td className="border-b border-[#eee] py-2 lg:py-4 px-4 dark:border-strokedark align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>
                            {formatDateWithLang(item.dateDebut, lang) === formatDateWithLang(item.dateFin, lang) 
                                ? formatDateWithLang(item.dateDebut, lang)
                                : `${t('label.du')} ${formatDateWithLang(item.dateDebut, lang)} ${t('label.au')} ${formatDateWithLang(item?.dateFin, lang)}`
                            }
                        </h5>
                    </div>
                </td>

                {/* durée */}
                <td className="border-b border-[#eee] py-2 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{item?.duree || 0}</h5>
                    </div>
                </td>


                {/* budget estimatif */}
                <td className="border-b border-[#eee] py-2 lg:py-4 px-4 dark:border-strokedark align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{`${(item?.budgetEstimatif || 0)} ${lang === 'fr' ? "FCFA" : "XAF"}`}</h5>
                    </div>
                </td>

                {/* budget reel */}
                <td className="border-b border-[#eee] py-2 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{`${(item?.budgetReel || 0)} ${lang === 'fr' ? "FCFA" : "XAF"}`}</h5>
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
                        {(() => {
                        // Construire dynamiquement la liste des pages en fonction des permissions
                            const listPage = [];

                            listPage.push({
                                name: t('label.lieux_formation'),
                                handleClick: () => {
                                    dispatch(setThemeFormationSelected(item));
                                    navigate('/elaboration-programme/formation/theme-formation/lieux-formation');
                                },
                            });

                            listPage.push({
                                name: t('label.formateurs'),
                                handleClick: () => {
                                    dispatch(setThemeFormationSelected(item));
                                    navigate('/elaboration-programme/formation/theme-formation/formateurs');
                                },
                            });
                        

                            listPage.push({
                                name: t('label.progression'),
                                handleClick: () => {
                                    dispatch(setThemeFormationSelected(item));
                                    navigate(`/mes-formations/taches?participant=false&themeId=${item._id}`);
                                },
                            });

                        
                            listPage.push({
                                name: t('label.objectifs'),
                                handleClick: () => {
                                    dispatch(setThemeFormationSelected(item));
                                    navigate('/elaboration-programme/formation/theme-formation/objectifs');
                                },
                            });

                            listPage.push({
                                name: t('label.participants'),
                                handleClick: () => {
                                    dispatch(setThemeFormationSelected(item));
                                    navigate(`/formation/pariticipants?themeId=${item._id}`);
                                },
                            });

                            // listPage.push({
                            //     name: t('label.budget'),
                            //     handleClick: () => {
                            //         dispatch(setThemeFormationSelected(item));
                            //         navigate('/elaboration-programme/formation/theme-formation/budgets');
                            //     },
                            // });
                        

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
import { useDispatch } from "react-redux"
import ButtonCrudTable from "../../common/ButtonActionTable"
import { setShowModal, setShowModalDelete } from "../../../../_redux/features/setting"
import { setStagiaireSelected } from "../../../../_redux/features/stagiaire/stagiaireSlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SelectButton } from "../../common/composants/SelectButton";

const BodyTable = ({ data, onEdit}: { data: Stagiaire[], onEdit: (stagiaire: Stagiaire) => void }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {t}= useTranslation();
    return <tbody>
        {data && data.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark hidden md:table-cell align-top">
                    <h5 className=" align-top">{index + 1}</h5>
                </td>

                {/* nom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{item.nom}</h5>
                    </div>
                </td>

                {/* prenom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{item.prenom?item.prenom:""}</h5>
                    </div>
                </td>

                {/* email */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black  align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{item.email}</h5>
                    </div>
                </td>

                {/* contact */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{item?.telephone || ""}</h5>
                    </div>
                </td>

                

                {/* Action  bouton pour edit*/}
                <td className="border-b border-[#eee] py-1 px-0 dark:border-strokedark flex justify-center items-center align-top">
                    <div className="min-h-[40px] flex items-center justify-center gap-1">
                        <ButtonCrudTable
                            onClickEdit={() => {
                                onEdit(item);
                                dispatch(setShowModal());
                                
                                // console.log("id : "+stagiaire.id)
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
                                    name: t('label.carnet_stage'),
                                    handleClick: () => {
                                        dispatch(setStagiaireSelected(item));
                                        navigate('/stagiaire/carnet-stage');
                                    },
                                });

                                // listPage.push({
                                //     name: t('label.attestations_conventions'),
                                //     handleClick: () => {
                                //         dispatch(setStagiaireSelected(item));
                                //         // navigate('/stagiaire/attestations&convention');
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
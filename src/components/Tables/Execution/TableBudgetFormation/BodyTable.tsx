import { useDispatch, useSelector } from "react-redux"
import ButtonCrudTable from "../../common/ButtonActionTable"
import { setShowModal, setShowModalDelete } from "../../../../_redux/features/setting"
import { RootState } from "../../../../_redux/store";
import { calculerEcartDepenseTTC, calculerMontantTTC, getTaxeNamesString } from "../../../../fonctions/fonction";
import { setBudgetFormationSelected } from "../../../../_redux/features/elaborations/budgetFormationSlice";

const BodyTable = ({ data, onEdit }: { data?: Depense[], onEdit: (depense: Depense) => void }) => {
    const lang = useSelector((state: RootState) => state.setting.language); // fr ou en
    const dispatch = useDispatch();
    return <tbody>
        {data?.map((item, index) => (
            
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5 className="">{index + 1}</h5>
                </td>

                {/* nom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{lang=='fr'?item.nomFr:item.nomEn}</h5>
                </td>

                {/**quantite */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{item.quantite || "" }</h5>
                </td>

                {/* prix unitaire prevu */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{item.montantUnitairePrevu}</h5>
                </td>

                {/*prix unitaire reel*/}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{item?.montantUnitaireReel || ""}</h5>
                </td>

                {/* taxe */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{getTaxeNamesString(item.taxes, lang, true)}</h5>
                </td>

                {/*total unitaire prevu ht*/}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{calculerMontantTTC({depense:item, utiliserReel:false})}</h5>
                </td>

                {/* total unitaire reel ht */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark">
                    <h5>{calculerMontantTTC({depense:item, utiliserReel:true})}</h5>
                </td>

                {/*ecart*/}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{calculerEcartDepenseTTC(item)}</h5>
                </td>
                

                {/* Action  bouton pour edit*/}
                <td className="border-b border-[#eee] py-0 px-0 dark:border-strokedark">
                    <ButtonCrudTable
                        onClickEdit={() => {
                            onEdit(item);
                            dispatch(setBudgetFormationSelected(item.budget))
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
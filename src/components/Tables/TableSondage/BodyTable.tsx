import { useDispatch } from "react-redux"
import ButtonCrudTable from "../common/ButtonActionTable"
import { setShowModal, setShowModalDelete, setShowModalToDOSondage } from "../../../_redux/features/setting"
import { Sondage } from "../../../pages/Admin/Sondages";

const BodyTable = ({ data, onEdit, toDo }: { data: Sondage[], onEdit: (sondage: Sondage) => void, toDo: (sondage: Sondage) => void }) => {

    const dispatch = useDispatch();
    const displayRubrique=(item:Sondage)=>{
        let rubriquesToString = "";
        item.rubriques.forEach((rubrique)=>{
            if(item.rubriques.indexOf(rubrique)===0){
                rubriquesToString = rubrique.libelle
            }else{
                rubriquesToString=rubriquesToString+", "+rubrique.libelle;
            }
               
        })
        return rubriquesToString;
    }

    return <tbody>
        {data.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark bg-gray-2 dark:bg-black hidden md:table-cell">
                    <h5 className="">{index + 1}</h5>
                </td>

                {/* code */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                    <h5>{item.code}</h5>
                </td>

                {/* libelle */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{item.libelle}</h5>
                </td>
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell">
                    <h5>{item.matiere.libelle}</h5>
                </td>
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black">
                    <h5>{displayRubrique(item)}</h5>
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
                        onClickSondage={() => {
                            
                            toDo(item);
                            dispatch(setShowModalToDOSondage());
                        }}
                        
                    />
                </td>
            </tr>
        ))}
    </tbody>
}

export default BodyTable
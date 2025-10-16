import { useDispatch } from "react-redux"
import ButtonCrudTable from "../../common/ButtonActionTable"
import { setShowModal, setShowModalDelete } from "../../../../_redux/features/setting"

const BodyTable = ({ data, onEdit}: { data: Utilisateur[], onEdit: (utilisateur: Utilisateur) => void }) => {

    const dispatch = useDispatch();
   
    
    return <tbody>
        {data && data.map((item, index) => (
            <tr key={index + 1} className="font-medium text-black dark:text-white text-[12px] md:text-[14px]">
                {/* index */}
                <td className="border-b border-[#eee] py-0 lg:py-4 pl-4 md:pl-5 lg:pl-6 xl:pl-5 dark:border-strokedark hidden md:table-cell align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{index + 1}</h5>
                    </div>
                </td>

                {/* matricule */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{item.matricule?item.matricule:""}</h5>
                    </div>
                </td>

                {/* nom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{item.nom}</h5>
                    </div>
                </td>

                {/* prenom */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{item.prenom?item.prenom:""}</h5>
                    </div>
                </td>

                {/* classes
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{item.classe}</h5>
                    </div>
                </td> */}

                {/* email */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark hidden md:table-cell align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{item.email}</h5>
                    </div>
                </td>

                {/* contact */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-4 dark:border-strokedark bg-gray-2 dark:bg-black align-top">
                    <div className="min-h-[40px] flex items-center">
                        <h5>{item?.telephone || ""}</h5>
                    </div>
                </td>
                

                {/* Action bouton pour edit */}
                <td className="border-b border-[#eee] py-0 lg:py-4 px-0 dark:border-strokedark align-top">
                    <div className="min-h-[40px] flex items-center justify-center">
                        <ButtonCrudTable
                            onClickEdit={() => {
                                onEdit(item);
                                dispatch(setShowModal());
                                
                                // console.log("id : "+utilisateur.id)
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
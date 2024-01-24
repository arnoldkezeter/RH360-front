// import { IoIosAdd } from "react-icons/io";
// import { FaRegEdit } from "react-icons/fa";
// import { RiDeleteBin6Line } from "react-icons/ri";
// import {
//     setShowModalDelete, setValueButtonid, setValueIndex,

//     deleteVehiculeType,
//     setValueDelete,
//     deleteMarque,
//     deleteEnergie,
//     deleteDepensesType,
//     setShowModalAdd,
//     setTitleTextAdd,
//     setValueSelectUpdate,
//     setShowModalUpdate,
//     deletePoste,
// } from "../../_redux/features/settings_slice.tsx";

// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "./../../_redux/store.tsx";
// import ModalConfirmDelete from "./Dialog_delete.tsx";
// import { deleteEnergiesApi, deleteMarqueApi, deletePosteApi, deleteTypeDeDepensesApi, deleteTypeVehiculeApi } from "../../api/configuration/delete/delete_configuration.tsx";
// import createToast from "../../hooks/toastify.tsx";



// interface CardConfigurationProps {
//     title: string;
//     list: string[];
//     buttonId: number;
// }

// function CardConfiguration({ title, list, buttonId }: CardConfigurationProps) {

//     const stateIndex = useSelector((state: RootState) => state.setting.index);
//     const stateButtonId = useSelector((state: RootState) => state.setting.buttonId);


//     const dispatch = useDispatch();

//     const handleShowModalDelete = () => { dispatch(setShowModalDelete()); }
//     const handleShowModalAdd = () => { dispatch(setShowModalAdd()); }
//     const handleShowModalUpdate = () => { dispatch(setShowModalUpdate()); }

//     const handleDeleteButtonClick = async (index: number, buttonId: number, valueDelete: string) => {
//         dispatch(setValueIndex(index))
//         dispatch(setValueButtonid(buttonId))
//         dispatch(setValueDelete(valueDelete))

//         handleShowModalDelete();
//     };


//     const handleUpdateButtonClick = async (index: number, buttonId: number, valueUpdate: string) => {
//         dispatch(setValueIndex(index))
//         dispatch(setValueButtonid(buttonId))
//         dispatch(setValueSelectUpdate(valueUpdate))

//         handleShowModalUpdate();
//     };


//     const handleAddButtonClick = async () => {
//         handleShowModalAdd();
//     };


//     return (
//         <div className="flex   border-b border-stroke  dark:border-strokedark h-max bg-white text-left dark:bg-boxdark ">


//             <div className=" mr-8 min-w-[200px]">
//                 <div className="flex text-md justify-start  items-center text-center rounded  px-5 font-medium text-gray hover:shadow-1 hover:bg-opacity-70 duration-300 " >
//                     <p className=" font-medium text-body dark:text-white  m-0 pt-2"> {title} </p>
//                 </div>
//             </div>
//             {/*  */}




//             {/*  */}
//             <div className="flex  w-full">

//                 {/* valeur de la liste */}
//                 <ul className="border-l border-r border-stroke  dark:border-strokedark  w-full
//                   text-md  dark:text-gray-2 dark:bg-black text-body ">
//                     {
//                         list.length > 0 ? list.map((item, index) => (
//                             <div className="flex hover:bg-gray hover:dark:bg-body  cursor-pointer  m-0 " key={index} >
//                                 <li className={`px-6 w-full p-2`} >{item}</li>

//                                 {/* Button Edit */}
//                                 <button className="hover:bg-body hover:dark:bg-gray flex text-sm gap-2 text-body hover:text-white hover:dark:text-body items-center py-2 px-3  dark:text-gray"
//                                     onClick={() => handleUpdateButtonClick(index, buttonId, item)}

//                                 >
//                                     <FaRegEdit />
//                                 </button>
//                                 {/* <button className="hover:bg-meta-1 flex text-sm  gap-2 text-body  hover:text-white items-center py-2 px-3" */}
//                                 <button className="hover:bg-meta-1 flex text-sm gap-2 text-body hover:text-white  items-center py-2 px-3  dark:text-gray"

//                                     onClick={() => handleDeleteButtonClick(index, buttonId, item)}
//                                 >
//                                     <RiDeleteBin6Line />
//                                 </button>
//                             </div>
//                         )) : (
//                             <div className="flex " >
//                                 <li className={`px-6  min-w-[500px] p-2`}>Aucun élément disponible !</li>

//                                 <div className="text-transparent py-2 px-3"> <RiDeleteBin6Line /> </div>
//                                 <div className="text-transparent py-2 px-3"> <RiDeleteBin6Line /> </div>
//                             </div>
//                         )
//                     }
//                 </ul>



//                 {/* Boouton ajouter */}
//                 < div className=" ml-auto pt-3" >
//                     <button
//                         onClick={() => {
//                             dispatch(setTitleTextAdd(title))
//                             dispatch(setValueButtonid(buttonId))
//                             handleAddButtonClick()
//                         }}
//                         className="
//                         dark:bg-primary hover:dark:text-white hover:dark:bg-primary bg-primary
//                         text-white hover:text-white
//                         mx-[40px]
                     
//                     flex  text-sm justify-center  items-center text-center rounded  hover:bg-primary py-2 px-5 font-medium hover:shadow-1 hover:bg-opacity-70  duration-300" >
//                         <div className="text-[20px] pr-1  ">
//                             <IoIosAdd />
//                         </div>
//                         <p className="text-md ">Ajouter</p>
//                     </button>

//                 </div>


//             </div>
//             {/*  */}


//             <ModalConfirmDelete handleConfirm={
//                 () => {
//                     // methode api pour supprimer   

//                     if (stateButtonId == 0) {
//                         deletePosteApi(stateIndex).then((e) => {
//                             if (e.status) {
//                                 dispatch(deletePoste(stateIndex));
//                                 createToast(e.message, "", 0);
//                             } else {
//                                 createToast('Une erreur est survenue, veuillez réessayer.', "", 2);
//                             }

//                         });

//                     }

//                     if (stateButtonId == 1) {

//                         deleteTypeVehiculeApi(stateIndex).then((e) => {


//                             if (e.status) {
//                                 dispatch(deleteVehiculeType(stateIndex));
//                                 createToast(e.message, "", 0);
//                             } else {
//                                 createToast('Une erreur est survenue, veuillez réessayer.', "", 2);
//                             }
//                         });



//                     }
//                     else if (stateButtonId == 2) {
//                         deleteMarqueApi(stateIndex).then((e) => {


//                             if (e.status) {
//                                 dispatch(deleteMarque(stateIndex));
//                                 createToast(e.message, "", 0);
//                             } else {
//                                 createToast('Une erreur est survenue, veuillez réessayer.', "", 2);
//                             }
//                         });



//                     }
//                     else if (stateButtonId == 3) {

//                         deleteEnergiesApi(stateIndex).then((e) => {


//                             if (e.status) {
//                                 dispatch(deleteEnergie(stateIndex));
//                                 createToast(e.message, "", 0);
//                             } else {
//                                 createToast('Une erreur est survenue, veuillez réessayer.', "", 2);
//                             }
//                         });



//                     }
//                     else if (stateButtonId == 4) {

//                         deleteTypeDeDepensesApi(stateIndex).then((e) => {


//                             if (e.status) {
//                                 dispatch(deleteDepensesType(stateIndex));
//                                 createToast(e.message, "", 0);
//                             } else {
//                                 createToast('Une erreur est survenue, veuillez réessayer.', "", 2);
//                             }
//                         });



//                     }
//                     //
//                     //
//                     handleShowModalDelete();
//                 }
//             } />




//         </div >

//     );
// }





// export default CardConfiguration;

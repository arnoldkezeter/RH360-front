
// import { Dialog, Transition } from '@headlessui/react'
// import { Fragment, useState } from 'react'
// import { IoMdClose } from "react-icons/io";
// import { addDepensesType, addEnergie, addMarque, addPoste, addVehiculeType, setShowModalAdd } from '../../_redux/features/settings_slice.tsx';
// import { RootState } from "../../_redux/store.tsx";
// import { useSelector, useDispatch } from "react-redux";
// import { addEnergiesApi, addPosteApi, addTypeDeDepensesApi, addTypeVehiculeApi, addeMarqueApi } from '../../api/configuration/add/add_configuration.tsx';
// import createToast from '../../hooks/toastify.tsx';



// function ModalConfirmAdd() {


//     const [newEntry, setNewEnrty] = useState("");

//     // controller l'affichage de la modal de confirmation de suppression 
//     const isModalOpen = useSelector((state: RootState) => state.setting.showModalAdd);

//     // titre de la boite de dial
//     const titleTextAdd = useSelector((state: RootState) => state.setting.titleTextAdd);
//     const buttonId = useSelector((state: RootState) => state.setting.buttonId);

//     const dispatch = useDispatch();

//     // fermer la modal
//     const closeModal = () => {
//         setNewEnrty("");
//         dispatch(setShowModalAdd());
//     };

//     const handleSubmit = (buttonId: number) => {
//         if (buttonId == 0) {
//             addPosteApi(newEntry).then((e) => {
//                 if (e.status && e.data) {
//                     dispatch(addPoste(e.data || ""));
//                     createToast(e.message, "", 0);
//                 } else {
//                     createToast('Une erreur est survenue, veuillez réessayer.', "", 2);
//                 }
//             });
//         }
//         else if (buttonId == 1) {
//             addTypeVehiculeApi(newEntry).then((e) => {
//                 if (e.status && e.data) {
//                     dispatch(addVehiculeType(e.data || ""));
//                     createToast(e.message, "", 0);
//                 } else {
//                     createToast('Une erreur est survenue, veuillez réessayer.', "", 2);
//                 }
//             });


//         }
//         else if (buttonId == 2) {
//             addeMarqueApi(newEntry).then((e) => {


//                 if (e.status && e.data) {
//                     dispatch(addMarque(e.data || ""));
//                     createToast(e.message, "", 0);
//                 } else {
//                     createToast('Une erreur est survenue, veuillez réessayer.', "", 2);
//                 }
//             });
//         }
//         else if (buttonId == 3) {
//             addEnergiesApi(newEntry).then((e) => {


//                 if (e.status && e.data) {
//                     dispatch(addEnergie(e.data || ""));
//                     createToast(e.message, "", 0);
//                 } else {
//                     createToast('Une erreur est survenue, veuillez réessayer.', "", 2);
//                 }
//             });
//         }
//         else if (buttonId == 4) {
//             addTypeDeDepensesApi(newEntry).then((e) => {


//                 if (e.status && e.data) {
//                     dispatch(addDepensesType(e.data || ""));
//                     createToast(e.message, "", 0);
//                 } else {
//                     createToast('Une erreur est survenue, veuillez réessayer.', "", 2);
//                 }
//             });
//         }



//         closeModal();
//     }


//     return (
//         <div>
//             <Transition
//                 show={isModalOpen}
//                 as={Fragment}

//             >
//                 <Dialog
//                     open={isModalOpen}
//                     as="div"
//                     className="relative z-10"
//                     onClose={() => { }}
//                 >
//                     <Transition.Child

//                         as={Fragment}
//                         enter="ease-out duration-300"
//                         enterFrom="opacity-0"
//                         enterTo="opacity-100"
//                         leave="ease-in duration-200"
//                         leaveFrom="opacity-100"
//                         leaveTo="opacity-0"
//                     >
//                         <div className="fixed inset-0 bg-black/75  dark:bg-white/10" />
//                     </Transition.Child>

//                     <div className="fixed inset-0  w-screen overflow-y-auto overflow-x-hidden ">
//                         <div className="flex min-h-full w-screen   items-center justify-center p-4 text-center">
//                             <Transition.Child
//                                 as={Fragment}
//                                 enter="ease-out duration-300"
//                                 enterFrom="opacity-0 scale-95"
//                                 enterTo="opacity-100 scale-100"
//                                 leave="ease-in duration-200"
//                                 leaveFrom="opacity-100 scale-100"
//                                 leaveTo="opacity-0 scale-95"
//                             >
//                                 <Dialog.Panel className="mt-[90px] w-[600px] transform overflow-hidden rounded-2xl bg-white dark:bg-boxdark p-6 text-left align-middle shadow-xl transition-all">
//                                     <Dialog.Title
//                                         as="h3"
//                                         className="text-lg font-medium leading-6 text-gray-900 "
//                                     >
//                                         <div className='flex justify-between items-center dark:text-gray'>
//                                             {titleTextAdd}
//                                             <div
//                                                 onClick={() => closeModal()}
//                                                 className='h-6 w-6 cursor-pointer flex items-center justify-center hover:bg-body rounded-full hover:text-white'>
//                                                 <IoMdClose />
//                                             </div>

//                                         </div>
//                                     </Dialog.Title>


//                                     <div className='py-5 mb-6'>
//                                         <input
//                                             className="w-full rounded border border-stroke bg-gray py-3 pl-4 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
//                                             type="text"
//                                             value={newEntry}
//                                             onChange={(e) => setNewEnrty(e.target.value)}
//                                         />
//                                     </div>



//                                     <div className="flex justify-end gap-4.5">
//                                         <button
//                                             className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
//                                             onClick={() => closeModal()}
//                                         >
//                                             Annuler
//                                         </button>
//                                         <button
//                                             className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-70"
//                                             onClick={() => {
//                                                 handleSubmit(buttonId);
//                                             }}
//                                         >
//                                             Ajouter
//                                         </button>
//                                     </div>
//                                 </Dialog.Panel>
//                             </Transition.Child>
//                         </div>
//                     </div>
//                 </Dialog>
//             </Transition>
//         </div>
//     );
// };

// export default ModalConfirmAdd




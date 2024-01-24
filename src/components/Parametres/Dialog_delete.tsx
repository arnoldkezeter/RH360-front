
// import { Dialog, Transition } from '@headlessui/react'
// import { Fragment } from 'react'
// import { IoMdClose } from "react-icons/io";
// import { setShowModalDelete } from '../../_redux/features/settings_slice';
// import { RootState } from "./../../_redux/store.tsx";
// import { useSelector, useDispatch } from "react-redux";


// interface ModalConfirmDeleteProps {
//     handleConfirm: () => void;
// }

// function ModalConfirmDelete({ handleConfirm }: ModalConfirmDeleteProps) {

//     // controller l'affichage de la modal de confirmation de suppression 
//     const isModalOpen = useSelector((state: RootState) => state.setting.showModalDelete);

//     // valeur a supprimer
//     const stateValueDelete = useSelector((state: RootState) => state.setting.valueDelete);

//     const dispatch = useDispatch();

//     const closeModal = () => {
//         dispatch(setShowModalDelete());
//     };


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
//                         <div className="fixed inset-0 bg-black/25  dark:bg-white/10" />
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
//                                         <div className='flex justify-between items-center text-lg text-graydark font-bold  dark:text-gray'>
//                                             Confirmer la suppréssion

//                                             <div
//                                                 onClick={() => closeModal()}
//                                                 className='h-6 w-6 cursor-pointer flex items-center justify-center hover:bg-body rounded-full hover:text-white'>
//                                                 <IoMdClose />
//                                             </div>

//                                         </div>
//                                     </Dialog.Title>


//                                     <div className='py-5 mb-6'>
//                                         <h3>Souhaitez vous supprimer : <span className='underline text-primary font-semibold'>{stateValueDelete}</span> ?</h3>
//                                     </div>


//                                     <div className="flex justify-end gap-4.5">
//                                         <button
//                                             className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
//                                             onClick={() => closeModal()}
//                                         >
//                                             Annuler
//                                         </button>
//                                         <button
//                                             className="flex justify-center rounded bg-meta-1 py-2 px-6 font-medium text-gray hover:bg-opacity-70"
//                                             onClick={() => handleConfirm()}
//                                         >
//                                             Supprimer
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

// export default ModalConfirmDelete




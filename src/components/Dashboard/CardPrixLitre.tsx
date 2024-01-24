// import { useSelector } from "react-redux";
// import { RootState } from "../../_redux/store";


// const CardPrixAuLitre = () => {

//     const listEnergie = useSelector((state: RootState) => state.setting.energies);

//     return (
//         <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">


//             <div className="flex items-end justify-between">
//                 {/* NOMBRE NUMERIQUE */}
//                 <div className="pb-5">
//                     <h4 className="text-[14px] font-medium text-boxdark dark:text-white ml-1 text-start">
//                         {
//                             listEnergie.map((value, index) => (
//                                 <h2 className="pb-.5" key={index}>{value} : <span className="font-bold text-meta-4 dark:text-white">0.08  €/l </span></h2>
//                             ))
//                         }



//                     </h4>
//                 </div>


//                 {/* ICONE UP */}
//                 <span className="flex items-center gap-1 text-sm font-medium text-meta-5 ">
//                     Prix moyen au litre

//                     <svg
//                         className="fill-meta-5"
//                         width="10"
//                         height="11"
//                         viewBox="0 0 10 11"
//                         fill="none"
//                         xmlns="http://www.w3.org/2000/svg"
//                     >
//                         <path
//                             d="M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z"
//                             fill=""
//                         />
//                     </svg>
//                 </span>
//             </div>
//         </div>
//     );
// };

// export default CardPrixAuLitre;


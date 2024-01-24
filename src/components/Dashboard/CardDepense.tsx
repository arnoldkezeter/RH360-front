// import { useSelector } from "react-redux";
// import { RootState } from "../../_redux/store";
// import { calculateTotalForMonthAndYear, monthToString, parseDateToMonthYear } from "../../fonctions/fonction";


// const CardTotalDepense = () => {
//     const dateDuServer = useSelector((state: RootState) => state.user.currentDateFromServer);


//     const formatDate = parseDateToMonthYear(dateDuServer);

//     const month = formatDate.month;
//     const year = formatDate.year;

//     const date = `${monthToString(month)} ${year}`;


//     const listExpenses = useSelector((state: RootState) => state.dashboard.listGlobalDepenses);
//     const count = calculateTotalForMonthAndYear(listExpenses, month, year);


//     return (
//         <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
//             <div className="flex justify-between">
//                 <div className="flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4">


//                     <svg id="Layer_1_1_" width="25"
//                         height="25"
//                         className="fill-primary dark:fill-white" version="1.1" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M1,3v2H0v8h14v-1h1h1V4V3H2H1z M7,11c-1.105,0-2-0.895-2-2c0-1.105,0.895-2,2-2s2,0.895,2,2C9,10.105,8.105,11,7,11z M15,11  h-1V5H2V4h13V11z" /></svg>

//                 </div>
//                 <h3 className="mt-2 text-meta-5 text-[13px]">
//                     {date}
//                 </h3>
//             </div>

//             <div className="mt-4 flex items-end justify-between">
//                 {/* NOMBRE NUMERIQUE */}
//                 <div>
//                     <h4 className="text-title-md font-bold text-black dark:text-white ml-1">
//                         {count} €
//                     </h4>
//                     <span className="text-sm font-medium">Dépenses</span>
//                 </div>


//                 {/* ICONE UP */}
//                 <span className="flex items-center gap-1 text-sm font-medium text-meta-5">
//                     Ce mois
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

// export default CardTotalDepense;

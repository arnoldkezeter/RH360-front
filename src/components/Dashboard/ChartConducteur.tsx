// import { ApexOptions } from 'apexcharts';
// import React, { useEffect, useState } from 'react';
// import ReactApexChart from 'react-apexcharts';
// import { useSelector } from "react-redux";
// import { RootState } from "../../_redux/store";

// interface ChartThreeState {
//     series: number[];
// }


// const ChartConducteur: React.FC = () => {

//     const listDistance = useSelector((state: RootState) => state.dashboard.listKilometreParcouru);
//     const dateFromServer = useSelector((state: RootState) => state.user.currentDateFromServer);
//     const pageIsLoading = useSelector((state: RootState) => state.dashboard.pageIsLoading);

//     const [plageList, setPlageList] = useState<RangeCounts[]>([]);
//     const [useDefaultList, setUseDefaultList] = useState<boolean>(true);

//     const [filteredPlageList, setFilteredPlageList] = useState<string[]>([]);

//     const currentDate = new Date(dateFromServer);

//     useEffect(() => {
//         // Filtrer la liste en fonction de l'état useDefaultList
//         let filteredList = useDefaultList
//             ? listDistance.filter(distance => {
//                 const distanceDate = new Date(distance.createdAt);
//                 return (
//                     !isNaN(distanceDate.getTime()) && // Check if createdAt is a valid date
//                     distanceDate.getMonth() === currentDate.getMonth() &&
//                     distanceDate.getFullYear() === currentDate.getFullYear()
//                 );
//             })
//             : listDistance.filter(distance => {
//                 const distanceDate = new Date(distance.createdAt);
//                 return !isNaN(distanceDate.getTime()) && // Check if createdAt is a valid date
//                     distanceDate.getFullYear() === currentDate.getFullYear();
//             });

//         // Mettre à jour la liste actuelle
//         const currentList = (filteredList.map(distance => distance.value));

//         const plageList = getCountsInRanges(currentList);

//         setPlageList(plageList);

//         setFilteredPlageList(plageList.map((e) => e.plage))

//         setState({
//             series: plageList.map((e) => e.pourcentage),
//         });
//     }, [useDefaultList, listDistance, dateFromServer]);


//     const handleToggleList = () => {
//         setUseDefaultList(!useDefaultList);

//     };


//     const colors: string[] = [
//         '#1E90FF', // 1
//         '#E74C3C', // 2
//         '#32CD32', // 3
//         '#FFD700',
//         '#6A5ACD',
//         '#40E0D0',
//         '#9B59B6',
//         '#1ABC9C',
//         '#E67E22',
//         '#2980B9',
//     ];

//     const options: ApexOptions = {
//         chart: {
//             type: 'donut',
            
//             toolbar: {
//                 show: true,
//             },
//         },
//         colors: colors,
//         labels: filteredPlageList,
//         legend: {
//             show: true,
//             position: 'bottom',
//         },

//         plotOptions: {
//             pie: {
//                 donut: {
//                     size: '65%',
//                     background: 'transparent',
//                 },
//             },
//         },
//         dataLabels: {
//             enabled: false,
//         },
//         responsive: [
//             {
//                 breakpoint: 2600,
//                 options: {
//                     chart: {
//                         width: 380,
//                     },
//                 },
//             },
//             {
//                 breakpoint: 640,
//                 options: {
//                     chart: {
//                         width: 200,
//                     },
//                 },
//             },
//         ],
//     };




//     const [state, setState] = useState<ChartThreeState>({
//         series: [],
//     });

//     return (
//         <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
//             <div className="mb-3 justify-between gap-4 sm:flex">
//                 <div>
//                     <h5 className="text-xl font-semibold text-black dark:text-white">
//                         Utilisations par utilisateurs
//                     </h5>

//                 </div>
//                 <div>
//                     <div>
//                         <div className="relative z-20 inline-block">
//                             <select
//                                 name=""
//                                 id=""
//                                 className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
//                                 onChange={handleToggleList}
//                                 value={useDefaultList ? 'Ce mois' : 'Cette année'}
//                             >
//                                 <option value="Ce mois">Ce mois</option>
//                                 <option value="Cette année">Cette année</option>
//                             </select>

//                             <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
//                                 <svg
//                                     width="10"
//                                     height="6"
//                                     viewBox="0 0 10 6"
//                                     fill="none"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                 >
//                                     <path
//                                         d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
//                                         fill="#637381"
//                                     />
//                                     <path
//                                         fillRule="evenodd"
//                                         clipRule="evenodd"
//                                         d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
//                                         fill="#637381"
//                                     />
//                                 </svg>
//                             </span>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {pageIsLoading ? <div className={`flex items-center justify-center  bg-transparent h-[335px]`}>
//                 <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
//             </div>

//                 : filteredPlageList.length === 0 ? <div className='w-full flex text-center justify-center py-[130px]' >
//                     <h1>Aucune donnée pour le moment</h1>
//                 </div> :


//                     <div>
//                         <div className="mb-2">
//                             <div id="chartThree" className="mx-auto flex justify-center my-6">
//                                 <ReactApexChart
//                                     options={options}
//                                     series={state.series}
//                                     type="donut"
//                                 />
//                             </div>
//                         </div>


//                         <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3 mt-6 ">

//                             {

//                                 plageList.map((plage, index) => (
//                                     <div key={plage.total} className="w-full px-8 sm:w-1/1">
//                                         <div className="flex w-full items-center">
//                                             <span className={`mr-2 block h-3 w-full max-w-3 rounded-full ${index === 0 ? 'bg-[#1E90FF]' : index === 1 ? 'bg-[#E74C3C]' : index === 2 ? 'bg-[#32CD32]' : index === 3 ? 'bg-[#FFD700]' : index === 4 ? 'bg-[#6A5ACD]' : index === 5 ? 'bg-[#40E0D0]' : index === 6 ? 'bg-[#9B59B6]' : index === 7 ? 'bg-[#1ABC9C]' : index === 8 ? 'bg-[#E67E22]' : index === 9 ? 'bg-[#2980B9]' : ' bg-black-2'}`}></span>
//                                             <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
//                                                 <span>Entre {plage.plage} km  <span className='pl-5 text-boxdark dark:text-gray-2'>Total ( {plage.total} km )</span> </span>
//                                                 <span>{plage.pourcentage}%</span>
//                                             </p>
//                                         </div>
//                                     </div>
//                                 ))

//                             }

//                         </div>
//                     </div>
//             }
//         </div>
//     );
// };

// export default ChartConducteur;


// interface RangeCounts {
//     plage: string;
//     number: number;
//     total: number;
//     pourcentage: number;
// }
// function getCountsInRanges(inputList: number[]): RangeCounts[] {
//     // Tri de la liste pour s'assurer qu'elle est dans l'ordre croissant
//     const sortedList = [...inputList].sort((a, b) => a - b);

//     // Définition de la taille de chaque plage
//     const rangeSize = 100;

//     // Initialisation du compteur pour chaque plage
//     const counters: { [key: string]: { number: number; total: number } } = {};

//     let currentRangeSize: number; // Déclarer la variable ici

//     // Parcours de la liste et comptage des éléments dans chaque plage
//     sortedList.forEach(value => {
//         let rangeStart;
//         let rangeEnd;

//         if (value === 0) {
//             rangeStart = '0';
//             rangeEnd = '0';
//             currentRangeSize = 1;
//         } else if (value < 100) {
//             rangeStart = '1';
//             rangeEnd = '99';
//             currentRangeSize = 99;
//         } else {
//             rangeStart = `${Math.floor(value / rangeSize) * rangeSize + 1}`;
//             rangeEnd = `${Math.floor(value / rangeSize) * rangeSize + rangeSize}`;
//             currentRangeSize = rangeSize;
//         }

//         const range = `${rangeStart}-${rangeEnd}`;
//         counters[range] = counters[range] || { number: 0, total: 0 };
//         counters[range].number += 1;
//         counters[range].total += value;
//     });

//     // Calcul de la somme totale de la liste
//     const totalSum = sortedList.reduce((acc, value) => acc + value, 0);

//     // Transformation du résultat en un tableau d'objets
//     const result: RangeCounts[] = Object.keys(counters).map(range => ({
//         plage: range,
//         number: counters[range].number,
//         total: counters[range].total,
//         pourcentage: parseFloat(((counters[range].total / totalSum) * 100).toFixed(2)), // arrondi à 2 chiffres après la virgule
//     }));

//     return result;
// }

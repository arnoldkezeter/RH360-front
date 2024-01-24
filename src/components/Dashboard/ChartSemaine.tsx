// import { ApexOptions } from 'apexcharts';
// import React, { useState, useEffect } from 'react';
// import ReactApexChart from 'react-apexcharts';
// import { useSelector } from "react-redux";
// import { RootState } from "../../_redux/store";
// import { GlobalDepenseState } from '../../_redux/features/dashboard_slice';
// import { getFormattedDate } from '../../fonctions/fonction';


// const options: ApexOptions = {
//   colors: ['#D2691E', '#80CAEE'],
//   chart: {
//     fontFamily: 'Satoshi, sans-serif',
//     type: 'bar',
//     height: 335,
//     stacked: true,
//     toolbar: {
//       show: true,
//     },
//     zoom: {
//       enabled: true,
//     },
//   },

//   responsive: [
//     {
//       breakpoint: 1536,
//       options: {
//         plotOptions: {
//           bar: {
//             borderRadius: 0,
//             columnWidth: '25%',
//           },
//         },
//       },
//     },
//   ],
//   plotOptions: {
//     bar: {
//       horizontal: false,
//       borderRadius: 0,
//       columnWidth: '25%',
//       borderRadiusApplication: 'end',
//       borderRadiusWhenStacked: 'last',
//     },
//   },
//   dataLabels: {
//     enabled: false,
//   },

//   xaxis: {
//     categories: ['L.', 'M.', 'M.', 'J.', 'V.', 'S.', 'D.'],
//   },
//   legend: {
//     position: 'top',
//     horizontalAlign: 'left',
//     fontFamily: 'Satoshi',
//     fontWeight: 500,
//     fontSize: '12px',

//     markers: {
//       radius: 99,
//     },
//   },
//   fill: {
//     opacity: 1,
//   },
// };

// interface ChartTwoState {
//   series: {
//     name: string;
//     data: number[];
//   }[];
// }



// const ChartSemaine: React.FC = () => {


//   const pageIsLoading = useSelector((state: RootState) => state.dashboard.pageIsLoading);
//   const listExpenses = useSelector((state: RootState) => state.dashboard.listGlobalDepenses);

//   const dateDuServer = useSelector((state: RootState) => state.user.currentDateFromServer);




//   useEffect(() => {
//     const data = displayDaysOfWeekForCurrentWeek(dateDuServer, listExpenses);
//     const dataForChart = data.map(value => (value));
//     setState({ series: [{ name: 'Dépenses', data: dataForChart }] });
//   }, [dateDuServer, listExpenses]);


//   const [state, setState] = useState<ChartTwoState>({
//     series: [

//       {
//         name: 'Dépenses',
//         data: [],
//       },
//     ],
//   });

//   return (


//     <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-3">
//       <div className="mb-4 justify-between gap-4 sm:flex">
//         <div>
//           <h4 className="text-md lg:text-xl font-semibold text-black dark:text-white">
//             Dépenses total de cette semaine (€)
//           </h4>
//         </div>

//       </div>

//       <div>
//         <div id="chartTwo" className="-ml-5 -mb-9">
//           {
//             !pageIsLoading ?

//               <ReactApexChart
//                 options={options}
//                 series={state.series}
//                 type="bar"
//                 height={350}
//               /> : <div className={`flex items-center justify-center  bg-transparent h-[335px]`}>
//                 <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
//               </div>
//           }


//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChartSemaine;







// const displayDaysOfWeekForCurrentWeek = (dateFromServer: string, depenses: GlobalDepenseState[]): number[] => {
//   const currentDate = new Date(dateFromServer);
//   const currentDayOfWeek = currentDate.getDay(); // 0 (dimanche) à 6 (samedi)

//   // Calcul de la date du lundi de la semaine en cours
//   const mondayDate = new Date(currentDate);
//   mondayDate.setDate(currentDate.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1));

//   // Tableau pour stocker les valeurs pour chaque jour de la semaine
//   const valuesPerDay: number[] = [0, 0, 0, 0, 0, 0, 0];

//   // Affichage des jours de la semaine
//   for (let i = 0; i < 7; i++) {
//     const day = new Date(mondayDate);
//     day.setDate(mondayDate.getDate() + i);

//     const formattedDate = getFormattedDate(day);

//     // Calcul de la somme des valeurs pour chaque jour
//     const valuesForDay = depenses
//       .filter(depense => getFormattedDate(new Date(depense.createdAt)) === formattedDate)
//       .map(depense => depense.value);

//     valuesPerDay[i] = valuesForDay.length > 0 ? valuesForDay.reduce((a, b) => a + b) : 0;
//   }

//   return valuesPerDay;
// };

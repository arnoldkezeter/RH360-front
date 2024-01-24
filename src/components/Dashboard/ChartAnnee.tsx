// import { ApexOptions } from 'apexcharts';
// import React, { useState, useEffect } from 'react';
// import ReactApexChart from 'react-apexcharts';
// import { useSelector } from "react-redux";
// import { RootState } from "../../_redux/store";
// import { getFormattedDate } from '../../fonctions/fonction';
// import { GlobalDepenseState } from '../../_redux/features/dashboard_slice';

// interface ChartFourState {
//   series: {
//     name: String;
//     data: number[];
//   }[];
// }

// const ChartAnnee: React.FC = () => {

//   const pageIsLoading = useSelector((state: RootState) => state.dashboard.pageIsLoading);
//   const listExpenses = useSelector((state: RootState) => state.dashboard.listGlobalDepenses);

//   const dateDuServer = useSelector((state: RootState) => state.user.currentDateFromServer);

//   useEffect(() => {
//     const data = displayTotalValuesForCurrentYear(dateDuServer, listExpenses);
//     const dataForChart = data.map(value => (value));
//     setState({ series: [{ name: 'Dépenses', data: dataForChart }] });
//   }, [dateDuServer, listExpenses]);



//   const [state, setState] = useState<ChartFourState>({
//     series: [
//       {
//         name: 'Dépenses',
//         data: [0]
//       },
//     ],
//   });

//   const options: ApexOptions = {
//     colors: ['#3C50E0'],
//     chart: {
//       fontFamily: 'Satoshi, sans-serif',
//       type: 'bar',
//       height: 350,
//       stacked: true,

//       toolbar: {
//         show: true,
//     },
//     zoom: {
//         enabled: true,
//     },
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false,
//         columnWidth: '30%',
//         borderRadius: 0,
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     stroke: {
//       show: true,
//       width: 4,
//       colors: ['transparent'],
//     },
//     xaxis: {
//       categories: [
//         'Janv.',
//         'Fev.',
//         'Mar.',
//         'Avr.',
//         'Mai',
//         'Jui.',
//         'Juil.',
//         'Aoû.',
//         'Sep.',
//         'Oct.',
//         'Nov.',
//         'Déc.'
//       ],
//       axisBorder: {
//         show: false,
//       },
//       axisTicks: {
//         show: false,
//       },
//     },
//     legend: {
//       show: true,
//       position: 'top',
//       horizontalAlign: 'left',
//       fontFamily: 'inter',

//       markers: {
//         radius: 0,
//       },
//     },
//     // yaxis: {
//     //   title: false,
//     // },
//     grid: {
//       yaxis: {
//         lines: {
//           show: false,
//         },
//       },
//     },
//     fill: {
//       opacity: 1,
//     },

//     tooltip: {
//       x: {
//         show: false,
//       },
//       // y: {
//       //   formatter: function (val) {
//       //     return val;
//       //   },
//       // },
//     },
//   };

//   return (
//     <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
//       <div>
//         <h3 className="text-xl font-semibold text-black dark:text-white">
//           Dépensens totales de cette <br/>année (€)
//         </h3>
//       </div>

//       <div className="my-4">


//         {
//           !pageIsLoading ?
//             <div id="chartFour" className="-ml-5">
//               <ReactApexChart
//                 options={options}
//                 series={state.series}
//                 type="bar"
//                 height={350}
//               />
//             </div> : <div className={`flex items-center justify-center  bg-transparent h-[335px]`}>
//               <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
//             </div>
//         }
//       </div>
//     </div>
//   );
// };

// export default ChartAnnee;



// const displayTotalValuesForCurrentYear = (dateFromServer: string, depenses: GlobalDepenseState[]): number[] => {
//   const currentDate = new Date(dateFromServer);
//   const currentYear = currentDate.getFullYear();

//   // Tableau pour stocker la somme des valeurs pour chaque mois
//   const totalValuesPerMonth: number[] = Array.from({ length: 12 }, () => 0);

//   // Boucle sur les mois de l'année
//   for (let month = 0; month < 12; month++) {

//     // Calcul du dernier jour du mois en cours
//     const lastDayOfMonth = new Date(currentYear, month + 1, 0);

//     // Boucle sur les jours du mois
//     for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
//       const currentDay = new Date(currentYear, month, day);
//       const formattedDate = getFormattedDate(currentDay);

//       // Calcul de la somme des valeurs pour chaque jour
//       const valuesForDay = depenses
//         .filter(depense => getFormattedDate(new Date(depense.createdAt)) === formattedDate)
//         .map(depense => depense.value);

//       const totalValueForDay = valuesForDay.length > 0 ? valuesForDay.reduce((a, b) => a + b) : 0;

//       // Accumulation de la valeur dans le tableau pour le mois en cours
//       totalValuesPerMonth[month] += totalValueForDay;
//     }
//   }


//   return totalValuesPerMonth;
// };

// import { ApexOptions } from 'apexcharts';
// import React, { useState, useEffect } from 'react';
// import ReactApexChart from 'react-apexcharts';
// import { useSelector } from "react-redux";
// import { RootState } from "../../_redux/store";
// import { GlobalDepenseState } from '../../_redux/features/dashboard_slice';
// import { getFormattedDate } from '../../fonctions/fonction';



// interface ChartTwoState {
//     series: {
//         name: string;
//         data: number[];
//     }[];
// }

// const ChartMonth: React.FC = () => {

//     const listExpenses = useSelector((state: RootState) => state.dashboard.listGlobalDepenses);

//     const dateFromServer = useSelector((state: RootState) => state.user.currentDateFromServer);
//     const pageIsLoading = useSelector((state: RootState) => state.dashboard.pageIsLoading);



//     const options: ApexOptions = {

//         colors: ['#FFA70B'],  // Orange foncé
//         chart: {
//             fontFamily: 'Satoshi, sans-serif',
//             type: 'bar',
//             height: 335,
//             stacked: true,
//             toolbar: {
//                 show: true,
//             },
//             zoom: {
//                 enabled: false,
//             },
//         },

//         responsive: [
//             {
//                 breakpoint: 1536,
//                 options: {
//                     plotOptions: {
//                         bar: {
//                             borderRadius: 0,
//                             columnWidth: '35%',
//                         },
//                     },
//                 },
//             },
//         ],
//         plotOptions: {
//             bar: {
//                 horizontal: false,
//                 borderRadius: 0,
//                 columnWidth: '25%',
//                 borderRadiusApplication: 'end',
//                 borderRadiusWhenStacked: 'last',
//             },
//         },
//         dataLabels: {
//             enabled: false,
//         },

//         xaxis: {
//             categories: generateDaysList(dateFromServer),
//         },
//         legend: {
//             position: 'top',
//             horizontalAlign: 'left',
//             fontFamily: 'Satoshi',
//             fontWeight: 500,
//             fontSize: '14px',

//             markers: {
//                 radius: 99,
//             },
//         },
//         fill: {
//             opacity: 1,
//         },
//     };

//     useEffect(() => {
//         const data = displayDaysOfMonthForCurrentMonth(dateFromServer, listExpenses);
//         const dataForChart = data.map(value => (value));
//         setState({ series: [{ name: 'Dépenses', data: dataForChart }] });
//     }, [dateFromServer, listExpenses]);


//     const [state, setState] = useState<ChartTwoState>({
//         series: [

//             {
//                 name: 'Dépenses',
//                 data: [],
//             },
//         ],
//     });

//     return (
//         <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-7">
//             <div className="mb-4 justify-between gap-4 sm:flex">
//                 <div>
//                     <h4 className="text-md lg:text-xl font-semibold text-black dark:text-white">
//                         Dépenses totales de ce <br />mois (€)
//                     </h4>
//                 </div>

//             </div>


//             {
//                 !pageIsLoading ?

//                     <div>
//                         <div id="chartTwo" className="-ml-5 -mb-9">
//                             <ReactApexChart
//                                 options={options}
//                                 series={state.series}
//                                 type="bar"
//                                 height={350}
//                             />
//                         </div>
//                     </div> : <div className={`flex items-center justify-center  bg-transparent h-[335px]`}>
//                         <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
//                     </div>
//             }
//         </div>
//     );
// };

// export default ChartMonth;


// function generateDaysList(dateFromServer: string): string[] {

//     const currentDate = new Date(dateFromServer);
//     const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
//     const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

//     const daysList: string[] = [];

//     for (let day = firstDay.getDate(); day <= lastDay.getDate(); day++) {
//         // Formate le jour avec deux chiffres
//         const formattedDay = day < 10 ? `0${day}` : `${day}`;
//         daysList.push(formattedDay);
//     }

//     return daysList;
// }



// const displayDaysOfMonthForCurrentMonth = (dateFromServer: string, depenses: GlobalDepenseState[]): number[] => {
//     const currentDate = new Date(dateFromServer);
//     const currentMonth = currentDate.getMonth();
//     const currentYear = currentDate.getFullYear();

//     // Calcul du premier jour du mois en cours

//     // Calcul du dernier jour du mois en cours
//     const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

//     // Tableau pour stocker les valeurs pour chaque jour du mois
//     const valuesPerDay: number[] = [];

//     // Affichage des jours du mois
//     for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
//         const currentDay = new Date(currentYear, currentMonth, day);
//         const formattedDate = getFormattedDate(currentDay);

//         // Calcul de la somme des valeurs pour chaque jour
//         const valuesForDay = depenses
//             .filter(depense => getFormattedDate(new Date(depense.createdAt)) === formattedDate)
//             .map(depense => depense.value);

//         const totalValueForDay = valuesForDay.length > 0 ? valuesForDay.reduce((a, b) => a + b) : 0;

//         valuesPerDay.push(totalValueForDay);

//     }

//     return valuesPerDay;
// };

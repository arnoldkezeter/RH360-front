// import { ApexOptions } from 'apexcharts';
// import React, { useState, useEffect } from 'react';
// import ReactApexChart from 'react-apexcharts';

// import { useSelector } from "react-redux";
// import { RootState } from "../../_redux/store";
// import { RepartitionDepenseState } from '../../_redux/features/dashboard_slice';



// interface ChartThreeState {
//   series: number[];
// }


// const ChartDepense: React.FC = () => {

//   const [useDefaultList, setUseDefaultList] = useState<boolean>(true);
//   const [filterDepenses, setFilterDepenses] = useState<MoyenneParName[]>([]);

//   const listRepartitionDepenses = useSelector((state: RootState) => state.dashboard.listRepartitionDepenses);
//   const dateFromServer = useSelector((state: RootState) => state.user.currentDateFromServer);
//   const pageIsLoading = useSelector((state: RootState) => state.dashboard.pageIsLoading);

//   useEffect(() => {

//     const data = calculerMoyennePourcentage(listRepartitionDepenses, dateFromServer, useDefaultList);



//     const moyennes = data.map(item => item.moyenne);

//     setState(prevState => ({ ...prevState, series: moyennes }));
//     setFilterDepenses(data)

//   }, [dateFromServer, listRepartitionDepenses, useDefaultList]);

//   const handleToggleList = () => {
//     setUseDefaultList(!useDefaultList);

//   };

//   const colors: string[] = [
//     '#6577F3',
//     '#FFA70B',
//     '#E74C3C',
//     '#2ECC71',
//     '#F39C12',
//     '#3498DB',
//     '#9B59B6',
//     '#1ABC9C',
//     '#E67E22',
//     '#2980B9',
//   ];

//   const options: ApexOptions = {
//     chart: {
//       type: 'donut',
//       fontFamily: 'Satoshi, sans-serif',

//       toolbar: {
//         show: true,
//       },
//     },
//     colors: colors,
//     labels: filterDepenses.map((e) => e.name),
//     legend: {
//       show: true,
//       position: 'bottom',
//     },

//     plotOptions: {
//       pie: {
//         donut: {
//           size: '65%',
//           background: 'transparent',
//         },
//       },
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     responsive: [
//       {
//         breakpoint: 2600,
//         options: {
//           chart: {
//             width: 380,
//           },
//         },
//       },
//       {
//         breakpoint: 640,
//         options: {
//           chart: {
//             width: 200,
//           },
//         },
//       },
//     ],
//   };



//   const [state, setState] = useState<ChartThreeState>({
//     series: [],
//   });

//   return (
//     <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
//       <div className="mb-3 justify-between gap-4 sm:flex">
//         <div>
//           <h5 className="text-xl font-semibold text-black dark:text-white">
//             Répartitions des dépenses (€)
//           </h5>
//         </div>
//         <div>
//           <div className="relative z-20 inline-block">
//             <select
//               name=""
//               id=""
//               className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 text-sm font-medium outline-none"
//               onChange={handleToggleList}
//               value={useDefaultList ? 'Ce mois' : 'Cette année'}
//             >
//               <option value="Ce mois">Ce mois</option>
//               <option value="Cette année">Cette année</option>
//             </select>
//             <span className="absolute top-1/2 right-3 z-10 -translate-y-1/2">
//               <svg
//                 width="10"
//                 height="6"
//                 viewBox="0 0 10 6"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M0.47072 1.08816C0.47072 1.02932 0.500141 0.955772 0.54427 0.911642C0.647241 0.808672 0.809051 0.808672 0.912022 0.896932L4.85431 4.60386C4.92785 4.67741 5.06025 4.67741 5.14851 4.60386L9.09079 0.896932C9.19376 0.793962 9.35557 0.808672 9.45854 0.911642C9.56151 1.01461 9.5468 1.17642 9.44383 1.27939L5.50155 4.98632C5.22206 5.23639 4.78076 5.23639 4.51598 4.98632L0.558981 1.27939C0.50014 1.22055 0.47072 1.16171 0.47072 1.08816Z"
//                   fill="#637381"
//                 />
//                 <path
//                   fillRule="evenodd"
//                   clipRule="evenodd"
//                   d="M1.22659 0.546578L5.00141 4.09604L8.76422 0.557869C9.08459 0.244537 9.54201 0.329403 9.79139 0.578788C10.112 0.899434 10.0277 1.36122 9.77668 1.61224L9.76644 1.62248L5.81552 5.33722C5.36257 5.74249 4.6445 5.7544 4.19352 5.32924C4.19327 5.32901 4.19377 5.32948 4.19352 5.32924L0.225953 1.61241C0.102762 1.48922 -4.20186e-08 1.31674 -3.20269e-08 1.08816C-2.40601e-08 0.905899 0.0780105 0.712197 0.211421 0.578787C0.494701 0.295506 0.935574 0.297138 1.21836 0.539529L1.22659 0.546578ZM4.51598 4.98632C4.78076 5.23639 5.22206 5.23639 5.50155 4.98632L9.44383 1.27939C9.5468 1.17642 9.56151 1.01461 9.45854 0.911642C9.35557 0.808672 9.19376 0.793962 9.09079 0.896932L5.14851 4.60386C5.06025 4.67741 4.92785 4.67741 4.85431 4.60386L0.912022 0.896932C0.809051 0.808672 0.647241 0.808672 0.54427 0.911642C0.500141 0.955772 0.47072 1.02932 0.47072 1.08816C0.47072 1.16171 0.50014 1.22055 0.558981 1.27939L4.51598 4.98632Z"
//                   fill="#637381"
//                 />
//               </svg>
//             </span>
//           </div>
//         </div>
//       </div>

//       {
//         pageIsLoading ? <div className={`flex items-center justify-center  bg-transparent h-[335px]`}>
//           <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
//         </div>
//           : filterDepenses.length === 0 ? <div className='w-full flex text-center justify-center py-[150px]' >
//             <h1>Aucune donnée pour le moment</h1>
//           </div>
//             :
//             <div>
//               <div className="mb-2 mt-6">
//                 <div id="chartThree" className="mx-auto flex justify-center">
//                   <ReactApexChart
//                     options={options}
//                     series={state.series}
//                     type="donut"
//                   />
//                 </div>
//               </div>

//               <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3 mt-6 ">

//                 {

//                   filterDepenses.map((depense, index) => (
//                     <div key={depense._id} className="w-full px-8 sm:w-1/1">
//                       <div className="flex w-full items-center">
//                         <span className={`mr-2 block h-3 w-full max-w-3 rounded-full ${index === 0 ? 'bg-[#6577F3]' : index === 1 ? 'bg-[#FFA70B]' : index === 2 ? 'bg-[#E74C3C]' : index === 3 ? 'bg-[#2ECC71]' : index === 4 ? 'bg-[#F39C12]' : index === 5 ? 'bg-[#3498DB]' : index === 6 ? 'bg-[#9B59B6]' : index === 7 ? 'bg-[#1ABC9C]' : index === 8 ? 'bg-[#E67E22]' : index === 9 ? 'bg-[#2980B9]' : ' bg-black-2'}`}></span>
//                         <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
//                           <span>{depense.name} ( {depense.total} €)</span>
//                           <span>{depense.moyenne}%</span>
//                         </p>
//                       </div>
//                     </div>
//                   ))

//                 }

//               </div>
//             </div>
//       }

//     </div>
//   );
// };

// export default ChartDepense;


// interface MoyenneParName {
//   name: string;
//   moyenne: number;
//   total: number;
//   totalValues: number;
//   _id: string;
// }

// function calculerMoyennePourcentage(listeRepartition: RepartitionDepenseState[], currentDateFromServer: string, useDefaultList: boolean): MoyenneParName[] {
//   const moyennes: { [name: string]: { total: number; count: number; _id: string } } = {};

//   // Récupérer le mois et l'année actuels
//   const currentDate = new Date(currentDateFromServer);
//   const currentMonth = currentDate.getMonth() + 1; // Les mois dans JavaScript vont de 0 à 11
//   const currentYear = currentDate.getFullYear();

//   // Filtrer les informations pour le mois et l'année actuels
//   const filteredList = useDefaultList ?

//     listeRepartition.filter((item) => {
//       const itemDate = new Date(item.createdAt);
//       return itemDate.getMonth() + 1 === currentMonth && itemDate.getFullYear() === currentYear;
//     }) : listeRepartition.filter((item) => {
//       const itemDate = new Date(item.createdAt);
//       return itemDate.getFullYear() === currentYear;
//     });

//   // Calculer la somme et le nombre d'occurrences pour chaque name
//   filteredList.forEach((item) => {
//     if (moyennes[item.name]) {
//       moyennes[item.name].total += item.value;
//       moyennes[item.name].count += 1;
//     } else {
//       moyennes[item.name] = { total: item.value, count: 1, _id: item._id };
//     }
//   });

//   // Calculer la somme totale des valeurs
//   const totalValues = Object.values(moyennes).reduce((acc, curr) => acc + curr.total, 0);

//   // Calculer et normaliser la moyenne en pourcentage pour chaque name
//   const result: MoyenneParName[] = [];
//   Object.keys(moyennes).forEach((name) => {
//     const moyenne = ((moyennes[name].total / totalValues) * 100).toFixed(2);
//     result.push({
//       name,
//       moyenne: parseFloat(moyenne),
//       total: moyennes[name].total,
//       totalValues,
//       _id: moyennes[name]._id,
//     });
//   });

//   result.sort((a, b) => b.moyenne - a.moyenne);

//   return result;
// }

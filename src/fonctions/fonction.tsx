// import moment from "moment";
// import { ChangeEvent } from "react";
import { config } from "../config";



export function formatRoleName(value: string) {
  const roles = config.roles;
  return value === roles.admin ? 'Administrateur' :
    value === roles.teacher ? 'Enseignant' :
      value === roles.delegate ? 'Délégué' :
        'Étudiant'
}






// export function formatDate(value: string) {
//   return moment(value).format(`DD/MM/YYYY HH:mm`);
// }

// export function formatDate2(value: string) {
//   return moment(value).format(`DD/MM/YYYY`);
// }



// export function monthToString(value: number) {
//   return value == 1 ? "Janvier" :
//     value === 2 ? "Février" :
//       value === 3 ? "Mars" :
//         value === 4 ? "Avril" :
//           value === 5 ? "Mai" :
//             value === 6 ? "Juin" :
//               value === 7 ? "Juillet" :
//                 value === 8 ? "Août" :
//                   value === 9 ? "Septembre" :
//                     value === 10 ? "Octobre" :
//                       value === 11 ? "Novembre" :
//                         "Décembre";
// }

// export function monthToInt(value: string) {
//   return value === "Janvier" ? 1 :
//     value === "Février" ? 2 :
//       value === "Mars" ? 3 :
//         value === "Avril" ? 4 :
//           value === "Mai" ? 5 :
//             value === "Juin" ? 6 :
//               value === "Juillet" ? 7 :
//                 value === "Août" ? 8 :
//                   value === "Septembre" ? 9 :
//                     value === "Octobre" ? 10 :
//                       value === "Novembre" ? 11 :
//                         12;
// }


// export const truncateId = (item: string) => {
//   return item.length > 11
//     ? `${item.substring(0, 3)}...${item.substring(item.length - 7)}`
//     : item;
// };


// export const listMonth = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
// export const listYear = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];



// export function validateNumericInput(e: ChangeEvent<HTMLInputElement>): void {
//   const regex = /^\d*(\.\d{0,2})?$/;
//   if (!regex.test(e.target.value)) {
//     alert("Veuillez saisir une valeur entiere ou un décimale valide.");
//     e.target.value = e.target.value.slice(0, -1); // Supprimer le dernier caractère non valide
//   }
// }


// export function areDatesEqual(useStateDate: string, itemSelectedDate: string) {
//   const useStateObj = new Date(useStateDate);
//   const itemSelectedObj = new Date(itemSelectedDate);
//   return useStateObj.getTime() === itemSelectedObj.getTime();
// }



// export function parseDateToMonthYear(dateString: string) {
//   const dateObject = new Date(dateString);
//   const month = dateObject.getMonth() + 1;
//   const year = dateObject.getFullYear();

//   return { month, year };
// }






// export const getFormattedDate = (date: Date): string => {
//   const year = date.getFullYear();
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const day = date.getDate().toString().padStart(2, '0');
//   return `${year}-${month}-${day}`;
// };
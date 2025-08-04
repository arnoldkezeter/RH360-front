import { config } from "../config";
import CryptoJS from 'crypto-js';
import { t } from "i18next";
import createToast from "../hooks/toastify";
import { Archive, File, FileAudio, FileImage, FileText, FileVideo } from "lucide-react";



export function capitalizeFirstLetter(text: string) {
  if (text.length === 0) {
    return text;
  }
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getEchellesMinMax = (echelles: EchelleReponse[]):any=> {
  if (!echelles || echelles.length === 0) {
    return { min: null, max: null };
  }

  let min = echelles[0];
  let max = echelles[0];

  for (const echelle of echelles) {
    if (echelle.ordre < min.ordre) {
      min = echelle;
    }
    if (echelle.ordre > max.ordre) {
      max = echelle;
    }
  }
  
  return { min, max };
}


export async function decrypt(encryptedValue: String) {
  const iv = encryptedValue.substr(0, 32);
  const ciphertext = encryptedValue.substr(32);

  const ivWordArray = CryptoJS.lib.WordArray.create(iv);
  const ciphertextWordArray = CryptoJS.lib.WordArray.create(ciphertext);

  const secretKey = config.cryptoKey; // Accéder à la clé

  const decrypted = CryptoJS.AES.decrypt({
    ciphertext: ciphertextWordArray,
    iv: ivWordArray,
  }, secretKey).toString(CryptoJS.enc.Utf8);

  return decrypted;
}


export function validateEmail(email: string) {

  if (!email) {
    return "toast.email_requis";
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "L'adresse e-mail n'est pas valide.";
  }
  return '';
}


export function isValidVerificationCode(code: string) {
  if (code.length < 6) {
    return "Le code n'est pas valide";
  }
  return '';
}

export function isValidEmail(email: string) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "L'adresse e-mail n'est pas valide.";
  }
  return '';
}

export function validatePassword(password: string) {
  if (!password) {
    return "toast.mot_de_passe_requis";
  }
  if (!password || password.trim().length < 8) {
    return "toast.mot_de_passe_min_longueur";
  }

  // Vérifie la présence d'au moins une lettre et un chiffre dans le mot de passe
  const containsLetter = /[a-zA-Z]/.test(password);
  const containsNumber = /\d/.test(password);

  if (!containsLetter || !containsNumber) {
    return "toast.mot_de_passe_lettre_chiffre";
  }

  return '';
}

export function formatDateForInput(dateString: string | undefined) {
  if(!dateString) return;
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export function formatDateTimeForInput(dateString: string | undefined) {
  if(!dateString) return;
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  // Récupère les composants de l'heure
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  const formattedTime = `${hours}:${minutes}`
  const formattedDate = `${year}-${month}-${day}`;
  return `${formattedDate}T${formattedTime}`;
}

export function formatYear(year: number | undefined) {
  if(year){
    return `${year}-${year + 1}`;
  }
  return undefined;
}


export function extractYear(yearRange: string) {
  const parts = yearRange.split('-');
  return parseInt(parts[0]);
}

export function generateYearRange(currentYear: number, startYear: number) {
  const yearRange : string[] = [];
  for (let year = currentYear; year >= startYear; year--) {
    const nextYear = year + 1;
    yearRange.push(`${year}-${nextYear}`);
  }
  return yearRange;
}

export function generateYearRange2(currentYear: number, startYear: number) {
  const yearRange :string[]= [];
  
  // Ajouter les 5 années suivant l'année courante
  let i=5;
  while(i>0) {
    const year = currentYear + i;
    const nextYear = year + 1;
    yearRange.push(`${year}-${nextYear}`);
    i--;
  }

  // Ajouter les années comprises entre l'année courante et startYear
  for (let year = currentYear; year >= startYear; year--) {
    const nextYear = year + 1;
    yearRange.push(`${year}-${nextYear}`);
  }

  return yearRange;
}

export function premierElement(value: String) {
  // Diviser la chaîne en fonction des espaces
  if (value) {
    const elements = value.split(" ");
    // Récupérer le premier élément
    const premier = elements[0];
    return premier;
  }
  return undefined;
}


export function formatDateWithLang(date:string | undefined, lang:string):string{
  if(!date) return "";
  const dateStr = date;
  const dateObj = new Date(dateStr);

  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // +1 car les mois sont indexés à partir de 0
  const day = dateObj.getDate().toString().padStart(2, '0');

  let formattedDate = `${year}-${month}-${day}`;
  if(lang==='fr'){
    formattedDate = `${day}-${month}-${year}`;
  }
  return formattedDate;
}

export function formatDatetime(datetime: string, lang: string): string {
  // Crée un objet Date à partir de la chaîne datetime
  const dateObj = new Date(datetime);

  // Vérifie si la date est valide
  if (isNaN(dateObj.getTime())) {
      throw new Error("Date invalide");
  }

  // Récupère les composants de la date
  const year = dateObj.getFullYear();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // +1 car les mois sont indexés à partir de 0
  const day = dateObj.getDate().toString().padStart(2, '0');

  // Récupère les composants de l'heure
  const hours = dateObj.getHours().toString().padStart(2, '0');
  const minutes = dateObj.getMinutes().toString().padStart(2, '0');

  // Formate la date en fonction de la langue
  let formattedDate = `${year}-${month}-${day}`; // Format par défaut (en-US)
  if (lang === 'fr') {
      formattedDate = `${day}-${month}-${year}`; // Format français
  }

  // Formate l'heure en fonction de la langue
  let formattedTime = `${hours}:${minutes}`;
  if (lang === 'en') {
      const period = parseInt(hours) >= 12 ? 'PM' : 'AM';
      const hours12 = ( parseInt(hours) % 12 || 12).toString().padStart(2, '0');
      formattedTime = `${hours12}:${minutes} ${period}`; // Format anglais avec AM/PM
  }

  return `${formattedDate} à ${formattedTime}`;
}


export function reduceWord(word: string, maxSize: number): string {
  // Vérifier si l'utilisateur est sur mobile ou non
  const isMobile = window.innerWidth <= 768; // Taille standard de la vue mobile

  if (!isMobile) {
      return word;
  } else {
      // Sur PC, réduit le mot si nécessaire
      if (word.length > maxSize) {
          return word.slice(0, maxSize) + "...";
      } else {
          return word;
      }
  }
}

export function createPDF(blob:Blob, title:string, type?:string){
    const url = URL.createObjectURL(blob);
    // Télécharger le PDF
    const link = document.createElement('a');
    link.href = url;
    
    let linkDowload=title+'.pdf';
    if(type){
      linkDowload=title+'.'+type;
    }
    link.download = linkDowload;
    document.body.appendChild(link);
    link.click();
    // Libérer l'URL de l'objet
    URL.revokeObjectURL(url);
}

export function compareDates(date1: string, date2: string): boolean {
  // Supprimez les parties de temps pour assurer une comparaison précise des dates
  const trimmedDate1 = date1.split('T')[0];
  const trimmedDate2 = date2.split('T')[0];

  // Comparez les deux dates
  return trimmedDate1 === trimmedDate2;
}

export function getCohorteNamesString(cohortes:Cohorte[], lang = 'fr') {
  const nomField = lang === 'en' ? 'nomEn' : 'nomFr';

  // Extraire tous les noms et garder uniquement les noms valides
  const noms = cohortes.map(c => c[nomField]).filter(Boolean);

  // Supprimer les doublons
  const nomsUniques = [...new Set(noms)];

  // Retourner sous forme de chaîne, noms séparés par des virgules
  return nomsUniques.join(', ');
}

export function getTaxeNamesString(taxes?: Taxe[], lang = 'fr', forTable = false) {
  const nomField = lang === 'en' ? 'natureFr' : 'natureEn';
  if(!taxes)return;
  // Extraire les noms et taux valides
  const taxesValides = taxes
    .filter(taxe => taxe[nomField] && taxe.taux !== undefined && taxe.taux !== null)
    .map(taxe => `${taxe[nomField]} (${taxe.taux}%)`);
  
  // Supprimer les doublons
  const taxesUniques = [...new Set(taxesValides)];
  
  // Retourner avec le séparateur approprié
  const separateur = forTable ? '\n' : ', ';
  return taxesUniques.join(separateur);
}


export function calculerTotalParticipantsTS(lieu: LieuFormation) {
    const totalLieu = lieu.cohortes.reduce((totalCohortes, cohorte) => {
      if (!cohorte.participants || !Array.isArray(cohorte.participants)) {
        return totalCohortes;
      }
      return totalCohortes + cohorte.participants.length;
    }, 0);
    return totalLieu
};

/**
 * Calcule le montant TTC pour une dépense unique
 * @param depense La dépense à calculer
 * @param utiliserReel Si vrai, utilise le montant réel, sinon prévu
 * @returns Le montant TTC arrondi à 2 décimales
 */
export function calculerMontantTTC({
  depense,
  utiliserReel = false,
}: { depense: Depense; utiliserReel?: boolean }): number {
  const quantite = depense.quantite ?? 1;
  const montantUnitaire = utiliserReel
    ? depense.montantUnitaireReel ?? 0
    : depense.montantUnitairePrevu ?? 0;

  // Somme des taux de toutes les taxes applicables
  const tauxTotal = (depense.taxes ?? []).reduce((acc, taxe) => acc + (taxe.taux ?? 0), 0);

  const montantHT = quantite * montantUnitaire;
  const montantTTC = montantHT * (1 + tauxTotal / 100);

  return Math.round(montantTTC * 100) / 100;
}


/**
 * Calcule l'écart TTC d'une dépense (reel - prevu)
 * @param depense La dépense concernée
 * @returns L'écart TTC (positif = dépassement, négatif = économie)
 */
export function calculerEcartDepenseTTC(depense: {
  quantite?: number;
  montantUnitairePrevu?: number;
  montantUnitaireReel?: number;
  taxes?: { taux: number }[]; // ou mongoose documents si tu préfères
}): number {
  const quantite = depense.quantite ?? 1;
  const prevuHT = depense.montantUnitairePrevu ?? 0;
  const reelHT = depense.montantUnitaireReel ?? 0;

  // Calcule le taux cumulé des taxes
  const totalTaux = (depense.taxes ?? []).reduce((acc, taxe) => acc + (taxe.taux ?? 0), 0);

  const prevuTTC = prevuHT * quantite * (1 + totalTaux / 100);
  const reelTTC = reelHT * quantite * (1 + totalTaux / 100);

  const ecart = reelTTC - prevuTTC;

  return Math.round(ecart * 100) / 100;
}


export function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

 // Fonction pour tronquer le texte
export  const truncateText = (text: string, maxLength: number = 25) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Fonction pour obtenir l'icône selon l'extension du fichier
  export const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const iconProps = { className: "w-8 h-8" };
    
    switch (extension) {
      case 'pdf':
        return <FileText {...iconProps} className="w-8 h-8 text-[#ef4444]" />;
      case 'doc':
      case 'docx':
        return <FileText {...iconProps} className="w-8 h-8 text-[#2563eb]" />;
      case 'ppt':
      case 'pptx':
        return <FileText {...iconProps} className="w-8 h-8 text-[#ea580c]" />;
      case 'xls':
      case 'xlsx':
        return <FileText {...iconProps} className="w-8 h-8 text-[#16a34a]" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return <FileImage {...iconProps} className="w-8 h-8 text-[#8b5cf6]" />;
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
        return <FileVideo {...iconProps} className="w-8 h-8 text-[#dc2626]" />;
      case 'mp3':
      case 'wav':
      case 'flac':
        return <FileAudio {...iconProps} className="w-8 h-8 text-[#06b6d4]" />;
      case 'zip':
      case 'rar':
      case '7z':
        return <Archive {...iconProps} className="w-8 h-8 text-[#a855f7]" />;
      default:
        return <File {...iconProps} className="w-8 h-8 text-[#6b7280]" />;
    }
  };

export const formatFileSizeInMo = (bytes: number)=> {
  const sizeInMo = bytes / (1024 * 1024);
  return `${sizeInMo.toFixed(2)} Mo`; // Limite à 2 décimales
}

  // Fonction pour obtenir la taille du fichier (simulation)
  export const getFileSize = (fileName: string) => {
    // Simulation de tailles de fichiers basées sur l'extension
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return '2.5 MB';
      case 'docx':
        return '850 KB';
      case 'pptx':
        return '4.2 MB';
      case 'xlsx':
        return '1.1 MB';
      case 'mp4':
        return '125 MB';
      case 'zip':
        return '15.8 MB';
      default:
        return '1.2 MB';
    }
  };





 // Fonction pour récupérer les permissions par défaut à partir des fichiers JSON
//  export async function loadDefaultPermissions(role : string, lang:string) {
//   let defaultPermissions:{_id:string, permission:string}[] = [];
  
//   // Charger le fichier approprié en fonction du rôle de l'utilisateur
//   try {
    
//     await apiGetRolePermissions({ role: role }).then((e: ReponseApiPros) => {
//       if(e.success){
//         defaultPermissions = e.data;
//       }else{
//         createToast(e.message[lang as keyof typeof e.message], '', 2);
//       }
//     }).catch((e) => {
//         console.error("Erreur lors du chargement des permissions par défaut :", e);
//         createToast(t('message.erreur'), "", 2);
//     })
//   } catch (e) {
//       console.error("Erreur lors du chargement des permissions par défaut :", e);
//       createToast(t('message.erreur'), "", 2);
//   }
//   return defaultPermissions;
// };

// Fonction pour comparer les permissions et créer la liste finale
// export async function createFinalPermissionList(
//     userPermissions: { is_granted: boolean; permission: { nom: string } }[],
//     role: string,
//     lang: string
//   ): Promise<string[]> {
//   // Charger les permissions par défaut en fonction du rôle
//   const defaultPermissions: { _id: string; permission: string }[] = await loadDefaultPermissions(role, lang);

//   // Créer une liste finale des permissions
//   const finalPermissions: string[] = [];

//   // Ajouter les permissions personnalisées de l'utilisateur avec is_granted: true
//   userPermissions.forEach((userPermission) => {
//     if (userPermission.is_granted) {
//       finalPermissions.push(userPermission.permission.nom);
//     }
//   });

//   // Ajouter les permissions par défaut qui ne sont pas dans les permissions personnalisées avec is_granted: false
//   defaultPermissions.forEach((defaultPermission) => {
//     const permissionExists = userPermissions.some(
//       (userPermission) =>
//         userPermission.permission.nom === defaultPermission.permission && !userPermission.is_granted
//     );

//     // Ajouter la permission par défaut si elle n'est pas présente dans les permissions personnalisées avec is_granted: false
//     if (!permissionExists) {
//       finalPermissions.push(defaultPermission.permission);
//     }
//   });

//   return finalPermissions;
// }

export function getNavLinkClass (isActive: boolean){ 
  return  `group relative flex items-center pb-1.5 rounded-md px-4 font-medium text-white duration-300 ease-in-out hover:text-secondary ${isActive ? 'text-secondary' : ''}`;
}








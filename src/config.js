export const config = {
    roles: { superAdmin: 'SUPER-ADMIN', admin: 'ADMIN', responsable: 'RESPONSABLE-FORMATION', utilisateur: 'UTILISATEUR', formateur: 'FORMATEUR', stagiaire:'STAGIAIRE', chercheur:'CHERCHEUR' },
    nameApp: "RH360",
    copyRight: '2025',
    version: "0.0.1",
    cryptoKey: "rh_360_2025",
    facebook: "#",
    instagram: "#",
    twitter: "#",
}

export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 Mo en octets

export const ROLES = {
    SUPER_ADMIN: { nomFr: "Super Administrateur", nomEn: "Super Administrator", key: "SUPER-ADMIN" },
    ADMIN: { nomFr: "Administrateur", nomEn: "Administrator", key: "ADMIN" },
    RESPONSABLE_FORMATION: { nomFr: "Responsable Formation", nomEn: "Training Manager", key: "RESPONSABLE-FORMATION" },
    UTILISATEUR: { nomFr: "Utilisateur", nomEn: "User", key: "UTILISATEUR" },
    FORMATEUR: { nomFr: "Formateur", nomEn: "Trainer", key: "FORMATEUR" },
    STAGIAIRE: { nomFr: "Stagiaire", nomEn: "Trainee", key: "STAGIAIRE" },
    CHERCHEUR: { nomFr: "Chercheur", nomEn: "Researcher", key: "CHERCHEUR" },
};


export const METHODES_VALIDATIONS = {
    MANUELLE: { nomFr: "Manuelle", nomEn: "Manual", key: "MANUELLE" },
    DONNEES: { nomFr: "Données", nomEn: "Data", key: "DONNEES" },
    FICHIER: { nomFr: "Fichier", nomEn: "File", key: "FICHIER" },
    AUTOMATIQUE: { nomFr: "Automatique", nomEn: "Automatic", key: "AUTOMATIQUE" },
};

export const ETAT_TACHE = {
    EXECUTEE: { nomFr: "Exécutée", nomEn: "Executed", key: "EXECUTEE" },
    NON_EXECUTEE: { nomFr: "Non exécutée", nomEn: "Not executed", key: "NON_EXECUTEE" },
};


export const TYPE_DEPENSE = {
    BIENS_SERVICES: { nomFr: "Aquisition des biens et services", nomEn: "Acquisition of goods and services", key: "ACQUISITION_BIENS_SERVICES" },
    FRAIS_ADMINISTRATIF: { nomFr: "Frais administratif", nomEn: "Administrative costs", key: "FRAIS_ADMINISTRATIF" },
};

export const STATUT_BUDGET = {
    BROUILLON: { nomFr: "Brouillon", nomEn: "Draft", key: "BROUILLON" },
    VALIDE: { nomFr: "Valide", nomEn: "Validated", key: "VALIDE" },
    EXECUTE: { nomFr: "Exécuté", nomEn: "Executed", key: "EXECUTE" },
    CLOTURE: { nomFr: "Clôturé", nomEn: "Closed", key: "CLOTURE" },
};


// frontnomEnd/constants/status.ts
export const STATUTS = {
    ACCEPTER: { nomFr: "Accepté", nomEn: "Accepted", key:"ACCEPTER" },
    REFUSER: { nomFr: "Refusé", nomEn: "Refused", key:"REFUSER" },
    EN_ATTENTE: { nomFr: "En attente", nomEn: "Pending", key:"EN_ATTENTE" },
};

export const STATUT_BESOIN = {
    VALIDER: { nomFr: "Validé", nomEn: "Validate", key:"VALIDER" },
    REFUSER: { nomFr: "Rejeté", nomEn: "Rejected", key:"REJETE" },
    EN_ATTENTE: { nomFr: "En attente", nomEn: "Pending", key:"EN_ATTENTE" },
    NON_EVALUE: {nomFr:"Non évalué", nomEn:"Not rated", key:"NON_EVALUE"}
};

export const STATUT_TACHE={
    COMPLETE: { nomFr: "Complétée", nomEn: "Completed", key:"COMPLETE" },
    EN_COURS: { nomFr: "En cours", nomEn: "In progress", key:"EN_COURS" },
    ABSENT: { nomFr: "Absent", nomEn: "Absent", key:"ABSENT" },
}

export const NIVEAU_AUTO_EVALUATION = {
  NIVEAU_1: {
    nomFr: "Vous ne disposez d'aucun savoir-faire en la matière",
    nomEn: "You have no expertise in this area",
    niveau: 1,
  },
  NIVEAU_2: {
    nomFr: "Vos capacités techniques pour exécuter les tâches sont faibles",
    nomEn: "Your technical ability to perform the tasks is weak",
    niveau: 2,
  },
  NIVEAU_3: {
    nomFr: "Vos capacités techniques en la matière sont bonnes, mais les matériels insuffisants",
    nomEn: "Your technical skills in this area are good, but the equipment is insufficient",
    niveau: 3,
  },
  NIVEAU_4: {
    nomFr: "Vos capacités techniques en la matière sont bonnes et vous exercez effectivement ces compétences selon les règles de l'art",
    nomEn: "Your technical skills in this area are good and you effectively apply them according to professional standards",
    niveau: 4,
  },
};

export const monthsFullFr = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin','Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
export const monthsFullEn = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];




export const apiUrl = import.meta.env.VITE_APP_API_URL || "non defini";
export const wstjqer = import.meta.env.VITE_APP_WSTJQER || "non defini";

export const r_sup_ad = import.meta.env.VITE_APP_ROLE_SUPER_ADMIN || "non defini";
export const r_adm = import.meta.env.VITE_APP_ROLE_ADMIN || "non defini";
export const r_enseig = import.meta.env.VITE_APP_ROLE_ENS || "non defini";
export const r_del = import.meta.env.VITE_APP_ROLE_DEL || "non defini";
export const r_etud = import.meta.env.VITE_APP_ROLE_ETU || "non defini";

export const socket_url = import.meta.env.VITE_APP_SOCKET_URL || 'socket url non defini'


export const serveurUrl = import.meta.env.VITE_APP_SERVEUR_URL || 'serveur url non defini'

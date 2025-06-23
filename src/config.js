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


// frontnomEnd/constants/status.ts
export const STATUTS = {
    ACCEPTER: { nomFr: "Accepté", nomEn: "Accepted", key:"ACCEPTER" },
    REFUSER: { nomFr: "Refusé", nomEn: "Refused", key:"REFUSER" },
    EN_ATTENTE: { nomFr: "En attente", nomEn: "Pending", key:"EN_ATTENTE" },
};



export const apiUrl = import.meta.env.VITE_APP_API_URL || "non defini";
export const wstjqer = import.meta.env.VITE_APP_WSTJQER || "non defini";

export const r_sup_ad = import.meta.env.VITE_APP_ROLE_SUPER_ADMIN || "non defini";
export const r_adm = import.meta.env.VITE_APP_ROLE_ADMIN || "non defini";
export const r_enseig = import.meta.env.VITE_APP_ROLE_ENS || "non defini";
export const r_del = import.meta.env.VITE_APP_ROLE_DEL || "non defini";
export const r_etud = import.meta.env.VITE_APP_ROLE_ETU || "non defini";

export const socket_url = import.meta.env.VITE_APP_SOCKET_URL || 'socket url non defini'


export const serveurUrl = import.meta.env.VITE_APP_SERVEUR_URL || 'serveur url non defini'

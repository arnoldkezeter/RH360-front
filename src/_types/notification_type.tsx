interface NotificationType {
    //Caractéristique commune
    _id?: string;
    type: string;
    user: Utilisateur; // ID de l'utilisateur qui a généré la notification
    role:string;
    date_creation: string; // Date de création de la notification en ISO format
    read?:boolean;
    
 
    
}

interface NotificationInitial {
    data: NotificationType[];
    newNotification:boolean;
    pageIsLoading: boolean,
    pageError: string | null;
    pageIsLoadingOnTable: boolean,

}

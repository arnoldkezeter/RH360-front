interface NotificationData {
  tacheId?: string;
  themeId?: string;
  ancienStatut?: string;
  nouveauStatut?: string;
  modifiePar?: string;
}

interface Notification {
  id: string;
  _id?: string;
  type: string;
  titre: {
    fr: string;
    en: string;
  };
  message: {
    fr: string;
    en: string;
  };
  donnees?: NotificationData;
  dateCreation: string;
  lue: boolean;
}

interface NotificationSystemProps {
  userId: string;
  token: string;
}

interface NotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    totalPages: number;
    currentPage: number;
    total: number;
    nonLuesCount: number;
  };
}
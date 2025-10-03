import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/notifications`;



// Interface pour la réponse standard
interface StandardResponse {
  success: boolean;
  message?: string;
  data?: Notification;
}

// Fonction pour récupérer le token
const getAuthHeaders = () => {
  const token = localStorage.getItem(wstjqer);
  return {
    'Authorization': `Bearer ${token}`,
    'Accept-Language': 'fr',
    'Content-Type': 'application/json'
  };
};

/**
 * Charger les notifications
 * @param limit - Nombre de notifications à charger (par défaut: 20)
 * @param page - Numéro de page (par défaut: 1)
 * @param nonLues - Filtrer uniquement les non lues (par défaut: false)
 */
export const loadNotifications = async (
  limit: number = 20,
  page: number = 1,
  nonLues: boolean = false,
  userId:string
): Promise<NotificationsResponse> => {
  try {
    const response: AxiosResponse<NotificationsResponse> = await axios.get(
      `${api}/${userId}`,
      {
        params: { limit, page, nonLues },
        headers: getAuthHeaders()
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Erreur chargement notifications:', error);
    throw error;
  }
};

/**
 * Marquer une notification comme lue
 * @param notificationId - ID de la notification
 */
export const markAsRead = async (notificationId: string, userId:string): Promise<StandardResponse> => {
    console.log(notificationId)
    console.log(userId)
    try {
    const response: AxiosResponse<StandardResponse> = await axios.patch(
      `${api}/${notificationId}/lire/${userId}`,
      {},
      {
        headers: getAuthHeaders()
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Erreur marquage notification:', error);
    throw error;
  }
};

/**
 * Marquer toutes les notifications comme lues
 */
export const markAllAsRead = async (userId:string): Promise<StandardResponse> => {
  try {
    const response: AxiosResponse<StandardResponse> = await axios.patch(
      `${api}/lire-toutes/${userId}`,
      {},
      {
        headers: getAuthHeaders()
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Erreur marquage toutes notifications:', error);
    throw error;
  }
};

/**
 * Supprimer une notification
 * @param notificationId - ID de la notification
 */
export const deleteNotification = async (notificationId: string, userId:string): Promise<StandardResponse> => {
  try {
    const response: AxiosResponse<StandardResponse> = await axios.delete(
      `${api}/${notificationId}/${userId}`,
      {
        headers: getAuthHeaders()
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Erreur suppression notification:', error);
    throw error;
  }
};

/**
 * Obtenir le nombre de notifications non lues
 */
export const getUnreadCount = async (userId:string): Promise<number> => {
  try {
    const response = await loadNotifications(1, 1, false, userId);
    return response.data.nonLuesCount;
  } catch (error) {
    console.error('Erreur récupération nombre non lues:', error);
    return 0;
  }
};
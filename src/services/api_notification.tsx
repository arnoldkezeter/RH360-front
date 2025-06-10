import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../config.js';


const api = `${apiUrl}/notification`;
const token = localStorage.getItem(wstjqer);

export async function getNotifications ({ userId, niveauxId, role, annee, semestre }: { userId: string, niveauxId?:string[], role:string, annee:number, semestre:number }): Promise<NotificationType[]> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/notifications/${userId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
                params: {
                    niveauxId:niveauxId,
                    role:role,
                    annee:annee,
                    semestre: semestre,
                },
            },
        );
        const notifications = response.data.data;
        return notifications;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function markNotificationAsRead({notificationId, userId}: {notificationId:string, userId:string}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/markAsRead`,
            { notificationId, userId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        // console.error('Error creating section : ', error);
        throw error;
    }
}

export async function markAllNotificationAsRead({notificationIds, userId}: {notificationIds:(string|undefined)[], userId:string}): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/markAllAsRead`,
            { notificationIds, userId },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        // console.error('Error creating section : ', error);
        throw error;
    }
}

export async function apiSignalerAbsence(formData: FormData): Promise<ReponseApiPros> {
    try {
      const response: AxiosResponse<any> = await axios.post(
        `${api}/signaler`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        },
      );
  
      return response.data;
    } catch (error) {
      console.error('Error signaling notification:', error);
      throw error;
    }
  }




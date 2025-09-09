import axios from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/chats`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

// Types de base pour les requêtes et les réponses
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}



export async function createChat({createdBy, entityType, entityId, participants, title, chatType}:Chat, lang: string): Promise<ApiResponse<Chat>> {
  try {
    const response = await axios.post(`${api}/${createdBy}`, {entityType, entityId, participants, title, chatType}, {
      headers: {
        'Content-Type': 'application/json',
        'accept-language': lang,
        'authorization': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la création du chat :', error);
    throw error;
  }
}


export async function getUtilisateurChats({lang, userId, entityType}:{lang: string, userId:string, entityType?: string}): Promise<ChatReturnGetType> {
  try {
    const response = await axios.get(`${api}/user/${userId}`, {
      headers: {
        'accept-language': lang,
        'authorization': token,
      },
      params:{
        entityType:entityType||""
      }
    });
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des chats de l\'utilisateur :', error);
    throw error;
  }
}


export async function getAvailableParticipants({userId, entityType, entityId, lang}:{userId:string, entityType: string, entityId: string, lang: string}): Promise<ApiResponse<any[]>> {
  try {
    const response = await axios.get(`${api}/available-participants/${userId}/chat/${entityId}`, {
      headers: {
        'accept-language': lang,
        'authorization': token,
      },
      params:{
        entityType:entityType
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des participants disponibles :', error);
    throw error;
  }
}

/**
 * Ajoute des participants à un chat existant.
 * @param chatId - L'ID du chat.
 * @param participants - La liste des participants à ajouter.
 * @param lang - La langue de la requête.
 * @returns Une promesse avec la réponse de l'API.
 */
export async function addParticipants(chatId: string, addedBy:string, participants: Participant[], lang: string): Promise<ApiResponse<Chat>> {
    console.log(participants)
    try {
    const response = await axios.post(`${api}/${chatId}/participants/add/${addedBy}`, { participants }, {
      headers: {
        'Content-Type': 'application/json',
        'accept-language': lang,
        'authorization': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'ajout des participants :', error);
    throw error;
  }
}

/**
 * Retire des participants d'un chat.
 * @param chatId - L'ID du chat.
 * @param participantIds - La liste des ID des participants à retirer.
 * @param lang - La langue de la requête.
 * @returns Une promesse avec la réponse de l'API.
 */
export async function removeParticipants(chatId: string, removedBy:string, participantIds: string[], lang: string): Promise<ApiResponse<Chat>> {
  try {
    const response = await axios.delete(`${api}/${chatId}/participants/remove/${removedBy}`, {
      headers: {
        'Content-Type': 'application/json',
        'accept-language': lang,
        'authorization': token,
      },
      data: { participantIds },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors du retrait des participants :', error);
    throw error;
  }
}


export async function addMessage(chatId: string, senderId:string, content: string,  messageType: string, lang: string,): Promise<ApiResponse<Message>> {
    try {
        const response = await axios.post(`${api}/${chatId}/${senderId}/messages`,{content, messageType}, {
        headers: {
            'Content-Type': 'application/json',
            'accept-language': lang,
            'authorization': token,
        },
        
        });
        return response.data;
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message :', error);
        throw error;
    }
}

/**
 * Récupère les messages d'un chat avec pagination.
 * @param chatId - L'ID du chat.
 * @param lang - La langue de la requête.
 * @param page - Le numéro de la page.
 * @param limit - Le nombre de messages par page.
 * @returns Une promesse avec les messages paginés.
 */
export async function getChatMessages({chatId,userId, lang, page, limit}:{chatId: string,userId:string, lang: string, page: number, limit: number}): Promise<any> {
  try {
    const response = await axios.get(`${api}/${chatId}/${userId}/messages?page=${page}&limit=${limit}`, {
      headers: {
        'accept-language': lang,
        'authorization': token,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des messages :', error);
    throw error;
  }
}

/**
 * Marque tous les messages d'un chat comme lus.
 * @param chatId - L'ID du chat.
 * @param lang - La langue de la requête.
 * @returns Une promesse avec la réponse de l'API.
 */
export async function markMessagesAsRead({chatId, userId, lang}:{chatId: string, userId:string, lang: string}): Promise<ApiResponse<any>> {
  try {
    const response = await axios.patch(`${api}/${chatId}/messages/read/${userId}`, {}, {
      headers: {
        'accept-language': lang,
        'authorization': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors du marquage des messages comme lus :', error);
    throw error;
  }
}

/**
 * Désactive un chat.
 * @param chatId - L'ID du chat.
 * @param lang - La langue de la requête.
 * @returns Une promesse avec la réponse de l'API.
 */
export async function deactivateChat(chatId: string, lang: string): Promise<ApiResponse<any>> {
  try {
    const response = await axios.delete(`${api}/${chatId}/deactivate`, {
      headers: {
        'accept-language': lang,
        'authorization': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la désactivation du chat :', error);
    throw error;
  }
}

/**
 * Récupère les détails d'un chat spécifique.
 * @param chatId - L'ID du chat.
 * @param lang - La langue de la requête.
 * @returns Une promesse avec les détails du chat.
 */
export async function chatDetails(chatId: string, lang: string): Promise<ApiResponse<Chat>> {
  try {
    const response = await axios.get(`${api}/${chatId}`, {
      headers: {
        'accept-language': lang,
        'authorization': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des détails du chat :', error);
    throw error;
  }
}

/**
 * Modifie les permissions d'un participant.
 * @param chatId - L'ID du chat.
 * @param participantId - L'ID du participant.
 * @param permissions - Les nouvelles permissions.
 * @param lang - La langue de la requête.
 * @returns Une promesse avec la réponse de l'API.
 */
export async function updatePartipantPermission(chatId: string, participantId: string, permissions: object, lang: string): Promise<ApiResponse<Chat>> {
  try {
    const response = await axios.patch(`${api}/${chatId}/participants/${participantId}/permissions`, { permissions }, {
      headers: {
        'Content-Type': 'application/json',
        'accept-language': lang,
        'authorization': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour des permissions du participant :', error);
    throw error;
  }
}

/**
 * Recherche des messages dans un chat.
 * @param chatId - L'ID du chat.
 * @param query - Le terme de recherche.
 * @param lang - La langue de la requête.
 * @returns Une promesse avec les résultats de la recherche.
 */
export async function searchMessage(chatId: string, query: string, lang: string): Promise<ApiResponse<any>> {
  try {
    const response = await axios.get(`${api}/${chatId}/messages/search?q=${query}`, {
      headers: {
        'accept-language': lang,
        'authorization': token,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la recherche des messages :', error);
    throw error;
  }
}

import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/cohortes`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;


// Ajouter un utilisateur à une cohorte
export async function addUserToCohorte({utilisateurId, cohorteId, lang}:{utilisateurId: string, cohorteId: string, lang: string}): Promise<ReponseApiPros> {
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${api}/utilisateur/ajouter`,
      { utilisateurId, cohorteId },
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          'authorization': token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l’ajout des utilisateurs à la cohorte :', error);
    throw error;
  }
}

// Retirer un utilisateur d’une cohorte
export async function removeUserFromCohorte({cohorteUtilisateurId, lang}:{cohorteUtilisateurId: string, lang: string}): Promise<ReponseApiPros> {
  try {
    const response: AxiosResponse<any> = await axios.delete(
      `${api}/${cohorteUtilisateurId}/utilisateur`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          'authorization': token,
        },
        data: { cohorteUtilisateurId }, // axios.delete ne supporte pas body en 2e param, il faut mettre data ici
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors du retrait des utilisateurs de la cohorte :', error);
    throw error;
  }
}


// Obtenir tous les utilisateurs d’une cohorte
export async function getUsersByCohorteByPage({cohorteId, lang, page, search}:{cohorteId: string, lang: string, page:number, search?:string}): Promise<any> {
  const limit:number=20;
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/${cohorteId}/utilisateurs`,
      {
        headers: {
          'accept-language': lang,
          'authorization': token,
        },
        params:{
          limit,
          page,
          search
        }
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs de la cohorte :', error);
    throw error;
  }
}

// Obtenir toutes les cohortes d’un utilisateur
export async function getCohortesByUser(utilisateurId: string, lang: string): Promise<ReponseApiPros> {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/utilisateurs/${utilisateurId}/cohortes`,
      {
        headers: {
          'accept-language': lang,
          'authorization': token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des cohortes de l’utilisateur :', error);
    throw error;
  }
}

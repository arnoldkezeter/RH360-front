import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/besoins-ajoutes`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createBesoinAjoute({
  utilisateur,
  titreFr,
  titreEn,
  descriptionFr,
  descriptionEn,
  pointsAAmeliorerFr,
  pointsAAmeliorerEn
}: {
  utilisateur: string;
  titreFr: string;
  titreEn: string;
  descriptionFr?: string;
  descriptionEn?: string;
  pointsAAmeliorerFr?: string;
  pointsAAmeliorerEn?: string;
}, lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.post(
      `${api}/`,
      {
        utilisateur,
        titreFr,
        titreEn,
        descriptionFr,
        descriptionEn,
        pointsAAmeliorerFr,
        pointsAAmeliorerEn,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating besoin ajoute:', error);
    throw error;
  }
}

export async function updateBesoinAjoute({
  _id,
  titreFr,
  titreEn,
  descriptionFr,
  descriptionEn,
  pointsAAmeliorerFr,
  pointsAAmeliorerEn
}: {
  _id: string;
  titreFr?: string;
  titreEn?: string;
  descriptionFr?: string;
  descriptionEn?: string;
  pointsAAmeliorerFr?: string;
  pointsAAmeliorerEn?: string;
}, lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.put(
      `${api}/${_id}`,
      {
        titreFr,
        titreEn,
        descriptionFr,
        descriptionEn,
        pointsAAmeliorerFr,
        pointsAAmeliorerEn,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating besoin ajoute:', error);
    throw error;
  }
}

export async function deleteBesoinAjoute(id: string, lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.delete(
      `${api}/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting besoin ajoute:', error);
    throw error;
  }
}

export async function getBesoinsByUser({utilisateurId, lang, page, search}:{utilisateurId?: string, lang: string, page:number, search?:string}): Promise<BesoinAjouteUtilisateurReturnGetType> {
  const pageSize = 10
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/utilisateur/${utilisateurId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
        params:{
          page,
          search,
          limit :pageSize
        }
      }
    );
    return response.data.data;
  } catch (error) {
    console.error('Error getting besoins by user:', error);
    throw error;
  }
}

export async function getAllBesoinsAjoutes(lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting all besoins ajoutes:', error);
    throw error;
  }
}

export async function validateBesoinAjoute(
  id: string,
  statut: 'VALIDE' | 'REJETE',
  commentaireAdminFr?: string,
  commentaireAdminEn?: string,
  lang?: string
): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.put(
      `${api}/valider/${id}`,
      {
        statut,
        commentaireAdminFr,
        commentaireAdminEn,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang || 'fr',
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error validating besoin ajoute:', error);
    throw error;
  }
}

export async function getStatutBesoinsAjoutes(lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/stats/statuts`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error getting statut besoins ajoutes:', error);
    throw error;
  }
}

export async function repartitionBesoinsAjoutesParPoste(lang: string): Promise<any> {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/stats/besoins-ajoutes-poste`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
      }
    );
    console.log(response.data.data)
    return response.data.data;
    
  } catch (error) {
    console.error('Error getting statut besoins ajoutes:', error);
    throw error;
  }
}


export async function getGroupedBesoinsAjoutes({page = 1, lang, search}: {page?: number, lang?: string, search?:string}): Promise<GroupedCompetenceReturnGetType> {
  const pageSize = 10;
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/stats/besoins-ajoutes-grouped`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          authorization: token,
        },
        params:{
          page,
          limit:pageSize,
          search
        }
      }
    );
    return response.data.data;
    
  } catch (error) {
    console.error('Error getting statut besoins ajoutes:', error);
    throw error;
  }
}


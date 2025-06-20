import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/cohortes`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;

export async function createCohorte({nomFr, nomEn, descriptionFr, descriptionEn }: Cohorte, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {nomFr, nomEn, descriptionFr, descriptionEn },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error creating cohorte:', error);
        throw error;
    }
}

export async function updateCohorte({ _id, nomFr, nomEn, descriptionFr, descriptionEn }: Cohorte, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            {nomFr, nomEn,  descriptionFr, descriptionEn },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error updating cohorte:', error);
        throw error;
    }
}

export async function deleteCohorte(cohorteId: string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${cohorteId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error('Error deleting cohorte:', error);
        throw error;
    }
}

export async function getCohortes({page, lang }: {page: number, lang:string }): Promise<CohorteReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params: {
                    page: page,
                    limit: pageSize,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const cohortes: CohorteReturnGetType = response.data.data;
        
        return cohortes;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getCohorte({id, lang }: {id: string, lang:string }): Promise<CohorteReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/${id}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const cohortes: CohorteReturnGetType = response.data.data;
        
        return cohortes;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function searchCohorte({ searchString, lang }: { lang:string, searchString: string}): Promise<CohorteReturnGetType> {
   
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/search/by-name`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params:{
                    nom:searchString
                }
            },
        );
        const cohortes: CohorteReturnGetType = response.data.data;

        return cohortes;
    } catch (error) {
        // console.error('Error getting all settings:', error);
        throw error;
    }
}


export async function getCohortesForDropDown({lang }: {lang:string }): Promise<CohorteReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/dropdown/all`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const cohortes: CohorteReturnGetType = response.data.data;
        
        return cohortes;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}


// Ajouter un utilisateur à une cohorte
export async function addUserToCohorte(utilisateurId: string, cohorteId: string, lang: string): Promise<ReponseApiPros> {
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
export async function removeUserFromCohorte(utilisateurId: string, cohorteId: string, lang: string): Promise<ReponseApiPros> {
  try {
    const response: AxiosResponse<any> = await axios.delete(
      `${api}/${cohorteId}/utilisateur`,
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          'authorization': token,
        },
        data: { utilisateurId }, // axios.delete ne supporte pas body en 2e param, il faut mettre data ici
      }
    );
    return response.data;
  } catch (error) {
    console.error('Erreur lors du retrait des utilisateurs de la cohorte :', error);
    throw error;
  }
}


// Obtenir tous les utilisateurs d’une cohorte
export async function getUsersByCohorte(cohorteId: string, lang: string): Promise<any[]> {
  try {
    const response: AxiosResponse<any> = await axios.get(
      `${api}/${cohorteId}/utilisateurs`,
      {
        headers: {
          'accept-language': lang,
          'authorization': token,
        },
      }
    );
    return response.data;
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

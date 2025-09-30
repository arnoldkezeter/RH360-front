import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';
import { downloadDocument } from '../../fonctions/fonction.js';

const api = `${apiUrl}/theme-formation/budget-formation/depenses`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;


export async function createDepense({nomFr, nomEn, montantUnitairePrevu, montantUnitaireReel, quantite, taxes, type}:Depense, budgetId:string, lang:string): Promise<ReponseApiPros> {
    try {
        // Extraire uniquement les IDs des taxes si taxes est un tableau d'objets
        const taxeIds = Array.isArray(taxes)
        ? taxes.map(t => (typeof t === 'string' ? t : t._id ? t._id : null)).filter(Boolean)
        : [];
        const response: AxiosResponse<any> = await axios.post(
            `${api}/${budgetId}`,
            {nomFr, nomEn, montantUnitairePrevu, montantUnitaireReel, quantite, taxes:taxeIds, type},
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
        console.error('Error adding objectif to objectif:', error);
        throw error;
    }
}

export async function updateDepense({_id, nomFr, nomEn, montantUnitairePrevu, montantUnitaireReel, quantite, taxes, type}:Depense, budgetId:string,lang: string): Promise<ReponseApiPros> {
    try {
        // Extraire uniquement les IDs des taxes si taxes est un tableau d'objets
        const taxeIds = Array.isArray(taxes)
        ? taxes.map(t => (typeof t === 'string' ? t : t._id ? t._id : null)).filter(Boolean)
        : [];
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${budgetId}/depense/${_id}`,
            { nomFr, nomEn, montantUnitairePrevu, montantUnitaireReel, quantite, taxes:taxeIds, type },
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
        console.error('Error updating objectif in objectif:', error);
        throw error;
    }
}

export async function deleteDepense(depenseId:string,lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${depenseId}`,
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
        console.error('Error deleting objectif from objectif:', error);
        throw error;
    }
}

export async function getFilteredDepenses({page, lang, type, search, budgetId }: {page: number, lang:string, type?:string, search?:string, budgetId?:string }): Promise<DepenseReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/filtre/${budgetId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params: {
                    page: page,
                    limit: pageSize,
                    type, 
                    search,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const depenses: DepenseReturnGetType = response.data.data;
        
        return depenses;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function generateDepense({budgetId, userId, lang}:{budgetId:string, userId:string, lang: string}): Promise<boolean> {
  try {
    const response: AxiosResponse<Blob> = await axios.get(
      `${api}/${budgetId}/${userId}/pdf`, 
      {
        headers: {
          'Content-Type': 'application/json',
          'accept-language': lang,
          'authorization': token,
        },
        responseType: 'blob', // 👈 important pour recevoir un fichier
      }
    );

    // ✅ Créer une URL temporaire pour télécharger le fichier
    const blob = new Blob([response.data], { type: 'application/pdf' });
    downloadDocument(blob,"mémoire-depense")
    console.log("génération")
    return true;
  } catch (error) {
    console.error('Erreur lors de la création de la note de service:', error);
    throw error;
  }
}








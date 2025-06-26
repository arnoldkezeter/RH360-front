import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

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








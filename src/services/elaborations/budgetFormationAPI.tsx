import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/theme-formation/budgets-formations`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;


export async function createBudgetFormation({theme, nomFr, nomEn, statut}:BudgetFormation, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/`,
            {theme:theme?._id, nomFr, nomEn, statut },
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

export async function updateBudgetFormation({_id, nomFr, nomEn, statut,}:BudgetFormation,lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${_id}`,
            { nomFr, nomEn, statut },
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

export async function deleteBudgetFormation(budgetId: string,lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${budgetId}`,
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


export async function getFilteredBudgetFormations({page, lang, search, themeId }: {page: number, lang:string, search?:string, themeId:string }): Promise<BudgetFormationReturnGetType> {
    const pageSize: number = 10;
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/filtre/${themeId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                },
                params: {
                    page: page,
                    limit: pageSize,
                    query:search
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const budgetFormations: BudgetFormationReturnGetType = response.data.data;
        
        return budgetFormations;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}



export async function getBudgetFormationForDropDown({lang, themeId }: {lang:string, themeId:string }): Promise<BudgetFormationReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/dropdown/theme/${themeId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const programmesFormations: BudgetFormationReturnGetType = response.data.data;
        
        return programmesFormations;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}


export async function getHistogrammeDepense({formationId, themeId}:{formationId?:string, themeId?:string}): Promise<any[]> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/histogramme/${formationId}/${themeId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        return response.data.data;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getTotauxBudget ({formationId, themeId}:{formationId?:string, themeId?:string}): Promise<any> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/totaux/${formationId}/${themeId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': token,
                },
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        return response.data.data;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}







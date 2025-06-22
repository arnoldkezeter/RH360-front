import axios, { AxiosResponse } from 'axios';
import { apiUrl, wstjqer } from '../../config.js';

const api = `${apiUrl}/theme-formation/formateurs`;

const token = `Bearer ${localStorage.getItem(wstjqer)}`;


export async function createFormateur({utilisateur, interne}:Formateur, themeId:string, lang:string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.post(
            `${api}/${themeId}/formateur`,
            { utilisateurId:utilisateur._id, interne },
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
        console.error('Error adding formateur to formateur:', error);
        throw error;
    }
}


export async function updateFormateur({_id, utilisateur, interne}:Formateur,themeId:string,lang: string): Promise<ReponseApiPros> {
    
    try {
        const response: AxiosResponse<any> = await axios.put(
            `${api}/${themeId}/formateur/${_id}`,
            { utilisateurId:utilisateur._id, interne },
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
        console.error('Error updating formateur in formateur:', error);
        throw error;
    }
}

export async function deleteFormateur(themeId: string,formateurId: string,lang: string): Promise<ReponseApiPros> {
    try {
        const response: AxiosResponse<any> = await axios.delete(
            `${api}/${themeId}/formateur/${formateurId}`,
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
        console.error('Error deleting formateur from formateur:', error);
        throw error;
    }
}

export async function getFilteredFormateurs({page, lang, search, themeId }: {page: number, lang:string, search?:string, themeId:string }): Promise<FormateurReturnGetType> {
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
        const formateurs: FormateurReturnGetType = response.data.data;
        
        return formateurs;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}

export async function getFormateurForDropDown({lang, themeId }: {lang:string, themeId:string }): Promise<FormateurReturnGetType> {
    try {
        const response: AxiosResponse<any> = await axios.get(
            `${api}/dropdown/all/${themeId}`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'accept-language':lang,
                    'authorization': token,
                }
            },
        );

        // Extraction de tous les objets de paramètres de la réponse
        const programmesFormations: FormateurReturnGetType = response.data.data;
        
        return programmesFormations;
    } catch (error) {
        console.error('Error getting all settings:', error);
        throw error;
    }
}






